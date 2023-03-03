import disk from 'diskusage'
import si from 'systeminformation'
import { stripIndents } from 'common-tags'
import os from 'os'
import { version } from 'discord.js'
import { version as BotVersion } from '../config/bot.config.js'
import google from 'googlethis';

/**
 * Regex
 */
const discordLinkRegex = /^https?:\/\/(www\.)?discord(?:app)?\.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})$/;
const discordIdRegex = /^(\d{17,19})$/;
const options = {
  page: 0, 
  safe: false, // Safe Search
  parse_ads: false, // If set to true sponsored results will be parsed
  additional_params: { 
    // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
    hl: 'en' 
  }
}

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
  const used = total - free
  const freePercentage = free / total
  const usedPercentage = used / total
  const totalNumber = total / 1000000000
  const freeNumber = free / 1000000000
  const usedNumber = used / 1000000000
  const freePercentageNumber = freePercentage * 100
  const usedPercentageNumber = usedPercentage * 100
  return {
    total: `${totalNumber.toFixed(2)} GB`,
    free: `${freeNumber.toFixed(2)} GB (${freePercentageNumber.toFixed(1)}%)`,
    used: `${usedNumber.toFixed(2)} GB (${usedPercentageNumber.toFixed(1)}%)`
  }
}

async function getBrandImage(brand:string) {
  const response = await google.image(`${brand} logo`, options)
  return response
}

export async function checkSystem() {

  const cpu = await si.cpu();
  const os = await si.osInfo();
  const ram = await si.mem();

  const space = await checkSpace('/')

  var endMeasure = cpuAverage();

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  const ramUsed = Math.round(ram.used) / 1024 / 1024 / 1024
  const ramTotal = Math.round(ram.total / 1024 / 1024 / 1024)

  let info = stripIndents`CPU: ${cpu.manufacturer} ${cpu.brand} @ ${cpu.speed}GHz
  Cores: ${cpu.cores} (${cpu.physicalCores} Physical)
  CPU Usage: ${percentageCPU}%
  Memory total: ${ramTotal.toFixed(1)} GB
  Memory used: ${ramUsed.toFixed(1)} GB
  Disk total: ${space.total}
  Disk used: ${space.used}
  Database size: 512 MB
  OS: ${os.distro} ${os.codename} (${os.platform})
  Kernel: ${os.kernel} ${os.arch}`

  return info
}

export async function checkVersion() {
  const versions = await si.versions();
  return {
    node: versions.node,
    framework: version,
    bot: BotVersion
  }
}