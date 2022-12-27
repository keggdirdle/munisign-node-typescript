
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const apiKey = '50d7a9f3-390c-4aca-b3f7-2e61543393a8';
let favorities = new Map();
favorities.set('27', '13194');
favorities.set('19', '13194');
favorities.set('14', '17129');
favorities.set('F', '15650')

const getLineData = async () => {
    let response = await fetch(`https://api.511.org/transit/lines?api_key=${apiKey}&operator_id=SF&format=JSON`);
    let lineData = await response.json();
    console.log('remaining requests', response.headers.get('ratelimit-remaining'));
    return lineData;
}

const getPredictionData = async () => {
    let response = await fetch(`https://api.511.org/transit/TripUpdates?api_key=${apiKey}&agency=SF&format=json`);
    let predictions = await response.json();
    return predictions;
}

const mapLines = (json) => {
    let lines = new Map();
    json.forEach((line) => {
        lines.set(line.PublicCode, line.Name)
    });
    eventEmitter.emit('linesLoaded', lines);
}

const mapPredictions = (predictions, mappedLines) => {
    favorities.forEach((stop, line) => {
        output = [];
        predictions.Entities.forEach((a) => {
            if (a.TripUpdate.Trip.RouteId === line.toString()) {
                a.TripUpdate.StopTimeUpdates.forEach((b) => {
                    if (b.StopId === stop.toString()) {
                        output.push(Math.floor((b.Arrival.Time * 1000 - new Date().getTime()) / 1000 / 60))
                    } else return
                })
            }
        })
        let map = new Map();
        map.set(`${line}-${stop}-${mappedLines.get(line)}`, output.sort((a, b) => { return a - b }).slice(0, 2));
        console.log(map)
    })
}

const getPredictions = (mappedLines) => {
    getPredictionData().then(predictions => mapPredictions(predictions, mappedLines))
}

eventEmitter.on('linesLoaded', mappedLines => {
    getPredictions(mappedLines);
})

eventEmitter.once('mapLines', lineData => {
    mapLines(lineData);
})

init = () => {
    getLineData().then(lineData => eventEmitter.emit('mapLines', lineData))
}

//init();

const showDateTime = async (runTime) => {
    //await Display.showDateTime(configModel);
    console.log(1);
    timer = setTimeout(() => {
        next();
    }, runTime);
    timers.push(timer);
};

const test2 = async (runTime) => {
    console.log(2);
    timer = setTimeout(() => {
        next();
    }, runTime);
    timers.push(timer);
};

const test3 = async (runTime) => {
    console.log(3);
    timer = setTimeout(() => {
        next();
    }, runTime);
    timers.push(timer);
};


const workFlow = [
    {

        functionName: showDateTime,
        runTime: 250,
        order: 0,
        hasErrors: false
    }
    ,
    {
        functionName: test2,
        runTime: 250,
        order: 1,
        hasErrors: false
    }
    ,
    {
        functionName: test3,
        runTime: 500,
        order: 2,
        hasErrors: false
    }
]

//let timer;
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
        process.kill();
    }
}
const stop = () => {
    timers.forEach((timer) => {
        clearTimeout(timer);
    })
}
setTimeout(() => {
    next();
}, 100 * 5);





