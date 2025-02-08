import ChatPage from "../pages/chat";
import "../pages/chat/ui/ChatPage.pcss";

import ProfilePage from "../pages/profile";
import "../pages/profile/ui/ProfilePage.pcss";

import AuthPage from "../pages/auth";
import "../pages/auth/ui/AuthPage.pcss";

import RegistrationPage from "../pages/register";
import "../pages/register/ui/RegistrationPage.pcss";

// import { NotFoundPage, ServerErrorPage } from "../pages/System";
import "../pages/System/404/ui/NotFoundPage.pcss";
import "../pages/System/505/ui/ServerErrorPage.pcss";

// import { http } from "../shared/api";

interface IUserData {
	email: string;
	login: string;
	name: string;
	surname: string;
	nickname: string;
	phoneNumber: string;
}

export const enum PAGES {
	AUTH = "authPage",
	CHAT = "chatPage",
	PROFILE = "profilePage",
	REGISTRATION = "registrationPage",
	NOT_FOUND = "notFoundPage",
	SERVER_ERROR = "serverErrorPage",
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum INPUT_RULES {
	EMAIL = "^[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\-\\.]+\\.[a-zA-Z]+$",
	PASSWORD = "^(?=.*[A-Z])(?=.*\\d).{8,40}$",
	LOGIN = "^(?=.*[a-zA-Z])[a-zA-Z0-9_\\-]{3,20}$",
	FIRST_NAME = "^[A-ZА-Я][a-zа-яё\\-]*$",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	SECOND_NAME = "^[A-ZА-Я][a-zа-яё\\-]*$",
	PHONE = "^\\+?\\d{10,15}$",
	MESSAGE = "^\\s*\\S.*+$",
}

interface IState {
	currentPage: PAGES;
	userData: IUserData;
}

export default class App {
	state: IState;

	appElement: HTMLElement;

	constructor() {
		this.state = {
			currentPage: PAGES.CHAT,
			userData: {
				email: "vladislav@yandex.ru",
				login: "svladislav",
				name: "Владислав",
				surname: "Селезов",
				nickname: "Владислав",
				phoneNumber: "+7 123 456 78 90",
			},
		};

		if (this.appElement !== null) {
			this.appElement = document.querySelector("#app")!;
		} else {
			throw new Error("Коневой эмент не найден");
		}

		console.log(`App element from constructor,`, this.appElement);

		// const testHttp = new http;
	}

	public toggleModal(IdModal: string) {
		const modal = document.getElementById(IdModal);
		if (!!modal) {
			modal.classList.toggle("modal_active");
		}
	}

	public changePage(pageName: PAGES): void {
		this.state.currentPage = pageName;
		console.log(this.state);
		this.render();
	}

	public render() {
		if (this.state.currentPage === PAGES.CHAT) {
			const page = new ChatPage({ AppInstance: this });
			this.appElement.replaceChildren(page.getContent());
		} else if (this.state.currentPage === PAGES.PROFILE) {
			const page = new ProfilePage({ AppInstance: this });
			this.appElement.replaceChildren(page.getContent());
		} else if (this.state.currentPage === PAGES.AUTH) {
			const page = new AuthPage({ AppInstance: this });
			this.appElement.replaceChildren(page.getContent());
		} else if (this.state.currentPage === PAGES.REGISTRATION) {
			const page = new RegistrationPage({ AppInstance: this });
			this.appElement.replaceChildren(page.getContent());
		}
		// else if (this.state.currentPage === PAGES.NOT_FOUND) {
		// 	template = Handlebars.compile(NotFoundPage);
		// 	this.appElement.innerHTML = template();
		// } else if (this.state.currentPage === PAGES.SERVER_ERROR) {
		// 	template = Handlebars.compile(ServerErrorPage);
		// 	this.appElement.innerHTML = template();
		// }
	}

	public setInputValidity(el: HTMLElement, isValid: boolean): void {
		if (isValid) {
			el.style.borderColor = "green";
		} else {
			el.style.borderColor = "red";
		}
	}

	public isValidate(el: HTMLInputElement, rules: INPUT_RULES[]): boolean {
		if (!rules) {
			return true;
		}

		const value = el.value;
		for (const rule of rules) {
			const regex = new RegExp(rule);
			const isValid = regex.test(value);

			this.setInputValidity(el, isValid);
			if (!isValid) {
				return false;
			}
		}
		return true;
	}

	public submit(idForm: string, formRules?: any): void {
		const applicantForm = document.getElementById(idForm);
		console.log(applicantForm);

		if (applicantForm) {
			const formFields = applicantForm.querySelectorAll("input");
			const formResult: Record<string, string> = {};

			let isFormValid: boolean = true;
			formFields.forEach((element) => {
				const inputValue = element.value;
				const inputName = element.name;
				formResult[inputName] = inputValue;

				if (!!formRules) {
					const rules: INPUT_RULES[] = formRules[inputName];
					const result = this.isValidate(element, rules);
					this.setInputValidity(element, result);

					if (!result) {
						isFormValid = false;
					}
				}
			});

			if (isFormValid) {
				console.log("formResult");
				console.log(formResult);
				console.log("SUBMITED");
				// applicantForm.submit();
			}
		} else {
			throw new Error(`Form не найден по ид ${idForm}`);
		}
	}
}
