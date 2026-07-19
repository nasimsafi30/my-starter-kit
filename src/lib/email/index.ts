import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email functionality will not work.");
}

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  react?: React.ReactElement;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export class EmailService {
  private static readonly FROM_EMAIL = process.env.EMAIL_FROM || "noreply@example.com";
  private static readonly FROM_NAME = process.env.EMAIL_FROM_NAME || "StarterKit";

  static async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!resend) {
      console.warn("Email service not configured. Skipping email send.");
      return { success: false, error: "Email service not configured" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        react: options.react,
        attachments: options.attachments,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        tags: options.tags,
      });

      if (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async sendWelcomeEmail(to: string, userName: string) {
    return this.send({
      to,
      subject: `Welcome to StarterKit, ${userName}! 🎉`,
      html: `<h1>Welcome ${userName}!</h1><p>Thank you for joining StarterKit.</p>`,
      tags: [{ name: "type", value: "welcome" }],
    });
  }

  static async sendPasswordResetEmail(to: string, userName: string, resetUrl: string) {
    return this.send({
      to,
      subject: "Reset your password",
      html: `<h1>Hi ${userName},</h1><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      tags: [{ name: "type", value: "password-reset" }],
    });
  }

  static async sendVerificationEmail(to: string, userName: string, verificationUrl: string) {
    return this.send({
      to,
      subject: "Verify your email address",
      html: `<h1>Hi ${userName},</h1><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
      tags: [{ name: "type", value: "verification" }],
    });
  }

  static async sendNotificationEmail(
    to: string,
    userName: string,
    notification: { title: string; message: string; actionUrl?: string; actionLabel?: string }
  ) {
    return this.send({
      to,
      subject: notification.title,
      html: `<h1>Hi ${userName},</h1><p>${notification.message}</p>${notification.actionUrl ? `<a href="${notification.actionUrl}">${notification.actionLabel || "View"}</a>` : ""}`,
      tags: [{ name: "type", value: "notification" }],
    });
  }
}