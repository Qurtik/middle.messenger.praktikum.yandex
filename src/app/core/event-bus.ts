// interface IEventBus {
// 	[key: string]: (callback: Event)[];
// }
export type EventCallback = (...args: any[]) => void;

export default class EventBus {
	// private listeners: IEventBus;
	private listeners: Record<string, EventCallback[]>;

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: EventCallback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);
	}

	off(event: string, callback: EventCallback) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
	}

	emit(event: string, ...args: unknown[]) {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event].forEach((listener) => {
			listener(...args);
		});
	}
}
