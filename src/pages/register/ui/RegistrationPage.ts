import App, { PAGES } from "@/app";
import Block from "@/app/core";
import { Router } from "@/app/router";
import { INPUT_RULES, isValidate, submit } from "@/shared/lib/validate";
import { Card, Input, Button } from "@/shared/ui";

import { useUser, type TRegisterUser } from "@/entities/User";

const router = new Router();
const user = new useUser();

import "./RegistrationPage.pcss";
import { connect } from "@/app/core/hoc";

interface IProps {
	AppInstance: App;
	class?: string;
	Card?: Block;
}

const RegistrationPageState = connect(() => ({}));

class RegistrationPageBase extends Block {
	private _fieldRules: Record<string, INPUT_RULES[]>;

	constructor(props: IProps) {
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			login: [INPUT_RULES.LOGIN],
			first_name: [INPUT_RULES.FIRST_NAME],
			second_name: [INPUT_RULES.SECOND_NAME],
			phone: [INPUT_RULES.PHONE],
			password: [INPUT_RULES.PASSWORD],
		};
		super({
			...props,
			class: "register-page",
			Card: new Card({
				title: "Регистрация",
				Body: [
					new Input({
						label: "Почта",
						name: "email",
						errorText: "Введите корректный email",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Логин",
						name: "login",
						errorText: "от 3 до 20 символов, без спецсимволов",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Имя",
						name: "first_name",
						errorText:
							"Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Фамилия",
						name: "second_name",
						errorText:
							"Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Телефон",
						name: "phone",
						errorText: "от 10 до 15 символов, состоит из цифр, может начинается с плюса.",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Пароль",
						name: "password",
						errorText: "от 8 до 40 символов, обязательно заглавная буква и цифра.",
						onBlur: (e: Event) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name !== undefined) {
								const rules = this._fieldRules[input.name];
								// if (props) {
								isValidate(input, rules);
								// }
							}
						},
					}),
					new Input({
						label: "Повторите пароль",
						name: "password",
					}),
				],
				Actions: [
					new Button({
						class: "goToChatsBtn",
						text: "Зарегистрироваться",
						onClick: async () => {
							const result = submit("register-page-form", this._fieldRules) as TRegisterUser;
							if (result) {
								const isRegister = await user.register(result);

								if (isRegister) {
									router.go(PAGES.CHAT);
								}
							}
						},
					}),
				],
			}),
		});
		this._fieldRules = fieldRules;
	}

	override render(): string {
		return `
		<form id="register-page-form">
			<div class="{{class}}">
				{{{Card}}}
			</div>
		<form id="">
		`;
	}
}

export default RegistrationPageState(RegistrationPageBase);
