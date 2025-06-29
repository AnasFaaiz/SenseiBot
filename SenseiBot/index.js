require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require('discord.js');

// Welcome System Class
class WelcomeSystem {
  constructor(client) {
    this.client = client;
    this.defaultWelcomeChannelNames = ['welcome', 'general', 'lobby', 'main'];
    this.serverRules = [
      '📝 Be respectful to all members',
      '🚫 No spam, harassment, or offensive content',
      '💬 Keep conversations in appropriate channels',
      '🎯 Stay on topic in each channel',
      '🔇 No excessive use of caps or mentions',
      '🤝 Help maintain a friendly community environment'
    ];
  }

  // Find the best welcome channel
  findWelcomeChannel(guild) {
    // First, try to find a channel with welcome-related names
    for (const channelName of this.defaultWelcomeChannelNames) {
      const channel = guild.channels.cache.find(ch => 
        ch.type === ChannelType.GuildText && 
        ch.name.toLowerCase().includes(channelName)
      );
      if (channel) return channel;
    }

    // Fallback to the first text channel the bot can send messages to
    return guild.channels.cache.find(ch => 
      ch.type === ChannelType.GuildText && 
      ch.permissionsFor(guild.members.me).has('SendMessages')
    );
  }

  // Create welcome embed
  createWelcomeEmbed(member) {
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle(`🎉 Welcome to ${member.guild.name}!`)
      .setDescription(`Hello ${member}, we're excited to have you here!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: '👤 Member Info',
          value: `**Username:** ${member.user.username}\n**Tag:** ${member.user.tag}\n**ID:** ${member.user.id}`,
          inline: true
        },
        {
          name: '📊 Server Stats',
          value: `**Total Members:** ${member.guild.memberCount}\n**You are member #${member.guild.memberCount}`,
          inline: true
        }
      )
      .setTimestamp()
      .setFooter({ 
        text: `Welcome to ${member.guild.name}`, 
        iconURL: member.guild.iconURL() 
      });

    return embed;
  }

  // Create rules embed
  createRulesEmbed(guild) {
    const rulesText = this.serverRules.map((rule, index) => `${index + 1}. ${rule}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('📋 Server Rules')
      .setDescription('Please read and follow these rules to keep our community friendly and welcoming:')
      .addFields({
        name: '📜 Rules',
        value: rulesText,
        inline: false
      })
      .addFields({
        name: '⚠️ Important',
        value: 'Violation of these rules may result in warnings, mutes, or bans depending on severity.',
        inline: false
      })
      .setTimestamp()
      .setFooter({ 
        text: `${guild.name} Rules`, 
        iconURL: guild.iconURL() 
      });

    return embed;
  }

  // Handle member join
  async handleMemberJoin(member) {
    try {
      const welcomeChannel = this.findWelcomeChannel(member.guild);
      
      if (!welcomeChannel) {
        console.log(`⚠️ No suitable welcome channel found in ${member.guild.name}`);
        return;
      }

      const welcomeEmbed = this.createWelcomeEmbed(member);
      const rulesEmbed = this.createRulesEmbed(member.guild);

      // Send welcome message and rules
      await welcomeChannel.send({ 
        content: `${member} has joined the server! 🎉`, 
        embeds: [welcomeEmbed, rulesEmbed] 
      });

      console.log(`👋 Welcomed ${member.user.tag} to ${member.guild.name}`);

    } catch (error) {
      console.error('❌ Error sending welcome message:', error);
    }
  }

  // Send DM welcome (optional)
  async sendWelcomeDM(member) {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle(`Welcome to ${member.guild.name}! 🎉`)
        .setDescription(`Hi ${member.user.username}! Thanks for joining our server.`)
        .addFields(
          {
            name: '💡 Getting Started',
            value: 'Feel free to introduce yourself and explore the different channels!',
            inline: false
          },
          {
            name: '📋 Rules',
            value: 'Please make sure to read the server rules in the welcome channel.',
            inline: false
          }
        )
        .setThumbnail(member.guild.iconURL())
        .setTimestamp();

      await member.send({ embeds: [dmEmbed] });
      console.log(`📨 Sent welcome DM to ${member.user.tag}`);

    } catch (error) {
      console.log(`❌ Could not send DM to ${member.user.tag}: ${error.message}`);
    }
  }
}

// Command System Class
class CommandHandler {
  constructor(client) {
    this.client = client;
    this.prefix = '!';
    this.commands = new Map();
    this.setupCommands();
  }

setupCommands() {

  const commandsPath = path.join(__dirname, 'src','commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name && typeof command.execute === 'function') {
      this.commands.set(command.name, command);
    }
  }

  // Optional: log how many commands were loaded
  console.log(`📦 Loaded ${this.commands.size} commands from /commands`);
}


  async handleMessage(message) {
    if (message.author.bot || !message.content.startsWith(this.prefix)) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName);

    if (!command) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('❌ Unknown Command')
        .setDescription(`Command \`${commandName}\` not found. Use \`${this.prefix}help\` to see available commands.`);
      
      return message.reply({ embeds: [embed] });
    }

    try {
      await command.execute(message, args);
      console.log(`📝 Command '${commandName}' executed by ${message.author.tag}`);
    } catch (error) {
      console.error(`❌ Error executing command '${commandName}':`, error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('⚠️ Command Error')
        .setDescription('There was an error executing this command.');
      
      await message.reply({ embeds: [errorEmbed] });
    }
  }
}

// Create client with necessary intents
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers  // Required for member join events
  ] 
});

// Initialize systems
const welcomeSystem = new WelcomeSystem(client);
const commandHandler = new CommandHandler(client);

// When the bot is ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);
  console.log(`🌐 Connected to ${client.guilds.cache.size} servers`);
  console.log(`👥 Serving ${client.users.cache.size} users`);
});

// Handle new member joins
client.on('guildMemberAdd', async (member) => {
  await welcomeSystem.handleMemberJoin(member);
  // Optionally send a DM (uncomment the line below)
  // await welcomeSystem.sendWelcomeDM(member);
});

// Handle messages
client.on('messageCreate', async (message) => {
  await commandHandler.handleMessage(message);
});

// Error handling
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
