import { Config } from "../config.js"


export class Display {

    static show = (string: string, center:boolean, obj:any = undefined) => {
        if(Config.debug) {
            console.log(center ? this.center(string) : string, obj)
        }
    }

    static clear = () => {
        if(!Config.debug) {
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
