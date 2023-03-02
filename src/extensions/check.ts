import disk from 'diskusage'
import si from 'systeminformation'
import { stripIndents } from 'common-tags'
import os from 'os'


/**
 * Regex
 */
const discordLinkRegex = /^https?:\/\/(www\.)?discord(?:app)?\.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})$/;
const discordIdRegex = /^(\d{17,19})$/;

function isDiscordLink(input: string): boolean {
  return discordLinkRegex.test(input);
}

function isDiscordId(input: string): boolean {
  return discordIdRegex.test(input);
}

export function getDiscordMessageInfo(input: string): {  channelId?: string; messageId?: string } {
    if (isDiscordLink(input)) {
      const match = discordLinkRegex.exec(input);
      if (match !== null) {
        const [, channelId, messageId] = match.slice(2);
        return { channelId, messageId };
      } else {
        throw new Error("Invalid Discord link");
      }
    } else if (isDiscordId(input)) {
      return { channelId: `1080557241800867880`, messageId: input };
    } else {
      throw new Error("Invalid Discord link or ID");
    }
}

function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(const type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuAverage();


async function checkSpace(path) {
  const { free, total } = await disk.check(path);
  const freePercentage = free / total
  const totalNumber = total / 1000000000
  const freeNumber = free / 1000000000
  const freePercentageNumber = freePercentage * 100
  return {
    total: `${totalNumber.toFixed(2)} GB`,
    free: `${freeNumber.toFixed(2)} GB (${freePercentageNumber.toFixed(1)}%)`
  }
}

export async function checkSystem() {

  const cpu = await si.cpu();
  const disk = (await si.diskLayout())[0];
  const os = await si.osInfo();
  const versions = await si.versions();
  const ram = await si.mem();

  const space = await checkSpace('/')

  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  let info = stripIndents`CPU: ${cpu.manufacturer} ${cpu.brand} @ ${cpu.speed}GHz
  Cores: ${cpu.cores} (${cpu.physicalCores} Physical)
  CPU Usage: ${percentageCPU}%
  Memory total: ${Math.round(ram.total / 1024 / 1024 / 1024)} GB
  Memory used: ${Math.round(ram.used) / 1024 / 1024 / 1024} GB
  Disk total: ${space.total}
  Disk used: ${space.free}
  Database size: 512 MB
  OS: ${os.distro} ${os.codename} (${os.platform})
  Kernel: ${os.kernel} ${os.arch}`

  return info
}