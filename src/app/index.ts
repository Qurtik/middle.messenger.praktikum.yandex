// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import store from "./store";
import { Router } from "./router";

import ChatPage from "../pages/chat";
import ProfilePage from "../pages/profile";
import AuthPage from "../pages/auth";
import RegistrationPage from "../pages/register";

// import { NotFoundPage, ServerErrorPage } from "../pages/System";
import "../pages/System/404/ui/NotFoundPage.pcss";
import "../pages/System/505/ui/ServerErrorPage.pcss";

import { useUser } from "@/entities/User";
const user = new useUser();

const router = new Router("#app");

export enum PAGES {
	DEFAULT = "/",
	AUTH = "/auth",
	CHAT = "/chats",
	PROFILE = "/profile",
	REGISTRATION = "/register",
	NOT_FOUND = "notFoundPage",
	SERVER_ERROR = "serverErrorPage",
}

export default class App {
	// state: IState;
	router: any;

	// public toggleModal(IdModal: string) {
	// 	const modal = document.getElementById(IdModal);
	// 	if (!!modal) {
	// 		modal.classList.toggle("modal_active");
	// 	}
	// }

	public async init() {
		// Создаем событие "updated" в шине
		store.on("updated", () => {
			console.log("STORE UPDATED");
		});
		// this.render();

		const isUserAuthorized = await user.isUserAuthorized();
		
		if (!isUserAuthorized) {
			router.use(PAGES.AUTH, AuthPage).start();
			router.go(PAGES.AUTH);
		}

		this.render();
 
		// user
		// 	.isUserAuthorized()
		// 	.then((isUserAuthorized) => {
		// 		console.log("isUserAuthorized:", isUserAuthorized);
		// 		if (!isUserAuthorized) {
		// 			router.go(PAGES.AUTH);
		// 		}
		// 	})
		// 	.catch(() => {
		// 		console.log("Пользователь не авторизован");
		// 	});
	}

	public render() {
		// public init() {
		router
			.use(PAGES.DEFAULT, AuthPage)
			// .use(PAGES.AUTH, AuthPage)
			.use(PAGES.CHAT, ChatPage)
			.use(PAGES.PROFILE, ProfilePage)
			.use(PAGES.REGISTRATION, RegistrationPage)
			.start();
	}
}
