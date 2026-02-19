import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Calendar IDs from Ryan's Google account
const CALENDAR_IDS = {
  photography: 'f4ea15fdd1ea8f5f2782618c36cd8de9422488ed6243d9707e0ff5de0ecda514@group.calendar.google.com',
  primary: 'rstanikk@gmail.com',
  meetings: 'ca1aca631e5c1f08b853debcfdb259465485359f8a498c35d5db07506210dfb1@group.calendar.google.com',
  travel: '64baf24171617db4cc34f2827555f3a9fb4384da727176b5e1301f50e56bcb1f@group.calendar.google.com',
  partners: 'b9234fa5d3cc4f610324b0e13ba689a10930d494a3e446bae19c7bdb2bc14106@group.calendar.google.com',
  leisure: '7c9a97ae8f4b4e510e204589e804f9a88b864bb112dc9c7a1978cd2dd67762f4@group.calendar.google.com',
  family: 'fa56c0ff55d718808237ed482284ec30a486501204b2fc498404a6bda1aa339a@group.calendar.google.com',
};

// Map calendar source to booking type
function getEventType(calendarId: string, summary: string): 'photography' | 'retainer' | 'personal' | 'meeting' | 'travel' {
  if (calendarId === CALENDAR_IDS.photography) return 'photography';
  if (calendarId === CALENDAR_IDS.meetings) return 'meeting';
  if (calendarId === CALENDAR_IDS.travel) return 'travel';
  if (calendarId === CALENDAR_IDS.partners) return 'personal';
  if (calendarId === CALENDAR_IDS.leisure) return 'personal';
  if (calendarId === CALENDAR_IDS.family) return 'personal';

  // Primary calendar: detect type from content
  const lowerSummary = summary.toLowerCase();
  if (lowerSummary.includes('flight') || lowerSummary.includes('accommodation') || lowerSummary.includes('stay at') || lowerSummary.includes('hotel')) return 'travel';
  if (lowerSummary.includes('padharo') || lowerSummary.includes('popado') || lowerSummary.includes('retainer')) return 'retainer';

  return 'personal';
}

// Get a friendly client name from the event
function getClient(summary: string, calendarId: string): string {
  if (calendarId === CALENDAR_IDS.photography) return summary;
  if (calendarId === CALENDAR_IDS.meetings) return 'Meeting';
  if (calendarId === CALENDAR_IDS.travel) return 'Travel';

  const lowerSummary = summary.toLowerCase();
  if (lowerSummary.includes('flight')) return 'Travel';
  if (lowerSummary.includes('accommodation') || lowerSummary.includes('stay at') || lowerSummary.includes('hotel')) return 'Travel';
  return summary;
}

export async function GET() {
  try {
    // Check for Google service account credentials
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      // No credentials configured - return empty array so frontend uses demo data
      return NextResponse.json({ events: [], live: false });
    }

    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Fetch upcoming events from all relevant calendars
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const calendarEntries = Object.entries(CALENDAR_IDS);
    const allEvents: any[] = [];

    for (const [source, calendarId] of calendarEntries) {
      try {
        const response = await calendar.events.list({
          calendarId,
          timeMin: now.toISOString(),
          timeMax: threeMonthsFromNow.toISOString(),
          maxResults: 50,
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = response.data.items || [];

        for (const event of events) {
          if (!event.summary || event.status === 'cancelled') continue;

          // Skip birthday events
          if (event.eventType === 'birthday') continue;

          // Parse start date/time
          const isAllDay = !!event.start?.date;
          const startDate = event.start?.date || event.start?.dateTime?.split('T')[0] || '';
          const startTime = event.start?.dateTime
            ? new Date(event.start.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' })
            : undefined;
          const endDate = event.end?.date || event.end?.dateTime?.split('T')[0] || '';
          const endTime = event.end?.dateTime
            ? new Date(event.end.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' })
            : undefined;

          allEvents.push({
            id: event.id || `${source}-${startDate}`,
            title: event.summary,
            client: getClient(event.summary, calendarId),
            date: startDate,
            endDate,
            time: startTime,
            endTime,
            location: event.location || undefined,
            description: event.description || undefined,
            type: getEventType(calendarId, event.summary),
            calendarSource: source,
            allDay: isAllDay,
          });
        }
      } catch (calError) {
        // Skip calendars we can't access
        console.error(`Failed to fetch ${source} calendar:`, calError);
      }
    }

    // Sort by date, then time
    allEvents.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      return 1;
    });

    // Deduplicate similar events (e.g. Gmail auto-created + manual)
    const deduped: any[] = [];
    const seen = new Set<string>();

    for (const event of allEvents) {
      // Create a dedup key from title + date
      const key = `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '')}-${event.date}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(event);
      }
    }

    return NextResponse.json({ events: deduped, live: true });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json({ events: [], live: false, error: 'Failed to fetch calendar data' });
  }
}
