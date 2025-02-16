import { BaseApi, http } from "@/shared/api";
const userApiInstance = new http<any>("https://ya-praktikum.tech/api/v2");

type TUser = {
	id: string;
	first_name: string;
	second_name: string;
	display_name: string;
	phone: string;
	login: string;
	avatar: string;
	email: string;
};

// interface IChatApi {
// 	signIn: (data: { login: string; password: string }) => Promise<string | { reason: string }>;
// 	getUserInfo: () => Promise<TUser>;
// }

export default class UserAPI extends BaseApi {
	// Set user cookie
	protected async signIn(data: {
		login: string;
		password: string;
	}): Promise<"OK" | { reason: string }> {
		const response = await userApiInstance.post("/auth/signin", { data }); // userId

		if (response.reason == "User already in system") {
			return "OK";
		}

		return response;
		// RouteManagement.go("/chats");
	}

	protected async getUserInfo(): Promise<TUser> {
		const response = await userApiInstance.get("/auth/user");
		return response;
	}
}
