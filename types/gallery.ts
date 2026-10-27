import type { StoredImage, MediaRef } from "@/types/video";

export interface StoredPhotoRecord {
  id: string;
  title: string;
  description: string;
  image: StoredImage;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface PhotoItem {
  id: string;
  title: string;
  description: string;
  image: MediaRef;
  order: number;
}

export interface GallerySavePayload {
  title: string;
  description: string;
  image?: StoredImage;
}
