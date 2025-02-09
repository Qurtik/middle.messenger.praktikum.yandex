import App, { INPUT_RULES } from "@/app";
import Block from "@/app/core";
import "./Chat.pcss";
import {
	// Avatar,
	Button,
	Input,
} from "@/shared/ui";

interface IProps {
	AppInstance: App;
}

export default class Chat extends Block {
	private _fieldRules: Record<string, INPUT_RULES[]>;

	constructor(props: IProps) {
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			password: [INPUT_RULES.PASSWORD],
		};
		super({
			...props,
			// FIXME:
			// Avatar: new Avatar({
			// 	userName: "Владислав",
			// }),
			MessageInput: new Input({
				label: "Собщение",
				name: "message",
				class: "chat-main__message-input text-field-size-block",
				onBlur: (e) => {
					const input = e.target as HTMLInputElement;
					if (input && input.name !== undefined) {
						const rules = this._fieldRules[input.name];
						if (props) {
							props.AppInstance.isValidate(input, rules);
						}
					}
				},
			}),
			SendMsgBtn: new Button({
				text: "Отправить",
				class: "chat-main__message-send",
				onClick: () => {
					console.log(props.AppInstance.submit("chat-main-form", this._fieldRules));
				},
			}),
		});
		this._fieldRules = fieldRules;
	}

	protected override render(): string {
		return `
		<form id="chat-main-form">
			<div class="chat-main">
				<div class="chat-main__header">
				{{{ Avatar }}}
				Header</div>
				<div class="chat-main__body">Message</div>
				<div class="chat-main__footer">
				{{{ MessageInput }}} {{{ SendMsgBtn }}}
				</div>
			</div>
		</form>
		`;
	}
}
