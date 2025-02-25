export type IEvents = {
	[eventName: string]: (event: Event) => void;
};
