import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID || "";
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || "";
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Spotify token error:", JSON.stringify(data));
    return { access_token: null };
  }

  return data;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const tokenData = await getAccessToken();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(200).json({ topTrack: null, topArtist: null, error: "No access token - check SPOTIFY env vars" });
    }

    const [tracksRes, artistsRes] = await Promise.all([
      fetch(TOP_TRACKS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(TOP_ARTISTS_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    if (!tracksRes.ok || !artistsRes.ok) {
      return res.status(200).json({
        topTrack: null,
        topArtist: null,
        error: `Spotify data fetch failed: tracks=${tracksRes.status}, artists=${artistsRes.status}`
      });
    }

    const [tracks, artists] = await Promise.all([
      tracksRes.json(),
      artistsRes.json()
    ]);

    const track = tracks?.items?.[0];
    const artist = artists?.items?.[0];

    const topTrack = track ? {
      songName: track.name,
      artistName: track.artists?.map((a: any) => a.name).join(", ") || "Unknown",
      albumArt: track.album?.images?.[0]?.url || "",
      url: track.external_urls?.spotify || "#"
    } : null;

    const topArtist = artist ? {
      name: artist.name,
      genres: artist.genres?.slice(0, 2).join(", ") || "",
      image: artist.images?.[0]?.url || "",
      url: artist.external_urls?.spotify || "#"
    } : null;

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");

    return res.status(200).json({ topTrack, topArtist });
  } catch (error: any) {
    console.error("Spotify API error:", error?.message || error);
    return res.status(200).json({ topTrack: null, topArtist: null, error: error?.message || "Internal Server Error" });
  }
}
