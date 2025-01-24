import Handlebars from "handlebars";

import { ChatPage } from "../pages/chat";
import "../pages/chat/ui/ChatPage.pcss";

import { ProfilePage } from "../pages/profile";
import "../pages/profile/ui/ProfilePage.pcss";

import { AuthPage } from "../pages/auth";
import "../pages/auth/ui/AuthPage.pcss";

import { RegistrationPage } from "../pages/register";
import "../pages/register/ui/RegistrationPage.pcss";

import { NotFoundPage, ServerErrorPage } from "../pages/System";
import "../pages/System/404/ui/NotFoundPage.pcss";
import "../pages/System/505/ui/ServerErrorPage.pcss";

import { Input, Button, ModalButton, Card, Modal } from "../shared/ui";

// import "../shared/ui/Input/Input.pcss";
import "../shared/ui/Button/Button.pcss";
import "../shared/ui/Card/Card.pcss";
import "../shared/ui/Modal/Modal.pcss";

import "../shared/ui/Input/TextField.pcss";

// import "../style.pcss";

import { LeftMenu } from "../widgets/left-menu";
import "../widgets/left-menu/ui/LeftMenu.pcss";

Handlebars.registerPartial("Input", Input);
Handlebars.registerPartial("Button", Button);
Handlebars.registerPartial("ModalButton", ModalButton);
Handlebars.registerPartial("Card", Card);
Handlebars.registerPartial("LeftMenu", LeftMenu);
Handlebars.registerPartial("Modal", Modal);

Handlebars.registerHelper("eq", function (a, b) {
	return a === b;
});

export default class App {

	constructor() {
		this.state = {
			currentPage: "authPage",
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

		document.addEventListener("click", attachedEventListenerToggleModal);
	}

	render() {
		let template;

		if (this.state.currentPage === "chatPage") {
			template = Handlebars.compile(ChatPage);
			this.appElement.innerHTML = template();
		} else if (this.state.currentPage === "profilePage") {
			template = Handlebars.compile(ProfilePage);
			this.appElement.innerHTML = template({ userData: this.state.userData });
		} else if (this.state.currentPage === "authPage") {
			template = Handlebars.compile(AuthPage);
			this.appElement.innerHTML = template();
		} else if (this.state.currentPage === "registrationPage") {
			template = Handlebars.compile(RegistrationPage);
			this.appElement.innerHTML = template();
		} else if (this.state.currentPage === "notFoundPage") {
			template = Handlebars.compile(NotFoundPage);
			this.appElement.innerHTML = template();
		} else if (this.state.currentPage === "serverErrorPage") {
			template = Handlebars.compile(ServerErrorPage);
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

			const avatarImage = document.querySelector(".avatar-image");
			const avatarUpload = document.querySelector(".avatar-upload");
			avatarImage.addEventListener("click", function () {
				avatarUpload.click();
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

	// eventListenerModal() {
	// 	console.log("eventListenerModal");
	// 	document.addEventListener("click", toggleModal);

	// 	function toggleModal(event) {
	// 		console.log("event:");
	// 		console.log(event);
	// 		// Проверяем, был ли клик на элементе, который нам интересен
	// 		if (event.target.classList.contains("modal_toggle")) {
	// 			const idModal = event.target.getAttribute("data-id-modal");
	// 			// const modalId = event.target.dataset.modal; // Если есть data атрибут
	// 			const modal = document.getElementById(idModal);
	// 			modal.classList.toggle("modal_active");
	// 		}
	// 	}
	// }
}

function attachedEventListenerToggleModal(event) {
	// Проверяем, был ли клик на элементе, который нам интересен
	if (event.target.classList.contains("modal_toggle")) {
		const idModal = event.target.getAttribute("data-id-modal");
		// const modalId = event.target.dataset.modal; // Если есть data атрибут
		const modal = document.getElementById(idModal);
		modal.classList.toggle("modal_active");
	}
}
