//@ts-check

import App from "@/app";
import Block from "@/app/core/Block";
import { Card, Input, Button } from "@/shared/ui";
import { submit, INPUT_RULES, isValidate } from "@/shared/lib/validate";

import { Router } from "@/app/router";
const router = new Router();

import "./AuthPage.pcss";

interface IProps {
	AppInstance?: App;
	Card?: Block | Block[];
	Body?: Block | Block[];
	Actions?: Block | Block[];
	onBlur?: (event: Event) => void;
}

export class AuthPage extends Block<IProps> {
	private _fieldRules: Record<string, INPUT_RULES[]>;

	constructor(props?: IProps) {
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			password: [INPUT_RULES.PASSWORD],
		};

		super({
			...props,
			// titleTest: "TitleTest",
			Card: new Card({
				title: "Авторизация",
				class: "auth-page",
				Body: [
					new Input({
						label: "Почта",
						name: "email",
						value: "vladislav.selezov@yandex.ru",
						errorText: "Введите корретный email",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								if (props && props.AppInstance) {
									isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Пароль",
						name: "password",
						errorText:
							"Пароль состоит из 3-8 симоволов, минимум 1 цифра, минимум 1 заглавная буква",
						required: true,
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (!!input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								if (props && props.AppInstance) {
									isValidate(input, rules);
								}
							}
						},
					}),
				],
				Actions: [
					new Button({
						onClick: () => {
							console.log("props");
							console.log(props);
							submit("auth-page-form", this._fieldRules);
							if (props && props.AppInstance) {
								submit("auth-page-form", this._fieldRules);
							}
							// props.AppInstance.changePage(PAGES.CHAT);
							// const form = document.getElementById("auth-page-form") as HTMLFormElement;
							// form.submit();
						},
						text: "Войти",
						class: "goToChatsBtn",
					}),
					new Button({
						onClick: () => {
							router.go("/register");
							// if (props && props.AppInstance) {
							// 	// props.AppInstance.changePage(PAGES.REGISTRATION);
							// }
							// const
						},
						text: "Зарегистрироваться",
						class: "goToRegisterBtn",
					}),
				],
			}),
		});
		this._fieldRules = fieldRules;
	}

	// public setInputValidity(el: HTMLElement, isValid: boolean): void {
	// 	if (isValid) {
	// 		el.style.borderColor = "green";
	// 	} else {
	// 		el.style.borderColor = "red";
	// 	}
	// }

	// public isValidate(el: HTMLInputElement, rules: INPUT_RULES[]): boolean {
	// 	const value = el.value;
	// 	for (const rule of rules) {
	// 		const regex = new RegExp(rule);
	// 		const isValid = regex.test(value);

	// 		this.setInputValidity(el, isValid);
	// 		if (!isValid) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	// private _submit(idForm: string): void {
	// 	const applicantForm = document.getElementById(idForm);
	// 	const formFields = applicantForm.querySelectorAll("input");

	// 	let formResult = {};

	// 	let isFormValid: boolean = true;
	// 	formFields.forEach((element) => {
	// 		const inputValue = element.value;
	// 		const inputName = element.name;
	// 		const rules = fieldRules[inputName];

	// 		formResult[inputName] = inputValue;

	// 		const result = this.isValidate(element, rules);

	// 		this.setInputValidity(element, result);

	// 		if (!result) {
	// 			isFormValid = false;
	// 		}
	// 	});

	// 	if (isFormValid) {
	// 		console.log("formResult");
	// 		console.log(formResult);
	// 		applicantForm.submit();
	// 	}
	// }

	// public setInputValidity(el: HTMLElement, isValid: boolean): void {
	// 	const parent: HTMLElement = el.parentElement!;
	// 	const errorDescription = parent.querySelector(".input-error-description");

	// 	if (isValid) {
	// 		el.style.borderColor = "green";
	// 		errorDescription?.classList.remove("input-error-description-active");
	// 	} else {
	// 		el.style.borderColor = "red";
	// 		errorDescription?.classList.add("input-error-description-active");
	// 	}
	// }

	// public isValidate(el: HTMLInputElement, rules: INPUT_RULES[]): boolean {
	// 	if (!rules) {
	// 		return true;
	// 	}

	// 	const value = el.value;
	// 	for (const rule of rules) {
	// 		const regex = new RegExp(rule);
	// 		const isValid = regex.test(value);

	// 		this.setInputValidity(el, isValid);
	// 		if (!isValid) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	// public submit(idForm: string, formRules?: any): void {
	// 	const applicantForm = document.getElementById(idForm);
	// 	console.log(applicantForm);

	// 	if (applicantForm) {
	// 		const formFields = applicantForm.querySelectorAll("input");
	// 		const formResult: Record<string, string> = {};

	// 		let isFormValid: boolean = true;
	// 		formFields.forEach((element) => {
	// 			const inputValue = element.value;
	// 			const inputName = element.name;
	// 			formResult[inputName] = inputValue;

	// 			if (!!formRules) {
	// 				const rules: INPUT_RULES[] = formRules[inputName];
	// 				const result = this.isValidate(element, rules);
	// 				this.setInputValidity(element, result);

	// 				if (!result) {
	// 					isFormValid = false;
	// 				}
	// 			}
	// 		});

	// 		if (isFormValid) {
	// 			console.log("formResult");
	// 			console.log(formResult);
	// 			console.log("SUBMITED");
	// 			// applicantForm.submit();
	// 		}
	// 	} else {
	// 		throw new Error(`Form не найден по ид ${idForm}`);
	// 	}
	// }

	override render(): string {
		return `
		<form id="auth-page-form" class="auth-page" action="/apply/" method="GET">
		{{titleTest}}
			{{{Card}}}
		</form>
		`;
	}
}
