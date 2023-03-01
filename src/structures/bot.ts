import { Client, GatewayIntentBits, PresenceData, PresenceStatusData, Collection } from "discord.js";

import { CommandService } from "../services/command.js";
import { EventService } from "../services/event.js";
import { DatabaseProvider } from "../providers/database.js";
import { log } from "../extensions/logger.js";

export class Bot extends Client {
    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.GuildMembers, 
                GatewayIntentBits.DirectMessages, 
                GatewayIntentBits.MessageContent, 
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildEmojisAndStickers, 
                GatewayIntentBits.GuildMessages, 
                GatewayIntentBits.GuildModeration, 
                GatewayIntentBits.GuildPresences
            ],
        })
        this.token = token;
    }

    public database: DatabaseProvider | undefined;
    public guildIds: string[] = [];
    public Listeners: EventService | undefined = undefined;
    public Commands: CommandService | undefined = undefined;
    public commands: any[] = [];
    public help = new Collection<string, {
        name: string,
        description: string,
        category: {
            name: String,
            emoji: String
        },
        level: number
    }>();

    addGuildId(guildId: string) : Bot {
        if (!this.guildIds.some(guild => guild === guildId)) {
            this.guildIds.push(guildId)
        }

        return this;
    }

    /**
    * Register providers
    */
    public async registerProviders(): Promise<void> {
        try {
        const database = new DatabaseProvider(this)
        await database._initialize();
        this.database = database;
        } catch (error) {
            console.error('Failed while registering providers', error)
        }
    }

    public async setPresence(presenceOptions: PresenceData): Promise<void> {
        await this.user!.setPresence(presenceOptions)
    }

    public async setStatus(statusOptions: PresenceStatusData): Promise<void> {
        await this.user!.setStatus(statusOptions)
    }
    
    public async registerListeners(): Promise<void> {
        try {
            const eventService = new EventService(this);
            await eventService._initialize();
            this.Listeners = eventService
        } catch (err) {
            console.error('Failed while registering listeners', err);
        }
    }

    /**
    * Register commands
    */
    async registerCommands(): Promise<void> {
        try {
            if (this.Commands === undefined) {
                const commandService = new CommandService(this);
                this.Commands = commandService;
            }
            await this.Commands._initialize();
        } catch (error) {
            console.error('Failed while registering commands', error);
        }
    }

    async reloadCommands() {
        if (this.Commands !== undefined) {
            await this.Commands._initialize();
        }   
    }

    start() {
        this.login(this.token!).then( async () => {
            await this.registerListeners()
            await this.registerProviders()
        })
        log(this);
    }
}