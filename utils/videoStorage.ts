import type {
  StoredSource,
  StoredImage,
  StoredVideoRecord,
  VideoItem,
  VideoLang,
} from "@/types/video";
import { LANG_LABELS } from "@/types/video";

const DB_NAME = "celestique-video-db";
const DB_VERSION = 1;
const STORE_NAME = "videos";

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

export async function getAllRecords(): Promise<StoredVideoRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result as StoredVideoRecord[]);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function getRecord(id: string): Promise<StoredVideoRecord | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => {
      db.close();
      resolve(req.result as StoredVideoRecord | undefined);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function putRecord(record: StoredVideoRecord): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await promisifyTx(tx, () => tx.objectStore(STORE_NAME).put(record));
  db.close();
}

export async function deleteRecord(id: string): Promise<void> {
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
  image: StoredImage | undefined,
  cache: UrlCache
): VideoItem["poster"] {
  const src = sourceToUrl(image, cache);
  if (!src || !image) return undefined;
  return {
    src,
    name: image.kind === "file" ? image.name : undefined,
    kind: image.kind,
    width: image.width,
    height: image.height,
  };
}

export function hydrateRecord(
  record: StoredVideoRecord,
  cache: UrlCache
): VideoItem {
  const videoSrc = sourceToUrl(record.video, cache);
  const subtitles = (["en", "es"] as VideoLang[])
    .map((lang) => {
      const src = sourceToUrl(record.subtitles[lang], cache);
      if (!src) return null;
      const stored = record.subtitles[lang];
      return {
        lang,
        label: LANG_LABELS[lang],
        src,
        name: stored && stored.kind === "file" ? stored.name : undefined,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const audioTracks = (["en", "es"] as VideoLang[])
    .map((lang) => {
      const src = sourceToUrl(record.audio[lang], cache);
      if (!src) return null;
      const stored = record.audio[lang];
      return {
        lang,
        label: LANG_LABELS[lang],
        src,
        name: stored && stored.kind === "file" ? stored.name : undefined,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const manualThumbs = record.manualThumbs
    .map((thumb) => imageToRef(thumb, cache))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  return {
    id: record.id,
    title: record.title,
    video: {
      src: videoSrc ?? "",
      name: record.video.kind === "file" ? record.video.name : undefined,
      kind: record.video.kind,
    },
    poster: imageToRef(record.poster, cache),
    subtitles,
    audioTracks,
    manualThumbs,
  };
}

const DEMO_VTT_EN = `WEBVTT

1
00:00:00.400 --> 00:00:02.200
Every piece begins as a whisper of light.

2
00:00:02.400 --> 00:00:04.000
Crafted by hand, in 14k gold.

3
00:00:04.200 --> 00:00:05.400
Brillo & Co — for moments that outshine time.
`;

const DEMO_VTT_ES = `WEBVTT

1
00:00:00.400 --> 00:00:02.200
Cada pieza comienza como un susurro de luz.

2
00:00:02.400 --> 00:00:04.000
Hecha a mano, en oro de 14 quilates.

3
00:00:04.200 --> 00:00:05.400
Brillo & Co — para momentos que trascienden el tiempo.
`;

function vttBlob(text: string): Blob {
  return new Blob([text], { type: "text/vtt" });
}

export function createDemoRecords(): StoredVideoRecord[] {
  const now = Date.now();
  return [
    {
      id: "demo-films",
      title: "The Light of Dawn",
      video: {
        kind: "url",
        value: "https://mdn.github.io/shared-assets/videos/flower.mp4",
      },
      poster: {
        kind: "url",
        value:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop",
      },
      subtitles: {
        en: { kind: "file", blob: vttBlob(DEMO_VTT_EN), name: "english.vtt" },
        es: { kind: "file", blob: vttBlob(DEMO_VTT_ES), name: "espanol.vtt" },
      },
      audio: {
        en: {
          kind: "url",
          value: "https://mdn.github.io/shared-assets/audio/guitar.mp3",
        },
        es: {
          kind: "url",
          value:
            "https://mdn.github.io/shared-assets/audio/voices-around-a-fire.mp3",
        },
      },
      manualThumbs: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-golden-hour",
      title: "Golden Hour",
      video: {
        kind: "url",
        value: "https://mdn.github.io/shared-assets/videos/friday.mp4",
      },
      poster: {
        kind: "url",
        value:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
      },
      subtitles: {
        en: { kind: "file", blob: vttBlob(DEMO_VTT_EN), name: "english.vtt" },
        es: { kind: "file", blob: vttBlob(DEMO_VTT_ES), name: "espanol.vtt" },
      },
      audio: {
        en: {
          kind: "url",
          value: "https://mdn.github.io/shared-assets/audio/guitar.mp3",
        },
        es: {
          kind: "url",
          value:
            "https://mdn.github.io/shared-assets/audio/voices-around-a-fire.mp3",
        },
      },
      manualThumbs: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
}
