const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});

const trackingInfo = {};

client.on('ready', () => {
    console.log('Bot is ready');
    client.user.setActivity('Cek paket kamu di sini!');
});

// Function to check tracking data
async function checkTrackingData(resiNumber, userId) {
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
            const newSize = trackingData.length;

            console.log("Checking tracking data for resi number", resiNumber);

            if (newSize > trackingInfo[resiNumber].size) {
                const latestUpdate = trackingData[0];
                const { tracking_time, message, city_name, partner_name } = latestUpdate;
                const user = await client.users.fetch(userId);
                const updateMessage = `Tracking data for resi number ${resiNumber} has been updated.\n\n**Time**: ${tracking_time}\n**Message**: ${message}\n**City**: ${city_name}\n**Partner**: ${partner_name}`;
                user.send(updateMessage);

                trackingInfo[resiNumber].size = newSize;
            }
        } else {
            console.error('Failed to retrieve tracking data.');
        }
    } catch (error) {
        console.error('Error fetching tracking data:', error);
    }
}

// Handle slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'newresi') {
        const resiNumber = interaction.options.getString('resi');
        const userId = interaction.user.id;

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
                const size = trackingData.length;

                // Save tracking info
                trackingInfo[resiNumber] = { userId, size };

                // Set up a timer to check tracking data every 10 minutes
                setInterval(() => checkTrackingData(resiNumber, userId), 10 * 60 * 1000);

                // Extract and format tracking data
                const formattedTrackingData = trackingData.map(entry => {
                    const { tracking_time, message, city_name, partner_name } = entry;
                    return `**Time**: ${tracking_time}\n**Message**: ${message}\n**City**: ${city_name}\n**Partner**: ${partner_name}`;
                }).join('\n\n');

                // Return formatted tracking data to user
                await interaction.reply(`Tracking data for resi number ${resiNumber}:\n${formattedTrackingData}`);
            } else {
                await interaction.reply('Failed to retrieve tracking data.');
            }
        } catch (error) {
            console.error('Error fetching tracking data:', error);
            await interaction.reply('An error occurred while fetching tracking data.');
        }
    } else {
        await interaction.reply('Unknown command');
    }
});

client.login(process.env.DISCORD_TOKEN);