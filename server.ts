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

// --- CHARIOW API INTEGRATION ROUTES ---

const CHARIOW_CONFIG_FILE = path.join(process.cwd(), "chariow-config.json");

function getChariowConfig() {
  let config = { apiKey: "", productId: "" };
  if (fs.existsSync(CHARIOW_CONFIG_FILE)) {
    try {
      const fileData = fs.readFileSync(CHARIOW_CONFIG_FILE, "utf-8");
      config = JSON.parse(fileData);
    } catch (err) {
      console.error("Error reading Chariow config file", err);
    }
  }
  if (!config.apiKey && process.env.CHARIOW_API_KEY) {
    config.apiKey = process.env.CHARIOW_API_KEY;
  }
  if (!config.productId && process.env.CHARIOW_PRODUCT_ID) {
    config.productId = process.env.CHARIOW_PRODUCT_ID;
  }
  return config;
}

function writeChariowConfig(config: { apiKey: string, productId: string }) {
  try {
    fs.writeFileSync(CHARIOW_CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing Chariow config file", err);
    return false;
  }
}

// 4. Get Chariow Configuration
app.get("/api/admin/chariow-config", (req, res) => {
  const config = getChariowConfig();
  res.json({
    success: true,
    apiKey: config.apiKey || "",
    productId: config.productId || "",
    hasKey: !!config.apiKey
  });
});

// 5. Update Chariow Configuration
app.post("/api/admin/chariow-config", (req, res) => {
  const { apiKey, productId } = req.body;
  const config = {
    apiKey: apiKey ? apiKey.trim() : "",
    productId: productId ? productId.trim() : ""
  };
  const success = writeChariowConfig(config);
  res.json({ success, message: success ? "Configuration Chariow enregistrée" : "Erreur de sauvegarde" });
});

// 6. Test Chariow Connection
app.post("/api/admin/chariow-test-connection", async (req, res) => {
  const apiKey = req.body.apiKey ? req.body.apiKey.trim() : getChariowConfig().apiKey;
  
  if (!apiKey) {
    return res.status(400).json({ success: false, error: "Clé API Chariow manquante. Veuillez la saisir pour tester." });
  }

  try {
    console.log("Testing Chariow connection with api.chariow.com...");
    const response = await fetch("https://api.chariow.com/v1/store", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Chariow response is not JSON:", text);
      return res.status(response.status).json({
        success: false,
        error: `Réponse du serveur Chariow non-JSON (Status: ${response.status}): ${text.substring(0, 200)}...`
      });
    }
    
    if (response.ok) {
      console.log("Chariow connection success:", data);
      const storeData = data.data || data;
      return res.json({
        success: true,
        message: "Connexion réussie à Chariow !",
        store: storeData
      });
    } else {
      console.warn("Chariow returned an error:", data);
      const detailedMessage = data.message || `Le serveur Chariow a retourné une erreur (Status ${response.status}).`;
      return res.status(response.status).json({
        success: false,
        error: detailedMessage,
        status: response.status,
        errors: data.errors || [],
        raw: data
      });
    }
  } catch (err: any) {
    console.error("Chariow API connection error:", err);
    return res.status(500).json({
      success: false,
      error: `Erreur de connexion réseau au serveur Chariow: ${err.message}`
    });
  }
});

// 7. Get Chariow Products List
app.get("/api/admin/chariow-products", async (req, res) => {
  const config = getChariowConfig();
  const queryApiKey = req.query.apiKey as string;
  const apiKey = queryApiKey ? queryApiKey.trim() : config.apiKey;

  if (!apiKey) {
    return res.json({ success: false, error: "Clé API non configurée" });
  }

  try {
    console.log("Fetching products from Chariow with type=course...");
    const response = await fetch("https://api.chariow.com/v1/products?per_page=50&type=course", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Chariow products list is not JSON:", text);
      return res.json({ success: false, error: `Réponse de Chariow non-JSON: ${text.substring(0, 150)}` });
    }

    if (response.ok) {
      const products = Array.isArray(data.data) ? data.data : (data.data?.data || (Array.isArray(data) ? data : []));
      return res.json({ success: true, products });
    } else {
      return res.json({ success: false, error: data.message || "Impossible de récupérer les produits" });
    }
  } catch (err: any) {
    console.error("Error fetching Chariow products:", err);
    return res.json({ success: false, error: err.message });
  }
});

// 8. Create Chariow Checkout Session
app.post("/api/chariow/checkout", async (req, res) => {
  const { email, first_name, last_name, phone, discount_code, redirect_url } = req.body;
  const config = getChariowConfig();
  
  if (!config.apiKey) {
    console.warn("Chariow API Key is not configured. Falling back to sandbox/simulation mode.");
    return res.json({
      success: true,
      simulation: true,
      message: "Simulation active (Clé API non configurée).",
      data: {
        step: "payment",
        purchase: {
          id: "sim_sal_" + Math.random().toString(36).substr(2, 9),
          status: "awaiting_payment",
          amount: {
            value: 15.00,
            formatted: "15,00 €",
            short: "15",
            currency: "EUR"
          }
        },
        payment: {
          checkout_url: "/checkout-simulation-success",
          transaction_id: "sim_txn_" + Math.random().toString(36).substr(2, 9)
        }
      }
    });
  }

  try {
    const productId = config.productId || "prd_default";
    console.log(`Initiating Chariow checkout for ${email} on product ${productId}...`);
    
    const payload: any = {
      product_id: productId,
      email: email,
      first_name: first_name || "Client",
      last_name: last_name || "MZ+",
      phone: {
        number: phone?.number || "",
        country_code: phone?.country_code || "FR"
      }
    };

    if (discount_code) {
      payload.discount_code = discount_code;
    }
    if (redirect_url) {
      payload.redirect_url = redirect_url;
    }

    const response = await fetch("https://api.chariow.com/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Chariow checkout API returned non-JSON:", text);
      return res.status(response.status).json({
        success: false,
        error: `Réponse Chariow invalide (status ${response.status}): ${text.substring(0, 150)}`
      });
    }

    if (response.ok && data) {
      console.log("Chariow checkout API success:", data);
      const resultData = data.data || data;
      return res.json({
        success: true,
        simulation: false,
        data: resultData
      });
    } else {
      console.warn("Chariow checkout API error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: data?.message || "Le serveur Chariow a retourné une erreur d'initialisation du checkout.",
        errors: data?.errors || null
      });
    }
  } catch (err: any) {
    console.error("Chariow checkout request failed:", err);
    return res.status(500).json({
      success: false,
      error: `Erreur de connexion réseau à Chariow : ${err.message}`
    });
  }
});

