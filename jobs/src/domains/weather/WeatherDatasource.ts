import axios, { AxiosInstance } from 'axios';
import {
  AirQualityData,
  Forecast,
  OceanConditions,
  TideData,
  WeatherCondition,
} from './models/WeatherCondition';
import { WeatherDataMapper } from './WeatherDataMapper';
import { Dayjs } from 'dayjs';

export class WeatherDatasource {
  private axiosClient: AxiosInstance;
  private mapper: WeatherDataMapper;

  constructor() {
    this.axiosClient = axios.create({
      timeout: 10000,
    });
    this.mapper = new WeatherDataMapper();
  }

  async getCurrentWeather(): Promise<WeatherCondition> {
    const response = await this.axiosClient.get(
      'https://api.weather.gov/stations/KFRG/observations/latest'
    );

    return this.mapper.toWeatherCondition(response.data);
  }

  async getHourlyForecast(): Promise<Forecast> {
    const response = await this.axiosClient.get(
      'https://api.weather.gov/gridpoints/OKX/49,38/forecast/hourly'
    );

    return this.mapper.toForecast(response.data);
  }

  async getDailyForecast(): Promise<Forecast> {
    const response = await this.axiosClient.get(
      'https://api.weather.gov/gridpoints/OKX/49,38/forecast'
    );

    return this.mapper.toForecast(response.data);
  }
  async getAirQualityIndex(zipCode: string, distance: number): Promise<AirQualityData> {
    const response = await this.axiosClient.get(
      `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=${distance}&API_KEY=883E7AC5-FB4C-4368-8000-83428D2B6794`
    );
    return this.mapper.toAirQualityData(response.data);
  }
  async getOceanConditions(): Promise<OceanConditions> {
    const response = await this.axiosClient.get(
      'https://www.ndbc.noaa.gov/data/realtime2/44065.txt',
      {
        responseType: 'text',
      }
    );
    return this.mapper.toOceanConditions(response.data);
  }

  async getTideData(startDate: Dayjs, endDate: Dayjs): Promise<TideData> {
    const stationId = '8518750'; //  station ID for Jones Beach, NY
    const beginDate = startDate.format('YYYYMMDD');
    const endDateString = endDate.format('YYYYMMDD');
    const response = await this.axiosClient.get(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${beginDate}&end_date=${endDateString}&station=${stationId}&product=predictions&time_zone=gmt&interval=hilo&units=metric&format=json&datum=MLLW`
    );
    return this.mapper.toTideData(response.data);
  }
}
