import constants from '@constants/constants';

export class ImageProcessor {
  static validateImage(file: File): void {
    if (!file) throw new Error('No file provided');
    if (!constants.ALLOWED_IMAGE_TYPES.includes(file.type as 'image/jpeg' | 'image/png' | 'image/gif')) {
      throw new Error(`Invalid file type. Allowed types: ${constants.ALLOWED_IMAGE_TYPES.join(', ')}`);
    }
    if (file.size > constants.MAX_COMPANY_LOGO_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size must be less than ${constants.MAX_COMPANY_LOGO_FILE_SIZE_MB}MB`);
    }
  }

  static async processImage(file: File): Promise<{ base64: string; metadata: ImageMetadata }> {
    this.validateImage(file);
    const base64 = await this.toBase64(file);
    return {
      base64,
      metadata: this.getMetadata(file),
    };
  }

  private static toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  private static getMetadata(file: File): ImageMetadata {
    return {
      filename: file.name,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };
  }
}

export interface ImageMetadata {
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
}
