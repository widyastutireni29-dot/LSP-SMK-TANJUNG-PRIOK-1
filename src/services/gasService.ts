/**
 * Service for interacting with Google Apps Script API
 */

const GAS_URL = (import.meta as any).env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbxqFeN-IOf4cIKSh7eyfRPUmQ998HtiPBQ0xlD6jpyKXVbKn_aWT26wchoahFkwpo1p/exec';

export async function callGasAction(data: any) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors', // Common for GAS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Note: 'no-cors' mode results in an opaque response (cannot read body).
    // In a real app, users should use a proxy or set up CORS properly in GAS.
    // For this prototype, we'll assume the action succeeded if no error was thrown,
    // but for actual data reading, 'cors' mode is needed.
    // However, GAS redirects often cause issues with fetch in 'cors' mode.
    // Best practice is to use a proxy or just handle it as a real POST.
    
    // Attempt with default mode to see if we can get data
    try {
      const realResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // GAS often likes this
        },
        body: JSON.stringify(data),
      });
      return await realResponse.json();
    } catch (e) {
      console.warn("Standard fetch failed, likely CORS. Error:", e);
      // Fallback or just throw
      return { status: 'error', message: 'CORS or Network Error. Check GAS deployment configuration.' };
    }
  } catch (error) {
    console.error('GAS Service Error:', error);
    return { status: 'error', message: 'Unknown error occurred' };
  }
}

// Helper for dev/mocking if GAS is not yet deployed
export function getMockData(action: string, params: any = {}) {
  if (action === 'login') {
    // Simulasi data dari kolom Username dan Password_Hash
    if (params.username === 'asesi' && params.password === '123') {
      return { 
        status: 'success', 
        user: { 
          userId: 'US-001', 
          username: 'asesi', 
          role: 'ASESI', 
          nama: 'Budi Santoso', 
          nisn: '12345678' 
        } 
      };
    }
    if (params.username === 'admin' && params.password === '123') {
      return { 
        status: 'success', 
        user: { 
          userId: 'AD-001', 
          username: 'admin', 
          role: 'ADMIN', 
          nama: 'Admin LSP SMK TP1' 
        } 
      };
    }
    if (params.username === 'direktur' && params.password === '123') {
      return { 
        status: 'success', 
        user: { 
          userId: 'DR-001', 
          username: 'direktur', 
          role: 'DIREKTUR', 
          nama: 'Direktur LSP SMK TP1' 
        } 
      };
    }
    return { status: 'error', message: 'Username atau Password_Hash salah di database' };
  }
  return { status: 'success', message: 'Data mock berhasil dimuat' };
}
