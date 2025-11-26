import {
  AirQualityData,
  OceanConditions,
  WeatherCondition,
} from './domains/weather/models/WeatherCondition';
import { setInterval } from 'node:timers';
import { WeatherDatasource } from './domains/weather/WeatherDatasource';
import { WeatherService } from './domains/weather/WeatherService';
import {
  DistanceUnit,
  Reading,
  Reporter,
  ReporterFactory,
  Unitless,
  Value,
} from '@tbiegner99/reporter';
import dayjs from 'dayjs';
import { clear } from 'node:console';

let reporters: Reporter[] = [];
let tideRetryTimeout: NodeJS.Timeout | null = null;
async function collectWeatherData(reporters: Reporter[]) {
  console.log('Collecting data...');
  const datasource = new WeatherDatasource();
  const service = new WeatherService(datasource);
  const currentWeather = await service.getCurrentWeather();

  await reportWeatherData(currentWeather, reporters);
  console.log('Weather data collection complete.');
}

async function collectAirQualityData(reporters: Reporter[]) {
  console.log('Collecting air quality data...');
  const datasource = new WeatherDatasource();
  const service = new WeatherService(datasource);
  const aqi = await service.getAirQualityIndex('11756', 10);
  await reportAqiData(aqi, reporters);
  console.log('Air quality data collection complete.');
}

async function collectOceanData(reporters: Reporter[]) {
  console.log('Collecting ocean data...');

  const datasource = new WeatherDatasource();
  const service = new WeatherService(datasource);
  const oceanConditions = await service.getOceanConditions();

  await reportOceanData(oceanConditions, reporters);
  console.log('Ocean data collection complete.');
}

async function collectTideData(reporters: Reporter[]) {
  if (tideRetryTimeout) {
    clearTimeout(tideRetryTimeout);
  }
  tideRetryTimeout = null;
  console.log('Collecting tide data...');
  const datasource = new WeatherDatasource();
  const service = new WeatherService(datasource);
  const startDate = dayjs().subtract(1, 'day').startOf('day'); // 1 day ago
  const endDate = dayjs().add(1, 'day').endOf('day'); // 1 day ahead
  try {
    const tideData = await service.getTideData(startDate, endDate);
    reportData(
      {
        reading: new Value(tideData.nextTide?.height, DistanceUnit.METER, tideData),
        timestamp: tideData.nextTide?.timestamp.toDate(),
        type: 'tides',
      },
      reporters
    );
    console.log('Tide data collection complete.');
  } catch (err) {
    console.error('Error reporting ocean data: ', err);
    if (!tideRetryTimeout) {
      console.log('Retrying in 60 sec');
      tideRetryTimeout = setTimeout(() => {
        tideRetryTimeout = null;
        collectOceanData(reporters);
      }, 60000);
    }
  }
}
async function reportAqiData(aqi: AirQualityData, reporters: Reporter[]) {
  if (aqi.o3) {
    await reportData(
      {
        reading: new Value(aqi.o3.aqi, Unitless),
        timestamp: aqi.o3.observedAt.toDate(),
        type: 'o3',
      },
      reporters
    );
  }
  if (aqi.pm25) {
    await reportData(
      {
        reading: new Value(aqi.pm25.aqi, Unitless),
        timestamp: aqi.pm25.observedAt.toDate(),
        type: 'pm25',
      },
      reporters
    );
  }
}

