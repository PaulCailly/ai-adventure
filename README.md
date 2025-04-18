# TinyQuest: AI-Powered Text Adventure Game

A fantasy RPG adventure chatbot built with Next.js and the Vercel AI SDK—created for the Next.js Global Hackathon (Apr 7–17, 2025).

_Submitted for the **Best Use of AI** category_

## 🎮 Project Overview

TinyQuest transforms the traditional text adventure RPG by using AI agents as dynamic narrators that adapt to player choices. Players can create characters, explore zones, battle enemies, find loot, manage inventory, visit markets, and complete quests—all powered by conversational AI.

![Game Demo](path/to/your/demo.gif) <!-- Add your gameplay demo GIF here -->

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

![Combat System](path/to/combat-demo.gif) <!-- Add your combat system GIF here -->

## 🔮 Game Features

- **Character Creation**: Players can create unique characters with different races and classes
- **Visual Inventory System**: Manage equipment, consumables, and quest items with an intuitive UI
- **Dynamic Loot Generation**: Procedurally generated items with qualities, stats, and effects
- **Market & Trading**: Buy, sell, and identify items with interactive merchant dialogues
- **Dice-Based Combat**: Animated dice rolls for combat with critical success/failure system
- **Immersive Zones**: Each area contains unique lore, enemies, and adventure opportunities

![Inventory System](path/to/inventory-demo.gif) <!-- Add your inventory system GIF here -->

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

- **AI Prompt Engineering**:
  - Carefully crafted context in `lib/ai/prompts/` for each game scenario
  - Zone-specific narratives and enemy types defined in `lib/ai/zones.ts`
  - Market interactions guided by structured prompts in `market.ts`

![AI System Architecture](path/to/system-architecture.gif) <!-- Add your system architecture GIF here -->

## 💻 Code Highlights

```typescript
// Combat calculation with dice rolls and critical hits
const calcDamage = (attack, defense, diceRoll, role) => {
  const randomFactor = ((diceRoll - 1) / (sides - 1)) * 0.4 + 0.8;
  let baseDamage = attack * randomFactor;
  baseDamage = baseDamage * (1 - defense / 100);

  // Critical hit system
  if (diceRoll === 1) {
    return { outcome: "critical failure", damage: 0 };
  } else if (diceRoll === sides) {
    return { outcome: "critical success", damage: baseDamage * 2 };
  } // ...
};
```

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/tinyquest.git
   cd tinyquest
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

- **Context-Aware Agents**: Each AI agent maintains its own personality and narrative style
- **Multi-Tool Framework**: AI can use specialized tools to affect the game state (combat, inventory, economy)
- **Memory & Persistence**: Character progress and choices impact future interactions
- **Procedural Content**: Dynamic generation of items, encounters, and narrative sequences
- **Balanced Game Systems**: AI-assisted calculation of stats, damage, and economy

![AI System Architecture](path/to/system-architecture.gif) <!-- Add your system architecture GIF here -->

---

_*Built with 💙 for the Next.js Global Hackathon*_
