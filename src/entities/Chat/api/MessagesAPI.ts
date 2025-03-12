/* eslint-disable @typescript-eslint/no-base-to-string */
// import { http } from "@/shared/api";
import store from "@/app/store";
import { WSTransport } from "@/shared/api/ws";

const wsUrl = "wss://ya-praktikum.tech/ws/chats";

export class MessagesAPI {
	private wsTransport: WSTransport;

	private callback: (messages: any) => void;

	constructor(userId: number, chatId: number, token: string, callback: any) {
		this.wsTransport = new WSTransport(`${wsUrl}/${userId}/${chatId}/${token}`);
		// Добавить коллбек функцию для привязки функционала при получении сообщений
		this.callback = callback;
		this.connect();
	}

	// protected async getToken(chatId: number | string): Promise<string> {
	// 	const { token } = await userApiInstance.post(`/chats/token/${chatId}`);
	// 	return token;
	// }

	public connect() {
		// console.log("WS API: Begin ws conection");
		// this.ws.on("message", callback)

		const messagesHandler = this._receiveMessages.bind(this);
		// console.log("messagesHandler:", messagesHandler);
		this.wsTransport.on(WSTransport.EVENTS.MESSAGE, messagesHandler);

		this.wsTransport
			.connect()
			.then(() => {
				// console.log("WS API: Connected");
				// Из примера: Получаем все сообщения при подключении
				this.wsTransport.send({ content: "0", type: "get old" });
			})
			.catch((error) => {
				console.error(error);
			});
	}

	public addMessage(message: string) {
		this.wsTransport.send({
			content: message,
			type: "message",
		});

		// const newMessage = { message, time: new Date(), userId: store.getState().user.id };
		// store.getState().currentChat.push(newMessage);
		// this.wsTransport.send({ content: "0", type: "get old" });
		store.emit("updateMessages", message);
	}

	private _receiveMessages(data: {
		content: string;
		time: string;
		user_id: string;
		[key: string]: any;
	}) {
		const convert = (message: any) => ({
			message: message.content,
			time: new Date(message.time),
			userId: message.user_id,
		});
		const messages = Array.isArray(data)
			? data.map((message) => convert(message))
			: [convert(data)];

		// console.log("received messages", messages);
		store.setMessages("currentChat.messages", messages);
		this.callback(messages);
		// console.log("this.callback", this.callback);
	}

	// private _receiveAllMessages(data: any) {
	// 	const messages = data;

	// 	// this.wsTransport.send(
	// 	// 	JSON.stringify({
	// 	// 		content: "0",
	// 	// 		type: "get old",
	// 	// 	}),
	// 	// );

	// 	this.wsTransport.on("message", this.callback(messages));

	// 	console.log("received messages", messages);
	// 	store.setMessages("currentChat.messages", messages);
	// 	this.callback(messages);
	// }

	public getMessages() {
		this.wsTransport.getChatMessages();
	}

	public sendAndGetMessages() {
		this.addMessage("test");
		this.getMessages();
	}
}
