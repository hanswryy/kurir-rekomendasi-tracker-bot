const TEST_COMMAND = {
    name: "test",
    description: "Test command",
    execute: async (interaction) => {
        await interaction.reply("Test command executed!");
    },
};

// command untuk menambahkan nomor resi baru
const ADD_RESI_COMMAND = {
    name: "newresi",
    description: "Add new resi",
    options: [
        {
            name: 'resi',
            type: 3, // Correct type for STRING
            description: 'The resi number to add',
            required: true,
        },
    ],
    execute: async (interaction, resiNumber) => {
        await interaction.reply(`Add new resi command executed with resi number: ${resiNumber}`);
    },
};

module.exports = { TEST_COMMAND, ADD_RESI_COMMAND };


