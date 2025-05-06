const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const GITHUB_BASE =
  "https://raw.githubusercontent.com/CR-ux/CGMS/main/The%20Woman%20In%20The%20Wallpaper";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q");
    const query = decodeURIComponent((rawQuery || "centre.md").trim().replace(/^\/+|\/+$/g, ""));

    const targetFile = query.endsWith(".md") ? query : `${query}.md`;
    const fileUrl = `${GITHUB_BASE}/${encodeURIComponent(targetFile)}`;

    let mdContent = "";

    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch markdown");
      mdContent = await res.text();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: `Could not load "${query}"` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const shortContent = mdContent.slice(0, 144000) + "\n{REDACTED}";
    const links = [...mdContent.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);

    const allLexDefs = [...mdContent.matchAll(/lexDef\s+"([^"]+)"\s*{usage:::\s*([^}]*)}\s*<\s*([^.\n]+)/g)];
    let totalPotency = 0;
    for (const match of allLexDefs) {
      const usageList = match[2].split("||").map((u) => u.trim());
      totalPotency += usageList.length;
    }

    return new Response(
      JSON.stringify({
        term: query,
        content: shortContent,
        next: links,
        coordinate: fileUrl,
        potency: totalPotency,
        concentration: allLexDefs.length,
        valency: (mdContent.match(/lexDef\s+/g) || []).length,
        lexDefs: allLexDefs.map((m) => ({
          name: m[1],
          usages: m[2].split("||").map((u) => u.trim()),
          defBlock: m[3].trim(),
        })),
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  },
};