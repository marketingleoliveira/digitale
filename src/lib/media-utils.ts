/**
 * Utility functions for handling media (images and videos)
 */

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().split('?')[0];
  return VIDEO_EXTENSIONS.some(ext => lower.endsWith(ext));
}

export function getAcceptedMediaTypes(): string {
  return "image/*,video/mp4,video/webm,video/ogg";
}

export function isValidMediaFile(file: File): boolean {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export function getMaxFileSize(file: File): number {
  // 50MB for videos, 5MB for images
  return file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
}

export function getMaxFileSizeLabel(file: File): string {
  return file.type.startsWith("video/") ? "50MB" : "5MB";
}
