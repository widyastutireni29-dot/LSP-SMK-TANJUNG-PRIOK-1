/**
 * Service for interacting with Google Apps Script API
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxqaMtZ44pc0wSkaqRz2DCPBgRj5x3dz1MpDdMS2Mq1vSmIYOjlNQ2ZyvQHmrrE-Y7/exec';

export async function callGasAction(data: any) {
  try {
    console.log("Calling GAS with:", data);
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
    
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse GAS response:", text);
      throw new Error("Format respons server tidak valid.");
    }

    console.log("GAS Result:", result);
    return result;
  } catch (error) {
    console.error('GAS Service Error:', error);
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Gagal terhubung ke server.' 
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
