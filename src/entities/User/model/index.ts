import store from "@/app/store";
import UserAPI from "../api";
import { IUserProfile, TRegisterUser } from "../types";

export default class User extends UserAPI {
	state = store.getState();

	public async isUserAuthorized(): Promise<boolean> {
		// Проверка авторизован ли пользователь - локально
		const { user } = store.getState();
		// console.log("user:", user);

		if (user && "id" in user) {
			// console.log("Пользователь авторизован - локально");
			return true;
		} else {
			try {
				// const response = 
				await this.getUser();
				// console.log("getUser-response=", response);
				return true;
			} catch (error) {
				alert(error);
				console.error(error);
				return false;
			}
			// Если локальная проверка непрошла, отправляем запрос на сервер
			// const response = await this.getUserInfo();
		}
	}

	// public async getUser(): Promise<boolean> {
	// 	const response = await
	// 	return true;
	// }

	public async getUser(): Promise<boolean> {
		try {
			const userData = await this.getUserInfo();
			store.set("user", userData);
			console.log("Пользователь авторизован - запрос на сервер");

			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public async login(data: { login: string; password: string }): Promise<boolean> {
		try {
			const signInStatus = await this.signIn(data);

			if (signInStatus !== "OK") {
				throw new Error("Authorization error: Invalid credentials");
			}

			await this.getUser();

			return true;
		} catch (error) {
			// console.error("Login failed", error);
			throw new Error(error instanceof Error ? error.message : "Unknown authorization error");
		}
	}

	public async register(data: TRegisterUser): Promise<boolean> {
		try {
			await this.userLogout();

			const response = await this.signUp(data);

			if (response) {
				await this.login(response);
				return true;
			}
			return false;
		} catch (error) {
			alert(error);
			throw new Error(error instanceof Error ? error.message : error);
		}
	}

	public async userLogout() {
		try {
			if (await this.isUserAuthorized()) {
				await this.logout();
			}
		} catch (error) {
			throw new Error("Ошибка при выходе из системы");
		}
	}

	public async userChangePassword(oldPassword: string, newPassword: string): Promise<boolean> {
		try {
			const data = { oldPassword, newPassword };
			// return await this.changePassword(data);
			await this.changePassword(data);
			return true;
		} catch (error) {
			alert(error);
			return false;
		}
	}

	public async userChangeProfile(data: IUserProfile): Promise<boolean> {
		try {
			await this.changeProfile(data);
			alert("Сохранено");
			return true;
		} catch (error) {
			alert(error);
			return false;
		}
	}
}
