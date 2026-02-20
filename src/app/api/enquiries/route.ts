import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Gmail search query: photography-related emails, excluding noise
const SEARCH_QUERY = [
  // Must relate to photography/business
  '(subject:(photography OR photo OR shoot OR booking OR enquiry OR inquiry OR quote OR hire OR headshot OR portrait OR event OR wedding OR brochure OR "looking for" OR marketing) OR from:(pixieset OR studio))',
  // Exclude Gmail categories
  '-category:promotions',
  '-category:social',
  // Exclude known noise senders
  '-from:noreply',
  '-from:no-reply',
  '-from:donotreply',
  '-from:notifications',
  '-from:linkedin.com',
  '-from:amazon',
  '-from:easyjet',
  '-from:dpd',
  '-from:nhs.net',
  '-from:google.com',
  '-from:apple.com',
  '-from:paypal',
  '-from:stripe.com',
  '-from:facebook.com',
  '-from:instagram.com',
  '-from:twitter.com',
  '-from:github.com',
  '-from:vercel.com',
  '-from:canva.com',
  '-from:adobe.com',
  '-from:dropbox.com',
  '-from:taskade.com',
  '-from:manus.im',
  '-from:marketing.easyjet',
  '-from:trainline',
  '-from:kiwi.com',
  '-from:booking.com',
  '-from:airbnb',
  '-from:skyscanner',
  '-from:ryanair',
  '-from:jet2',
  '-from:tui.co.uk',
  '-from:nationalrail',
  '-from:uber',
  '-from:deliveroo',
  '-from:justeat',
  '-from:nhs',
  '-from:practiceplusgroup',
  '-from:patient.info',
  // Only recent (last 3 months)
  'newer_than:3m',
].join(' ');

// Spam keyword blocklist for subject/snippet filtering
const SPAM_KEYWORDS = [
  'clipping path', 'clipping mask', 'image editing service', 'photo editing service',
  'background removal service', 'retouching service', 'outsource', 'bulk editing',
  'real estate editing', 'product photo editing', 'photo enhancement service',
  'ecommerce photo', 'ghost mannequin', 'color correction service',
  'unsubscribe', 'newsletter', 'webinar', 'free trial', 'limited offer',
  'seo service', 'web design service', 'social media management',
  'verification code', 'password reset', 'security alert',
  'delivery notification', 'your order', 'your parcel', 'tracking number',
  'booking confirmation', 'your trip', 'e-ticket', 'flight confirmation',
  'train ticket', 'travel insurance', 'boarding pass', 'itinerary',
  'your booking is confirmed', 'return trip', 'departing',
  'hospital', 'appointment reminder', 'medical', 'gp surgery', 'practice plus',
  'wellsoon', 'peyronie',
];

// Known spam sender patterns
const SPAM_SENDERS = [
  /clippingpath/i, /editingservice/i, /outsource/i, /offshore/i,
  /fiverr/i, /upwork/i, /freelancer\.com/i,
  /@outlook\.in$/i, /@yahoo\.in$/i,
  /marketing@/i, /promo@/i, /sales@/i, /info@(?!ryanstanikk)/i,
  /trainline/i, /kiwi\.com/i, /booking\.com/i, /skyscanner/i,
  /airbnb/i, /ryanair/i, /jet2/i, /nationalrail/i,
  /nhs\.uk/i, /nhs\.net/i, /practiceplusgroup/i, /patient\.info/i,
];

interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  date: string;
  timestamp: number;
  isUnread: boolean;
  account: 'personal' | 'professional';
  gmailUrl: string;
}

function isSpam(from: string, fromEmail: string, subject: string, snippet: string): boolean {
  const combined = `${subject} ${snippet}`.toLowerCase();

  // Check spam keywords
  for (const kw of SPAM_KEYWORDS) {
    if (combined.includes(kw.toLowerCase())) return true;
  }

  // Check spam sender patterns
  for (const pattern of SPAM_SENDERS) {
    if (pattern.test(fromEmail) || pattern.test(from)) return true;
  }

  // Emails from Ryan himself are not enquiries (they're his replies)
  if (fromEmail.includes('rstanikk@gmail.com') || fromEmail.includes('photography@ryanstanikk.co.uk')) {
    return true;
  }

  return false;
}

function extractHeader(headers: any[], name: string): string {
  const header = headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || '';
}

