import Handlebars from "handlebars";
import { ChatPage } from "../pages/chat";
import { ProfilePage } from "../pages/profile";

import { AuthPage } from "../pages/auth";
import "../pages/auth/ui/AuthPage.pcss";

import { RegistrationPage } from "../pages/register";
import "../pages/register/ui/RegistrationPage.pcss";

import { Input, Button, Card, Modal } from "../shared/ui";

import "../shared/ui/Input/Input.pcss";
import "../shared/ui/Button/Button.pcss";
import "../shared/ui/Card/Card.pcss";
import "../shared/ui/Modal/Modal.pcss";

// import "../style.pcss";

import { ChatList } from "../widgets/chat-list";

Handlebars.registerPartial("Input", Input);
Handlebars.registerPartial("Button", Button);
Handlebars.registerPartial("Card", Card);
Handlebars.registerPartial("ChatList", ChatList);
Handlebars.registerPartial("Modal", Modal);

// Handlebars.registerHelper("bold", function (options) {
// 	return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
// });

export default class App {
	constructor() {
		this.state = {
			currentPage: "chatPage",
			userData: {
				email: "vladislav@yandex.ru",
				login: "svladislav",
				name: "Владислав",
				surname: "Селезов",
				nickname: "Владислав",
				phoneNumber: "+7 123 456 78 90",
			},
		};

		this.appElement = document.getElementById("app");
	}

	render() {
		let template;

		if (this.state.currentPage === "chatPage") {
			console.log("12312");
			template = Handlebars.compile(ChatPage);
			this.appElement.innerHTML = template({ param1: 123 });
		} else if (this.state.currentPage === "profilePage") {
			template = Handlebars.compile(ProfilePage);
			this.appElement.innerHTML = template({ userData: this.state.userData });
		} else if (this.state.currentPage === "authPage") {
			template = Handlebars.compile(AuthPage);
			this.appElement.innerHTML = template();
		} else if (this.state.currentPage === "registrationPage") {
			template = Handlebars.compile(RegistrationPage);
			this.appElement.innerHTML = template();
		}
		this.attachEventListeners();
	}

	attachEventListeners() {
		if (this.state.currentPage === "chatPage") {
			const goToProfile = document.querySelector(".goToProfileBtn");

			goToProfile.addEventListener("click", (e) => {
				e.preventDefault();
				this.state.currentPage = "profilePage";
				this.render();
			});
		}
		if (this.state.currentPage === "profilePage") {
			const goToProfile = document.querySelector(".goToChatsBtn");

			goToProfile.addEventListener("click", (e) => {
				e.preventDefault();
				this.state.currentPage = "chatPage";
				this.render();
			});
		}
		if (this.state.currentPage === "authPage") {
			const goToRegister = document.querySelector(".goToRegisterBtn");
			const goToChats = document.querySelector(".goToChatsBtn");

			goToRegister.addEventListener("click", (e) => {
				e.preventDefault();
				this.state.currentPage = "registrationPage";
				this.render();
			});

			goToChats.addEventListener("click", (e) => {
				e.preventDefault();
				this.state.currentPage = "chatPage";
				this.render();
			});
		}
		if (this.state.currentPage === "registrationPage") {
			const goToChats = document.querySelector(".goToChatsBtn");

			goToChats.addEventListener("click", (e) => {
				e.preventDefault();
				this.state.currentPage = "chatPage";
				this.render();
			});
		}
	}
}
