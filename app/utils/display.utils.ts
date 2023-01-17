import { Config } from "../config.js"
import { SignUtils } from "./sign.utils.js"


export class Display {

    static show = (string: string, center:boolean = false, obj:any = null) => {
        if(Config.sendToConsole) {
            if (obj) {
                console.log(center ? this.center(string) : string, obj)
            } else {
                console.log(center ? this.center(string) : string)
            }
        } else {
            const output = center ? this.center(string) : string;
            SignUtils.send(output);
        }
    }

    static clear = () => {
        if(!Config.sendToConsole) {
            console.log('\n')
        }
    }

    private static center = (string, charLength = 20) => {
        let sidePadding: string = "";
        if (string.length < 20) {
          const spaceToFill: number = charLength - string.length;
          const paddingSize: number = Math.floor(spaceToFill / 2);
          const paddingChar: string = ' ';
          sidePadding = paddingChar.repeat(paddingSize);
        }
        return `${sidePadding}${string}${sidePadding}`;
    }
}
