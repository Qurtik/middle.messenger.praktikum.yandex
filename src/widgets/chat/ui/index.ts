import App, { INPUT_RULES } from "@/app";
import Block from "@/app/core";
import "./Chat.pcss";
import { Button, Input } from "@/shared/ui";

interface IProps {
	AppInstance: App;
}

export default class Chat extends Block {
	constructor(props: IProps) {
		super({
			...props,
			messageInput: new Input({
				label: "Собщение",
				name: "message",
				class: "chat-main__message-input text-field-size-block",
				onBlur: (e) => {
					const input = e.target;
					const rules = fieldRules[input.name];
					props.AppInstance.isValidate(input, rules);
				},
			}),
			sendMsgBtn: new Button({
				text: "Отправить",
				class: "chat-main__message-send",
				onClick: (e) => {
					console.log(props.AppInstance.submit("chat-main-form", fieldRules));
				},
			}),
		});
		const fieldRules = {
			email: [INPUT_RULES.MESSAGE],
		};
	}
	protected override render(): string {
		return `
		<form id="chat-main-form">
			<div class="chat-main">
				<div class="chat-main__header">Header</div>
				<div class="chat-main__body">Message</div>
				<div class="chat-main__footer">
				{{{ messageInput }}} {{{sendMsgBtn}}}
				</div>
			</div>
		</form>
		`;
	}
}
