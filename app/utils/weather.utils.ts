import { WeatherModel } from "../models/weather.model.js";

export class WeatherUtils {
    static mapWeatherData = (weatherData: WeatherModel): WeatherModel => {
       return this.mapAqiLabel(weatherData);
        return 
    }

    static mapAqiLabel = (weatherData: WeatherModel): WeatherModel => {
        let aqiLabels: Map<number, string> = new Map();
            aqiLabels.set(1,'Good');
            aqiLabels.set(2,'Fair');
            aqiLabels.set(3,'Moderate');
            aqiLabels.set(4,'Poor');
            aqiLabels.set(5,'Very Poor');

            weatherData.list[0].airLabel = aqiLabels.get(weatherData.list[0].airData.list[0].main.aqi)
        return weatherData;
    }
}