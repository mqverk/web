import path from "path"
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

function lastfmDevApi(): Plugin {
    return {
        name: 'lastfm-dev-api',
        configureServer(server) {
            server.middlewares.use('/api/lastfm', async (_req, res) => {
                res.setHeader('Content-Type', 'application/json');
                try {
                    const env = loadEnv('', process.cwd(), '');
                    const apiKey = env.LASTFM_API_KEY || '';
                    const username = env.LASTFM_USERNAME || '';

                    if (!apiKey || !username) {
                        res.end(JSON.stringify({ nowPlaying: null, recentTrack: null, topArtist: null, error: 'Missing LASTFM env vars' }));
                        return;
                    }

                    const lfm = (method: string, extra = '') =>
                        `${LASTFM_API_BASE}?method=${method}&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json${extra}`;

                    const [recentRes, topArtistsRes] = await Promise.all([
                        fetch(lfm('user.getrecenttracks', '&limit=1')),
                        fetch(lfm('user.gettopartists', '&period=1month&limit=1')),
                    ]);

                    let nowPlaying = null;
                    let recentTrack = null;
                    if (recentRes.ok) {
                        const data = await recentRes.json();
                        const track = data?.recenttracks?.track?.[0];
                        if (track) {
                            const formatted = {
                                songName: track.name || 'Unknown',
                                artistName: track.artist?.['#text'] || track.artist?.name || 'Unknown',
                                albumArt: track.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || track.image?.[2]?.['#text'] || '',
                                url: track.url || '#',
                            };
                            if (track['@attr']?.nowplaying === 'true') {
                                nowPlaying = formatted;
                            } else {
                                recentTrack = formatted;
                            }
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

                    res.end(JSON.stringify({ nowPlaying, recentTrack, topArtist }));
                } catch (error: any) {
                    res.end(JSON.stringify({ nowPlaying: null, recentTrack: null, topArtist: null, error: error?.message || 'Dev API error' }));
                }
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        lastfmDevApi(),
    ],
    define: {
        'process.env': {}
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "src": path.resolve(__dirname, "./src"),
        },
    },
})
