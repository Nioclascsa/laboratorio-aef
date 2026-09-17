"use client";

import { useEffect } from "react";
import Script from "next/script";

type InstagramEmbedsProps = {
  posts: string[];
};

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process?: () => void;
    };
  };
};

export function InstagramEmbeds({ posts }: InstagramEmbedsProps) {
  useEffect(() => {
    const instgrm = (window as InstagramWindow).instgrm;
    instgrm?.Embeds?.process?.();
  }, [posts]);

  return (
    <>
      <div className="instagram-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-start w-full">
        {posts.map((post) => (
          <div className="instagram-embed w-full flex justify-center max-w-[400px]" key={post}>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={post}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: "0",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                margin: "0 auto",
                maxWidth: "100%",
                minWidth: "280px",
                padding: "0",
                width: "99.375%",
              }}
            >
              <a href={post} target="_blank" rel="noopener noreferrer">
                Ver en Instagram
              </a>
            </blockquote>
          </div>
        ))}
      </div>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          const instgrm = (window as InstagramWindow).instgrm;
          instgrm?.Embeds?.process?.();
        }}
      />
    </>
  );
}
