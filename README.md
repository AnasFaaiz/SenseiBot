# SenseiBot - A Learning Companion for Discord 🧠

SenseiBot is an intelligent, AI-powered Discord bot designed to deliver daily educational snippets on a variety of topics, including technology, finance, science, and more. It ensures a unique and non-repetitive learning experience by remembering previously shared terms.

---

## ✨ Features

-   **AI-Powered Content**: Leverages the Google Gemini API to generate concise, easy-to-understand definitions for a wide range of topics.
-   **Smart Memory**: Utilizes a local SQLite database to track used terms, preventing repetitions within a 30-day window for each category.
-   **On-Demand Learning**: Users can request a term from various categories using a simple `!term` command.
-   **Organized & Extensible**: Built with a modular command handler, making it easy to add new commands and features.
-   **Rich Embeds**: Presents information in clean, beautifully formatted Discord embeds.

---

## 🛠️ Technology Stack

-   **Language**: Node.js
-   **Discord Interaction**: [discord.js](https://discord.js.org/)
-   **AI Content Generation**: [Google Gemini API](https://aistudio.google.com/) (`@google/generative-ai`)
-   **Database**: [SQLite](https://www.sqlite.org/index.html) (via `better-sqlite3`)
-   **Environment Variables**: `dotenv`

---

## 🚀 Getting Started

Follow these instructions to get a local copy of SenseiBot up and running for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16.9.0 or higher recommended)
-   A Discord Bot Token ([How to create a Discord Bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
-   A Google Gemini API Key ([Get one from Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/SenseiBot.git](https://github.com/your-username/SenseiBot.git)
    cd SenseiBot
    ```

2.  **Install NPM Packages**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a file named `.env` in the root of your project folder. Add the following lines, replacing the placeholder values with your actual keys:

    ```env
    # Your Discord bot's secret token
    DISCORD_TOKEN=YourDiscordBotTokenGoesHere

    # Your Google Gemini API key
    GEMINI_API_KEY=YourGeminiAPIKeyGoesHere
    ```

4.  **Initialize the Database**
    Run the database setup script one time to create the `senseibot.db` file and the necessary tables:
    ```bash
    node database.js
    ```

5.  **Start the Bot**
    ```bash
    node index.js
    ```
    If everything is configured correctly, you will see a message in your console saying the bot is online.

---

## 🤖 Bot Usage

The primary command to interact with SenseiBot is `!term`.

-   **Get a term from a specific category:**
    ```
    !term <category>
    ```

-   **Example:**
    ```
    !term finance
    ```
    The bot will reply with a unique finance term and its definition.

-   **Available Categories:** `tech`, `finance`, `business`, `science`, `history`, `ai`, and more. (View the full list in `src/commands/term.js`)

---

## 📁 Project Structure

```
SenseiBot/
├── src/
│   └── commands/
│       └── term.js       # Logic for the !term command
├── .env                  # Stores your secret API keys (do not commit)
├── database.js           # Initializes the SQLite database
├── senseibot.db          # The SQLite database file (your bot's memory)
├── index.js              # Main bot entry point (client login, command handler)
└── package.json          # Project dependencies
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page for this repository.

---

## 📄 License

This project is licensed under the MIT License.
