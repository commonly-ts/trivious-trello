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

### Creating a Trello API key & token

- Go to [Power-Up Admin](https://trello.com/power-ups/admin) page and click "New" next to "Your Apps"
- Fill out the form and then click "Create"
- View your power-up and head to the "API Key" section
- Copy the API key and save it to your environment variables file
- To get the token, to the right of the API key is a paragraph. At the end of the paragraph is a hyperlink "Token"
<img width="853" height="473" alt="image" src="https://github.com/user-attachments/assets/0e046e3d-d797-44a1-925a-e73c2ed4f44a" />

- Click on "Token," review the information and scroll to the bottom, and then click "Allow"
- Copy the token (usually starts with "ATTA") and save it to your environment variables file
