var _a;
import { Config } from "../config.js";
export class Display {
}
_a = Display;
Display.show = (string, center, obj = undefined) => {
    if (Config.debug) {
        console.log(center ? _a.center(string) : string, obj);
    }
};
Display.clear = () => {
    if (!Config.debug) {
        console.log('\n');
    }
};
Display.center = (string, charLength = 20) => {
    let sidePadding = "";
    if (string.length < 20) {
        const spaceToFill = charLength - string.length;
        const paddingSize = Math.floor(spaceToFill / 2);
        const paddingChar = ' ';
        sidePadding = paddingChar.repeat(paddingSize);
    }
    return `${sidePadding}${string}${sidePadding}`;
};
