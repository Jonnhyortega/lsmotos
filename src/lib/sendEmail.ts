
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set in .env.local");
      // Fallback log for dev without key
      console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
      return;
  }

  try {
    const data = await resend.emails.send({
      from: 'Motos LS <onboarding@resend.dev>', // Use this default for testing until you verify your domain
      to: to, // Note: In Resend 'Testing' mode, you can only send to the email you signed up with.
      subject: subject,
      html: html,
    });
    
    if (data.error) {
        console.error("Resend API Error:", data.error);
        throw new Error(data.error.message);
    }

    console.log('Email sent successfully:', data.data);
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    throw error;
  }
};
