import { createHash, randomBytes, timingSafeEqual } from "crypto";

export class SecurityService {
  /**
   * Generate a random token
   */
  static generateToken(length = 32): string {
    return randomBytes(length).toString("hex");
  }

  /**
   * Generate a random code (for 2FA, etc.)
   */
  static generateCode(length = 6): string {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  /**
   * Hash a string using SHA-256
   */
  static hash(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }

  /**
   * Generate API key
   */
  static generateApiKey(): { key: string; hash: string; prefix: string } {
    const key = `sk_${randomBytes(32).toString("hex")}`;
    const hash = this.hash(key);
    const prefix = key.substring(0, 10);
    return { key, hash, prefix };
  }

  /**
   * Verify API key
   */
  static verifyApiKey(key: string, storedHash: string): boolean {
    const hash = this.hash(key);
    return timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
  }

  /**
   * Sanitize HTML input
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push("Password should be at least 8 characters");

    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Add uppercase letters");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("Add lowercase letters");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("Add numbers");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("Add special characters");

    return {
      score: Math.min(score, 5),
      feedback: feedback.length > 0 ? feedback : ["Password is strong"],
    };
  }

  /**
   * Mask sensitive data
   */
  static maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    const maskedName = name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  }

  /**
   * Mask credit card number
   */
  static maskCreditCard(number: string): string {
    const last4 = number.slice(-4);
    return `****-****-****-${last4}`;
  }

  /**
   * Generate CSRF token
   */
  static generateCsrfToken(): string {
    return this.generateToken(32);
  }
}
