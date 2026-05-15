import { NextRequest, NextResponse } from 'next/server';

const USER_AGENTS = {
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'googlebot-smartphone': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  facebookbot: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  twitterbot: 'Twitterbot/1.0',
  linkedinbot: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
  bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  slackbot: 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
  whatsapp: 'WhatsApp/2.19.81 A',
  telegrambot: 'TelegramBot (like TwitterBot)',
  discordbot: 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
};

export async function POST(request: NextRequest) {
  try {
    const { url, botType } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const userAgent = USER_AGENTS[botType as keyof typeof USER_AGENTS] || USER_AGENTS.googlebot;

    // Fetch the page with bot user agent
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    });

    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    // Extract meta tags for preview
    const metaTags = extractMetaTags(html);

    return NextResponse.json({
      success: true,
      data: {
        html,
        statusCode: response.status,
        headers,
        metaTags,
        finalUrl: response.url,
      },
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch URL', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function extractMetaTags(html: string) {
  const metaTags: Record<string, string> = {};
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) {
    metaTags.title = titleMatch[1].trim();
  }

  // Extract meta tags
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  let match;
  
  while ((match = metaRegex.exec(html)) !== null) {
    const metaContent = match[1];
    
    // Extract property and content
    const propertyMatch = metaContent.match(/(?:property|name)=["']([^"']+)["']/i);
    const contentMatch = metaContent.match(/content=["']([^"']+)["']/i);
    
    if (propertyMatch && contentMatch) {
      metaTags[propertyMatch[1]] = contentMatch[1];
    }
  }

  return metaTags;
}
