/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VideoItem, VideoLang } from "@/types/video";

const THUMB_COUNT = 12;
const DRIFT_TOLERANCE = 0.35;

type SubtitleChoice = "off" | VideoLang;

interface HoverState {
  ratio: number;
  time: number;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTimecode(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseTimeInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^\d+(:\d{1,2}){0,2}$/.test(trimmed)) return null;
  const parts = trimmed.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return null;
  const seconds = parts.pop()!;
  if (seconds >= 60) return null;
  if (parts.length === 0) return seconds;
  const minutes = parts.pop()!;
  if (parts.length === 0) return minutes * 60 + seconds;
  if (minutes >= 60) return null;
  return parts[0] * 3600 + minutes * 60 + seconds;
}

function seekVideoTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      video.removeEventListener("seeked", finish);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, 3000);
    video.addEventListener("seeked", finish);
    video.currentTime = time;
  });
}

function nearestThumb(
  thumbs: { time: number; src: string }[],
  time: number
): string | undefined {
  if (thumbs.length === 0) return undefined;
  let best = thumbs[0];
  for (const thumb of thumbs) {
    if (Math.abs(thumb.time - time) < Math.abs(best.time - time)) best = thumb;
  }
  return best.src;
}

function shortenUrl(url: string, max = 60): string {
  try {
    const u = new URL(url);
    const s = `${u.hostname}${u.pathname}`;
    return s.length > max ? s.slice(0, max) + "…" : s;
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url;
  }
}

