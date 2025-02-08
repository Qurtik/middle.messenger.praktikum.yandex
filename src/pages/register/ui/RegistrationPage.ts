import App, { INPUT_RULES } from "@/app";
import Block from "@/app/core";
import { Card, Input, Button } from "@/shared/ui";

interface IProps {
	AppInstance: App;
	class?: string;
	Card?: Block;
}

export default class RegistrationPage extends Block {
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
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Логин",
						name: "login",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Имя",
						name: "first_name",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Фамилия",
						name: "second_name",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Телефон",
						name: "phone",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
							}
						},
					}),
					new Input({
						label: "Пароль",
						name: "password",
						onBlur: (e) => {
							const input = e.target as HTMLInputElement;
							if (input && input.name === undefined) {
								const rules = this._fieldRules[input.name];
								if (props) {
									props.AppInstance.isValidate(input, rules);
								}
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
						onClick: () => {
							props.AppInstance.submit("register-page-form", fieldRules);
							// props.AppInstance.changePage(PAGES.CHAT)
						},
					}),
				],
			}),
		});
		this._fieldRules = fieldRules;
	}

	protected override render(): string {
		return `
		<form id="register-page-form">
			<div class="{{class}}">
				{{{Card}}}
			</div>
		<form id="">
		`;
	}
}
