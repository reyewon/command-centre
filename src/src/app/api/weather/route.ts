import { NextResponse } from 'next/server';

// Southampton coordinates
const LAT = 50.9097;
const LON = -1.4044;

export async function GET() {
  try {
    // Try OpenWeatherMap (free tier)
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey) {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          icon: data.weather[0].main.toLowerCase(),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          forecast: [],
        });
      }
    }

    // Fallback: return sensible Southampton winter defaults
    return NextResponse.json({
      temp: 8,
      feelsLike: 5,
      description: 'partly cloudy',
      icon: 'clouds',
      humidity: 72,
      windSpeed: 14,
      forecast: [
        { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], high: 9, low: 4, description: 'cloudy', icon: 'clouds' },
        { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], high: 10, low: 5, description: 'light rain', icon: 'rain' },
        { date: new Date(Date.now() + 259200000).toISOString().split('T')[0], high: 8, low: 3, description: 'clear', icon: 'clear' },
      ],
    });
  } catch {
    return NextResponse.json({
      temp: 8, feelsLike: 5, description: 'partly cloudy', icon: 'clouds',
      humidity: 72, windSpeed: 14, forecast: [],
    });
  }
}
