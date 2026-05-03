import Bottleneck from "bottleneck";
import { TrelloAPIError } from "./errors.js";
import {
	CreateAttachmentOnCardQueryParameters,
	CreateCardQueryParameters,
	TrelloCard,
	TrelloRatelimitErrorType,
	UpdateCardQueryParameters,
} from "./typings.js";

const apiTokenLimit = new Bottleneck({
	reservoir: 100,
	reservoirRefreshAmount: 100,
	reservoirRefreshInterval: 10_000,
});

const apiKeyLimit = new Bottleneck({
	reservoir: 300,
	reservoirRefreshAmount: 300,
	reservoirRefreshInterval: 10_000,
});

interface ClientCredentials {
	key: string;
	token: string;
}

export default class TrelloClient {
	private readonly _credentials: ClientCredentials;
	private readonly limiters = {
		token: apiTokenLimit,
		apiKey: apiKeyLimit,
	};
	private limiter = this.limiters.apiKey.chain(this.limiters.token);
	private readonly cache = new Map<string, any>();

	readonly baseUrl = "https://api.trello.com/1/";

	constructor(credentials: ClientCredentials) {
		this._credentials = credentials;
	}

	private async fetchApi(url: string, method: string, body?: string): Promise<Response> {
		return this.limiter.schedule(async () => {
			const headers: Record<string, string> = {
				Accept: "application/json",
			};
			if (body) headers["Content-Type"] = "application/json";

			const response = await fetch(url, {
				method,
				body,
				headers,
			});

			const tokenInterval = Number(response.headers.get("x-rate-limit-api-token-interval-ms"));
			const tokenMax = Number(response.headers.get("x-rate-limit-api-token-max"));
			const tokenRemaining = Number(response.headers.get("x-rate-limit-api-token-remaining"));

			const keyInterval = Number(response.headers.get("x-rate-limit-api-key-interval-ms"));
			const keyMax = Number(response.headers.get("x-rate-limit-api-key-max"));
			const keyRemaining = Number(response.headers.get("x-rate-limit-api-key-remaining"));

			if (!isNaN(tokenInterval) && !isNaN(tokenMax) && !isNaN(tokenRemaining)) {
				this.limiters.token.updateSettings({
					reservoir: tokenRemaining,
					reservoirRefreshAmount: tokenMax,
					reservoirRefreshInterval: tokenInterval,
				});
			}

			if (!isNaN(keyInterval) && !isNaN(keyMax) && !isNaN(keyRemaining)) {
				this.limiters.apiKey.updateSettings({
					reservoir: keyRemaining,
					reservoirRefreshAmount: keyMax,
					reservoirRefreshInterval: keyInterval,
				});
			}

			this.limiter = this.limiters.apiKey.chain(this.limiters.token);

			if (response.status === 429) {
				const errorType = (await response.json()).body["error"] as string;
				await new Promise((resolve) =>
					setTimeout(
						resolve,
						errorType === TrelloRatelimitErrorType.API_KEY ? keyInterval : tokenInterval + 1_000
					)
				);
				return this.fetchApi(url, method, body);
			}

			return response;
		});
	}

	createCache<T>(name: string, refresh?: { func: () => T; interval: number }) {
		this.cache.set(name, new Map<string, T>());
		if (refresh) setInterval(() => this.cache.set(name, refresh.func()), refresh.interval);
		return this.cache.get(name) as Map<string, T>;
	}

	getCache(name: string) {
		return this.cache.get(name);
	}

	appendCredentialParams(url: URL) {
		url.searchParams.set("key", this._credentials.key);
		url.searchParams.set("token", this._credentials.token);
		return url;
	}

	cards = {
		client: this as TrelloClient,
		path: new URL("cards/", this.baseUrl).toString(),
		async addAttachment(cardId: string, params: CreateAttachmentOnCardQueryParameters) {
			const url = new URL(`${cardId}/attachments`, this.path);
			try {
				const data = await this.client.fetchApi(
					this.client.appendCredentialParams(url).toString(),
					"POST",
					JSON.stringify(params)
				);
				if (!data.ok) {
					throw new TrelloAPIError(`Failed to create attachment on card: ${data.statusText}`);
				}
			} catch (err: unknown) {
				const error = err as TrelloAPIError;
				console.error(error);
			}
		},
		async create(listId: string, params: CreateCardQueryParameters) {
			const url = new URL("", this.path);
			url.searchParams.set("idList", listId);
			try {
				const data = await this.client.fetchApi(
					this.client.appendCredentialParams(url).toString(),
					"POST",
					JSON.stringify(params)
				);
				if (!data.ok) {
					throw new TrelloAPIError(`Failed to create card: ${data.statusText}`);
				}

				return (await data.json()) as TrelloCard;
			} catch (err: unknown) {
				const error = err as TrelloAPIError;
				console.error(error);
			}
		},
		async update(cardId: string, params: UpdateCardQueryParameters) {
			const url = new URL(`${cardId}`, this.path);
			try {
				const data = await this.client.fetchApi(
					this.client.appendCredentialParams(url).toString(),
					"PUT",
					JSON.stringify(params)
				);
				if (!data.ok) {
					throw new TrelloAPIError(`Failed to update card: ${data.statusText}`);
				}
			} catch (err: unknown) {
				const error = err as TrelloAPIError;
				console.error(error);
			}
		},
		async addComment(cardId: string, params: { text: string }) {
			const url = new URL(`${cardId}/actions/comments`, this.path);
			try {
				const data = await this.client.fetchApi(
					this.client.appendCredentialParams(url).toString(),
					"POST",
					JSON.stringify(params)
				);
				if (!data.ok) {
					throw new TrelloAPIError(`Failed to add comment to card: ${data.statusText}`);
				}
			} catch (err: unknown) {
				const error = err as TrelloAPIError;
				console.error(error);
			}
		},
	};

	boards = {
		client: this as TrelloClient,
		async getCards(boardId: string) {
			const url = new URL(`${boardId}/.json`, "https://trello.com/b/");
			url.searchParams.set("cards", "visible");
			try {
				const data = await this.client.fetchApi(url.toString(), "GET");
				if (!data.ok) {
					throw new TrelloAPIError(`Failed fetch board cards: ${data.statusText}`);
				}

				return (await data.json())["cards"] as TrelloCard[];
			} catch (err: unknown) {
				const error = err as TrelloAPIError;
				console.error(error);
			}
		},
	};
}
