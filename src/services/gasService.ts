/**
 * Service for interacting with Google Apps Script API
 */

const GAS_URL = (import.meta as any).env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbwGfYEMAzhYSB7WJRa7MJYGZdQtoU26bdBMZjtodd3sLOVtj-jvCnDerixXpKohRkkn/exec';

export async function callGasAction(data: any) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('GAS Service Error:', error);
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Terjadi kesalahan koneksi ke server.' 
    };
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
