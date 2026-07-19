import { EmailService } from "@/lib/email";
import { Logger } from "@/lib/utils/logger";

const logger = new Logger("NotificationService");

interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  data?: Record<string, any>;
  link?: string;
  sendEmail?: boolean;
  email?: string;
  userName?: string;
}

export class NotificationService {
  private static notifications: Map<string, any[]> = new Map();

  /**
   * Send a notification to a user
   */
  static async send(options: NotificationOptions) {
    const {
      userId,
      title,
      message,
      type = "info",
      data = {},
      link,
      sendEmail = false,
      email,
      userName,
    } = options;

    // Store in-app notification
    const notification = {
      id: crypto.randomUUID(),
      userId,
      title,
      message,
      type,
      read: false,
      data,
      link,
      createdAt: new Date(),
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.unshift(notification);

    // Send email notification if requested
    if (sendEmail && email) {
      try {
        await EmailService.sendNotificationEmail(email, userName || "User", {
          title,
          message,
          actionUrl: link,
          actionLabel: "View Details",
        });
      } catch (error) {
        logger.error("Failed to send email notification", error);
      }
    }

    logger.info(`Notification sent to user ${userId}: ${title}`);
    return notification;
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { unreadOnly = false, limit = 20, offset = 0 } = options;

    let userNotifications = this.notifications.get(userId) || [];

    if (unreadOnly) {
      userNotifications = userNotifications.filter((n) => !n.read);
    }

    const total = userNotifications.length;
    const notifications = userNotifications.slice(offset, offset + limit);
    const unreadCount = (this.notifications.get(userId) || []).filter(
      (n) => !n.read
    ).length;

    return { notifications, total, unreadCount };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(userId: string, notificationId: string) {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const notification = userNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }

    return false;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return;

    userNotifications.forEach((n) => (n.read = true));
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(userId: string, notificationId: string) {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const index = userNotifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      userNotifications.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read).length;
  }

  /**
   * Send bulk notifications
   */
  static async sendBulk(
    userIds: string[],
    notification: Omit<NotificationOptions, "userId">
  ) {
    const results = await Promise.allSettled(
      userIds.map((userId) =>
        this.send({ ...notification, userId })
      )
    );

    return {
      total: userIds.length,
      success: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
    };
  }
}
