import ip from 'ip';
import { TransitUtils } from './utils/transit.utils.js';
import { EventEmitter } from 'events';
import { Transit } from './api/transit/transit.js';
import { transitApiKey, weatherApiKey, twitterBearerKey } from './keys.js';
import { Config } from './config.js'
import { Weather } from './api/weather/weather.js';
import { WeatherModel } from './models/weather.model.js';
import dayjs from 'dayjs';
import { WeatherUtils } from './utils/weather.utils.js';
import { Display } from './utils/display.utils.js';
import { WebServer } from './web/server.js';
import { Favorites } from './favorites/favorites.js';
import { Line } from './models/transit.model.js';
import { Logger } from './utils/logger.js'

const eventEmitter = new EventEmitter();
export let lineDataStore: Map<string, string> = new Map();
let predictionDataStore: Map<string, string> = new Map();
let weatherDataStore: WeatherModel = {};

let timer: any;
let timers = [];
let isRunning = false;
let agency;

//startup
//register 2s
//display IP 2s
//mapRoutes 0s
//display alert ?s
//start rotation engine

export namespace Main {
    const logger = new Logger();
    export const init = () => {
        if (isRunning) return;
        isRunning = true;
        
        Display.show('Registering ...', true);
        logger.trackMessage('Train Sign Service Started', 'kenneth.eldridge@gmail.com');
        timer = setTimeout(() => {
            eventEmitter.emit('registered', () => { })
        }, 2000)
        timers.push(timer);
    }
    eventEmitter.on('registered', () => {
        displayIp();
    })

    export const exit = () => {
        isRunning = false;
        Display.clear();
        clearTimeout(timer);
    }

    const displayIp = () => {
        Display.clear();
        Display.show(ip.address(), true);
        timer = setTimeout(() => {
            eventEmitter.emit('ipDisplayed', () => { })
        }, 2000)
        timers.push(timer);
    }
    eventEmitter.on('ipDisplayed', () => {
        process.argv.forEach((val) => {
            agency = val.indexOf('agency=') > -1 ? val.split('=')[1] : Config.defaultAgency;
          });
        loadLineData(agency.toUpperCase());
    })

    const loadLineData = (agency) => {
        try {
            if (Config.debug) {
                Display.show('Getting Line Data...')
            }
            Transit.getLineData(transitApiKey, agency).then(lineData => eventEmitter.emit('lineDataLoaded', lineData))
        }
        catch(e) {
            logger.trackMessage(e.message, 'kenneth.eldridge@gmail.com');
            console.log(e);
        }

    }

    eventEmitter.on('lineDataLoaded', (lineData: Line[]) => {
        TransitUtils.mapLines(lineData, eventEmitter);
    })

    eventEmitter.on('linesMapped', mappedLines => {
        lineDataStore = mappedLines;
        getLastestAlert();
    })

    const getLastestAlert = () => {
        if (Config.debug) {
            Display.show('Getting Muni Alert...')
        }
        Transit.getLatestAlert(twitterBearerKey).then(alert => TransitUtils.displayAlert(alert, eventEmitter, timer))
    }
    eventEmitter.on('alertsDisplayCompleted', () => {
        eventEmitter.emit('startRotation')
    })

    // rotation
    // load weather data 0 s
    // load data into cache no delay
    // display time 10 sec
    // display weather 10 sec
    // get data from cache 40 sec

    const runNext = (runTime: number, agency: string) => {
        if (runNext) {
            timer = setTimeout(() => {
                next(agency);
            }, runTime);
            timers.push(timer);
        }
    }

    const loadWeatherData = (runTime: number, agency:string) => {
        if (Config.debug) {
            Display.show('Loading Weather Data...')
        }
        Weather.getForcast(weatherApiKey)
            .then(WeatherUtils.mapWeatherData)
            .then(weather => weatherDataStore = weather)
        runNext(runTime, agency);
    }

    const loadPredictions = (runTime: number, agency: string) => {
        if (Config.debug) {
            Display.show('Getting Prediction Data...')
        }
        Transit.getPredictionData(transitApiKey, agency)
            .then(predictions => TransitUtils.mapPredictions(predictions, lineDataStore, agency))
            .then(predictions => predictionDataStore = predictions)
        runNext(runTime, agency);
    }

    const showDateTime = (runTime: number, agency: string) => {
        const dayOfWeek: string = dayjs().format('dddd');
        const dateTime: string = dayjs().format('MM/DD/YYYY h:mm A');
        Display.clear();
        Display.show(dayOfWeek, true);
        Display.show(dateTime, true);
        runNext(runTime, agency);
    }

    const displayWeather = (runTime: number, agency: string) => {
        const tempF = Math.ceil(weatherDataStore.list[0].main.temp);
        const tempC = Math.ceil((weatherDataStore.list[0].main.temp - 32) * .5556)
        const temp: string = `${tempF}F/${tempC}C`;
        const AQI: string = `AQ:${weatherDataStore.list[0].airLabel}`;
        const forecast: string = `Humidity: ${weatherDataStore.list[0].main.humidity}% ${weatherDataStore.list[0].weather[0].main}`;
        Display.clear();
        Display.show(`${(temp)} ${AQI}`, true)
        Display.show(forecast, true)
        runNext(runTime, agency);
    }


    const displayPredictions = (runTime: number, agency) => {
        if(!predictionDataStore) {
            Display.show('No Lines Loaded', true)
        } else {
            loopThroughPredictions(0, runTime);
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
        }, runTime);
        timers.push(timer);
        runNext(runTime, agency);
    }

    const loopThroughPredictions = (index, runTime) => {
        const key = Array.from(predictionDataStore.keys())[index];
        timer = setTimeout(() => {
            const line = `${key.split('-')[0]}-${key.split('-')[2].toLowerCase()}`;
            const prediction = predictionDataStore.get(key);
            index === predictionDataStore.size - 1 ? index = 0 : index++;
            display(line, prediction, index);
        }, Config.loopDuration);
        timers.push(timer);

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


    let isError = false;
    let i = 0;
    const next = (agency) => {
        try {
            if (isError) {
                stop();
                return;
            }
            stop();
            const {
                functionName,
                runTime,
                hasErrors
            } = workFlow.find(a => a.order === i);
            try {
                if (hasErrors) {
                    timer = setTimeout(() => {
                        next(agency);
                    }, runTime);
                    timers.push(timer);
                } else {
                    functionName(runTime, agency);
                }
            } catch (err) {
                console.log('error', err)
                //logger.error(`${functionName} threw ${err.message} moving on...`);
                if (err.message === "Error: ETIMEDOUT" || err.message === "Error: ESOCKETTIMEDOUT") {

                } else {
                    next(agency);
                }
            }
            i++;
            i === workFlow.length ? i = 0 : i = i;
        } catch (error) {
            logger.trackMessage(error.message, 'kenneth.eldridge@gmail.com');
            workFlow.find(a => a.order === i).hasErrors = true;
            console.log('error', error)
            isError = true;
            process.kill(0);
        }
    }
    const stop = () => {
        timers.forEach((timer) => {
            clearTimeout(timer);
        })
    }
    eventEmitter.once('startRotation', () => {
        next(agency);
    })
}
Main.init();
WebServer.runWebServer();
