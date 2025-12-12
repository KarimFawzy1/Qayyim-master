import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  await resend.emails.send({
    from: 'Qayyim <noreply@qayyim.com>',
    to: [email],
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Qayyim account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string, role: string): Promise<void> {
  await resend.emails.send({
    from: 'Qayyim <welcome@qayyim.com>',
    to: [email],
    subject: 'Welcome to Qayyim!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Qayyim, ${name}!</h2>
        <p>Your ${role.toLowerCase()} account has been successfully created.</p>
        <p>You can now log in and start using the platform.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Login Now</a>
      </div>
    `,
  });
}

