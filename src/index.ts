import * as url from 'url';
import { ClusterManager } from "discord-hybrid-sharding";
import { config } from "dotenv";
config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const manager = new ClusterManager(`${__dirname}/bot.js`, {
    totalShards: 'auto', // or 'auto'
    /// Check below for more options
    shardsPerClusters: 2,
    // totalClusters: 7,
    mode: 'process', // you can also choose "worker"
    token: process.env.TOKEN!,
});

manager.on('clusterCreate', cluster => console.log(``));
manager.spawn();