export type VideoLang = "en" | "es";

export const LANG_LABELS: Record<VideoLang, string> = {
  en: "English",
  es: "Español",
};

export type StoredSource =
  | { kind: "url"; value: string }
  | { kind: "file"; blob: Blob; name?: string };

export type StoredImage = StoredSource & {
  width?: number;
  height?: number;
};

export interface StoredVideoRecord {
  id: string;
  title: string;
  video: StoredSource;
  poster?: StoredImage;
  subtitles: Partial<Record<VideoLang, StoredSource>>;
  audio: Partial<Record<VideoLang, StoredSource>>;
  manualThumbs: StoredImage[];
  createdAt: number;
  updatedAt: number;
}

export interface MediaRef {
  src: string;
  name?: string;
  kind: "file" | "url";
  width?: number;
  height?: number;
}

export interface SubtitleTrackItem {
  lang: VideoLang;
  label: string;
  src: string;
  name?: string;
}

export interface AudioTrackItem {
  lang: VideoLang;
  label: string;
  src: string;
  name?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  video: MediaRef;
  poster?: MediaRef;
  subtitles: SubtitleTrackItem[];
  audioTracks: AudioTrackItem[];
  manualThumbs: MediaRef[];
}

export interface VideoSavePayload {
  title: string;
  video?: StoredSource;
  poster?: StoredImage | null;
  subtitles: Partial<Record<VideoLang, StoredSource | null>>;
  audio: Partial<Record<VideoLang, StoredSource | null>>;
  manualThumbs?: StoredImage[];
}
