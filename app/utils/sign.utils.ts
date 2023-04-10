import { exec } from 'child_process';

const script: string = 'sudo ../../rpi-rgb-led-matrix-master/examples-api-use/text-example --led-rows=16 --led-cols=32 --led-chain=3  -C 255,155,5 --led-parallel=1 --led-slowdown-gpio=4 --led-pwm-lsb-nanoseconds=50 --led-brightness=75 -f ./fonts/muni8.bdf';

const child = exec(script, (error, stdout, stderr) => {
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
});

export class SignUtils {

  static send = (string) => {
    setTimeout(() => {
      //console.log(string)
      child.stdin.write(`${string}\n`);
    }, 10);
  };

  static kill = () => {
    return new Promise((resolve, reject) => {
      const child = exec(script);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    });
  };


  static clear = () => {
    child.stdin.write('\n');
  };
}