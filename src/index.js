require('dotenv').config();
const { Client, IntentsBitField, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024, 500);
welcomeCanvas.context = welcomeCanvas.create.getContext('2d');
welcomeCanvas.context.font = '72px sans-serif';
welcomeCanvas.context.fillStyle = '#ffffff';
Canvas.loadImage("./img/bg.png").then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
    welcomeCanvas.context.fillText("welcome", 360, 360);
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    welcomeCanvas.context.stroke();
    welcomeCanvas.context.fill();
});

client.on('ready', (c) => {
    console.log(`✅ Lets Fly! ${c.user.tag} is online`);
});

client.on('guildMemberAdd', async member => {
    const welcomechannel = client.channels.cache.get('1246057579487039528');
    let canvas = welcomeCanvas;
    canvas.context.font = '42px sans-serif';
    canvas.context.textAlign = 'center';
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = '32px sans-serif';
    canvas.context.fillText(`You are the ${member.guild.memberCount}th`, 512, 455);
    canvas.context.beginPath();
    canvas.context.arc(512, 168, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 1024 }))
        .then(img => {
            canvas.context.drawImage(img, 393, 47, 238, 238);
        });
    let atta = new AttachmentBuilder(canvas.create.toBuffer(), { name: `welcome-${member.id}.png` });
    try {
        welcomechannel.send({ content: `:wave: Hello ${member}, welcome to ${member.guild.name}!`, files: [atta] });
    } catch (error) {
        console.log(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isButton()) return;
        await interaction.deferReply({ ephemeral: true });

        const role = interaction.guild.roles.cache.get(interaction.customId);
        if (!role) {
            interaction.editReply({
                content: "I couldn't find that role",
            });
            return;
        }

        const hasRole = interaction.member.roles.cache.has(role.id);

        if (hasRole) {
            await interaction.member.roles.remove(role);
            await interaction.editReply(`The role ${role} has been removed.`);
            return;
        }

        await interaction.member.roles.add(role);
        await interaction.editReply(`The role ${role} has been added.`);
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);
