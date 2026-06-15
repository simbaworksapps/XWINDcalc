async function handleMetar(request) {
  const url = new URL(request.url);
  const ids = (url.searchParams.get("ids") || "").toUpperCase().replace(/[^A-Z0-9,]/g, "");

  if (!ids) {
    return Response.json({ error: "Missing ids" }, { status: 400 });
  }

  const upstream = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(ids)}&format=json`;
  const res = await fetch(upstream, {
    headers: {
      "User-Agent": "SIMBA-XWIND/1.0 contact: deployed-via-cloudflare-pages"
    }
  });

  if (res.status === 204) {
    return Response.json({ error: "No METAR available" }, { status: 404 });
  }

  if (!res.ok) {
    return Response.json({ error: "METAR service unavailable" }, { status: res.status });
  }

  const data = await res.json();
  const metar = Array.isArray(data) ? data[0] : data;

  if (!metar) {
    return Response.json({ error: "No METAR available" }, { status: 404 });
  }

  return Response.json(metar, {
    headers: {
      "Cache-Control": "public, max-age=60"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/metar") {
      return handleMetar(request);
    }
    return env.ASSETS.fetch(request);
  }
};
