import App from "@/app";
import Block from "@/app/core";
// import { useChat } from "@/entities/Chat";
// import { useUser } from "@/entities/User";

import "./Chat.pcss";
import {
	// Avatar,
	Button,
	Input,
} from "@/shared/ui";
import { INPUT_RULES, isValidate, submit } from "@/shared/lib/validate";
import { connect } from "@/app/core/hoc";
import MessageCard from "./message";

interface IProps {
	AppInstance: App;
}
// import { Router } from "@/app/router";
// const router = new Router();

import store from "@/app/store";

// const user = new useUser();
// const chat = new useChat();

// console.log("chat.state", chat.state);
// console.log("user.state.user", user.state);
// chat.connectToChat();

const mapStateToProps = (state: any) => ({
	user: state.user,
	chat: state.chats,
	currentChat: state.currentChat,
});

class ChatBase extends Block {
	private _fieldRules: Record<string, INPUT_RULES[]>;

	private ws: any;

	constructor(props: IProps) {
		const fieldRules = {
			email: [INPUT_RULES.EMAIL],
			password: [INPUT_RULES.PASSWORD],
			message: [INPUT_RULES.MESSAGE],
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
				onBlur: (e: Event) => {
					const input = e.target as HTMLInputElement;
					if (input && input.name !== undefined) {
						const rules = this._fieldRules[input.name];
						if (props) {
							isValidate(input, rules);
						}
					}
				},
			}),
			MessagesList: [],
			SendMsgBtn: new Button({
				text: "Отправить",
				class: "chat-main__message-send",
				onClick: () => {
					// this.getMessages();
					const result = submit("chat-main-form", this._fieldRules);

					if (result) {
						const message = result.message;

						this.ws.addMessage(message);
						this.ws.getMessages();

						setTimeout(() => {
							this.getMessages();
						}, 300);
					}
					// this.getMessages();
				},
			}),
		});
		this._fieldRules = fieldRules;

		// eslint-disable-next-line @typescript-eslint/unbound-method
		store.on("updateMessages", () => {
			// alert("MESSAGES UPDATED");
			// this.ws.getMessages();
			this.getMessages();
			this.ws = this.props.currentChat.websocket;
		});

		// this.props.currentChat.websocket.on("message", () => {
		// 	alert(true);
		// });
	}

	private getMessages() {
		console.log("GetMessages");
		const props = this.props.chat;

		// this.ws.getMessages();

		const messages = this.props.currentChat.messages;

		console.log("MESSAGES:", messages);
		console.log("chat props", props);
		console.log("store", store.getState());

		const messagesList = messages.map((chatProps: any) => {
			return new MessageCard(chatProps);
		});

		this.setLists({
			MessagesList: messagesList,
		});
	}

	override render(): string {
		return `
		<form id="chat-main-form">
			<div class="chat-main">
				<div class="chat-main__header">
				{{{ Avatar }}}
				Header</div>
				<div class="chat-main__body">
					{{{MessagesList}}}
				</div>
				<div class="chat-main__footer">
				{{{ MessageInput }}} {{{ SendMsgBtn }}}
				</div>
			</div>
		</form>
		`;
	}
}

const ChatState = connect(mapStateToProps)(ChatBase);
export default ChatState;
