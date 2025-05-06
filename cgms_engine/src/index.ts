const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }//test


    const { searchParams } = new URL(request.url);    const docName = searchParams.get("doc") || "centre.md";
    const rawUrl = `https://raw.githubusercontent.com/CR-ux/CGMS/main/cgms_engine/The%20Woman%20In%20The%20Wallpaper/${docName}`;

    const query = docName.replace(".md", "");

    if (!query) {
      return new Response(JSON.stringify({ error: "No query provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
//test

    let mdContent = "";
//builtlog
console.log('Query:', query);
    try {
      const mdRes = await fetch(rawUrl);
      if (!mdRes.ok) throw new Error("Failed to fetch markdown file");
      mdContent = await mdRes.text();
      // Rewrite image paths to full frontend URLs
      const BASE_IMAGE_URL = "http://localhost:5173"; // or your actual domain
      mdContent = mdContent.replace(/\!\[(.*?)\]\(\s*\/images\/(.*?)\)/g, `![$1](${BASE_IMAGE_URL}/images/$2)`);
      console.log("Fetched Markdown:", mdContent.slice(0, 1000));
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const shortContent = mdContent.slice(0, 144000) + "\n{REDACTED}";
    const links = [...mdContent.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]);

    const allLexDefs = [...mdContent.matchAll(/lexDef\s+"([^"]+)"\s*{usage:::\s*([^}]*)}\s*<\s*([^.\n]+)/g)];
    console.log("Matched lexDefs:", allLexDefs);
    let totalPotency = 0;
    for (const match of allLexDefs) {
      const usagePart = match[2];
      const usageList = usagePart.split("||").map(u => u.trim());
      totalPotency += usageList.length;
    }

    return new Response(JSON.stringify({
      term: query,
      usageTypes: [],
      potency: totalPotency,
      concentration: allLexDefs.length,
      valency: (mdContent.match(/lexDef\s+/g) || []).length,
      fallback: shortContent,
      fall: shortContent,
      markdown: shortContent,
      coordinate: rawUrl,
      links,
      lexDefs: allLexDefs.map(m => ({
        name: m[1],
        usages: m[2].split("||").map(u => u.trim()),
        defBlock: m[3].trim()
      }))
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};