export default function VideoPlayer({ video }: { video: VideoItem }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);

  const hasAudio = video.audioTracks.length > 0;
  const defaultAudioLang: VideoLang | null = video.audioTracks[0]?.lang ?? null;
  const [audioLang, setAudioLang] = useState<VideoLang | null>(defaultAudioLang);
  const [subtitleLang, setSubtitleLang] = useState<SubtitleChoice>("off");

  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [ccMenuOpen, setCcMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [generatedThumbs, setGeneratedThumbs] = useState<
    { time: number; src: string }[]
  >([]);
  const [thumbsFailed, setThumbsFailed] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioFailed, setAudioFailed] = useState(false);
  const [activeCues, setActiveCues] = useState<string[]>([]);
  const [timeDraft, setTimeDraft] = useState("");
  const [timeEditing, setTimeEditing] = useState(false);

  const activeAudioSrc = useMemo(
    () => video.audioTracks.find((t) => t.lang === audioLang)?.src ?? null,
    [video.audioTracks, audioLang]
  );

  const manualThumbs = useMemo(() => {
    const list = video.manualThumbs;
    if (list.length === 0 || !duration) return [];
    return list.map((thumb, i) => ({
      time: ((i + 0.5) / list.length) * duration,
      src: thumb.src,
    }));
  }, [video.manualThumbs, duration]);

  const hoverThumbs = generatedThumbs.length > 0 ? generatedThumbs : manualThumbs;
  const hoverThumbSrc =
    hover && hoverThumbs.length > 0
      ? nearestThumb(hoverThumbs, hover.time)
      : undefined;

  const menusOpen = ccMenuOpen || audioMenuOpen;

  const bumpControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (menusOpen) {
      setControlsVisible(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      return;
    }
    if (isPlaying) bumpControls();
    else {
      setControlsVisible(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    }
  }, [isPlaying, menusOpen, bumpControls]);

  useEffect(() => {
    if (video.audioTracks.length === 0) return;
    setAudioLang(video.audioTracks[0].lang);
  }, [video.audioTracks]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setCcMenuOpen(false);
        setAudioMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted, activeAudioSrc]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!hasAudio || audioFailed) {
      el.volume = volume;
      el.muted = muted;
    }
  }, [volume, muted, hasAudio, audioFailed]);

  useEffect(() => {
    setAudioFailed(false);
    setAudioError(null);
    const el = audioRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const sync = () => {
      el.currentTime = vid.currentTime;
      if (!vid.paused && !vid.ended) el.play().catch(() => {});
    };
    if (el.readyState >= 1) sync();
    el.addEventListener("loadedmetadata", sync, { once: true });
    return () => el.removeEventListener("loadedmetadata", sync);
  }, [activeAudioSrc]);

  useEffect(() => {
    if (!isPlaying || !hasAudio) return;
    const id = window.setInterval(() => {
      const vid = videoRef.current;
      const el = audioRef.current;
      if (!vid || !el || el.paused) return;
      if (Math.abs(el.currentTime - vid.currentTime) > DRIFT_TOLERANCE) {
        el.currentTime = vid.currentTime;
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [isPlaying, hasAudio]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const applyModes = () => {
      const tracks = vid.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const shouldShow =
          subtitleLang !== "off" && track.language === subtitleLang;
        track.mode = shouldShow ? "hidden" : "disabled";
      }
    };

    const onCueChange = () => {
      const tracks = vid.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.mode === "hidden" || track.mode === "showing") {
          const cues = track.activeCues;
          if (cues && cues.length > 0) {
            setActiveCues(
              Array.from(cues).map((c) => (c as VTTCue).text)
            );
            return;
          }
        }
      }
      setActiveCues([]);
    };

    applyModes();
    onCueChange();

    const trackEls = vid.querySelectorAll("track");
    trackEls.forEach((el) => {
      el.addEventListener("load", applyModes);
      el.addEventListener("error", () =>
        console.warn("Subtitle track failed to load:", el.src)
      );
    });

    const tracks = vid.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].addEventListener("cuechange", onCueChange);
    }

    vid.addEventListener("loadedmetadata", applyModes);

    return () => {
      trackEls.forEach((el) => el.removeEventListener("load", applyModes));
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].removeEventListener("cuechange", onCueChange);
      }
      vid.removeEventListener("loadedmetadata", applyModes);
    };
  }, [subtitleLang, video.id, duration]);

  useEffect(() => {
    let cancelled = false;
    setGeneratedThumbs([]);
    setThumbsFailed(false);

    const el = document.createElement("video");
    el.crossOrigin = "anonymous";
    el.muted = true;
    el.preload = "auto";
    el.src = video.video.src;

    const capture = async () => {
      const dur = el.duration;
      if (!isFinite(dur) || dur <= 0) return;
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const list: { time: number; src: string }[] = [];
      for (let i = 0; i < THUMB_COUNT; i++) {
        if (cancelled) return;
        const time = (dur / THUMB_COUNT) * (i + 0.5);
        await seekVideoTo(el, time);
        if (cancelled) return;
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
        list.push({ time, src: canvas.toDataURL("image/jpeg", 0.6) });
      }
      if (!cancelled) setGeneratedThumbs(list);
    };

    const onLoaded = () => {
      capture().catch(() => {
        if (!cancelled) setThumbsFailed(true);
      });
    };
    el.addEventListener("loadedmetadata", onLoaded, { once: true });
    el.addEventListener("error", () => {
      if (!cancelled) setThumbsFailed(true);
    });

    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeAttribute("src");
      el.load();
    };
  }, [video.video.src]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    const el = audioRef.current;
    if (!vid) return;
    if (vid.paused || vid.ended) {
      setStarted(true);
      if (el && activeAudioSrc) {
        el.currentTime = vid.currentTime;
        el.play().catch((error) => {
          console.warn("Audio play failed:", error);
          setAudioFailed(true);
        });
      }
      vid.play().catch((error) => {
        console.warn("Video play failed:", error);
        setMediaError(
          `The video could not be played. Check that the file exists and the URL is reachable. (${shortenUrl(video.video.src)})`
        );
      });
    } else {
      vid.pause();
      el?.pause();
    }
  }, [activeAudioSrc, video.video.src]);

  const seekTo = useCallback(
    (time: number) => {
      const vid = videoRef.current;
      if (!vid || !duration) return;
      const clamped = Math.min(Math.max(time, 0), duration);
      vid.currentTime = clamped;
      const el = audioRef.current;
      if (el) el.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [duration]
  );

  useEffect(() => {
    if (!timeEditing) setTimeDraft(formatTimecode(currentTime));
  }, [currentTime, timeEditing]);

  const commitTimeDraft = useCallback(() => {
    const parsed = parseTimeInput(timeDraft);
    if (parsed !== null) seekTo(parsed);
    setTimeDraft(formatTimecode(videoRef.current?.currentTime ?? currentTime));
    setTimeEditing(false);
  }, [timeDraft, seekTo, currentTime]);

  const cancelTimeDraft = useCallback(() => {
    setTimeDraft(formatTimecode(videoRef.current?.currentTime ?? currentTime));
    setTimeEditing(false);
  }, [currentTime]);

  const onTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || dragging) return;
    setCurrentTime(vid.currentTime);
  }, [dragging]);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const bar = seekBarRef.current;
      if (!bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      seekTo(ratio * duration);
    },
    [duration, seekTo]
  );

  const onBarPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(true);
      seekFromClientX(event.clientX);
    },
    [seekFromClientX]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => seekFromClientX(event.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, seekFromClientX]);

  const onBarHover = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      const bar = seekBarRef.current;
      if (!bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((event.clientX - rect.left) / rect.width, 0),
        1
      );
      setHover({ ratio, time: ratio * duration });
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      rootRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT") return;
      const vid = videoRef.current;
      if (!vid) return;
      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          event.preventDefault();
          seekTo(vid.currentTime + 5);
          break;
        case "ArrowLeft":
          event.preventDefault();
          seekTo(vid.currentTime - 5);
          break;
        case "ArrowUp":
          event.preventDefault();
          setMuted(false);
          setVolume((v) => Math.min(v + 0.05, 1));
          break;
        case "ArrowDown":
          event.preventDefault();
          setVolume((v) => Math.max(v - 0.05, 0));
          break;
        case "m":
          setMuted((m) => !m);
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          break;
      }
    },
    [togglePlay, seekTo, toggleFullscreen]
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration ? Math.min(buffered * 100, 100) : 0;
  const controlsShown = controlsVisible || !isPlaying || menusOpen || dragging;

  return (
    <div
      ref={rootRef}
      className="group/player relative w-full overflow-hidden select-none"
      style={{ backgroundColor: "#000", aspectRatio: "16 / 9" }}
      onPointerMove={bumpControls}
      onPointerLeave={() => {
        if (!menusOpen) setControlsVisible(false);
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${video.title}`}
    >
      <video
        ref={videoRef}
        key={video.id}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "contain" }}
        src={video.video.src}
        poster={video.poster?.src}
        preload="metadata"
        playsInline
        muted={hasAudio && !audioFailed}
        onError={(e) => {
          console.warn("Video element error:", e.currentTarget.error);
          setMediaError(
            `The video could not be loaded. Check that the file exists and the URL is reachable. (${shortenUrl(video.video.src)})`
          );
        }}
        onLoadedMetadata={(e) => {
          setMediaError(null);
          setDuration(e.currentTarget.duration);
        }}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          if (hasAudio) audioRef.current?.play().catch(() => {});
        }}
        onPause={() => {
          setIsPlaying(false);
          audioRef.current?.pause();
        }}
        onEnded={() => {
          setIsPlaying(false);
          audioRef.current?.pause();
        }}
        onProgress={(e) => {
          const el = e.currentTarget;
          if (el.buffered.length > 0) {
            setBuffered(el.buffered.end(el.buffered.length - 1));
          }
        }}
        onSeeking={() => {
          const el = videoRef.current;
          const audio = audioRef.current;
          if (el && audio) audio.currentTime = el.currentTime;
        }}
      >
        {video.subtitles.map((track) => (
          <track
            key={`${track.lang}-${track.src}`}
            kind="subtitles"
            srcLang={track.lang}
            label={track.label}
            src={track.src}
          />
        ))}
      </video>

      {hasAudio && (
        <audio
          ref={audioRef}
          src={activeAudioSrc ?? undefined}
          preload="auto"
          onError={(e) => {
            const el = e.currentTarget;
            const src = el.currentSrc || activeAudioSrc || "";
            console.warn("Audio element error:", el.error, src);
            setAudioFailed(true);
            setAudioError(
              src.includes("gist.github.com")
                ? `The audio URL points to a webpage, not an audio file (${shortenUrl(src)}). Use a direct .mp3 link or upload a file.`
                : `The audio track could not be loaded. Check that the URL is a direct audio file. (${shortenUrl(src)})`
            );
          }}
          onCanPlay={() => {
            const vid = videoRef.current;
            const el = audioRef.current;
            if (vid && el && !vid.paused && !vid.ended && el.paused) {
              el.currentTime = vid.currentTime;
              el.play().catch(() => {});
            }
          }}
        />
      )}

      {audioError && hasAudio && (
        <div
          className="absolute top-3 left-3 right-3 z-30 px-3 py-2 text-[11px] md:text-xs text-white/95"
          style={{ backgroundColor: "rgba(127, 29, 29, 0.92)" }}
          role="alert"
        >
          {audioError}
        </div>
      )}

      {activeCues.length > 0 && (
        <div
          className="absolute bottom-16 md:bottom-20 left-0 right-0 z-30 flex justify-center px-6 md:px-12 pointer-events-none"
          aria-live="polite"
        >
          <div className="text-center">
            {activeCues.map((text, i) => (
              <p
                key={i}
                className="inline-block text-white text-xs md:text-sm px-3 py-1.5 mb-1 leading-snug max-w-2xl"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.78)",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      )}

      {mediaError && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center p-6 text-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          role="alert"
        >
          <div>
            <svg
              className="mx-auto mb-3"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-white/90 max-w-sm">{mediaError}</p>
            <button
              onClick={() => setMediaError(null)}
              className="mt-4 text-[10px] tracking-[0.15em] uppercase px-4 py-2 border text-white/80 transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          aria-label="Play video"
        >
          <span
            className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 3 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      <div
        className="absolute left-0 right-0 bottom-0 z-30 transition-opacity duration-300"
        style={{
          opacity: controlsShown ? 1 : 0,
          pointerEvents: controlsShown ? "auto" : "none",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 55%, transparent)",
        }}
      >
        <div className="px-3 md:px-4 pt-8 pb-2">
          <p className="text-white/90 text-xs md:text-sm font-medium mb-1.5 truncate" style={{ fontFamily: "var(--font-title)" }}>
            {video.title}
          </p>

          <div className="relative" onPointerLeave={() => setHover(null)}>
            {hover && hoverThumbSrc && (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${hover.ratio * 100}%`,
                  bottom: "18px",
                  transform: "translateX(-50%)",
                }}
              >
                <img
                  src={hoverThumbSrc}
                  alt=""
                  className="block w-28 md:w-36 border border-white/20"
                  style={{ aspectRatio: "16 / 9", objectFit: "cover", backgroundColor: "#111" }}
                />
                <p className="text-center text-[11px] text-white mt-1 tabular-nums">
                  {formatTime(hover.time)}
                </p>
              </div>
            )}
            {hover && !hoverThumbSrc && (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${hover.ratio * 100}%`,
                  bottom: "18px",
                  transform: "translateX(-50%)",
                }}
              >
                <p
                  className="text-[11px] text-white px-1.5 py-0.5 tabular-nums"
                  style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
                >
                  {formatTime(hover.time)}
                </p>
              </div>
            )}

            <div
              ref={seekBarRef}
              className="relative w-full cursor-pointer py-2"
              onPointerDown={onBarPointerDown}
              onPointerMove={onBarHover}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              tabIndex={-1}
            >
              <div
                className="relative w-full transition-all duration-150"
                style={{
                  height: hover || dragging ? "5px" : "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: `${bufferedPercent}%`, backgroundColor: "rgba(255, 255, 255, 0.45)" }}
                />
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: `${progress}%`, backgroundColor: "var(--color-accent)" }}
                />
                <div
                  className="absolute w-3 h-3 rounded-full transition-transform duration-150"
                  style={{
                    left: `${progress}%`,
                    top: "50%",
                    transform: `translate(-50%, -50%) scale(${hover || dragging ? 1.2 : 1})`,
                    backgroundColor: "var(--color-accent)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-1">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
            <button
              onClick={togglePlay}
              className="p-1.5 text-white transition-opacity hover:opacity-70"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <span className="text-white/90 text-xs tabular-nums hidden sm:inline whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={timeDraft}
              placeholder="0:00"
              onFocus={(e) => {
                setTimeEditing(true);
                setTimeDraft(
                  formatTimecode(videoRef.current?.currentTime ?? currentTime)
                );
                e.currentTarget.select();
              }}
              onChange={(e) => setTimeDraft(e.target.value)}
              onBlur={commitTimeDraft}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitTimeDraft();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelTimeDraft();
                }
              }}
              className="w-[4.25rem] sm:w-16 text-center text-xs text-white tabular-nums px-1 py-1 border bg-black/40 outline-none focus:border-[var(--color-accent)]"
              style={{
                borderColor: timeEditing
                  ? "var(--color-accent)"
                  : "rgba(255, 255, 255, 0.3)",
              }}
              aria-label="Go to time (mm:ss)"
            />
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 ml-auto shrink-0">
            <div className="group/volume flex items-center">
              <button
                onClick={() => setMuted((m) => !m)}
                className="p-1.5 text-white transition-opacity hover:opacity-70"
                aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>
              <div
                className="overflow-hidden transition-all duration-300 w-16 opacity-100 md:w-0 md:opacity-0 md:group-hover/volume:w-20 md:group-hover/volume:opacity-100 md:group-focus-within/volume:w-20 md:group-focus-within/volume:opacity-100"
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(false);
                  }}
                  className="w-16 md:w-20 align-middle"
                  style={{ accentColor: "var(--color-accent)" }}
                  aria-label="Volume"
                />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setCcMenuOpen((o) => !o);
                  setAudioMenuOpen(false);
                }}
                className="px-1.5 py-1 text-white text-[10px] tracking-[0.1em] border transition-opacity hover:opacity-70"
                style={{
                  borderColor:
                    subtitleLang !== "off"
                      ? "var(--color-accent)"
                      : "rgba(255, 255, 255, 0.4)",
                }}
                aria-label="Subtitles"
                aria-expanded={ccMenuOpen}
              >
                CC
              </button>
              {ccMenuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-44 py-1 border"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.92)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  role="menu"
                >
                  <p className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-white/50">
                    Subtitles
                  </p>
                  {(["off", "en", "es"] as SubtitleChoice[]).map((choice) => {
                    const label =
                      choice === "off"
                        ? "Off"
                        : video.subtitles.find((t) => t.lang === choice)?.label ??
                          choice.toUpperCase();
                    const disabled = choice !== "off" && !video.subtitles.some((t) => t.lang === choice);
                    const active = subtitleLang === choice;
                    return (
                      <button
                        key={choice}
                        disabled={disabled}
                        onClick={() => {
                          setSubtitleLang(choice);
                          setCcMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-left"
                        role="menuitem"
                      >
                        {label}
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setAudioMenuOpen((o) => !o);
                  setCcMenuOpen(false);
                }}
                className="px-1.5 py-1 text-white transition-opacity hover:opacity-70"
                aria-label="Audio track"
                aria-expanded={audioMenuOpen}
                disabled={video.audioTracks.length === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
              {audioMenuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-44 py-1 border"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.92)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  role="menu"
                >
                  <p className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-white/50">
                    Audio track
                  </p>
                  {video.audioTracks.map((track) => {
                    const active = audioLang === track.lang;
                    return (
                      <button
                        key={track.lang}
                        onClick={() => {
                          setAudioLang(track.lang);
                          setAudioMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 text-left"
                        role="menuitem"
                      >
                        {track.label}
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-white transition-opacity hover:opacity-70"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
            </div>
          </div>
        </div>
      </div>

      {(thumbsFailed || (!started && hoverThumbs.length === 0)) && (
        <span className="sr-only">
          Playback thumbnail previews unavailable for this video.
        </span>
      )}
    </div>
  );
}
