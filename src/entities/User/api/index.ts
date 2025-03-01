import { BaseApi, Http } from "@/shared/api";
import { IUserProfile, TRegisterUser } from "../types";
const userApiInstance = new Http<any>();

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
	}

	protected async getUserInfo(): Promise<TUser> {
		const response = await userApiInstance.get("/auth/user");

		// console.log("GetUserInfo:", response);

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		// console.log("No Error - getUserInfo");

		return response;
	}

	protected async signUp(data: TRegisterUser): Promise<{ login: string; password: string }> {
		const response = await userApiInstance.post("/auth/signup", { data });

		if ("id" in response) {
			return {
				login: data.login,
				password: data.password,
			};
		} else {
			throw new Error(response.reason);
		}
	}

	protected async logout(): Promise<boolean> {
		// Используются куки
		const response = await userApiInstance.post("/auth/logout");

		if (response) {
			return true;
		}
		return false;
	}

	protected async changePassword(data: {
		oldPassword: string;
		newPassword: string;
	}): Promise<"OK" | { reason: string }> {
		// try {
		const response = await userApiInstance.put("/user/password", { data });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	protected async changeProfile(data: IUserProfile): Promise<"OK" | { reason: string }> {
		const response = await userApiInstance.put("/user/profile", { data });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	protected async getResourse(path: string): Promise<File> {
		const response = await userApiInstance.get(`/resources/${path}`);
		return response;
	}

	public async changeAvatar(
		data: any,
	): Promise<{ avatar: string; [key: string]: any } | { reason: string }> {
		const response = await userApiInstance.put("/user/profile/avatar", { data });

		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}

	protected async getUserByLogin(login: string): Promise<
		{
			id: number;
			first_name: string;
			second_name: string;
			display_name: string;
			login: string;
			avatar: string;
		}[]
	> {
		const data = { login: login };
		console.log("data", data);
		const response = await userApiInstance.post(`/user/search`, { data });
		if ("reason" in response) {
			throw new Error(response.reason);
		}

		return response;
	}
}
