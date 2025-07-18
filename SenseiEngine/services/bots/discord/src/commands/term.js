const { EmbedBuilder } = require('discord.js');
const axios = require('axios'); // We need a tool to make API calls
require('dotenv').config();

// The URL for our new connector service. We can put this in the .env file later.
const CONNECTOR_URL = 'http://localhost:3000/v1/generate-term';

module.exports = {
  name: 'term',
  description: 'Get a random educational term from a category (e.g. tech, finance, business)',
  execute: async (message, args) => {
    // --- USER INPUT VALIDATION (This part stays the same) ---
    const category = args[0]?.toLowerCase();

    if (!category) {
      return message.reply("❌ Please provide a category. Example: `!term tech`, `!term finance`, `!term business`.");
    }

    const validCategories = ['tech', 'technology', 'business', 'finance', 'marketing', 'startup', 'ai', 'science', 'cryptocurrency'];

    if (!validCategories.includes(category)) {
      return message.reply(" Invalid category. Try one of: " + validCategories.join(','));
    }

    try {
      // Acknowledge the request so the user knows the bot is working.
      // This is good practice for potentially long-running commands.
      await message.channel.sendTyping();

      // --- NEW LOGIC: Call our backend ---
      // 1. Prepare the data to send to the connector.
      const payload = {
        platform: 'discord',
        userId: message.author.id,
        guildId: message.guild.id,
        category: category
      };

      // 2. Make the API call to our new connector service.
      const response = await axios.post(CONNECTOR_URL, payload);

      // 3. Get the final result from the response. Our backend did all the hard work.
      const { termName, termDefinition } = response.data;
      // --- END OF NEW LOGIC ---


      // --- PRESENTATION LOGIC (This part stays, but uses the API response) ---
      const embed = new EmbedBuilder()
        .setColor(0x1abc9c)
        .setTitle(`📘 ${termName}`)
        .setDescription(termDefinition)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      await message.reply({ embeds: [embed] });

    } catch (error) {
      // This error handler now catches problems with the API call.
      console.error('❌ API Error or bot error:', error.message);
      return message.reply("⚠️ Sorry, I had trouble communicating with the SenseiEngine. Please try again.");
    }
  }
};
