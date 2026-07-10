import type { VercelRequest, VercelResponse } from "@vercel/node";

interface PreorderBody {
    name?: string;
    email?: string;
    org?: string;
    company?: string; // honeypot field — real users never fill this
}

const RECIPIENT_EMAILS = [
    "aviprakashjaiswal@gmail.com",
    "sohamnalawade77@gmail.com",
];

// Basic in-memory rate limiting (best-effort on serverless — resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "unknown";
    if (isRateLimited(ip)) {
        return res
            .status(429)
            .json({ error: "Too many requests. Please try again in a minute." });
    }

    const { name, email, org, company } = req.body as PreorderBody;

    // honeypot — bots fill every field, real users never see/fill this one
    if (company) {
        return res.status(200).json({ ok: true });
    }

    if (!name || !email || !isValidEmail(email)) {
        return res.status(400).json({ error: "A valid name and email are required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not set in environment variables");
        return res.status(500).json({ error: "Email delivery is not configured" });
    }

    const safeName = escapeHtml(name).slice(0, 200);
    const safeEmail = escapeHtml(email).slice(0, 200);
    const safeOrg = org ? escapeHtml(org).slice(0, 200) : "";

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "ProtoPulse Reservations <onboarding@resend.dev>",
                to: RECIPIENT_EMAILS,
                reply_to: email,
                subject: `New Baker-01 reservation — ${name}`,
                html: `
          <div style="font-family: sans-serif; max-width: 480px;">
            <h2 style="margin-bottom: 4px;">New build slot reservation</h2>
            <p style="color: #666; margin-top: 0;">Baker-01 · First batch</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
              ${safeOrg ? `<tr><td style="padding: 8px 0; color: #888;">Company</td><td style="padding: 8px 0;">${safeOrg}</td></tr>` : ""}
            </table>
          </div>
        `,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Resend API error:", response.status, errorBody);
            return res.status(502).json({ error: "Failed to send reservation email" });
        }

        return res.status(200).json({ ok: true });
    } catch (error: unknown) {
        console.error("Preorder email error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ error: message });
    }
}
