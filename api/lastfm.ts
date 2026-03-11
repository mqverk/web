import type { VercelRequest, VercelResponse } from '@vercel/node';

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.LASTFM_API_KEY || '';
    const username = process.env.LASTFM_USERNAME || '';

    if (!apiKey || !username) {
      return res.status(200).json({ nowPlaying: null, recentTrack: null, topTrack: null, topArtist: null, error: 'Missing LASTFM env vars' });
    }

    const lfm = (method: string, extra = '') =>
      `${LASTFM_API_BASE}?method=${method}&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json${extra}`;

    const [recentRes, topTracksRes, topArtistsRes] = await Promise.all([
      fetch(lfm('user.getrecenttracks', '&limit=1')),
      fetch(lfm('user.gettoptracks', '&period=7day&limit=1')),
      fetch(lfm('user.gettopartists', '&period=1month&limit=1')),
    ]);

    let nowPlaying = null;
    let recentTrack = null;
    if (recentRes.ok) {
      const data = await recentRes.json();
      const track = data?.recenttracks?.track?.[0];
      if (track) {
        const formatted: Record<string, any> = {
          songName: track.name || 'Unknown',
          artistName: track.artist?.['#text'] || track.artist?.name || 'Unknown',
          albumArt: track.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || track.image?.[2]?.['#text'] || '',
          url: track.url || '#',
        };
        if (track['@attr']?.nowplaying === 'true') {
          nowPlaying = formatted;
          // Fetch track duration
          try {
            const infoRes = await fetch(lfm('track.getinfo', `&artist=${encodeURIComponent(formatted.artistName)}&track=${encodeURIComponent(formatted.songName)}`));
            if (infoRes.ok) {
              const infoData = await infoRes.json();
              const dur = parseInt(infoData?.track?.duration || '0', 10);
              if (dur > 0) nowPlaying.duration = dur;
            }
          } catch { /* duration is optional */ }
        } else {
          recentTrack = formatted;
        }
      }
    }

    let topTrack = null;
    if (topTracksRes.ok) {
      const data = await topTracksRes.json();
      const t = data?.toptracks?.track?.[0];
      if (t) {
        topTrack = {
          songName: t.name || 'Unknown',
          artistName: t.artist?.name || 'Unknown',
          albumArt: t.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || t.image?.[2]?.['#text'] || '',
          url: t.url || '#',
          playcount: t.playcount || '0',
        };
      }
    }

    let topArtist = null;
    if (topArtistsRes.ok) {
      const data = await topArtistsRes.json();
      const artist = data?.topartists?.artist?.[0];
      if (artist) {
        topArtist = {
          name: artist.name,
          playcount: artist.playcount || '0',
          url: artist.url || '#',
        };
      }
    }

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return res.status(200).json({ nowPlaying, recentTrack, topTrack, topArtist });
  } catch (error: any) {
    console.error('Last.fm API error:', error?.message || error);
    return res.status(200).json({ nowPlaying: null, recentTrack: null, topTrack: null, topArtist: null, error: error?.message || 'Internal Server Error' });
  }
}
