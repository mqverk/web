// src/lib/api.ts

export interface GithubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
}

export interface GithubUser {
    followers: number;
    public_repos: number;
}

export const fetchGithubData = async (username: string) => {
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("Failed to fetch Github data");

        const user: GithubUser = await userRes.json();
        const repos: GithubRepo[] = await reposRes.json();

        return { user, repos };
    } catch (error) {
        console.error("Github API Error:", error);
        return null;
    }
};

export interface MediumPost {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
}

// Convert Medium username to RSS feed URL and proxy through rss2json
export const fetchMediumPosts = async (username: string) => {
    try {
        const rssUrl = `https://medium.com/feed/@${username}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch Medium data");

        const data = await res.json();
        if (data.status !== "ok") throw new Error("rss2json parsing failed");

        // Return the latest 3 posts
        return data.items.slice(0, 3) as MediumPost[];
    } catch (error) {
        console.error("Medium API Error:", error);
        return null;
    }
};

export interface LastfmTrack {
    songName: string;
    artistName: string;
    albumArt: string;
    url: string;
    duration?: number;
}

export interface LastfmArtist {
    name: string;
    playcount: string;
    url: string;
}

export interface LastfmTopTrack extends LastfmTrack {
    playcount: string;
}

export interface LastfmData {
    nowPlaying?: LastfmTrack | null;
    recentTrack?: LastfmTrack | null;
    topTrack?: LastfmTopTrack | null;
    topArtist?: LastfmArtist | null;
    error?: string;
}

export const fetchLastfmData = async (): Promise<LastfmData | null> => {
    try {
        const response = await fetch("/api/lastfm");
        if (!response.ok) {
            console.warn(`Last.fm API unreachable (${response.status}).`);
            return null;
        }
        return await response.json() as LastfmData;
    } catch (error) {
        console.warn("Last.fm Fetch Error:", error);
        return null;
    }
};
