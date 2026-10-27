import type { StoredImage, StoredSource } from "@/types/video";
import type {
  StoredPhotoRecord,
  PhotoItem,
  GallerySavePayload,
} from "@/types/gallery";
import { products } from "@/data/products";

const DB_NAME = "celestique-gallery-db";
const DB_VERSION = 1;
const STORE_NAME = "photos";

export const GALLERY_IMAGE_WIDTH = 1200;
export const GALLERY_IMAGE_HEIGHT = 1500;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promisifyTx<T>(
  tx: IDBTransaction,
  runner: () => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = runner();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getAllPhotos(): Promise<StoredPhotoRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result as StoredPhotoRecord[]);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function putPhoto(record: StoredPhotoRecord): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await promisifyTx(tx, () => tx.objectStore(STORE_NAME).put(record));
  db.close();
}

export async function putPhotos(
  records: StoredPhotoRecord[]
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  for (const record of records) {
    await promisifyTx(tx, () => store.put(record));
  }
  db.close();
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await promisifyTx(tx, () => tx.objectStore(STORE_NAME).delete(id));
  db.close();
}

type UrlCache = WeakMap<Blob, string>;

function sourceToUrl(
  source: StoredSource | undefined,
  cache: UrlCache
): string | undefined {
  if (!source) return undefined;
  if (source.kind === "url") return source.value;
  let url = cache.get(source.blob);
  if (!url) {
    url = URL.createObjectURL(source.blob);
    cache.set(source.blob, url);
  }
  return url;
}

function imageToRef(
  image: StoredImage,
  cache: UrlCache
): PhotoItem["image"] | null {
  const src = sourceToUrl(image, cache);
  if (!src) return null;
  return {
    src,
    name: image.kind === "file" ? image.name : undefined,
    kind: image.kind,
    width: image.width,
    height: image.height,
  };
}

export function hydratePhoto(
  record: StoredPhotoRecord,
  cache: UrlCache
): PhotoItem | null {
  const image = imageToRef(record.image, cache);
  if (!image) return null;
  return {
    id: record.id,
    title: record.title,
    description: record.description ?? "",
    image,
    order: record.order,
  };
}

function galleryUrlFromProduct(url: string): string {
  const u = new URL(url);
  u.searchParams.set("w", String(GALLERY_IMAGE_WIDTH));
  u.searchParams.set("h", String(GALLERY_IMAGE_HEIGHT));
  u.searchParams.set("fit", "crop");
  u.searchParams.set("q", "80");
  u.searchParams.set("auto", "format");
  return u.toString();
}

export function createDefaultPhotos(): StoredPhotoRecord[] {
  const now = Date.now();
  return products.map((product, index) => ({
    id: `demo-photo-${product.id}`,
    title: product.name,
    description: product.description,
    image: {
      kind: "url" as const,
      value: galleryUrlFromProduct(product.image),
      width: GALLERY_IMAGE_WIDTH,
      height: GALLERY_IMAGE_HEIGHT,
    },
    order: index,
    createdAt: now,
    updatedAt: now,
  }));
}

export function backfillDemoDescriptions(
  records: StoredPhotoRecord[]
): StoredPhotoRecord[] {
  const descriptions = new Map(
    products.map((product) => [
      `demo-photo-${product.id}`,
      product.description,
    ])
  );
  const updated: StoredPhotoRecord[] = [];
  for (const record of records) {
    if (record.description) continue;
    const description = descriptions.get(record.id);
    if (!description) continue;
    updated.push({ ...record, description });
  }
  return updated;
}

export function sortPhotos(
  records: StoredPhotoRecord[]
): StoredPhotoRecord[] {
  return [...records].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt - b.createdAt;
  });
}

export function nextOrder(records: StoredPhotoRecord[]): number {
  if (records.length === 0) return 0;
  return Math.max(...records.map((r) => r.order)) + 1;
}

export function buildPhotoRecord(
  payload: GallerySavePayload,
  existing: StoredPhotoRecord | undefined,
  order: number
): StoredPhotoRecord {
  const now = Date.now();
  if (existing) {
    return {
      ...existing,
      title: payload.title,
      description: payload.description,
      image: payload.image ?? existing.image,
      updatedAt: now,
    };
  }
  if (!payload.image) {
    throw new Error("A photo image is required");
  }
  return {
    id: `photo-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    title: payload.title,
    description: payload.description,
    image: payload.image,
    order,
    createdAt: now,
    updatedAt: now,
  };
}
