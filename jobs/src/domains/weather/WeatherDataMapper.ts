import dayjs from 'dayjs';
import {
  Unit,
  Value,
  DistanceUnit,
  TemperatureUnit,
  SpeedUnit,
  PercentUnit,
  PressureUnit,
  DirectionUnit,
  TimeUnit,
} from '@tbiegner99/reporter';

import {
  AirQualityData,
  AirQualityMetric,
  BuoyReading,
  Forecast,
  ForecastPeriod,
  OceanConditions,
  Tide,
  TideData,
  TideType,
  WeatherCondition,
} from './models/WeatherCondition';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export class WeatherDataMapper {
  toTideData(apiResponse: any): TideData {
    const tides: Tide[] = apiResponse.predictions.map(
      (p: any): Tide => ({
        timestamp: dayjs.utc(p.t, 'YYYY-MM-DD HH:mm'),
        height: parseFloat(p.v),
        unit: DistanceUnit.METER.symbol,
        type: p.type === 'H' ? TideType.High : TideType.Low,
      })
    );
    const nextTide = tides
      .sort((a, b) => a.timestamp.unix() - b.timestamp.unix())
      .filter((t) => t.timestamp.isAfter(dayjs.utc()))[0];
    return {
      stationId: 8516385,
      stationName: 'Jones Beach, NY',
      predictions: tides,
      nextTide: nextTide,
    };
  }

  aggregateReadings(readings: BuoyReading[]): BuoyReading | undefined {
    if (readings.length === 0) {
      return undefined;
    }
    return readings[0];
  }
  toOceanConditions(apiResponse: any): OceanConditions {
    const lines = apiResponse.split('\n');
    const unitsLine = lines[1].split(/\s+/);
    const readings: BuoyReading[] = [];
    for (let i = 2; i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length < 10) continue;
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      const hour = parseInt(parts[3]);
      const minute = parseInt(parts[4]);
      const dateTime = dayjs.utc(`${year}-${month}-${day} ${hour}:${minute}`, 'YYYY-M-D H:m');
      if (!dateTime.isValid()) continue;

      const reading: BuoyReading = {
        timestamp: dateTime,
        windDirection: Value.fromString(parts[5], DirectionUnit.fromSymbol(unitsLine[5]))!,
        windSpeed: Value.fromString(parts[6], SpeedUnit.fromSymbol(unitsLine[6]))!,
        windGust: Value.fromString(parts[7], SpeedUnit.fromSymbol(unitsLine[7]))!,
        waveHeight: new Value(parseFloat(parts[8]), DistanceUnit.fromSymbol(unitsLine[8])),
        dominantWavePeriod: Value.fromString(parts[9], TimeUnit.fromSymbol(unitsLine[9])),
        averageWavePeriod: Value.fromString(parts[10], TimeUnit.fromSymbol(unitsLine[10])),
        waveDirection: Value.fromString(parts[11], DirectionUnit.fromSymbol(unitsLine[11])),
        pressure: Value.fromString(parts[12], PressureUnit.fromSymbol(unitsLine[12]))!,
        airTemperature: Value.fromString(parts[13], TemperatureUnit.fromSymbol(unitsLine[13]))!,
        waterTemperature: Value.fromString(parts[14], TemperatureUnit.fromSymbol(unitsLine[14]))!,
        dewpoint: Value.fromString(parts[15], TemperatureUnit.fromSymbol(unitsLine[15]))!,
      };
      readings.push(reading);
    }
    return {
      stationId: 44065,
      stationName: 'Breezy Point, NY',

      readings,
      currentConditions: this.aggregateReadings(readings.slice(0, 5))!,
    };
  }
  toAirQualityMetric(apiMetric: any): AirQualityMetric {
    const date = dayjs(apiMetric.dateObserved, 'YYYY-MM-DD ');

    return {
      metricName: apiMetric.ParameterName,
      reportingArea: apiMetric.ReportingArea,
      stateCode: apiMetric.StateCode,
      latitude: apiMetric.Latitude,
      longitude: apiMetric.Longitude,
      observedAt: date.hour(apiMetric.HourObserved),
      aqi: apiMetric.AQI,
      category: {
        number: apiMetric.Category.Number,
        name: apiMetric.Category.Name,
      },
    };
  }

  toAirQualityData(apiResponse: any): AirQualityData {
    const metrics = apiResponse.map((item) => this.toAirQualityMetric(item));
    return {
      o3: metrics.find((m) => m.metricName?.toLowerCase() === 'o3'),
      pm25: metrics.find((m) => m.metricName?.toLowerCase() === 'pm2.5'),
      metrics,
    };
  }

  private convertValue<T>(data: any, unitFactory: (data: any) => Unit<T>): Value<T> | undefined {
    if (!data || data.value === null || data.value === undefined) {
      return undefined;
    }
    const unitString = data.unitCode.split(':')[1];
    const unit = unitFactory(unitString);
    return new Value(data.value, unit);
  }

  toForecast(apiResponse: any): Forecast {
    const properties = apiResponse.properties;
    return {
      elevation: this.convertValue(properties.elevation, DistanceUnit.fromSymbol)!,
      generatedAt: dayjs(properties.generatedAt),

      periods: properties.periods.map((p: any) => this.toForecastPeriod(p)),
    };
  }

  toForecastPeriod(apiPeriod: any): ForecastPeriod {
    const windSpeedParts = apiPeriod.windSpeed.split(' ');
    const windSpeedValue = parseFloat(windSpeedParts[0]);
    const windSpeedUnit = windSpeedParts[1] || 'mph';
    const windSpeed = new Value(windSpeedValue, SpeedUnit.fromSymbol(windSpeedUnit));
    return {
      id: apiPeriod.number,
      name: apiPeriod.name,
      startTime: dayjs(apiPeriod.startTime),
      endTime: dayjs(apiPeriod.endTime),
      isDaytime: apiPeriod.isDaytime,
      temperature: new Value(
        apiPeriod.temperature,
        TemperatureUnit.fromSymbol(apiPeriod.temperatureUnit)
      ),
      dewpoint: this.convertValue(apiPeriod.dewpoint, TemperatureUnit.fromSymbol),
      humidity: this.convertValue(apiPeriod.relativeHumidity, PercentUnit.fromSymbol),
      windSpeed,
      windDirection: DirectionUnit.fromCompassDirection(apiPeriod.windDirection),
      icon: apiPeriod.icon,
      shortForecast: apiPeriod.shortForecast,
      detailedForecast: apiPeriod.detailedForecast,
    };
  }

  toWeatherCondition(apiResponse: any): WeatherCondition {
    // Map the API response to your WeatherData model
    const observation = apiResponse.properties;
    const windChill = this.convertValue(observation.windChill, TemperatureUnit.fromSymbol);
    const heatIndex = this.convertValue(observation.heatIndex, TemperatureUnit.fromSymbol);
    const temperature = this.convertValue(observation.temperature, TemperatureUnit.fromSymbol)!;
    return {
      stationId: observation.stationId,
      stationName: observation.stationName,
      elevation: this.convertValue(observation.elevation, DistanceUnit.fromSymbol)!,
      timestamp: dayjs(observation.timestamp),
      condition: observation.textDescription,
      icon: observation.icon,
      temperature,
      dewpoint: this.convertValue(observation.dewpoint, TemperatureUnit.fromSymbol),
      windDirection: this.convertValue(observation.windDirection, DirectionUnit.fromSymbol),
      windSpeed: this.convertValue(observation.windSpeed, SpeedUnit.fromSymbol),
      windGust: this.convertValue(observation.windGust, SpeedUnit.fromSymbol),
      pressure: this.convertValue(observation.barometricPressure, PressureUnit.fromSymbol),
      visibility: this.convertValue(observation.visibility, DistanceUnit.fromSymbol),
      humidity: this.convertValue(observation.relativeHumidity, PercentUnit.fromSymbol)!,
      windChill: windChill,
      heatIndex: heatIndex,
      feelsLike: windChill || heatIndex || temperature,
    };
  }
}
