"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  StoredSource,
  StoredImage,
  StoredVideoRecord,
  VideoItem,
  VideoSavePayload,
  VideoLang,
} from "@/types/video";
import {
  getAllRecords,
  putRecord,
  deleteRecord,
  hydrateRecord,
  createDemoRecords,
} from "@/utils/videoStorage";

const SEED_FLAG = "celestique-videos-seeded-v2";
const ACTIVE_KEY = "celestique-active-video";

interface VideoContextType {
  items: VideoItem[];
  records: StoredVideoRecord[];
  activeId: string | null;
  activeItem: VideoItem | null;
  loading: boolean;
  setActiveVideo: (id: string) => void;
  saveVideo: (payload: VideoSavePayload, existingId?: string) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | null>(null);

function mergeSources(
  existing: Partial<Record<VideoLang, StoredSource>>,
  incoming: Partial<Record<VideoLang, StoredSource | null>>
): Partial<Record<VideoLang, StoredSource>> {
  const result: Partial<Record<VideoLang, StoredSource>> = {};
  for (const lang of ["en", "es"] as VideoLang[]) {
    const value = incoming[lang];
    if (value === null) continue;
    if (value !== undefined) {
      result[lang] = value;
    } else if (existing[lang]) {
      result[lang] = existing[lang];
    }
  }
  return result;
}

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StoredVideoRecord[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const urlCacheRef = useRef<WeakMap<Blob, string>>(new WeakMap());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let recs = await getAllRecords();
        const seeded = localStorage.getItem(SEED_FLAG);
        const needsRefresh =
          seeded !== "1" ||
          recs.length === 0 ||
          recs.some(
            (r) =>
              r.id.startsWith("demo-") &&
              (!r.audio.en ||
                !r.audio.es ||
                !r.subtitles.en ||
                !r.subtitles.es)
          );
        if (needsRefresh) {
          const demos = createDemoRecords();
          const demoIds = new Set(demos.map((d) => d.id));
          for (const demo of demos) {
            await putRecord(demo);
          }
          recs = [
            ...recs.filter((r) => !demoIds.has(r.id)),
            ...demos,
          ];
          localStorage.setItem(SEED_FLAG, "1");
        }
        if (cancelled) return;
        setRecords(recs);
        const storedActive = localStorage.getItem(ACTIVE_KEY);
        setActiveIdState(
          storedActive && recs.some((r) => r.id === storedActive)
            ? storedActive
            : recs[0]?.id ?? null
        );
        setLoading(false);
      } catch (error) {
        console.error("Failed to load videos:", error);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(
    () => records.map((record) => hydrateRecord(record, urlCacheRef.current)),
    [records]
  );

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0] ?? null,
    [items, activeId]
  );

  const setActiveVideo = useCallback((id: string) => {
    setActiveIdState(id);
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const saveVideo = useCallback(
    async (payload: VideoSavePayload, existingId?: string) => {
      const now = Date.now();
      let record: StoredVideoRecord;

      if (existingId) {
        const existing = records.find((r) => r.id === existingId);
        if (!existing) throw new Error("Video not found");
        record = {
          ...existing,
          title: payload.title,
          video: (payload.video as StoredSource | undefined) ?? existing.video,
          poster:
            payload.poster === undefined
              ? existing.poster
              : payload.poster ?? undefined,
          subtitles: mergeSources(existing.subtitles, payload.subtitles),
          audio: mergeSources(existing.audio, payload.audio),
          manualThumbs: payload.manualThumbs ?? existing.manualThumbs,
          updatedAt: now,
        };
      } else {
        if (!payload.video) {
          throw new Error("A video file or URL is required");
        }
        record = {
          id: `vid-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
          title: payload.title,
          video: payload.video,
          poster: payload.poster ?? undefined,
          subtitles: mergeSources({}, payload.subtitles),
          audio: mergeSources({}, payload.audio),
          manualThumbs: payload.manualThumbs ?? [],
          createdAt: now,
          updatedAt: now,
        };
      }

      await putRecord(record);
      setRecords((prev) =>
        existingId
          ? prev.map((r) => (r.id === existingId ? record : r))
          : [...prev, record]
      );
      setActiveIdState((cur) => {
        if (cur) return cur;
        try {
          localStorage.setItem(ACTIVE_KEY, record.id);
        } catch {
          /* ignore */
        }
        return record.id;
      });
    },
    [records]
  );

  const removeVideo = useCallback(
    async (id: string) => {
      await deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setActiveIdState((cur) => {
        if (cur !== id) return cur;
        const next = records.filter((r) => r.id !== id)[0]?.id ?? null;
        try {
          if (next) localStorage.setItem(ACTIVE_KEY, next);
          else localStorage.removeItem(ACTIVE_KEY);
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [records]
  );

  const value = useMemo(
    () => ({
      items,
      records,
      activeId: activeItem?.id ?? null,
      activeItem,
      loading,
      setActiveVideo,
      saveVideo,
      removeVideo,
    }),
    [
      items,
      records,
      activeItem,
      loading,
      setActiveVideo,
      saveVideo,
      removeVideo,
    ]
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within VideoProvider");
  return ctx;
}

export type { StoredImage };
