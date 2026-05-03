# Trivious Trello

Trello API wrapper module for Trivious framework

---

### Installation

```bash
npm install @trivious/trello
yarn add @trivious/trello
pnpm add @trivious/trello
```

> Requires Node.js 22+

---

### Quick Start

```ts
import { TrelloClient, TrelloCard } from "@trivious/trello";

// Create the API client
const trelloClient = new TrelloClient({
	key: "API_KEY",
	token: "API_TOKEN",
});

// Create a new card
const newCard = await trelloClient.cards.create("LIST_ID", {
	name: "My Card",
	desc: "This is my new card!",
});

// State/cache handlers
trelloClient.createCache("BoardCards", {
	// refresh function & interval (in seconds)
	func: async () => await trelloClient.boards.getCards("BOARD_ID"),
	interval: 30_000,
});

// Intended for special cases where you may need to iterate over lots
// of objects in a situation where an API request takes too long
const myBoardCards = trelloClient.getCache("BoardCards") as TrelloCard[];
```
