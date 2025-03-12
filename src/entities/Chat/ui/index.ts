import Block from "@/app/core";
import { connect } from "@/app/core/hoc";

import "./MessageCard.pcss";
import { IEvents } from "@/shared/types";

// import { Router } from "@/app/router";
// import { PAGES } from "@/app";
// const router = new Router();

// import { WSTransport } from "@/shared/api/ws";

// import { MessagesAPI } from "./../api/MessagesAPI";
// const message = new MessagesAPI();
// import { useUser } from "@/entities/User";
// const user = new useUser();

// import { useChat } from "@/entities/Chat";
// const chat = new useChat();

import { Http } from "@/shared/api";
const userApiInstance = new Http<any>();

import { MessagesAPI } from "./../api/MessagesAPI";
import store from "@/app/store";
// const messageApi = new

interface IProps {
	events?: IEvents;
	onClick?: (e: Event) => void;
	id: number;
	[prop: string]: any;
}

const mapStateToProps = (state: any) => ({
	user: state.user,
});

class MessageCard extends Block {
	private ws: MessagesAPI;

	constructor(props: IProps) {
		super({
			...props,
			events: {
				click: (e: Event) => {
					e.preventDefault();
					e.stopPropagation();

					// this.getMessages(this.props.user.id, this.props.id);

					// this.ws.getMessages();

					this.loadMessage();

					// router.go(`${PAGES.CHAT}/${props.id}`);

					if (!!props.onClick) {
						props.onClick(e);
					}
				},
			},
		});

		this.connect(this.props.user.id, this.props.id);
	}

	private connect(userId: number, chatId: number) {
		const callback = (messages: any) => {
			// console.log(`Set value `, messages, `On path ${this.props.id}`);
			store.setMessages(`messages.${this.props.id}`, messages);
			// console.log(store.getState());
		};

		userApiInstance
			.post(`/chats/token/${chatId}`)
			.then(({ token }) => {
				this.ws = new MessagesAPI(userId, chatId, token, callback);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	loadMessage() {
		const messages = store.getState().messages[this.props.id];
		store.setMessages("currentChat.messages", messages);
		store.setMessages("currentChat.websocket", this.ws);
		store.setMessages("currentChat.chatId", this.props.id);

		store.emit("updateMessages");

		// this.ws.addMessage(time.toString());
		// console.log(store.getState());
	}

	override render(): string {
		return `
		<div class="message-card">
			<div class="message-card__avatar">
				<img src="/img/avatar_default.jpg" alt="Avatar" class="avatar-image">
			</div>
			<div class="message-card__body">
				<div class="message-card__user-name">
					{{title}} -- {{id}}
				</div>
				<div class="message-card__last-message">
					{{last_message.user.first_name}}: {{last_message.content}}
				</div>
			</div>
			<div class="message-card__metadata">
				<div class="message-time">
					{{last_message.time}}
				</div>
				<div class="chip">
					{{unread_count}}
				</div>
			</div>
		<div>
		`;
	}
}
const MessageCardState = connect(mapStateToProps)(MessageCard);
export default MessageCardState;
