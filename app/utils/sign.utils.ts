import { exec } from 'child_process';

const script:string = 'sudo ../led-engine/led --led-rows=16 --led-cols=32 --led-chain=3 -S 0 -b 50 -f ../fonts/muni.bdf -C 255,155,5 --led-parallel=1 --led-pwm-lsb-nanoseconds=50 --led-slowdown-gpio=4 --led-pwm-lsb-nanoseconds=50';
// const rows:number = 2;
// const signWidth:number = 19;
// const signHistory:string[] = [];
const child = exec(script, (error, stdout, stderr) => {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    //child.on('exit', (status) => {
    // let msg = message;
    // if (status !== 0) {
    //     console.error('command', cmd);
    //     msg = null;
    // }
    //});
});

export class SignUtils {

    static send = (string) => {
        setTimeout(() => {
                child.stdin.write(`${string}\n`);
        }, 0);
    };
    
    static kill = () => {
      return new Promise((resolve, reject) => {
        const child = exec(script);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        //child.on('exit', (status) => {
        //   let msg = message;
        //   if (status !== 0) {
        //     console.error('command', script);
        //     msg = null;
        //   }
          //resolve(msg);
        //});
      });
    };


    static clear = () => {
        child.stdin.write('\n');
    };
}