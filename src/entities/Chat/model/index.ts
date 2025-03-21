// import { connect } from "@/app/stores";
import store from "@/app/store";
import ChatAPI from "../api";
// import { MessagesAPI } from "./../api/MessagesAPI";

export default class Chat extends ChatAPI {
	public state = store.getState();

	public ws: any;

	public async createChat(title: string): Promise<boolean> {
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
		this.ws.getMessages();
	}

	public sendMessages(message: string) {
		this.ws.addMessage(message);
	}

	public async addUser(chatId: number, userId: number) {
		console.log("chatId:", chatId);
		const users: number[] = [];
		users[0] = userId;

		try {
			await this.addUserToChat(chatId, users);
		} catch (error) {
			alert(error);
		}
	}

	public async deleteUser(chatId: number, userId: number) {
		const users: number[] = [];
		users[0] = userId;

		try {
			await this.deleteUserFromChat(chatId, users);
		} catch (error) {
			alert(error);
		}
	}
}
