import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  thumbnailSize?: { width: number; height: number };
  compress?: boolean;
  compressionQuality?: number;
}

interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export class UploadService {
  private static readonly UPLOAD_DIR = join(process.cwd(), "public", "uploads");
  private static readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024;
  private static readonly DEFAULT_ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf", "text/plain",
  ];

  static async uploadFile(
    file: File,
    userId: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      maxSize = this.DEFAULT_MAX_SIZE,
      allowedTypes = this.DEFAULT_ALLOWED_TYPES,
    } = options;

    this.validateFile(file, maxSize, allowedTypes);

    const ext = extname(file.name).toLowerCase();
    const filename = randomUUID() + ext;
    const userDir = join(this.UPLOAD_DIR, userId);
    await mkdir(userDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(userDir, filename);
    await writeFile(filepath, buffer);

    return {
      url: "/uploads/" + userId + "/" + filename,
      filename,
      originalName: file.name,
      size: buffer.length,
      type: file.type,
    };
  }

  static async deleteFile(url: string): Promise<void> {
    const filepath = join(this.UPLOAD_DIR, url.replace("/uploads/", ""));
    try {
      await unlink(filepath);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }

  private static validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
  ): void {
    if (file.size > maxSize) {
      throw new Error("File size exceeds limit");
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error("File type not allowed");
    }
  }
}