import { Config } from "../config.js"
import { SignUtils } from "./sign.utils.js"

export class Display {

    static show = (string: string, center:boolean = false, obj:any = null, ) => {
        let caseString = string;
        if (center) {
            caseString = this.capitalize(string);
        }
        if(Config.sendToConsole) {
            if (obj) {
                console.log(center ? this.center(caseString) : caseString, obj)
            } else {
                console.log(center ? this.center(caseString) : caseString)
            }
        } else {
            const output = center ? this.center(caseString) : caseString;
            SignUtils.send(output);
        }
    }

    static clear = () => {
        if(Config.sendToConsole) {
           // console.log('\n')
        } else {
            Display.show('\n');
        }
    }

    private static capitalize = (string) => {
        var aryString = string.split('-')
        var tmpArray = []
        aryString.forEach((a) => {
            tmpArray.push(a[0].toUpperCase() + a.substr(1));
        })
        return tmpArray.join('-')
    }

    private static center = (string, charLength = 20) => {
        let sidePadding: string = "";
        if (string.length < 20) {
          const spaceToFill: number = (charLength - string.length) + 4;
          const paddingSize: number = Math.floor(spaceToFill / 2);
          const paddingChar: string = ' ';
          sidePadding = paddingChar.repeat(paddingSize);
        }
        return `${sidePadding}${string}${sidePadding}`;
    }
}
