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
                        res.end(JSON.stringify({ nowPlaying: null, recentTrack: null, topTrack: null, topArtist: null, error: 'Missing LASTFM env vars' }));
                        return;
                    }

                    const lfm = (method: string, extra = '') =>
                        `${LASTFM_API_BASE}?method=${method}&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json${extra}`;

                    const [recentRes, topTracksRes, topArtistsRes, userInfoRes] = await Promise.all([
                        fetch(lfm('user.getrecenttracks', '&limit=1')),
                        fetch(lfm('user.gettoptracks', '&period=7day&limit=1')),
                        fetch(lfm('user.gettopartists', '&period=1month&limit=1')),
                        fetch(lfm('user.getinfo')),
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
                            let albumArt = '';
                            try {
                                const infoRes = await fetch(lfm('track.getinfo', `&artist=${encodeURIComponent(t.artist?.name || '')}&track=${encodeURIComponent(t.name || '')}`));
                                if (infoRes.ok) {
                                    const infoData = await infoRes.json();
                                    albumArt = infoData?.track?.album?.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || '';
                                }
                            } catch { /* fallback below */ }
                            topTrack = {
                                songName: t.name || 'Unknown',
                                artistName: t.artist?.name || 'Unknown',
                                albumArt: albumArt || t.image?.find((i: any) => i.size === 'extralarge')?.['#text'] || '',
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

                    let userStats = null;
                    if (userInfoRes.ok) {
                        const data = await userInfoRes.json();
                        const u = data?.user;
                        if (u) {
                            userStats = {
                                scrobbles: parseInt(u.playcount || '0', 10),
                                artistCount: parseInt(u.artist_count || '0', 10),
                            };
                        }
                    }

                    res.end(JSON.stringify({ nowPlaying, recentTrack, topTrack, topArtist, userStats }));
                } catch (error: any) {
                    res.end(JSON.stringify({ nowPlaying: null, recentTrack: null, topTrack: null, topArtist: null, userStats: null, error: error?.message || 'Dev API error' }));
                }
            });
        },
    };
}

function githubContributionsDevApi(): Plugin {
    return {
        name: 'github-contributions-dev-api',
        configureServer(server) {
            server.middlewares.use('/api/github-contributions', async (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                try {
                    const env = loadEnv('', process.cwd(), '');
                    const url = new URL(req.url || '', 'http://localhost');
                    const username = url.searchParams.get('username') || env.VITE_GITHUB_USERNAME || 'mqverk';
                    const token = env.GITHUB_TOKEN;

                    interface ContributionDay { date: string; count: number; level: number; }

                    if (!token) {
                        console.warn('No GITHUB_TOKEN provided, using fallback scraping method');
                        // Fallback to original scraping method
                        const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
                            headers: { 'Accept': 'text/html' },
                        });

                        if (!response.ok) {
                            res.end(JSON.stringify({ contributions: [], total: 0, error: 'Failed to fetch' }));
                            return;
                        }

                        const html = await response.text();
                        const contributions: ContributionDay[] = [];
                        let total = 0;

                        const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
                        let match;
                        while ((match = cellRegex.exec(html)) !== null) {
                            const date = match[1];
                            const level = parseInt(match[2], 10);
                            const countRegex = new RegExp(`(\\d+)\\s+contribution[s]?\\s+on\\s+\\w+\\s+${parseInt(date.split('-')[2], 10)}`, 'i');
                            const around = html.substring(Math.max(0, match.index - 200), match.index + 300);
                            const countMatch = countRegex.exec(around);
                            const count = countMatch ? parseInt(countMatch[1], 10) : (level > 0 ? level : 0);
                            contributions.push({ date, count, level });
                            total += count;
                        }

                        res.end(JSON.stringify({ contributions, total }));
                        return;
                    }

                    // Use GitHub GraphQL API for accurate data
                    const query = `
                      query($username: String!) {
                        user(login: $username) {
                          contributionsCollection {
                            contributionCalendar {
                              totalContributions
                              weeks {
                                contributionDays {
                                  date
                                  contributionCount
                                  contributionLevel
                                }
                              }
                            }
                          }
                        }
                      }
                    `;

                    const response = await fetch('https://api.github.com/graphql', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query,
                            variables: { username },
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`GitHub API error: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    if (!data.data?.user) {
                        throw new Error('User not found');
                    }

                    const contributions: ContributionDay[] = [];
                    const calendar = data.data.user.contributionsCollection.contributionCalendar;

                    // Convert GitHub's contribution level strings to numbers
                    function getLevelFromString(level: string): number {
                        switch (level) {
                            case 'NONE': return 0;
                            case 'FIRST_QUARTILE': return 1;
                            case 'SECOND_QUARTILE': return 2;
                            case 'THIRD_QUARTILE': return 3;
                            case 'FOURTH_QUARTILE': return 4;
                            default: return 0;
                        }
                    }

                    for (const week of calendar.weeks) {
                        for (const day of week.contributionDays) {
                            contributions.push({
                                date: day.date,
                                count: day.contributionCount,
                                level: getLevelFromString(day.contributionLevel),
                            });
                        }
                    }

                    res.end(JSON.stringify({ 
                        contributions, 
                        total: calendar.totalContributions 
                    }));

                } catch (error: any) {
                    res.end(JSON.stringify({ contributions: [], total: 0, error: error?.message || 'Dev API error' }));
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
        githubContributionsDevApi(),
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
