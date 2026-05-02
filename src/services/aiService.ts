import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function verifyDesignPortfolio(link: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Anda adalah verifikator LSP (Lembaga Sertifikasi Profesi) SMK Tanjung Priok 1.
        Tugas Anda adalah memverifikasi apakah bukti portofolio link berikut adalah aset Desain Grafis yang valid untuk unit kompetensi 'Menciptakan Karya Desain'.
        
        Link: ${link}
        Deskripsi Pekerjaan: ${description}
        
        Berikan jawaban dalam format JSON:
        {
          "isDesign": boolean,
          "confidence": number (0-1),
          "explanation": "Alasan singkat mengapa ini dianggap valid/tidak valid (dalam Bahasa Indonesia)"
        }
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("AI Verification Error:", error);
    return {
      isDesign: false,
      confidence: 0,
      explanation: "Gagal menghubungkan ke AI untuk verifikasi."
    };
  }
}
