"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Aperture, SwitchCamera, ImageOff, Upload } from "lucide-react";

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
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function start() {
      setReady(false);
      setError(null);
      streamRef.current?.getTracks().forEach((t) => t.stop());

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("This browser can't open the camera. Upload a photo instead.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        const name = (e as DOMException)?.name;
        setError(
          name === "NotAllowedError"
            ? "Camera access was blocked. Allow the camera for this site, then try again."
            : name === "NotFoundError"
            ? "No camera was found on this device."
            : "Couldn't start the camera. On the deployed (https) site it works in iPad Safari."
        );
      }
    }

    start();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

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
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  }

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
        className="glass-strong w-full max-w-md overflow-hidden rounded-3xl"
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-head">
            <Aperture className="h-4 w-4 text-brand-violet-soft" /> Scan a meal
          </p>
          <button onClick={onClose} aria-label="Close camera" className="text-hint hover:text-head">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[3/4] w-full bg-black">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-metric-heart/15">
                <ImageOff className="h-7 w-7 text-metric-heart" />
              </span>
              <p className="text-sm font-semibold text-head">Camera unavailable</p>
              <p className="max-w-xs text-xs text-muted">{error}</p>
              <button
                onClick={onUploadInstead}
                className="btn-gradient mt-1 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <Upload className="h-4 w-4" /> Upload a photo instead
              </button>
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
          <div className="flex items-center justify-between px-6 py-4">
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
