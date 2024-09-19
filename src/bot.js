const Discord = require('discord.js');
const { TEST_COMMAND, ADD_RESI_COMMAND } = require('./command');
require('dotenv').config();

const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ]})

client.on('ready', () => {
    console.log('henlo');
    client.user.setActivity('Cek paket kamu di sini!');
});

// handle slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === TEST_COMMAND.name) {
        await TEST_COMMAND.execute(interaction);
    } else if (commandName === ADD_RESI_COMMAND.name) {
        const resiNumber = interaction.options.getString('resi');
        await executeAddResiCommand(interaction, resiNumber);
    } else {
        await interaction.reply('Unknown command');
    }
});

client.on('messageCreate', msg => {
    const prefix = 't?';

    if (msg.author.bot || !msg.content.startsWith(prefix)) return;

    console.log(msg.content);

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command.charAt(0).toUpperCase() == command.charAt(0)) return;

    if (command === 'hello') {
        msg.channel.send('Konnichiwa, ' + '<@' + msg.author.id + '>' + '-sama!');
    } else if (command === 'ping') {
        msg.channel.send('Ping ku ' + client.ws.ping + 'ms!');
    } else if (command === '') {
        return;
    } else {
        msg.channel.send('Lw ngomong apa?');
        console.log(command);
    }
});

async function executeAddResiCommand(interaction, resiNumber) {
    const urlTarget = `https://orchestra.tokopedia.com/orc/v1/microsite/tracking?airwaybill=${resiNumber}`;
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'dnt': '1',
        'origin': 'https://www.tokopedia.com',
        'priority': 'u=1, i',
        'referer': `https://www.tokopedia.com/kurir-rekomendasi?awb=${resiNumber}`,
        'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    };

    try {
        const response = await fetch(urlTarget, { headers });
        const data = await response.json();

        if (data.status === 200) {
            const trackingData = data.data[0].tracking_data;
            console.log(trackingData);

            // Extract and format tracking data
            const formattedTrackingData = trackingData.map(entry => {
                const { tracking_time, message, city_name, partner_name } = entry;
                return `Time: ${tracking_time}\nMessage: ${message}\nCity: ${city_name}\nPartner: ${partner_name}`;
            }).join('\n');

            // Return formatted tracking data to user
            await interaction.reply(`Tracking data for resi number ${resiNumber}:\n${formattedTrackingData}`);
        } else {
            await interaction.reply('Failed to retrieve tracking data.');
        }
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        await interaction.reply('An error occurred while fetching tracking data.');
    }
}

client.login(process.env.DISCORD_TOKEN);