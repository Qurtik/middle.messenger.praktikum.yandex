// import { connect } from "@/app/stores";
import store from "@/app/store";
import ChatAPI from "../api";
// import { MessagesAPI } from "./../api/MessagesAPI";

export default class Chat extends ChatAPI {
	public state = store.getState();

	public ws: any;

	public async createChat(title: string): Promise<boolean> {
		// console.log("title", title);
		try {
			await this.create(title);
			alert("Сохранено");
			return true;
		} catch (error) {
			alert(error);
			throw new Error(error instanceof Error ? error.message : error);
		}
	}

	public async getUserChats(): Promise<boolean> {
		try {
			const response = await this.request();
			store.set("chats", response);

			return true;
		} catch (error) {
			alert(error);
			throw new Error(error instanceof Error ? error.message : error);
		}
	}

	public getMessages() {
		console.log("SendMessage");
		// console.log(this.ws);
		this.ws.getMessages();
	}

	public sendMessages(message: string) {
		this.ws.addMessage(message);
	}

	public test(userId, chatId) {
		console.log("test");
		// console.log(this.ws);
		console.log(userId, chatId);
		this.ws.sendAndGetMessages();
	}
}
