import ip from 'ip';
import { TransitUtils } from './utils/transit.utils.js';
import { EventEmitter } from 'events';
import { Transit } from './api/transit/transit.js';
import { transitApiKey, weatherApiKey, twitterApiKey, Config } from './config.js';
import { Weather } from './api/weather/weather.js';
import { WeatherModel } from './models/weather.model.js';
import dayjs from 'dayjs';
import { WeatherUtils } from './utils/weather.utils.js';
import { Display } from './utils/display.utils.js';

const eventEmitter = new EventEmitter();
let lineDataStore: Map<string,string> = new Map();
let predictionDataStore : Map<string, string> = new Map();
let weatherDataStore: WeatherModel = {};

let timer: any;
let isDebug = false;

//startup
    //register 2s
    //display IP 2s
    //mapRoutes 0s
    //display alert ?s
    //start rotation engine


const init = () => {
    //isDebug = process.argv.slice(2).toString() === '--debug' ? true : Config.debug ? true : false;
    isDebug = false;
    Display.show('Registering ...', true);
    setTimeout(() => {
        eventEmitter.emit('registered', () => {})
    }, 2000)
}
eventEmitter.on('registered', () => {
    displayIp();
 })

const displayIp = () => {
    Display.clear();
    Display.show(ip.address(), true);
    setTimeout(() => {
        eventEmitter.emit('ipDisplayed', () => {})
    }, 2000)
}
eventEmitter.on('ipDisplayed', () => {
    loadLineData();
 })

 const loadLineData = () => {
    if (isDebug) {
        Display.show('Getting Line Data...')
    } 
    Transit.getLineData(transitApiKey).then(lineData => eventEmitter.emit('lineDataLoaded', lineData))
 }

 eventEmitter.on('lineDataLoaded', (lineData) => {
    TransitUtils.mapLines(lineData, eventEmitter);
 })

 eventEmitter.on('linesMapped', mappedLines => {
    lineDataStore = mappedLines;
    getLastestAlert();
})

const getLastestAlert = () => {
    if (isDebug) {
        Display.show('Getting Muni Alert...')
    }
    Transit.getLatestAlert(twitterApiKey).then(alert => TransitUtils.displayAlert(alert, eventEmitter))
}
eventEmitter.on('alertsDisplayCompleted', () => {
    eventEmitter.emit('startRotation', () => {})
})

// rotation
    // load weather data 0 s
    // load data into cache no delay
    // display time 10 sec
    // display weather 10 sec
    // get data from cache 40 sec

const runNext = (runTime: number) => {
    if (runNext) {
        timer = setTimeout(() => {
            next();
        }, runTime);
        timers.push(timer);
    } 
}

const loadWeatherData = (runTime: number) => {
    if (isDebug) {
        Display.show('Loading Weather Data...')
    }
    Weather.getForcast(weatherApiKey)
    .then(WeatherUtils.mapWeatherData)
    .then(weather => weatherDataStore = weather)
    runNext(runTime);
}

const loadPredictions = (runTime: number) => {
    if (isDebug) {
        Display.show('Getting Prediction Data...')
    }
    Transit.getPredictionData(transitApiKey)
    .then(predictions => TransitUtils.mapPredictions(predictions, lineDataStore))
    .then(predictions => predictionDataStore = predictions)
    runNext(runTime);
}

const showDateTime = (runTime: number) => {
    const dayOfWeek: string = dayjs().format('dddd');
    const dateTime: string = dayjs().format('MM/DD/YYYY h:mm A');
    Display.clear();
    Display.show(dayOfWeek, true);
    Display.show(dateTime, true);
    runNext(runTime);
}

const displayWeather = (runTime: number) => {
    const tempF = Math.ceil(weatherDataStore.list[0].main.temp);
    const tempC = Math.ceil((weatherDataStore.list[0].main.temp - 32) * .5556)
    const temp: string = `${tempF}F/${tempC}C`;
    const AQI: string =`AQ:${weatherDataStore.list[0].airLabel}`;
    const forecast: string = weatherDataStore.list[0].weather[0].main;
    Display.clear();
    Display.show(`${(temp)} ${AQI}`, true)
    Display.show(forecast, true)
    runNext(runTime);
}


const displayPredictions = (runTime: number) => {
    loopThroughPredictions(0,runTime);
    setTimeout(() => {
        clearTimeout(timer);
        console.log("done.");
      }, runTime);
    runNext(runTime);
}

const loopThroughPredictions = (index, runTime) => {
    timer = setTimeout(() => {
        const key = Array.from(predictionDataStore.keys())[index];  
        const line = `${key.split('-')[0]}-${key.split('-')[2].toLowerCase()}`;
        const prediction = predictionDataStore.get(key);
        index === predictionDataStore.size - 1 ? index = 0 : index++;
        display(line, prediction, index);
    }, Config.loopDuration);
    //timers.push(timer);

    // setTimeout(() => {
    //     clearTimeout(timer);
    //     //console.log('timerCleared', runTime)
    // }, runTime)
        
    function display(line, prediction, index) {
        Display.show(line, true)
        Display.show(prediction, true)
        loopThroughPredictions(index, runTime)
    }
}

const workFlow = [
    {

        functionName: loadWeatherData,
        runTime: 0,
        order: 0,
        hasErrors: false
    }
    ,
    {

        functionName: loadPredictions,
        runTime: 0,
        order: 1,
        hasErrors: false
    },
    {

        functionName: showDateTime,
        runTime: 5000,
        order: 2,
        hasErrors: false
    },
    {

        functionName: displayWeather,
        runTime: 5000,
        order: 3,
        hasErrors: false
    },
    {

        functionName: displayPredictions,
        runTime: 50000,
        order: 4,
        hasErrors: false
    }
]

const timers = [];
let isError = false;
let i = 0;
const next = () => {
    try {
        if (isError) {
            stop();
            return;
        }
        stop();
        //Display.stopTimers();
        const {
            functionName,
            runTime,
            hasErrors
        } = workFlow.find(a => a.order === i);
        try {
            if (hasErrors) {
                timer = setTimeout(() => {
                    next();
                }, runTime);
            } else {
                functionName(runTime);
            }
        } catch (err) {
            console.log('error', err)
            //logger.error(`${functionName} threw ${err.message} moving on...`);
            if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {

            } else {
                next();
            }
        }
        i++;
        i === workFlow.length ? i = 0 : i = i;
    } catch (error) {
        workFlow.find(a => a.order === i).hasErrors = true;
        console.log('error', error)
        isError = true;
        //logger.error(error.message);
        //logger.error(error.stack);
        process.kill(0);
    }
}
const stop = () => {
    timers.forEach((timer) => {
        clearTimeout(timer);
    })
}
eventEmitter.once('startRotation', () => {
    next();
})
init();