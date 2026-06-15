"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Aperture, SwitchCamera, ImageOff, Upload, RotateCcw } from "lucide-react";

// Live in-browser camera (works on iPad/iPhone Safari over https, and on
// localhost). Streams the rear camera, lets the user snap a frame, and returns
// it as a JPEG data URL. Degrades gracefully if the camera is unavailable.
export function CameraCapture({
  onCapture,
  onClose,
  onUploadInstead,
}: {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  onUploadInstead: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeRef = useRef(true);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setReady(false);
    setError(null);
    setErrorCode(null);
    stop();

    // In-app browsers (opening the link inside Instagram/Discord/Gmail etc.)
    // and non-secure contexts can't grant camera access at all.
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorCode("unsupported");
      setError(
        "This browser can't open the camera. If you tapped a link inside another app (Instagram, Discord, Mail…), open the site directly in Safari, or just upload a photo."
      );
      return;
    }

    // Try the preferred camera first, then fall back to any available camera.
    const attempts: MediaStreamConstraints[] = [
      { video: { facingMode: { ideal: facing } }, audio: false },
      { video: true, audio: false },
    ];

    let stream: MediaStream | null = null;
    let lastErr: unknown = null;
    for (const constraints of attempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        break;
      } catch (e) {
        lastErr = e;
        // A blocked permission won't be fixed by a looser constraint — stop.
        if ((e as DOMException)?.name === "NotAllowedError") break;
      }
    }

    if (!activeRef.current) {
      stream?.getTracks().forEach((t) => t.stop());
      return;
    }

    if (!stream) {
      const name = (lastErr as DOMException)?.name ?? "Error";
      setErrorCode(name);
      setError(
        name === "NotAllowedError"
          ? "Camera access is blocked for this site. On iPad: tap the “aA” in Safari's address bar → Website Settings → Camera → Allow, then tap Try again. Or upload a photo instead."
          : name === "NotFoundError" || name === "OverconstrainedError"
          ? "No usable camera was found on this device. Upload a photo instead."
          : name === "NotReadableError"
          ? "Another app is using the camera. Close it (or other camera tabs) and tap Try again."
          : "Couldn't start the camera. Tap Try again, or upload a photo instead."
      );
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      // iOS Safari needs these set as live attributes and only plays reliably
      // once metadata has loaded — playing too early shows a black frame.
      video.setAttribute("playsinline", "true");
      video.muted = true;
      video.onplaying = () => {
        if (activeRef.current) setReady(true);
      };
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 1) tryPlay();
      else video.onloadedmetadata = tryPlay;
    }
  }, [facing, stop]);

  useEffect(() => {
    activeRef.current = true;
    start();
    return () => {
      activeRef.current = false;
      stop();
    };
  }, [start, stop]);

  function shoot() {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stop();
    onCapture(dataUrl);
  }

  const canRetry = errorCode !== "unsupported";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between px-5 py-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-head">
            <Aperture className="h-4 w-4 text-brand-violet-soft" /> Scan a meal
          </p>
          <button onClick={onClose} aria-label="Close camera" className="text-hint hover:text-head">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[3/4] max-h-[60vh] w-full shrink bg-black">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-metric-heart/15">
                <ImageOff className="h-7 w-7 text-metric-heart" />
              </span>
              <p className="text-sm font-semibold text-head">Camera unavailable</p>
              <p className="max-w-xs text-xs text-muted">{error}</p>
              {errorCode && (
                <p className="text-[10px] uppercase tracking-wide text-hint">code: {errorCode}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                {canRetry && (
                  <button
                    onClick={start}
                    className="btn-ghost flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
                  >
                    <RotateCcw className="h-4 w-4" /> Try again
                  </button>
                )}
                <button
                  onClick={onUploadInstead}
                  className="btn-gradient flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  <Upload className="h-4 w-4" /> Upload a photo
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="h-full w-full object-cover"
                style={{ transform: facing === "user" ? "scaleX(-1)" : undefined }}
              />
              {/* viewfinder frame */}
              <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/40" />
              {!ready && (
                <div className="absolute inset-0 grid place-items-center text-sm text-white/80">
                  Starting camera…
                </div>
              )}
            </>
          )}
        </div>

        {!error && (
          <div className="flex shrink-0 items-center justify-between px-6 py-4">
            <button
              onClick={onUploadInstead}
              className="btn-ghost grid h-11 w-11 place-items-center rounded-full"
              aria-label="Upload a photo instead"
              title="Upload a photo instead"
            >
              <Upload className="h-5 w-5" />
            </button>

            <button
              onClick={shoot}
              disabled={!ready}
              aria-label="Take photo"
              className="grid h-16 w-16 place-items-center rounded-full bg-white ring-4 ring-white/30 transition active:scale-95 disabled:opacity-40"
            >
              <span className="h-12 w-12 rounded-full bg-brand-gradient" />
            </button>

            <button
              onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
              className="btn-ghost grid h-11 w-11 place-items-center rounded-full"
              aria-label="Switch camera"
              title="Switch camera"
            >
              <SwitchCamera className="h-5 w-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
