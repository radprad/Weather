export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  sys: {
    country: string;
  };
}

export interface WeatherApiResponse {
  cod: number;
  message?: string;
  data?: WeatherData;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherAlert {
  type: 'high-humidity' | 'heavy-rain' | 'extreme-temperature';
  message: string;
}