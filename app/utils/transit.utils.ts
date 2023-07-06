
import { Config } from '../config.js';
import { Favorites } from '../favorites/favorites.js'
import { Line } from '../models/transit.model.js';
import { Display } from './display.utils.js';

export class TransitUtils {
    static mapLines = (lineData: Line[], eventEmitter) => {
        let lines = new Map();
        lineData.forEach((line: Line) => {
            lines.set(line.PublicCode, line.Name)
            //console.log('NAME ' + line.Name)
        });
        eventEmitter.emit('linesMapped', lines);
    }

    static mapPredictions = (predictions, mappedLines, agency): Map<string, string> => {
        let map = new Map();
        let output: Array<number> = [];
        Favorites.getFavorites(agency).forEach((stop, line) => {
            console.log('stop', JSON.stringify(stop));
            console.log('line', JSON.stringify(line));
            output = [];
            predictions.Entities.forEach((a) => {
                if (a.TripUpdate.Trip.RouteId === line.toString()) {
                    a.TripUpdate.StopTimeUpdates.forEach((b) => {
                        if (b.StopId === stop.toString() && (b.Arrival.Time * 1000) > new Date().getTime()) {
                            output.push(Math.floor((b.Arrival.Time * 1000 - new Date().getTime()) / 1000 / 60))
                        } else return
                    })
                }
            })
            if (output.length > 1) {
                map.set(`${line}-${stop}-${mappedLines.get(line)}`, output.sort((a, b) => { return a - b }).slice(0, 2));
            } else if (output.length === 1) {
                map.set(`${line}-${stop}-${mappedLines.get(line)}`, output);
            } else {
                return
            }
        })
        return TransitUtils.formatArrivalTimes(map);
    }

    static displayAlert(alert, eventEmitter, timer) {
        //remove DMs
        alert = alert["data"].filter(a => !a.text.startsWith('@'))[0].text.replaceAll('\n', ' ').trim();
        alert = alert.split('https');
        if (alert.length > 1) {
            alert.pop();
            alert = alert.join('. ');
        }

        alert = ' '.repeat(19) + alert;
        for (var i = 0; i < alert.length; i++) {
            delay(i, alert.length)
        }
        function delay(i, total) {
            timer = setTimeout(() => {
                Display.show(alert.substring(i, i + (19 + 19)));
                if (i < total - 1) {
                    timer = setTimeout(() => {
                        Display.clear();
                    }, Config.scrollSpeed - 10)
                }
                if (i === total - 1) {
                    eventEmitter.emit('alertsDisplayCompleted', '')
                }
            }, i * Config.scrollSpeed);
        }
    }
    static formatArrivalTimes(times: Map<any, any>) {
        times.forEach((value, key) => {
            let i = 0;
            let num1;
            let num2 = '';
            value.forEach((num) => {
                if (i === 0) {
                    if (num === 0) {
                        num1 = "Arriving"
                    } else {
                        num1 = num + ' min'
                    }
                } else if (num) {
                    num2 = '& ' + num + ' min'
                }
                i++;
            })
            times.set(key, num1 + ' ' + num2)
        })
        return times;
    }
}
