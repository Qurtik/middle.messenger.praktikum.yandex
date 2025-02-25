import App, { PAGES } from "@/app";
import Block from "@/app/core/Block";
import { Card, Input, Button } from "@/shared/ui";
import { submit, INPUT_RULES, isValidate } from "@/shared/lib/validate";

import { Router } from "@/app/router";

// import store, { StoreEvents } from "@/app/stores";

const router = new Router();

import "./AuthPage.pcss";

import { useUser } from "@/entities/User";
import { connect } from "@/app/core/hoc";
const user = new useUser();

interface IProps {
	AppInstance?: App;
	Card?: Block | Block[];
	Body?: Block | Block[];
	Actions?: Block | Block[];
	onBlur?: (event: Event) => void;
}

const AuthPageState = connect((state) => ({
	user: state.user,
	titleTest: state.titleTest,
}));

class AuthPageBase extends Block {
	private _fieldRules: Record<string, INPUT_RULES[]>;

	constructor(props?: IProps) {
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			password: [INPUT_RULES.PASSWORD],
		};
		
		super({
			...props,
			Card: new Card({
				title: "Авторизация",
				class: "auth-page",
				Body: [
					new Input({
						label: "Логин",
						name: "login",
						// value: "vladislav.selezov@yandex.ru",
						value: "testya12345",
						errorText: "Введите корретный email",
						onBlur: (e: Event) => {
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
						value: "Test12345",
						errorText:
							"Пароль состоит из 3-8 симоволов, минимум 1 цифра, минимум 1 заглавная буква",
						required: true,
						onBlur: (e: Event) => {
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
							const result = submit("auth-page-form", this._fieldRules);
							if (result) {
								const login = user.login(result as { login: string; password: string });

								void login.then(() => {
									router.go(PAGES.CHAT);
								});
							}
						},
						text: "Войти",
						class: "goToChatsBtn",
					}),
					new Button({
						onClick: () => {
							router.go(PAGES.REGISTRATION);
						},
						text: "Зарегистрироваться",
						class: "goToRegisterBtn",
					}),
				],
			}),
		});

		// store.on(StoreEvents.Updated, () => {
		// 	console.log("Store updated");
		// 	console.log("store.getState()");
		// 	console.log(store.getState());
		// 	this.setProps(store.getState());
		// });

		this._fieldRules = fieldRules;
	}

	override render(): string {
		return `
		<form id="auth-page-form" class="auth-page" action="/apply/" method="GET">
		{{titleTest}} -- user: {{user}}
			{{{Card}}}
		</form>
		`;
	}
}

export default AuthPageState(AuthPageBase);