function parseFrom(fromHeader: string): { name: string; email: string } {
  const match = fromHeader.match(/^"?([^"<]*)"?\s*<?([^>]*)>?$/);
  if (match) {
    return { name: match[1].trim() || match[2], email: match[2].trim() };
  }
  return { name: fromHeader, email: fromHeader };
}

async function fetchEmailsFromAccount(
  credentials: any,
  refreshToken: string,
  accountLabel: 'personal' | 'professional',
  userEmail: string,
): Promise<EmailMessage[]> {
  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    // Search for photography-related emails
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      q: SEARCH_QUERY,
      maxResults: 30,
    });

    const messages = listResponse.data.messages || [];
    const emails: EmailMessage[] = [];

    // Fetch details for each message (batch for speed)
    const batchSize = 10;
    for (let i = 0; i < Math.min(messages.length, 30); i += batchSize) {
      const batch = messages.slice(i, i + batchSize);

      const details = await Promise.all(
        batch.map(msg =>
          gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
            format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'Date'],
          })
        )
      );

      for (const detail of details) {
        const msg = detail.data;
        const headers = msg.payload?.headers || [];

        const fromHeader = extractHeader(headers, 'From');
        const { name: fromName, email: fromEmail } = parseFrom(fromHeader);
        const subject = extractHeader(headers, 'Subject');
        const dateStr = extractHeader(headers, 'Date');
        const snippet = msg.snippet || '';
        const isUnread = msg.labelIds?.includes('UNREAD') || false;

        // Apply spam filter
        if (isSpam(fromName, fromEmail, subject, snippet)) continue;

        // Build Gmail URL
        const gmailUrl = accountLabel === 'personal'
          ? `https://mail.google.com/mail/u/0/#inbox/${msg.id}`
          : `https://mail.google.com/mail/u/4/#inbox/${msg.id}`;

        emails.push({
          id: msg.id || '',
          threadId: msg.threadId || '',
          from: fromName,
          fromEmail,
          subject: subject.replace(/^(Re:\s*|Fwd:\s*|\*\*\*SPAM\*\*\*\s*)+/gi, '').trim(),
          snippet: snippet.substring(0, 200),
          date: new Date(parseInt(msg.internalDate || '0')).toISOString(),
          timestamp: parseInt(msg.internalDate || '0'),
          isUnread,
          account: accountLabel,
          gmailUrl,
        });
      }
    }

    return emails;
  } catch (error) {
    console.error(`Failed to fetch ${accountLabel} emails:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const oauthCredentials = process.env.GMAIL_OAUTH_CREDENTIALS;
    const personalRefreshToken = process.env.GMAIL_PERSONAL_REFRESH_TOKEN;
    const professionalRefreshToken = process.env.GMAIL_PROFESSIONAL_REFRESH_TOKEN;

    if (!oauthCredentials) {
      return NextResponse.json({ emails: [], live: false, message: 'Gmail OAuth not configured' });
    }

    const credentials = JSON.parse(oauthCredentials);
    const emails: EmailMessage[] = [];

    // Fetch from personal Gmail (rstanikk@gmail.com)
    if (personalRefreshToken) {
      const personalEmails = await fetchEmailsFromAccount(
        credentials, personalRefreshToken, 'personal', 'rstanikk@gmail.com'
      );
      emails.push(...personalEmails);
    }

    // Fetch from professional Gmail (photography@ryanstanikk.co.uk)
    if (professionalRefreshToken) {
      const proEmails = await fetchEmailsFromAccount(
        credentials, professionalRefreshToken, 'professional', 'photography@ryanstanikk.co.uk'
      );
      emails.push(...proEmails);
    }

    // Sort by date descending (newest first)
    emails.sort((a, b) => b.timestamp - a.timestamp);

    // Deduplicate by threadId (same thread across accounts)
    const seen = new Set<string>();
    const deduped = emails.filter(e => {
      const key = `${e.subject.toLowerCase().replace(/[^a-z0-9]/g, '')}-${e.fromEmail}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      emails: deduped.slice(0, 20),
      live: true,
      accounts: {
        personal: !!personalRefreshToken,
        professional: !!professionalRefreshToken,
      },
    });
  } catch (error) {
    console.error('Enquiries API error:', error);
    return NextResponse.json({ emails: [], live: false, error: 'Failed to fetch emails' });
  }
}
