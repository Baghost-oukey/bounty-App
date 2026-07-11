import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

// ─── Types ───────────────────────────────────────────────

interface AnalyzeRequest {
    rawText: string;
    budget: number;
}

interface AnalyzeResponse {
    tasks: string[];
    suggestedPrice: number;
    tooLow: boolean;
    summary: string;
}

// ─── Prompt ──────────────────────────────────────────────

function buildPrompt(rawText: string, budget: number): string {
    return `
Kamu adalah asisten untuk aplikasi jasa kebersihan bernama Bounty.
User mengirimkan permintaan bebas (bisa berupa curhat, keluhan, atau deskripsi singkat).

Tugasmu:
1. Ekstrak daftar tugas kebersihan yang perlu dikerjakan dari teks user.
2. Berikan estimasi harga wajar (dalam Rupiah, tanpa desimal) berdasarkan jumlah dan kompleksitas tugas.
3. Tentukan apakah budget user (Rp ${budget.toLocaleString("id-ID")}) terlalu rendah.
4. Buat ringkasan singkat yang mudah dimengerti pekerja (1-2 kalimat).

Aturan:
- Harga minimum per tugas sederhana: Rp 15.000
- Harga minimum total: Rp 30.000
- Jika tidak ada tugas spesifik terdeteksi, buat 1 tugas umum "Bersih-bersih rumah"
- Gunakan bahasa Indonesia

Teks user:
"${rawText}"

Balas HANYA dengan JSON berikut, tanpa penjelasan tambahan:
{
  "tasks": ["string array of tasks"],
  "suggestedPrice": number,
  "tooLow": boolean,
  "summary": "string"
}
`.trim();
}

// ─── Handler ─────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: AnalyzeRequest = await req.json();

        if (!body.rawText?.trim()) {
            return NextResponse.json(
                { error: "rawText is required" },
                { status: 400 }
            );
        }

        if (typeof body.budget !== "number" || body.budget < 0) {
            return NextResponse.json(
                { error: "budget must be a non-negative number" },
                { status: 400 }
            );
        }

        const prompt = buildPrompt(body.rawText, body.budget);
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        let parsed: AnalyzeResponse;
        try {
            parsed = JSON.parse(raw);
        } catch {
            return NextResponse.json(
                { error: "Failed to parse AI response", raw },
                { status: 502 }
            );
        }

        return NextResponse.json(parsed, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[layananbersih/analyze] ERROR:", message);
        return NextResponse.json(
            { error: "Internal server error", detail: message },
            { status: 500 }
        );
    }
}
