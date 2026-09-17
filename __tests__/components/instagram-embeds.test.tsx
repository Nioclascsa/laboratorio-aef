import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InstagramEmbeds } from "@/app/components/instagram-embeds";

// Mock next/script
vi.mock("next/script", () => ({
  __esModule: true,
  default: () => null,
}));

describe("InstagramEmbeds component", () => {
  it("renders blockquotes with permalinks for all posts", () => {
    const posts = [
      "https://www.instagram.com/p/DVosclokYaj/",
      "https://www.instagram.com/p/DYr-ZW1ERAE/",
    ];

    const { container } = render(<InstagramEmbeds posts={posts} />);

    const links = screen.getAllByRole("link", { name: "Ver en Instagram" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", posts[0]);
    expect(links[1]).toHaveAttribute("href", posts[1]);

    const blockquotes = container.querySelectorAll("blockquote.instagram-media");
    expect(blockquotes).toHaveLength(2);
    expect(blockquotes[0]).toHaveAttribute("data-instgrm-permalink", posts[0]);
  });

  it("handles empty post list cleanly", () => {
    const { container } = render(<InstagramEmbeds posts={[]} />);
    const blockquotes = container.querySelectorAll("blockquote.instagram-media");
    expect(blockquotes).toHaveLength(0);
  });
});
