const { TEST_COMMAND, ADD_RESI_COMMAND } = require('./command');
// import env
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.'
  );
}

/**
 * Register all commands globally. This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

async function registerCommands(url) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify([TEST_COMMAND, ADD_RESI_COMMAND]),
  });

  if (response.ok) {
    console.log('Registered all commands');
    // print all commands
    const commands = await response.json();
    console.log(commands);
  } else {
    console.error('Error registering commands');
    const text = await response.text();
    console.error(text);
  }
  return response;
}

// Wrap the await call in an async function
(async () => {
  try {
    await registerGlobalCommands();
  } catch (error) {
    console.error(error);
  }
})();