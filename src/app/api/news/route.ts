import { NextResponse } from "next/server";

const FALLBACK_NEWS = [
  {
    title: "Clark University Ranks #37 in Best Value Schools 2026",
    summary: "U.S. News & World Report recognizes Clark for exceptional academics and affordability.",
    url: "https://www.clarku.edu/news",
    date: "2026-04-18",
    category: "Rankings",
  },
  {
    title: "Robert H. Goddard Centennial Celebrations Begin on Campus",
    summary: "Clark marks 100 years since the world's first liquid-fueled rocket launch.",
    url: "https://www.clarku.edu/goddard",
    date: "2026-04-15",
    category: "Events",
  },
  {
    title: "Tech Innovation Challenge 2026 Demo Day — April 30",
    summary: "Student teams present AI-powered projects built during the spring innovation challenge.",
    url: "https://www.clarku.edu",
    date: "2026-04-01",
    category: "Events",
  },
];

export async function GET() {
  try {
    // Fetch Clark's RSS feed
    const res = await fetch("https://www.clarku.edu/feed/", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "CampusPulse/1.0" },
    });

    if (!res.ok) throw new Error("Feed not available");

    const xml = await res.text();

    // Parse RSS items
    const items = xml.split("<item>").slice(1, 4);

    const articles = items.map(item => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        || item.match(/<title>(.*?)<\/title>/)?.[1]
        || "Clark University News";

      const summary = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
        || item.match(/<description>(.*?)<\/description>/)?.[1]
        || "Read the latest from Clark University.";

      const url = item.match(/<link>(.*?)<\/link>/)?.[1]
        || "https://www.clarku.edu/news";

      const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]
        || new Date().toISOString();

      // Clean HTML tags from summary
      const cleanSummary = summary
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .trim()
        .slice(0, 150) + "...";

      return {
        title: title.trim(),
        summary: cleanSummary,
        url: url.trim(),
        date: new Date(date).toISOString().split("T")[0],
        category: "News",
      };
    });

    if (articles.length > 0) {
      return NextResponse.json({ articles, source: "live" });
    }

    throw new Error("No articles found");

  } catch (error) {
    return NextResponse.json({ articles: FALLBACK_NEWS, source: "static" });
  }
}