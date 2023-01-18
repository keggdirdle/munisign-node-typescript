import { AirModel, WeatherModel } from "../../models/weather.model.js";
import { Display } from "../../utils/display.utils.js";

export class Weather {
    static getForcast = async (weatherApiKey): Promise<WeatherModel> => {
      const url = `http://api.openweathermap.org/data/2.5/forecast?zip=94103,us&units=imperial&appid=${weatherApiKey}`;
        let response = await fetch(url);
        let weatherData: WeatherModel = await response.json() 
        let airData: AirModel = await Weather.getAirQuality(weatherApiKey);
        weatherData.list[0].airData = airData;
        //Display.show('weatherRequest', false, url)
        //Display.show('weatherData', false, weatherData)
        return weatherData;
      }

    private static getAirQuality = async (weatherApiKey): Promise<AirModel> => {
      let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=37.7836807&lon=-122.4127467&appid=${weatherApiKey}`);
      let airData: AirModel = await response.json();
      return airData;
    }
}




