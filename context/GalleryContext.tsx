"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoredPhotoRecord, PhotoItem } from "@/types/gallery";
import {
  getAllPhotos,
  putPhoto,
  putPhotos,
  deletePhoto,
  hydratePhoto,
  createDefaultPhotos,
  backfillDemoDescriptions,
  sortPhotos,
  nextOrder,
  buildPhotoRecord,
} from "@/utils/galleryStorage";

const SEED_FLAG = "celestique-gallery-seeded-v1";
const DESCRIPTION_FLAG = "celestique-gallery-descriptions-v1";

interface GalleryContextType {
  photos: PhotoItem[];
  records: StoredPhotoRecord[];
  loading: boolean;
  savePhoto: (
    payload: Parameters<typeof buildPhotoRecord>[0],
    existingId?: string
  ) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  reorderPhotos: (orderedIds: string[]) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StoredPhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const urlCacheRef = useRef<WeakMap<Blob, string>>(new WeakMap());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let recs = await getAllPhotos();
        const seeded = localStorage.getItem(SEED_FLAG);
        if (!seeded && recs.length === 0) {
          const defaults = createDefaultPhotos();
          await putPhotos(defaults);
          recs = defaults;
          localStorage.setItem(SEED_FLAG, "1");
        } else if (!seeded) {
          localStorage.setItem(SEED_FLAG, "1");
        }
        if (!localStorage.getItem(DESCRIPTION_FLAG)) {
          const updated = backfillDemoDescriptions(recs);
          if (updated.length > 0) {
            await putPhotos(updated);
            const byId = new Map(updated.map((record) => [record.id, record]));
            recs = recs.map((record) => byId.get(record.id) ?? record);
          }
          localStorage.setItem(DESCRIPTION_FLAG, "1");
        }
        if (cancelled) return;
        setRecords(sortPhotos(recs));
        setLoading(false);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = useMemo(
    () =>
      sortPhotos(records)
        .map((record) => hydratePhoto(record, urlCacheRef.current))
        .filter((photo): photo is PhotoItem => photo !== null),
    [records]
  );

  const savePhoto = useCallback(
    async (
      payload: Parameters<typeof buildPhotoRecord>[0],
      existingId?: string
    ) => {
      const existing = existingId
        ? records.find((r) => r.id === existingId)
        : undefined;
      const order = existing ? existing.order : nextOrder(records);
      const record = buildPhotoRecord(payload, existing, order);
      await putPhoto(record);
      setRecords((prev) => sortPhotos(
        existingId
          ? prev.map((r) => (r.id === existingId ? record : r))
          : [...prev, record]
      ));
    },
    [records]
  );

  const removePhoto = useCallback(
    async (id: string) => {
      await deletePhoto(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    },
    []
  );

  const reorderPhotos = useCallback(
    async (orderedIds: string[]) => {
      const now = Date.now();
      const byId = new Map(records.map((r) => [r.id, r]));
      const updated: StoredPhotoRecord[] = [];
      orderedIds.forEach((id, index) => {
        const record = byId.get(id);
        if (record && record.order !== index) {
          updated.push({ ...record, order: index, updatedAt: now });
        }
      });
      if (updated.length > 0) {
        await putPhotos(updated);
        const updatedIds = new Set(updated.map((r) => r.id));
        setRecords((prev) =>
          prev.map((r) =>
            updatedIds.has(r.id)
              ? updated.find((u) => u.id === r.id)!
              : r
          )
        );
      }
    },
    [records]
  );

  const value = useMemo(
    () => ({
      photos,
      records,
      loading,
      savePhoto,
      removePhoto,
      reorderPhotos,
    }),
    [photos, records, loading, savePhoto, removePhoto, reorderPhotos]
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used within GalleryProvider");
  return ctx;
}
