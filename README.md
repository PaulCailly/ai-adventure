# AI Adventure: AI-Powered Text RPG Game

A fantasy RPG adventure chatbot built with Next.js and the Vercel AI SDK—created for the Next.js Global Hackathon (Apr 7–17, 2025).

_Submitted for the **Best Use of AI** category_

## 🎮 Project Overview

AI Adventure transforms the traditional text adventure RPG by using AI agents as dynamic narrators that adapt to player choices. Players can create characters, explore zones, battle enemies, find loot, manage inventory, visit markets, and complete quests—all powered by conversational AI.

## 🧠 AI Integration

- **Multi-Agent Framework**: Three specialized AI agents handle different game contexts:

  - **Adventure Agent**: Manages exploration, combat, and storytelling
  - **Market Agent**: Handles trading, item identification, and merchant interactions
  - **Character Agent**: Guides character creation and backstory development

- **Tool-Using AI**: Agents use specialized tools to interact with game systems:
  - **Combat Engine**: `combatCalculation` tool simulates dice-based combat with realistic damage calculations
  - **Inventory Management**: Tools for generating loot, using consumables, and tracking player items
  - **Economy System**: Trade negotiation with dynamic pricing based on character skills
  - **Procedural Content**: Dynamic generation of items, encounters, and narrative events
  - **Character Generation**: `generateHero` tool creates complete character sheets with calculated stats

## 🔮 Game Features

- **Immersive Character Creation**:

  - Choose from 7 unique races (Reptilien, Elfe, Orc, Nain, Mort-vivant, Gobelin, Troll)
  - Select from 7 character classes with distinct play styles (Guerrier, Mage, Voleur, Chamane, Paladin, Chasseur, Druide)
  - Customize with personalized weapons, strengths, weaknesses, companions, and symbols
  - Receive a dynamically generated character avatar using AI image generation

- **Dynamic Stat System**:

  - Base stats (Health, Mana, Attack, Defense, Speed) calculated based on race and class
  - Equipment and consumables provide percentage-based buffs to character attributes
  - Effective stats automatically recalculated as inventory changes
  - Stats influence combat success and special ability effectiveness

- **Visual Inventory System**: Manage equipment, consumables, and quest items with an intuitive UI
- **Dynamic Loot Generation**: Procedurally generated items with qualities, stats, and effects
- **Market & Trading**: Buy, sell, and identify items with interactive merchant dialogues
- **Dice-Based Combat**: Animated dice rolls for combat with critical success/failure system
- **Immersive Zones**: Each area contains unique lore, enemies, and adventure opportunities
  - **Tombe du Dragon Leprestrix**: A forgotten crypt with ancient magic and spectral enemies
  - **Fort Gaultier**: A prison fortress guarded by werewolves and fanatic soldiers
  - **Marché de Luneterne**: A lively market for trading and discovering new items

## 🖼️ Screenshots

<p align="center">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.12.46.png" width="15%">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.13.01.png" width="15%">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.14.13.png" width="15%">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.14.28.png" width="15%">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.14.42.png" width="15%">
  <img src="screenshots/Screenshot%202025-04-19%20at%2017.15.11.png" width="15%">
</p>

## 🚧 Features in Development

1. **Multi-Language Support**: Currently available in French only, with plans to expand to other languages
2. **Spell System**: Implementation of magic spells, including the ability to cast fireballs and other exciting abilities
3. **Leaderboards**: Competitive rankings to showcase top players and their achievements
4. **Quest Journal**: Track ongoing quests, completed adventures, and narrative progression
5. **AI-Generated Voice Narration**: Convert text responses to atmospheric voice narration
6. **Achievement System**: Unlock badges and rewards for in-game accomplishments

## 🏗️ Technical Architecture

- **Specialized API Routes**:

  - `/api/adventure`: Handles exploration, combat, and story progression
  - `/api/market`: Manages trading, item identification, and merchant interactions
  - `/api/chat`: Handles general conversations and character creation
  - `/api/avatar`: Manages character visualization and customization

- **Custom Game Components**:

  - `DiceDisplay`: Visualizes combat rolls with advanced animations
  - `Inventory`: Manages and displays character items with rarity-based styling
  - `Loot System`: Generates balanced items with scaling stats based on level and quality
  - `AudioPlayer`: Provides immersive background music that adapts to game context

- **AI Prompt Engineering**:
  - Character creation system based on choices `introduction.ts`
  - Carefully crafted context in `lib/ai/prompts/` for each game scenario
  - Zone-specific narratives and enemy types defined in `lib/ai/zones.ts`
  - Market interactions guided by structured prompts in `market.ts`

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/ai-adventure.git
   cd ai-adventure
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Set up environment**  
   Copy `.env.example` to `.env` and fill in your `AUTH_SECRET`, `OPENAI_API_KEY`, etc.
4. **Run locally**
   ```bash
   pnpm dev
   ```
   The game will be available at [http://localhost:3000](http://localhost:3000).

## 📅 Hackathon Timeline

- **Apr 7, 2025** — Kickoff & start coding
- **Apr 17, 2025** — Submission deadline
- **Apr 22, 2025** — Winners announced (live stream)

## 🎯 Our Focus: Best Use of AI

Our project showcases innovative AI integration through:

- **80% Vibe Coded**: Most of the code has been vibe coded, even this sentence has been autocompleted
- **Context-Aware Agents**: Each AI agent maintains its own personality and narrative style
- **Multi-Tool Framework**: AI can use specialized tools to affect the game state (combat, inventory, economy)
- **Memory & Persistence**: Character progress and choices impact future interactions
- **Procedural Content**: Dynamic generation of items, encounters, and narrative sequences
- **Balanced Game Systems**: AI-assisted calculation of stats, damage, and economy
- **AI Image Generation**: Character avatars created based on selected attributes
- **Emotion-Adaptive Narrative**: Story tone shifts based on player decisions and combat outcomes

---

_*Built with 💙 for the Next.js Global Hackathon*_
