// import { Router } from "@/app/router";
// const router = new Router();

import store from "@/app/stores";

import UserAPI from "../api";

export default class User extends UserAPI {
	public async isUserAuthorized(): Promise<boolean> {
		// Проверка авторизован ли пользователь - локально
		const { user } = store.getState();
		if (user) {
			console.log("Пользователь авторизован - локально");
			return true;
		} else {
			// Если локальная проверка непрошла, отправляем запрос на сервер
			const response = await this.getUserInfo();

			if ("id" in response) {
				console.log("Пользователь авторизован - запрос на сервер");
				return true;
			}
			return false;
		}
	}

	// async loginAsync(data: any): Promise<void> {
	// 	try {
	// 		const isSignedIn = await this.signIn(data);
	// 		if (!!isSignedIn) {
	// 			const userData = await this.getUserInfo();
	// 			console.log(userData);
	// 			store.set("user", userData);
	// 		}
	// 	} catch (err) {
	// 		console.error("Ошибка при выполнеии запроса loginAsync", err);
	// 	}
	// }

	public async login(data: { login: string; password: string }): Promise<boolean> {
		try {
			const signInStatus = await this.signIn(data);

			if (signInStatus !== "OK") {
				throw new Error("Authorization error: Invalid credentials");
			}

			const userData = await this.getUserInfo();
			store.set("user", userData);

			return true;
		} catch (error) {
			console.error("Login failed", error);
			throw new Error(error instanceof Error ? error.message : "Unknown authorization error");
		}
	}

	// return new Promise((resolve, reject) => {
	// 	this.signIn(data)
	// 		.then((isSignedIn) => {
	// 			console.log("isSignedIn");
	// 			console.log(isSignedIn);
	// 			if (isSignedIn === "OK") {
	// 				// Данные передаются через cookies
	// 				this.getUserInfo()
	// 					.then((userData) => {
	// 						console.log("GetUserInfo");
	// 						console.log(userData);
	// 						store.set("user", userData);
	// 						setTimeout(() => {
	// 							resolve(true);
	// 						}, 2500);
	// 					})
	// 					.catch(() => {
	// 						console.log("error");
	// 						throw new Error("Ошибка авторизации");
	// 					});
	// 			} else {
	// 				throw new Error("Ошибка авторизации");
	// 			}
	// 			// TODO: в чем разница если в промисе вернуть throw new Error или reject
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 			reject(err);
	// 		});
	// });
	// }
}