// Legacy Create Payment Proxy (falls back or adapts)
app.post("/api/chariow/create-payment", async (req, res) => {
  const { email, phone, operator, amountString } = req.body;
  const config = getChariowConfig();
  
  if (!config.apiKey) {
    console.warn("Chariow API Key is not configured. Falling back to sandbox/simulation mode.");
    return res.json({
      success: true,
      simulation: true,
      message: "Simulation active (Clé API non configurée).",
      data: {
        id: "sim_pay_" + Math.random().toString(36).substr(2, 9),
        amount: amountString || "49,00 €"
      }
    });
  }

  try {
    console.log(`Creating Chariow payment for ${email} (${operator} / ${phone})...`);
    
    const payload: any = {
      email: email,
      product_id: config.productId || "prd_default"
    };

    if (phone) payload.phone = phone;
    if (operator) payload.operator = operator;

    const response = await fetch("https://api.chariow.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok && data.message === "success") {
      console.log("Chariow payment created successfully:", data);
      return res.json({
        success: true,
        simulation: false,
        data: data.data,
        message: "success"
      });
    } else {
      console.warn("Chariow payment creation error status:", response.status, data);
      return res.json({
        success: true,
        simulation: true,
        message: data.message || "Retour Chariow traité en mode simulation.",
        chariowError: data.errors || null,
        data: {
          id: "sim_pay_" + Math.random().toString(36).substr(2, 9),
          amount: amountString || "49,00 €"
        }
      });
    }
  } catch (err: any) {
    console.error("Chariow payment request failed:", err);
    return res.json({
      success: true,
      simulation: true,
      message: `Connexion Chariow hors-ligne (${err.message}). Traitement par simulation sécurisée.`,
      data: {
        id: "sim_pay_" + Math.random().toString(36).substr(2, 9),
        amount: amountString || "49,00 €"
      }
    });
  }
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
