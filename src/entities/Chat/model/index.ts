import { BaseApi, http } from "@/shared/api";

const chatApiInstance = new http();

export default class ChatAPI extends BaseApi {
	create(): Promise<any> {
		return chatApiInstance.post("/", { title: "string" });
	}

	request() {
		// Здесь уже не нужно писать полный путь /api/v1/chats/
		return chatApiInstance.get("https://httpbin.org/get");
	}
}
