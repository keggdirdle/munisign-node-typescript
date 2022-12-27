export class Weather {
    static getForcast = async (weatherApiKey) => {
        let response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=94103,us&units=imperial&appid=${weatherApiKey}`);
        let lineData = await response.json();
        return lineData;
      }
}