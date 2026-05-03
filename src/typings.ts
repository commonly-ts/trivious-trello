export enum TrelloRatelimitErrorType {
	API_TOKEN = "API_TOKEN_LIMIT_EXCEEDED",
	API_KEY = "API_KEY_LIMIT_EXCEEDED",
}

export interface CreateAttachmentOnCardQueryParameters {
	/**
	 * The name of the attachment. Max length 256.
	 */
	name?: string;
	/**
	 * The file to attach, as multipart/form-data
	 * @format `binary`
	 */
	file?: string;
	/**
	 * The mimeType of the attachment. Max length 256
	 */
	mimeType?: string;
	/**
	 * A URL to attach. Must start with `http://` or `https://`
	 */
	url?: string;
	/**
	 * Determines whether to use the new attachment as a cover for the Card.
	 * @Default `false`
	 */
	setCover?: boolean;
}

export interface CreateCardQueryParameters {
	/**
	 * The name for the card
	 */
	name?: string;
	/**
	 * The description for the card
	 */
	desc?: string;
	/**
	 * The position of the new card. `top`, `bottom`, or a positive float
	 */
	pos?: "bottom" | "top" | number;
	/**
	 * A due date for the card
	 * @format `date`
	 */
	due?: string | null;
	/**
	 * The start date of a card, or null
	 * @nullable
	 * @format `date`
	 */
	start?: string;
	/**
	 * Whether the status of the card is complete
	 */
	dueComplete?: boolean;
	/**
	 * The ID of the list the card should be created in
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idList?: TrelloID;
	/**
	 * Comma-separated list of member IDs to add to the card
	 */
	idMembers?: TrelloID;
	/**
	 * Comma-separated list of label IDs to add to the card
	 */
	idLabels?: TrelloID;
	/**
	 * A URL starting with `http://` or `https://`. The URL will be attached to the card upon creation.
	 * @format `url`
	 */
	urlSource?: string;
	/**
	 * @format `binary`
	 */
	fileSource?: string;
	/**
	 * The mimeType of the attachment. Max length 256
	 */
	mimeType?: string;
	/**
	 * The ID of a card to copy into the new card
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idCardSource?: TrelloID;
	/**
	 * If using `idCardSource` you can specify which properties to copy over. `all` or comma-separated list of:
	 *
	 * `attachments,checklists,customFields,comments,due,start,labels,members,start,stickers`
	 */
	keepFromSource?: string;
	/**
	 * For use with/by the Map View
	 */
	address?: string;
	/**
	 * For use with/by the Map View
	 */
	locationName?: string;
	/**
	 * For use with/by the Map View. Should take the form latitude,longitude
	 */
	coordinates?: string | null;
	/**
	 * For displaying cards in different ways based on the card name.
	 * Board cards must have a name that is a link to a Trello board.
	 * Mirror cards must have a name that is a link to a Trello card.
	 * @nullable
	 * @values `separator`, `board`, `mirror`, `link`
	 */
	cardRole?: string;
}

type CoverBase = {
	brightness: "dark" | "light";
	size?: "normal" | "full";
};

type CoverColor = {
	color: TrelloBaseColour;
	url?: never;
	idAttachment?: never;
};

type CoverUrl = {
	url: string;
	color?: never;
	idAttachment?: never;
};

type CoverAttachment = {
	idAttachment: TrelloID;
	color?: never;
	url?: never;
};

type CoverNone = {
	color?: never;
	url?: never;
	idAttachment?: never;
};

export interface UpdateCardQueryParameters {
	/**
	 * The new name for the card
	 */
	name?: string;
	/**
	 * The new description for the card
	 */
	desc?: string;
	/**
	 * Whether the card should be archived (closed: true)
	 */
	closed?: boolean;
	/**
	 * Comma-separated list of member IDs
	 * @style `form`
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idMembers?: TrelloID;
	/**
	 * The ID of the image attachment the card should use as its cover, or null for none
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idAttachmentCover?: TrelloID;
	/**
	 * The ID of the list the card should be in
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idList?: TrelloID;
	/**
	 * Comma-separated list of label IDs
	 * @style `form`
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idLabels?: TrelloID[];
	/**
	 * The ID of the board the card should be on
	 * @pattern `^[0-9a-fA-F]{24}$`
	 */
	idBoard?: TrelloID;
	/**
	 * The position of the card in its list. `top`, `bottom`, or a positive float
	 */
	pos?: "bottom" | "top" | number;
	/**
	 * When the card is due, or `null`
	 * @nullable
	 * @format `date`
	 */
	due?: string;
	/**
	 * The start date of a card, or `null`
	 * @nullable
	 * @format `date`
	 */
	start?: string;
	/**
	 * Whether the status of the card is complete
	 */
	dueComplete?: boolean;
	/**
	 * Whether the member is should be subscribed to the card
	 */
	subscribed?: boolean;
	/**
	 * For use with/by the Map View
	 */
	address?: string;
	/**
	 * For use with/by the Map View
	 */
	locationName?: string;
	/**
	 * For use with/by the Map View. Should be latitude,longitude
	 */
	coordinates?: string;
	/**
	 * Updates the card's cover
	 *
	 * `brightness` can be sent alongside any of the other parameters, but all of the other parameters are mutually exclusive;
	 * you can not have the cover be a `color` and an `idAttachment` at the same time.
	 *
	 * On the brightness options, setting it to light will make the text on the card cover dark:
	 *
	 * And vice versa, setting it to dark will make the text on the card cover light:
	 *
	 * @property `color` Makes the cover a solid color.
	 * @property `brightness` Determines whether the text on the cover should be dark or light.
	 * @property `url` Used if making an image the cover. Only Unsplash URLs work.
	 * @property `idAttachment` Used if setting an attached image as the cover.
	 * @property `size` Determines whether to show the card name on the cover, or below it.
	 */
	cover?:
		| (CoverBase & CoverColor)
		| (CoverBase & CoverUrl)
		| (CoverBase & CoverAttachment)
		| (CoverBase & CoverNone);
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
