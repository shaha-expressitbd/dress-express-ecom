// components/YouTubeShorts.tsx
"use client";

interface YouTubeShortsProps {
    videoId: string;   // e.g. "34xWPOn7efY"
    className?: string;
}

export default function YouTubeShorts({
    videoId,
    className = "",
}: YouTubeShortsProps) {
    const params = new URLSearchParams({
        autoplay: "1",
        mute: "1",
        controls: "0",
        modestbranding: "1",
        playsinline: "1",
        rel: "0",
        loop: "1",
        playlist: videoId,
        fs: "0",
        iv_load_policy: "3",
        disablekb: "1",

    }).toString();

    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            <div className="absolute inset-0 w-full h-full" aria-disabled></div>
            {/* 9 : 16 vertical ratio */}
            <div className="aspect-[9/16]">
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen   // will not show because fs=0, but keeps API happy
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
}
