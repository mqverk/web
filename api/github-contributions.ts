import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const username = (req.query.username as string) || process.env.VITE_GITHUB_USERNAME || 'mqverk';

    const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: { 'Accept': 'text/html' },
    });

    if (!response.ok) {
      return res.status(200).json({ contributions: [], total: 0, error: 'Failed to fetch GitHub contributions' });
    }

    const html = await response.text();
    const contributions: ContributionDay[] = [];
    let total = 0;

    // Parse contribution cells: <td ... data-date="2025-01-15" data-level="2" ...>...</td>
    const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    let match;
    while ((match = cellRegex.exec(html)) !== null) {
      const date = match[1];
      const level = parseInt(match[2], 10);

      // Extract count from the tooltip text near this cell
      // GitHub uses formats like "5 contributions on January 15" or "No contributions on January 15"
      const countRegex = new RegExp(`(\\d+)\\s+contribution[s]?\\s+on\\s+\\w+\\s+${parseInt(date.split('-')[2], 10)}`, 'i');
      const around = html.substring(Math.max(0, match.index - 200), match.index + 300);
      const countMatch = countRegex.exec(around);
      const count = countMatch ? parseInt(countMatch[1], 10) : (level > 0 ? level : 0);

      contributions.push({ date, count, level });
      total += count;
    }

    // If regex-based count extraction didn't find a total, try the heading
    if (total === 0) {
      const totalRegex = /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i;
      const totalMatch = totalRegex.exec(html);
      if (totalMatch) {
        total = parseInt(totalMatch[1].replace(/,/g, ''), 10);
      }
    }

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({ contributions, total });
  } catch (error: any) {
    console.error('GitHub contributions error:', error?.message || error);
    return res.status(200).json({ contributions: [], total: 0, error: error?.message || 'Internal error' });
  }
}
