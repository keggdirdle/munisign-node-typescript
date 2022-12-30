var _a;
export class WeatherUtils {
}
_a = WeatherUtils;
WeatherUtils.mapWeatherData = (weatherData) => {
    return _a.mapAqiLabel(weatherData);
    return;
};
WeatherUtils.mapAqiLabel = (weatherData) => {
    let aqiLabels = new Map();
    aqiLabels.set(1, 'Good');
    aqiLabels.set(2, 'Fair');
    aqiLabels.set(3, 'Moderate');
    aqiLabels.set(4, 'Poor');
    aqiLabels.set(5, 'Very Poor');
    weatherData.list[0].airLabel = aqiLabels.get(weatherData.list[0].airData.list[0].main.aqi);
    return weatherData;
};
