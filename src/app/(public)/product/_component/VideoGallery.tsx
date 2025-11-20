// components/YouTubeEmbed.tsx
"use client";

interface YouTubeEmbedProps {
    videoId: string;          // e.g. "34xWPOn7efY"
    className?: string;       // optional Tailwind / custom styles
}

export default function VideoGallery({ videoId, className = "" }: YouTubeEmbedProps) {
    // Build the query string once so it’s easy to tweak later
    const params = new URLSearchParams({
        autoplay: "1",
        mute: "1",
        controls: "0",
        modestbranding: "1",
        rel: "0",
        playsinline: "1",
        loop: "1",
        enablejsapi: "1"
    }).toString();

    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            {/* Maintain 16:9 aspect ratio */}
            <div>
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}?${params}`}
                    title="YouTube video player"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
}
