import {
    AirQualityData,
    BuoyReading,
    OceanConditions,
    TideData,
    WeatherCondition
} from './models/WeatherCondition';
import { WeatherDatasource } from './WeatherDatasource';
import { Forecast } from './models/WeatherCondition';
import { Dayjs } from 'dayjs';

enum AggregationStrategy {
    AverageDaily = 'AverageDaily',
    AverageHourly = 'AverageHourly',
    FirstHourly = 'FirstHourly',
    FirstDaily = 'FirstDaily'
}

export class WeatherService {
    constructor(private datasource: WeatherDatasource) {}

    async getCurrentWeather(): Promise<WeatherCondition> {
        return this.datasource.getCurrentWeather();
    }

    async getHourlyForecast(): Promise<Forecast> {
        return this.datasource.getHourlyForecast();
    }

    async getDailyForecast(): Promise<Forecast> {
        return this.datasource.getDailyForecast();
    }

    async getAirQualityIndex(zipCode: string, distance: number): Promise<AirQualityData> {
        return this.datasource.getAirQualityIndex(zipCode, distance);
    }
    aggregateBouyReadings(
        readings: BuoyReading[],
        value: keyof BuoyReading,
        aggregationStrategy: AggregationStrategy
    ): BuoyReading[] {
        return readings;
    }

    async getOceanConditions(): Promise<OceanConditions> {
        const conditions = await this.datasource.getOceanConditions();
        return conditions;
    }

    async getTideData(startDate: Dayjs, endDate: Dayjs): Promise<TideData> {
        return this.datasource.getTideData(startDate, endDate);
    }
}

export default new WeatherService(new WeatherDatasource());
