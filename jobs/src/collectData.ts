import { WeatherDatasource } from "./domains/weather/WeatherDatasource";
import {WeatherService} from "./domains/weather/WeatherService";

async function collectData() {
    console.log("Collecting data...");
    const datasource = new WeatherDatasource();
    const service = new WeatherService(datasource);
    const currentWeather = await service.getCurrentWeather();
    const aqi = await service.getAirQualityIndex("11706", 25);
    const oceanConditions = await service.getOceanConditions();

   

}
collectData();