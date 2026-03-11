import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }>;
          }>;
        };
      };
    };
  };
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const username = (req.query.username as string) || process.env.VITE_GITHUB_USERNAME || 'mqverk';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.warn('No GITHUB_TOKEN provided, using fallback scraping method');
      // Fallback to original scraping method if no token
      const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
        headers: { 'Accept': 'text/html' },
      });

      if (!response.ok) {
        return res.status(200).json({ contributions: [], total: 0, error: 'Failed to fetch GitHub contributions' });
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

      return res.status(200).json({ contributions, total });
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

    const data: GitHubContributionsResponse = await response.json();
    
    if (!data.data?.user) {
      throw new Error('User not found');
    }

    const contributions: ContributionDay[] = [];
    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getLevelFromString(day.contributionLevel),
        });
      }
    }

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({ 
      contributions, 
      total: calendar.totalContributions 
    });

  } catch (error: any) {
    console.error('GitHub contributions error:', error?.message || error);
    return res.status(200).json({ 
      contributions: [], 
      total: 0, 
      error: error?.message || 'Internal error' 
    });
  }
}
