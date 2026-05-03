export enum TrelloRatelimitErrorType {
	API_TOKEN = "API_TOKEN_LIMIT_EXCEEDED",
	API_KEY = "API_KEY_LIMIT_EXCEEDED",
}

export interface CreateAttachmentOnCardQueryParameters {
	name?: string;
	file?: string;
	mimeType?: string;
	url?: string;
	setCover?: boolean;
}

export interface CreateCardQueryParameters {
	name?: string;
	desc?: string;
	pos?: [string, number];
	due?: string;
	start?: string;
	dueComplete?: boolean;
	idMembers?: TrelloID[];
	idLabels?: TrelloID[];
	urlSource?: string;
	fileSOurce?: string;
	mimeType?: string;
	idCardSource?: TrelloID;
	keepFromSource?: string;
	address?: string;
	locationName?: string;
	coordinates?: string;
}

export interface UpdateCardQueryParameters {
	name?: string | null;
	desc?: string | null;
	closed?: boolean | null;
	idMembers?: TrelloID | null;
	idAttachmentCover?: TrelloID | null;
	idList?: TrelloID | null;
	idLabels?: TrelloID[] | null;
	idBoard?: TrelloID | null;
	pos?: "bottom" | "top" | number | null;
	due?: string | null;
	start?: string | null;
	dueComplete?: boolean | null;
	subscribed?: boolean | null;
	address?: string | null;
	locationName?: string | null;
	coordinates?: string | null;
	cover?: {
		color?: TrelloBaseColour;
		brightness: "dark" | "light";
		url?: string;
		idAttachment?: TrelloID;
		size?: "normal" | "full";
	} | null;
}

export type TrelloBaseColour =
	| "green"
	| "yellow"
	| "orange"
	| "red"
	| "purple"
	| "blue"
	| "sky"
	| "lime"
	| "pink"
	| "black";
export type TrelloColour =
	| "green"
	| "yellow"
	| "orange"
	| "red"
	| "purple"
	| "blue"
	| "sky"
	| "lime"
	| "pink"
	| "black"
	| "green_dark"
	| "yellow_dark"
	| "orange_dark"
	| "red_dark"
	| "purple_dark"
	| "blue_dark"
	| "sky_dark"
	| "lime_dark"
	| "pink_dark"
	| "black_dark"
	| "green_light"
	| "yellow_light"
	| "red_light"
	| "purple_light"
	| "blue_light"
	| "sky_light"
	| "lime_light"
	| "pink_light"
	| "black_light";
export type TrelloID = string;

export interface TrelloLabel {
	id: TrelloID;
	idBoard: TrelloID;
	name: string;
	color: TrelloColour;
}

export interface TrelloChecklist {
	id: TrelloID;
}

export interface TrelloCard {
	id: TrelloID;
	address: string;
	badges: {
		attachmentsByType: {
			trello: {
				board: number;
				card: number;
			};
		};
		location: boolean;
		votes: number;
		viewingMemberVoted: boolean;
		subscribed: boolean;
		fogbugz: string;
		checkItems: number;
		checkItemsChecked: number;
		comments: number;
		attachments: number;
		description: boolean;
		due: string;
		start: string;
		dueComplete: boolean;
	};
	checkItemStates: string[];
	closed: boolean;
	coordinates: string;
	creationMethod: string;
	dateLastActivity: string;
	desc: string;
	descData: {
		emoji: Record<string, string | number>;
	};
	due: string;
	dueReminder: string;
	idBoard: TrelloID;
	idChecklists: TrelloChecklist[];
	idLabels: TrelloID[];
	idList: TrelloID;
	idMembers: TrelloID[];
	idMembersVoted: TrelloID[];
	idShort: number;
	labels: TrelloLabel[];
	limits: {
		attachments: {
			perBoard: {
				status: string;
				disableAt: number;
				warnAt: number;
			};
		};
	};
	locationName: string;
	manualCoverAttachment: boolean;
	name: string;
	pos: number;
	shortLink: string;
	shortUrl: string;
	subscribed: boolean;
	url: string;
	cover: {
		color: TrelloColour;
		idUploadedBackground: boolean;
		size: string;
		brightness: string;
		isTemplate: boolean;
	};
}
