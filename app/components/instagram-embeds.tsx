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
      <div className="instagram-grid">
        {posts.map((post) => (
          <div className="instagram-embed" key={post}>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={post}
              data-instgrm-version="14"
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
