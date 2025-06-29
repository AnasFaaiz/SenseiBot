const { EmbedBuilder } = require('discord.js');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const db = require('../config/database');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});


module.exports = {
  name: 'term',
  description: 'Get a random educational term from a category (e.g. tech, finance, business)',
  execute: async (message, args) => {
    const category = args[0]?.toLowerCase();

    if (!category) {
      return message.reply("❌ Please provide a category. Example: `!term tech`, `!term finance`, `!term business`.");
    }


    const validCategories = ['tech', 'technology', 'business', 'finance', 'marketing', 'startup', 'ai', 'science', 'cryptocurrency'];

    if (!validCategories.includes(category)) {
      return message.reply(" Invalid category. Try one of: " + validCategories.join(','));
    }

try {
      // 1. Get the last 50 used terms for this category from the last 30 days
      const recentTermsStmt = db.prepare("SELECT term FROM used_terms WHERE category = ? AND timestamp >= date('now', '-30 days') ORDER BY timestamp DESC LIMIT 50");
      const recentTerms = recentTermsStmt.all(category).map(row => row.term);

      // 2. Create the prompt, telling the AI which terms to avoid
      let prompt = `Give me one important and trending ${category} term of the day with its definition. Format it as "Term: Definition". The definition should be concise (under 60 words).`;
      if (recentTerms.length > 0) {
        prompt += ` Do not use any of the following terms: ${recentTerms.join(', ')}.`;
      }

      // 3. Call the Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // 4. Parse the AI's response to separate the term and its definition
      const parts = aiResponse.split(':');
      const termName = parts[0].trim();
      const termDefinition = parts.slice(1).join(':').trim();

      if (!termName || !termDefinition) {
        throw new Error("AI response was not in the expected 'Term: Definition' format.");
      }

      // 5. Save the new, unique term to our database for future reference
      const insertStmt = db.prepare('INSERT INTO used_terms (term, category) VALUES (?, ?)');
      insertStmt.run(termName, category);
      console.log(`Saved new term '${termName}' to the database for category '${category}'.`);

      // 6. Build and send the final message
      const embed = new EmbedBuilder()
        .setColor(0x1abc9c)
        .setTitle(`📘 ${termName}`)
        .setDescription(termDefinition)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      await message.reply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ AI API Error or Parsing Error:', error);
      return message.reply("⚠️ Sorry, I had trouble generating a unique term. Please try again.");
    }
  }
};
