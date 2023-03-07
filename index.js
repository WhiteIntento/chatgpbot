// Create a Discord bot using OpenAi Api interacts on the Discord Server
require('dotenv').config();

// Prepare to connect to the Discord Api
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Prepare connection to OpenAi API
const { Configuration, OpenAIApi } = require('openai');
const openaiConfig = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(openaiConfig);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message){
    try {
        // Don't respond to youtself or ther bots
        if(message.author.bot) return;

        const gptResponse = await openai.createCompletion({
            model: "davinci",
            prompt: `ChatGPT is a friendly chatbot.\n\
ChatGPT: Claniel, how are you?\n\
${message.author.username}: ${message.content}\n\
ChatGPT:`,
            temperature: 0.9,
            max_tokens: 100,
            stop: ["ChatGPT:", "Claniel:"],
        })

        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    } catch(err){
        console.log(err)
    }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT bot is Online on Discord")
