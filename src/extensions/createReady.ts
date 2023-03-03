import ora from 'ora'
import chalk from 'chalk'

interface Spinner {
    name: string;
    color: string;
    counter: number;
    account: string;
}

export function createReady(...spinners: Spinner[]) {
    const spinnersList = spinners.map((spinner) => ({
      text: `[${chalk.hex(spinner.color)(spinner.name)}] Logging in...`,
      interval: 200,
    }));
  
    let counter = 0;
    const interval = setInterval(() => {
      const spinner = ora(spinnersList[counter]).start();
      spinner.succeed(`[${chalk.hex(spinners[counter].color)(spinners[counter].name)}] Logged in as ${spinners[counter].account}`);
      counter++;
      if (counter >= spinners.length) {
        clearInterval(interval);
      }
    }, 200);
  
    return interval;
}