// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";
import { auditHtml } from "./audit";

const perfect = `<!doctype html><html><head>
<title>Acme — Marketing that Works</title>
<meta name="description" content="Acme helps startups grow with data-driven marketing.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:image" content="https://acme.dev/og.png">
<link rel="canonical" href="https://acme.dev/">
</head><body><h1>Grow with Acme</h1></body></html>`;

describe("auditHtml", () => {
  it("scores a well-formed page 100 with no issues", () => {
    const r = auditHtml("https://acme.dev", perfect);
    expect(r.score).toBe(100);
    expect(r.issues).toEqual([]);
    expect(r).toMatchObject({
      title: "Acme — Marketing that Works",
      h1: "Grow with Acme",
      hasViewport: true,
      ogImage: "https://acme.dev/og.png",
      canonical: "https://acme.dev/",
    });
  });

  it("flags every missing essential and scores 0", () => {
    const r = auditHtml("https://bare.dev", "<html><body><p>hi</p></body></html>");
    expect(r.score).toBe(0);
    expect(r.issues).toContain("Missing <title>");
    expect(r.issues).toContain("Missing meta description");
    expect(r.issues).toContain("Missing an <h1> heading");
    expect(r.issues).toContain("No viewport meta — the page isn't mobile-ready");
  });

  it("adds advisory issues for over-long title/description without lowering a full score", () => {
    const longTitle = "x".repeat(70);
    const longDesc = "y".repeat(200);
    const html = perfect
      .replace("Acme — Marketing that Works", longTitle)
      .replace("Acme helps startups grow with data-driven marketing.", longDesc);
    const r = auditHtml("https://acme.dev", html);
    expect(r.score).toBe(100); // all six essentials still present
    expect(r.issues).toContain("Title is longer than 60 characters");
    expect(r.issues).toContain("Meta description is longer than 160 characters");
  });
});
