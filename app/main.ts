import ip from 'ip';
import { TransitUtils } from './utils/transit.utils.js';
import { EventEmitter } from 'events';
import { Transit } from './api/transit/transit.js';
import { transitApiKey, weatherApiKey, twitterApiKey } from './api-keys.js';
import { Weather } from './api/weather/weather.js';
import { WeatherModel } from './models/weather.model.js';
import dayjs from 'dayjs';
import { WeatherUtils } from './utils/weather.utils.js';

const eventEmitter = new EventEmitter();
let lineDataStore: Map<string,string> = new Map();
let predictionDataStore : Map<string, string> = new Map();
let weatherDataStore = {};

//startup
    //register 2s
    //display IP 2s
    //mapRoutes 0s
    //display alert ?s
    //start rotation engine
const display = (string1, obj = undefined) => {
    console.log(string1, obj)
}

const init = () => {
    display('Registering ...');
    setTimeout(() => {
        eventEmitter.emit('registered', () => {})
    }, 2000)
}
eventEmitter.on('registered', () => {
    displayIp();
 })

const displayIp = () => {
    display(ip.address());
    setTimeout(() => {
        eventEmitter.emit('ipDisplayed', () => {})
    }, 2000)
}
eventEmitter.on('ipDisplayed', () => {
    loadLineData();
 })

 const loadLineData = () => {
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
    Transit.getLatestAlert(twitterApiKey).then(alert => TransitUtils.displayAlert(alert, eventEmitter))
}
eventEmitter.on('alertsDisplayCompleted', () => {
    display('lineDataStore', lineDataStore);
    eventEmitter.emit('startRotation', () => {})
})

// rotation
    // load weather data 0 s
    // load data into cache no delay
    // display time 10 sec
    // display weather 10 sec
    // get data from cache 40 sec

const runNext = (runTime) => {
    if (runNext) {
        timer = setTimeout(() => {
            next();
        }, runTime);
        timers.push(timer);
    } 
}

const loadWeatherData = (runTime) => {
    Weather.getForcast(weatherApiKey).then((weather: WeatherModel) => { weatherDataStore = weather.list[0]})
    runNext(runTime);
}

const loadPredictions = (runTime) => {
    Transit.getPredictionData(transitApiKey)
    .then(predictions => TransitUtils.mapPredictions(predictions, lineDataStore))
    .then(predictions => predictionDataStore = predictions)
    runNext(runTime);
}

const showDateTime = (runTime) => {
    display(dayjs().format('dddd MM/DD/YYYY h:mm A'));
    runNext(runTime);
}

const displayWeather = (runTime) => {
    display(weatherDataStore)
    runNext(runTime);
}

const displayPredictions = (runTime) => {
    display(predictionDataStore)
    runNext(runTime);
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

let timer: any;
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