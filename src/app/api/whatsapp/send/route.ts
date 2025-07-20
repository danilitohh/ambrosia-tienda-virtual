import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, phoneNumber } = await req.json();
    
    // Usar la API de WhatsApp Business (requiere token)
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
    
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      // Fallback: devolver el mensaje para copiar manualmente
      return NextResponse.json({ 
        success: true, 
        message: message,
        instructions: "Copia este mensaje y pégalo en WhatsApp manualmente"
      });
    }

    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message
        }
      })
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Error sending WhatsApp message');
    }
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error sending message',
      fallback: true 
    });
  }
} 