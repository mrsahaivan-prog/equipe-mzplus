/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if MZ+ is officially launched (past July 4th, 2026 at 20:00 GMT+1, or admin forced)
 */
export function isLaunchModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // 1. Force launch via admin switch
  if (localStorage.getItem('mz_admin_force_launch') === 'true') {
    return true;
  }
  
  // 2. Force launch via countdown override
  if (localStorage.getItem('mz_admin_override_countdown') === 'true') {
    return true;
  }

  // 3. Custom test countdown simulation (e.g. 10 sec, 1 min)
  const customTimeStr = localStorage.getItem('mz_custom_launch_time');
  if (customTimeStr) {
    const targetTimeMs = parseInt(customTimeStr, 10);
    if (!isNaN(targetTimeMs) && Date.now() >= targetTimeMs) {
      return true;
    }
  }

  // 4. Default launch date: July 4th, 2026 at 20:00:00 GMT+1
  // This corresponds to 19:00:00 UTC
  const launchTimeMs = new Date("2026-07-04T20:00:00+01:00").getTime();
  return Date.now() >= launchTimeMs;
}
