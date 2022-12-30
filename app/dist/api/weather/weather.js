var _a;
export class Weather {
}
_a = Weather;
Weather.getForcast = async (weatherApiKey) => {
    let response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=94103,us&units=imperial&appid=${weatherApiKey}`);
    let weatherData = await response.json();
    let airData = await Weather.getAirQuality(weatherApiKey);
    weatherData.list[0].airData = airData;
    return weatherData;
};
Weather.getAirQuality = async (weatherApiKey) => {
    let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=37.7836807&lon=-122.4127467&appid=${weatherApiKey}`);
    let airData = await response.json();
    return airData;
};
