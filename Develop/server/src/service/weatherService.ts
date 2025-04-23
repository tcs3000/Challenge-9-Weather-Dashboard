import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  icon: string;
  alt: string;
  temperature: number;
  wind: number;
  humidity: number;
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  private apiKey = process.env.OPENWEATHER_API_KEY!;
  private baseGeoURL = 'http://api.openweathermap.org/geo/1.0/direct';
  private baseWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private cityName = '';

  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseGeoURL}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    const { data } = await axios.get(url);
    return data[0];
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseWeatherURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const { data } = await axios.get(url);
    return data;
  }

  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];
    return {
      city: response.city.name,
      date: current.dt_txt,
      icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`,
      alt: current.weather[0].description,
      temperature: current.main.temp,
      wind: current.wind.speed,
      humidity: current.main.humidity,
    };
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    const forecast: Weather[] = [];

    for (let i = 7; i < weatherData.length; i += 8) {
      const item = weatherData[i];
      forecast.push({
        city: '',
        date: item.dt_txt,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        alt: item.weather[0].description,
        temperature: item.main.temp,
        wind: item.wind.speed,
        humidity: item.main.humidity,
      });
    }

    return forecast;
  }

  public async getWeatherByCity(city: string): Promise<{ current: Weather, forecast: Weather[] }> {
    this.cityName = city;

    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);

    const weatherData = await this.fetchWeatherData(coordinates);

    const current = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list).map(day => ({ ...day, city }));

    return { current, forecast };
  }
}

export default new WeatherService();

