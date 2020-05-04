const { readdirSync, statSync } = require('fs');
const { join, sep } = require('path');
const { Collection } = require('discord.js');
const Command = require('./Command');

class Handler {
    constructor(client) {
        this.client = client;
        this.aliases = new Collection();
        this.commands = new Collection();
        this.events = new Collection();
    }

    readdir(directory) {
        if (!directory) throw new Error('No diretory provided.')
        const result = [];
        (function read(dir) {
            const files = readdirSync(dir);
            for (const file of files) {
                const filepath = join(dir, file);
                if (statSync(filepath).isDirectory()) {
                    read(filepath);
                } else {
                    result.push(`${process.cwd()}${sep}${filepath}`);
                }
            }
        }(directory));
        return result;
    }

    loadCommands() {
        const files = this.readdir('./src/commands');
        for (const file of files) {
            delete require.cache[require.resolve(file)];
            if (file.endsWith('.js')) {
                try {
                    const command = new (require(file))(this.client);
                    for (const alias of command.aliases) {
                        this.aliases.set(alias, command.name)
                    }
                    this.commands.set(command.name, command);
                } catch (e) {
                    throw new Error(e);
                }
            }
        }
    }

    loadCommandsNeko() {
        const nk = require('nekos.life');
        const nekosLife = new nk();
        this.client.nekosSafe = nekosLife.sfw;
        this.client.nekosUnSafe = nekosLife.nsfw;
        const actions = ['tickle', 'poke', 'feed', 'cuddle', 'hug', 'pat'];
        const images = ['lizard', 'meow', 'smug', 'baka', 'woof'];
        const excludes = ['foxGirl', '8ball', 'why', 'catText', 'OwOify', 'fact', 'chat', 'nekoGif', 'spoiler'];
        delete this.client.nekosUnSafe.neko;
        delete this.client.nekosUnSafe.avatar;

        Object.entries(this.client.nekosUnSafe).map(x => {
            const cmd = new Command(this.client, {
                name: x[0].toLowerCase(),
                description: 'Just your average lewd',
                category: 'nsfw'
            });
            cmd.exec = async function (message, args) {
                if (!message.channel.nsfw) return message.channel.send('Nope. It\'s lewd. (Use the command in an nsfw channel.)');
                message.channel.send(new (require('discord.js').MessageEmbed)().setImage((await x[1]()).url));
            }
            this.client.handler.commands.set(cmd.name, cmd);
        });
        Object.entries(this.client.nekosSafe).filter(x => !this.client.handler.commands.has(x[0]) && actions.includes(x[0]) && !excludes.includes(x[0])).map(x => {
            const cmd = new Command(this.client, {
                name: x[0].toLowerCase(),
                description: 'Enact an action upon the other user!',
                category: 'image'
            });
            cmd.exec = async function (message, args) {
                const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);//(await x[1]()).url
                message.channel.send(`${target ? `${message.author} has enacted ${x[0]} on ${target}!` : `Guess it's my turn to ${x[0]} you, ${message.author}! >:3 `}`, new (require('discord.js').MessageEmbed)().setColor(this.client.color).setImage((await x[1]()).url));
            }
            this.client.handler.commands.set(cmd.name, cmd);
        });
        Object.entries(this.client.nekosSafe).filter(x => !this.client.handler.commands.has(x[0]) && images.includes(x[0]) && !excludes.includes(x[0])).map(x => {
            const cmd = new Command(this.client, {
                name: x[0].toLowerCase(),
                description: 'Your everyday images',
                category: 'image'
            });
            cmd.exec = async function (message, args) {
                message.channel.send(new (require('discord.js').MessageEmbed)().setColor(this.client.color).setImage((await x[1]()).url));
            }
            this.client.handler.commands.set(cmd.name, cmd);
        });
    }


    loadEvents() {
        const files = this.readdir('./src/events');
        for (const file of files) {
            delete require.cache[require.resolve(file)];
            if (file.endsWith('.js')) {
                try {
                    const event = new (require(file))(this.client);
                    this.client.on(event.name, (...args) => {
                        event.exec(...args);
                    });
                    this.events.set(event.name, event);
                } catch (e) {
                    throw new Error(e);
                }
            }
        }
    }
}

module.exports = Handler;