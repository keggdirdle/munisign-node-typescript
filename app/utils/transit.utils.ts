
import { Favorites } from '../favorites/favorites.js'
import { Line } from '../models/transit.model.js';
import { Display } from './display.utils.js';

export class TransitUtils {
    static mapLines = (lineData: Line[], eventEmitter)  => {
        let lines = new Map();
        lineData.forEach((line: Line) => {
            lines.set(line.PublicCode, line.Name)
        });
        eventEmitter.emit('linesMapped', lines);
    }

    static mapPredictions = (predictions, mappedLines) : Map<string, string> => {
        let map = new Map();
        let output: Array<number> = [];
        Favorites.getFavorites().forEach((stop, line) => {
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
            if(output.length > 1) {
                map.set(`${line}-${stop}-${mappedLines.get(line)}`, output.sort((a, b) => { return a - b }).slice(0, 2));
            } else if (output.length === 1) {
                map.set(`${line}-${stop}-${mappedLines.get(line)}`, output);
            } else {
                return
            }
        })
        return TransitUtils.formatArrivalTimes(map);
    }

    static displayAlert(alert, eventEmitter) {
        //remove DMs
        alert = alert["data"].filter(a => !a.text.startsWith('@'))[0].text.replaceAll('\n',' ').trim();
        alert = alert.split('https');
        if(alert.length > 1) {
            alert.pop();
            alert = alert.join('. ');
        }

        alert = ' '.repeat(19) + alert;
        for(var i = 0; i < alert.length; i++) {
            delay(i,alert.length)
          }
        function delay(i, total) {
            const timer = setTimeout(() => {
                Display.show(alert.substring(i, i+(19+19)));
                setTimeout(() => {
                    Display.clear();
                }, 148)
                if(i === total - 1) {
                    eventEmitter.emit('alertsDisplayCompleted', '')
                }
            }, i * 150);
        }
    }
    static formatArrivalTimes(times: Map<any,any>) {
        times.forEach((value, key) => {
            let i=0;
            let num1;
            let num2;
            value.forEach((num) => {
                if (i===0) {
                    if(num === 0) {
                        num1 = "Arriving"
                    } else {
                        num1 = num + ' min'
                    }
                } else {
                    num2 = '& ' + num + ' min'
                }
                i++;
            })
            times.set(key, num1 + ' ' + num2)
        })
        return times;
    }
}
