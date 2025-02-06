interface IEventBus {
	[key: string]: Function[];
}

export default class EventBus {
	private listeners: IEventBus;

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: Function) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);
	}

	off(event: string, callback: Function) {
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
