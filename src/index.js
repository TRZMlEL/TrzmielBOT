require('dotenv').config()
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log(`✅ Lets Fly! ${c.user.tag} is online`)
})

// client.on('messageCreate', (message) => {
//     if(message.author.bot) {
//         return
//     }

//     console.log(message.author.globalName + ": " + message.content);
//     if(message.content === 'hello') {
//         message.reply('hello');
//     }
// })

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'hey'){
       interaction.reply('hey!');
    }
    if(interaction.commandName === 'ping'){
        interaction.reply('pong!');
     }

     if(interaction.commandName === 'add'){
        const num1 = interaction.options.get('first-number')
        const num2 = interaction.options.get('second-number')
        interaction.reply(`${num1.value} + ${num2.value} = ${num1.value+num2.value}`);
     }
});

client.login(process.env.TOKEN);