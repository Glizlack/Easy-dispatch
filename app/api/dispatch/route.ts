import { NextResponse } from 'next/server';

export const maxDuration = 60; // Essential for AI response time

export async function POST(req: Request) {
  try {
    const { distance } = await req.json();
    const miles = Number(distance);

    // --- TRUCKER MATH (10.5hr Safety Rule) ---
    const AVG_SPEED = 57; 
    const MAX_DRIVE = 10.5; // Your custom safety limit
    const RESET_TIME = 10;
    const BREAK_TIME = 0.5;

    const driveTimeHours = miles / AVG_SPEED;
    const resetsRequired = Math.floor(driveTimeHours / MAX_DRIVE);
    const breaksRequired = Math.floor(driveTimeHours / 8);
    
    const totalDuration = driveTimeHours + (resetsRequired * RESET_TIME) + (breaksRequired * BREAK_TIME);
    
    const etaDate = new Date();
    etaDate.setHours(etaDate.getHours() + totalDuration);

    // --- OPENROUTER AI CONNECTION ---
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", 
        messages: [
          { role: "system", content: "You are a professional dispatcher. Use bullet points." },
          { role: "user", content: `Trip: ${miles} miles. Time: ${totalDuration.toFixed(1)}h. Provide a driver manifest.` }
        ]
      })
    });

    const aiData = await aiResponse.json();
    const manifest = aiData.choices?.[0]?.message?.content || "AI Offline";

    return NextResponse.json({
      eta: etaDate.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' }),
      resets: resetsRequired,
      manifest: manifest
    });

  } catch (error) {
    return NextResponse.json({ error: "Calculation Error" }, { status: 500 });
  }
}
