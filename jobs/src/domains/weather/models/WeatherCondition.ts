import { Dayjs } from 'dayjs';
import {
  Value,
  Distance,
  Temperature,
  Speed,
  Pressure,
  Percent,
  Direction,
  Time,
} from '@tbiegner99/reporter';

export interface WeatherCondition {
  stationId: string;
  stationName: string;
  elevation: Value<Distance>;
  timestamp: Dayjs;
  condition: string;
  icon: string;
  temperature: Value<Temperature>;
  dewpoint?: Value<Temperature>;
  windDirection?: Value<Direction>;
  windSpeed?: Value<Speed>;
  windGust?: Value<Speed>;
  pressure?: Value<Pressure>;
  visibility?: Value<Distance>;
  humidity: Value<Percent>;
  windChill?: Value<Temperature>;
  heatIndex?: Value<Temperature>;
  uvIndex?: number;
  cloudCover?: Value<Percent>;
  feelsLike: Value<Temperature>;
}

export interface Forecast {
  elevation: Value<Distance>;
  generatedAt: Dayjs;

  periods: ForecastPeriod[];
}

export interface ForecastPeriod {
  id: number;
  name: string;
  startTime: Dayjs;
  endTime: Dayjs;
  isDaytime: boolean;
  temperature: Value<Temperature>;
  precipitationProbability?: Value<Percent>;
  dewpoint?: Value<Temperature>;
  humidity?: Value<Percent>;
  windSpeed?: Value<Speed>;
  windDirection?: Value<Direction>;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface AirQualityCategory {
  number: number;
  name: string;
}

export interface AirQualityMetric {
  observedAt: Dayjs;
  reportingArea: string;
  stateCode: string;
  metricName: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: AirQualityCategory;
}

export interface AirQualityData {
  o3: AirQualityMetric;
  pm25: AirQualityMetric;
  metrics: AirQualityMetric[];
}

export interface BuoyReading {
  timestamp: Dayjs;
  dominantWavePeriod?: Value<Time>;
  averageWavePeriod?: Value<Time>;
  waveHeight?: Value<Distance>;
  waveDirection?: Value<Direction>;
  wavePeriod?: Value<Time>;
  pressure: Value<Pressure>;
  airTemperature: Value<Temperature>;
  waterTemperature: Value<Temperature>;
  dewpoint: Value<Temperature>;
  windDirection: Value<Direction>;
  windSpeed: Value<Speed>;
  windGust: Value<Speed>;
}

export interface OceanConditions {
  stationId: number;
  stationName: string;
  currentConditions: BuoyReading;
  readings: BuoyReading[];
}

export enum TideType {
  High = 'High',
  Low = 'Low',
}

export interface Tide {
  timestamp: Dayjs;
  type: TideType;
  height: Value<Distance>;
}

export interface TideData {
  stationId: number;
  stationName: string;
  predictions: Tide[];
  nextTide?: Tide;
}
