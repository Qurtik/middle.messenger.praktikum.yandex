import EventBus from "@/app/core/event-bus";

export class WSTransport extends EventBus {
	static EVENTS = {
		MESSAGE: "message",
		ERROR: "error",
		CONNECTED: "connected",
		CLOSE: "close",
	};

	private socket?: WebSocket;

	private pingInterval?: ReturnType<typeof setInterval>;

	private readonly pingIntervalTime = 30000; // 30 секунд интервал между пингами

	private url: string;

	constructor(url: string) {
		super();
		this.url = url;
	}

	public send(data: string | number | object) {
		if (!this.socket) {
			throw new Error("Socket is not connected");
		}
		this.socket.send(JSON.stringify(data));
	}

	public getChatMessages() {
		if (!this.socket) {
			throw new Error("Socket is not connected");
		}

		const metaInfo = {
			content: "0",
			type: "get old",
		};

		this.send(metaInfo);
	}

	public connect(): Promise<void> {
		if (this.socket) {
			throw new Error("The socket is already connected");
		}

		this.socket = new WebSocket(this.url);

		this._subscribe(this.socket);
		this._setupPing();

		return new Promise((resolve, reject) => {
			this.on(WSTransport.EVENTS.ERROR, reject);
			this.on(WSTransport.EVENTS.CONNECTED, () => {
				this.off(WSTransport.EVENTS.ERROR, reject);
				console.log("Соединение установлено, промисс выполнен");
				resolve();
			});
		});
	}

	public close() {
		this.socket?.close();
		clearInterval(this.pingInterval);
	}

	private _setupPing() {
		this.pingInterval = setInterval(() => {
			this.send({ type: "ping" });
		}, this.pingIntervalTime);

		this.on(WSTransport.EVENTS.CLOSE, () => {
			clearInterval(this.pingInterval);
			this.pingInterval = undefined;
			console.log("CLose connection");
		});
	}

	private _subscribe(socket: WebSocket) {
		socket.addEventListener("open", () => {
			this.emit(WSTransport.EVENTS.CONNECTED);
		});

		socket.addEventListener("close", () => {
			this.emit(WSTransport.EVENTS.CLOSE);
		});

		socket.addEventListener("error", (e) => {
			this.emit(WSTransport.EVENTS.ERROR, e);
		});

		socket.addEventListener("message", (message) => {
			try {
				const data = JSON.parse(message.data);
				if (["pong", "user connected"].includes(data?.type)) {
					return;
				}
				this.emit(WSTransport.EVENTS.MESSAGE, data);
			} catch (error) {
				// Ошибки разбора JSON
			}
		});
	}
}