async function reportWeatherData(conditions: WeatherCondition, reporters: Reporter[]) {
  await reportData(
    {
      reading: conditions.temperature,
      timestamp: conditions.timestamp.toDate(),
      type: 'temperature',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.humidity,
      timestamp: conditions.timestamp.toDate(),
      type: 'humidity',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.pressure,
      timestamp: conditions.timestamp.toDate(),
      type: 'pressure',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.windSpeed,
      timestamp: conditions.timestamp.toDate(),
      type: 'windSpeed',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.windGust,
      timestamp: conditions.timestamp.toDate(),
      type: 'windGust',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.visibility,
      timestamp: conditions.timestamp.toDate(),
      type: 'visibility',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.dewpoint,
      timestamp: conditions.timestamp.toDate(),
      type: 'dewpoint',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.feelsLike,
      timestamp: conditions.timestamp.toDate(),
      type: 'feelsLike',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.windChill,
      timestamp: conditions.timestamp.toDate(),
      type: 'windChill',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.heatIndex,
      timestamp: conditions.timestamp.toDate(),
      type: 'heatIndex',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.cloudCover,
      timestamp: conditions.timestamp.toDate(),
      type: 'cloudCover',
    },
    reporters
  );
  await reportData(
    {
      reading: new Value(conditions.uvIndex || 0, Unitless),
      timestamp: conditions.timestamp.toDate(),
      type: 'uvIndex',
    },
    reporters
  );
  await reportData(
    {
      reading: conditions.windDirection,
      timestamp: conditions.timestamp.toDate(),
      type: 'windDirection',
    },
    reporters
  );
}

async function reportOceanData(oceanConditions: OceanConditions, reporters: Reporter[]) {
  await reportData(
    {
      reading: oceanConditions.currentConditions.waveHeight,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'waveHeight',
    },
    reporters
  );
  await reportData(
    {
      reading: oceanConditions.currentConditions.waterTemperature,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'waterTemperature',
    },
    reporters
  );
  await reportData(
    {
      reading: oceanConditions.currentConditions.windDirection,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'oceanWindDirection',
    },
    reporters
  );
  await reportData(
    {
      reading: oceanConditions.currentConditions.windSpeed,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'oceanWindSpeed',
    },
    reporters
  );
  await reportData(
    {
      reading: oceanConditions.currentConditions.windGust,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'oceanWindGust',
    },
    reporters
  );
  await reportData(
    {
      reading: oceanConditions.currentConditions.waveDirection,
      timestamp: oceanConditions.currentConditions.timestamp.toDate(),
      type: 'waveDirection',
    },
    reporters
  );
}

async function reportData(reading: Reading<any> | undefined, reporters: Reporter[]) {
  if (!reading || !reading.reading || isNaN(reading.reading.value)) {
    console.warn(`Skipping empty reading: ${reading?.type}`);
    return;
  }
  for (const reporter of reporters) {
    await reporter.reportReading(reading);
  }
}

const parseValue = (envVar: string | undefined, defaultValue: number): number => {
  if (!envVar) {
    return defaultValue;
  }
  const parsed = Number.parseInt(envVar, 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
};

const FIVE_MINUTES = 5 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Schedule data collection
const collect = async () => {
  const factory = ReporterFactory.fromEnvironment();
  reporters = await factory.constructReporters();
  var oceanDataInterval = parseValue(process.env.OCEAN_DATA_INTERVAL, FIFTEEN_MINUTES);
  console.log('Using ocean data interval of', oceanDataInterval, 'ms');
  setInterval(() => collectOceanData(reporters), oceanDataInterval); // every 15 minutes

  var airQualityDataInterval = parseValue(process.env.AIR_QUALITY_DATA_INTERVAL, FIVE_MINUTES);
  console.log('Using air quality data interval of', airQualityDataInterval, 'ms');
  setInterval(() => collectAirQualityData(reporters), airQualityDataInterval); // every 5 minutes
  var weatherDataInterval = parseValue(process.env.WEATHER_DATA_INTERVAL, FIVE_MINUTES);
  console.log('Using weather data interval of', weatherDataInterval, 'ms');
  setInterval(() => collectWeatherData(reporters), weatherDataInterval); // every 5 minutes
  var tideDataInterval = parseValue(process.env.TIDE_DATA_INTERVAL, ONE_HOUR);
  console.log('Using tide data interval of', tideDataInterval, 'ms');
  setInterval(() => collectTideData(reporters), tideDataInterval); // every 1 hour
  console.log('Data collection service started.');
  console.log('Reporters:', JSON.stringify(factory.config, null, 2));
  collectWeatherData(reporters);
  collectAirQualityData(reporters);
  collectOceanData(reporters);
  collectTideData(reporters);
};
collect();
