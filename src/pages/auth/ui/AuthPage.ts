//@ts-check

import App, { PAGES, INPUT_RULES } from "@/app";
import Block from "@/app/core/Block";
import { Card, Input, Button } from "@/shared/ui";

interface IProps {
	AppInstance: App;
	Card?: Block | Block[];
	Body?: Block | Block[];
	Actions?: Block | Block[];
}

export class AuthPage extends Block {
	constructor(props?: IProps) {
		super({
			...props,
			Card: new Card({
				title: "Авторизация",
				class: "auth-page",
				Body: [
					new Input({
						label: "Почта",
						name: "email",
						value: "vladislav.selezov@yandex.ru",
						onBlur: (e) => {
							const input = e.target;
							const rules = fieldRules[input.name];
							props.AppInstance.isValidate(input, rules);
						},
					}),
					new Input({
						label: "Пароль",
						name: "password",
						required: true,
						onBlur: (e) => {
							const input = e.target;
							const rules = fieldRules[input.name];

							// const isValid = this.isValidate(input.value, rules);
							props.AppInstance.isValidate(input, rules);
							// this.setInputValidity(input, isValid);
						},
					}),
				],
				Actions: [
					new Button({
						onClick: (e: Event) => {
							props.AppInstance.submit("auth-page-form", fieldRules);
							// props.AppInstance.changePage(PAGES.CHAT);
							// const form = document.getElementById("auth-page-form") as HTMLFormElement;
							// form.submit();
						},
						text: "Войти",
						class: "goToChatsBtn",
					}),
					new Button({
						onClick: (e) => {
							console.log(e);
							props.AppInstance.changePage(PAGES.REGISTRATION);
						},
						text: "Зарегистрироваться",
						class: "goToRegisterBtn",
					}),
				],
			}),
		});
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			password: [INPUT_RULES.PASSWORD],
		};
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

	protected override render(): string {
		return `
		<form id="auth-page-form" class="auth-page" action="/apply/" method="GET">
			{{{Card}}}
		</form>
		`;
	}
}
