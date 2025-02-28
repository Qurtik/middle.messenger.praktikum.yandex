import { Http } from "@/shared/api";
const userApiInstance = new Http<any>();

export default class ChatAPI {
	protected async create(data: string): Promise<{ id: string }> {
		const response = await userApiInstance.post("/chats", { data });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	protected async request(): Promise<{
		id: string;
		title: string;
		avatar: any;
		created_by: number;
		unread_count: number;
		last_message: any;
	}> {
		const response = await userApiInstance.get("/chats");

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	// protected
	public async getToken(chatId: number): Promise<string> {
		const { token } = await userApiInstance.post(`/chats/token/${chatId}`);
		return token;
	}

	protected async addUserToChat(chatId: number, users: number[]): Promise<boolean> {
		const response = await userApiInstance.put(`/chats/users`, { data: { chatId, users } });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	protected async deleteUserFromChat(chatId: number, users: number[]): Promise<boolean> {
		const response = await userApiInstance.delete(`/chats/users`, { data: { chatId, users } });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}
}
