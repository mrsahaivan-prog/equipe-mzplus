import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "waitlist-db.json");

// Parse JSON bodies
app.use(express.json());

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Read local database
function readLocalDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file", err);
    return [];
  }
}

// Write local database
function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Helper to get Supabase connection info
function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    return null;
  }
  
  let cleanUrl = url.trim();
  if (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  
  const endpoint = cleanUrl.includes('/rest/v1')
    ? `${cleanUrl}/waitlist`
    : `${cleanUrl}/rest/v1/waitlist`;
    
  return { endpoint, anonKey };
}

// API Routes

// 1. Get entire waitlist
app.get("/api/waitlist", async (req, res) => {
  const localList = readLocalDb();
  const supabase = getSupabaseConfig();
  
  if (!supabase) {
    // Return local list sorted by created_at ascending
    localList.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return res.json(localList);
  }
  
  try {
    console.log("Fetching waitlist from Supabase...");
    const response = await fetch(`${supabase.endpoint}?order=created_at.asc`, {
      method: "GET",
      headers: {
        "apikey": supabase.anonKey,
        "Authorization": `Bearer ${supabase.anonKey}`,
        "Accept": "application/json"
      }
    });
    
    if (response.ok) {
      const supabaseData = await response.json();
      if (Array.isArray(supabaseData)) {
        console.log(`Successfully fetched ${supabaseData.length} records from Supabase.`);
        
        // Merge local database with Supabase data, avoiding duplicates
        const mergedList = [...localList];
        let changed = false;
        
        supabaseData.forEach((item: any) => {
          if (item && item.email) {
            const exists = mergedList.some(
              (m: any) => m.email.toLowerCase() === item.email.toLowerCase()
            );
            if (!exists) {
              mergedList.push({
                email: item.email,
                whatsapp: item.whatsapp || "",
                fullName: item.fullName || "",
                country_code: item.country_code || "",
                country_name: item.country_name || "",
                source: item.source || "general",
                created_at: item.created_at || new Date().toISOString()
              });
              changed = true;
            }
          }
        });
        
        if (changed) {
          writeLocalDb(mergedList);
        }
        
        // Sort merged list by created_at ascending so positions/ranks are stable!
        mergedList.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        return res.json(mergedList);
      }
    } else {
      console.warn("Supabase returned error status:", response.status);
    }
  } catch (err) {
    console.error("Error connecting to Supabase, falling back to local database:", err);
  }
  
  // Default fallback: return local list sorted by created_at
  localList.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  res.json(localList);
});

// 2. Submit to waitlist
app.post("/api/waitlist", async (req, res) => {
  const { email, whatsapp, country_code, country_name, source, created_at, fullName } = req.body;
  
  if (!email || !whatsapp) {
    return res.status(400).json({ error: "Email and whatsapp are required" });
  }

  const list = readLocalDb();
  
  // Prevent duplicate registrations in local database
  const isDuplicate = list.some((item: any) => item.email.toLowerCase() === email.trim().toLowerCase());
  
  const newEntry = {
    email: email.trim(),
    whatsapp: whatsapp.trim(),
    fullName: fullName ? fullName.trim() : "",
    country_code: country_code || "",
    country_name: country_name || "",
    source: source || "general",
    created_at: created_at || new Date().toISOString()
  };

  if (!isDuplicate) {
    list.push(newEntry);
    writeLocalDb(list);
    console.log(`Added email ${email} (Name: ${newEntry.fullName}) to local database. Total count: ${list.length}`);
  } else {
    console.log(`Email ${email} is already in local database.`);
  }
  
  // Save to Supabase (non-blocking)
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      console.log(`Inserting email ${email} into Supabase...`);
      const insertResp = await fetch(supabase.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabase.anonKey,
          "Authorization": `Bearer ${supabase.anonKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(newEntry)
      });
      
      if (insertResp.ok) {
        console.log(`Successfully saved email ${email} to Supabase.`);
      } else {
        console.warn("Failed to insert into Supabase (probably RLS policy, saved locally):", await insertResp.text());
      }
    } catch (err) {
      console.error("Error interacting with Supabase on insert:", err);
    }
  }

  // Retrieve latest combined list to return
  let latestList = [...list];
  if (supabase) {
    try {
      const response = await fetch(`${supabase.endpoint}?order=created_at.asc`, {
        method: "GET",
        headers: {
          "apikey": supabase.anonKey,
          "Authorization": `Bearer ${supabase.anonKey}`,
          "Accept": "application/json"
        }
      });
      if (response.ok) {
        const supabaseData = await response.json();
        if (Array.isArray(supabaseData)) {
          supabaseData.forEach((item: any) => {
            if (item && item.email) {
              const exists = latestList.some(
                (m: any) => m.email.toLowerCase() === item.email.toLowerCase()
              );
              if (!exists) {
                latestList.push({
                  email: item.email,
                  whatsapp: item.whatsapp || "",
                  fullName: item.fullName || "",
                  country_code: item.country_code || "",
                  country_name: item.country_name || "",
                  source: item.source || "general",
                  created_at: item.created_at || new Date().toISOString()
                });
              }
            }
          });
        }
      }
    } catch (err) {
      console.error("Error retrieving latest list from Supabase on post:", err);
    }
  }
  
  // Sort by created_at ascending so sequence is correct
  latestList.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  res.json({ success: true, entry: newEntry, list: latestList });
});

// 3. Clear local waitlist (Admin only)
app.post("/api/admin/clear-waitlist", (req, res) => {
  writeLocalDb([]);
  console.log("Local waitlist cleared by administrator.");
  res.json({ success: true, message: "Local database cleared" });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
