import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "ambrosiabhangg@gmail.com",
      subject: "Prueba directa desde Resend",
      html: "<h1>¡Hola!</h1><p>Este es un correo de prueba enviado directamente con la API de Resend.</p>"
    });
    console.log("Resultado:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main(); 