/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import App, { PAGES } from "@/app";
import { Router } from "@/app/router";
import Block from "@/app/core";
import { connect } from "@/app/core/hoc";

import "./LeftMenu.pcss";
import { Avatar, Button, Input, Modal } from "@/shared/ui";
import { MessageCard } from "@/entities/Chat";
import { toggleModal } from "@/shared/lib/toggleModal";
import { submit } from "@/shared/lib/validate";

import { useChat } from "@/entities/Chat";
import { useUser } from "@/entities/User";
const chat = new useChat();
const user = new useUser();

const router = new Router();

// import Handlebars from "handlebars";

interface IProps {
	AppInstance: App;
	class?: string;
	Chats?: Block | Block[];
	MessageCard?: Block;
	ProfileBtn?: Block | Block[];
	Actions?: Block | Block[];
	Modal?: Block | Block[];
}

const mapStateToProps = (state: any) => ({
	chats: state.chat,
	user: state.user,
	currentChat: state.currentChat,
});

class LeftMenuBase extends Block {
	constructor(props: IProps) {
		super({
			...props,
			// title: props.title,
			// Test: props.test,
			// Chats: props.chats,
			class: "left-menu",
			Avatar: new Avatar({
				class: "left-menu__avatar",
			}),
			ProfileBtn: new Button({
				text: "Профиль",
				class: "btn goToProfileBtn",
				onClick: () => {
					// props.AppInstance.changePage(PAGES.PROFILE);
					router.go(PAGES.PROFILE);
				},
			}),
			MessagesBlock: [],
			// MessageCard: [new MessageCard({}), new MessageCard({})],

			// Chats2: props.chats2,
			Actions: [
				new Button({
					text: "Добавить пользователя",
					class: "btn_bg_color_green btn_size_s",
					onClick: () => {
						// this.getUser();
						toggleModal("addNewsUserToChat");
					},
				}),
				new Button({
					text: "Удалить пользователя",
					class: "btn_bg_color_red btn_size_s",
					onClick: () => {
						toggleModal("deleteUserFromChat");
					},
				}),
				new Button({
					text: "Добавить чат",
					class: "btn_bg_color_green btn_size_s",
					onClick: () => {
						toggleModal("addNewChat");
					},
				}),
			],
			Modal: [
				new Modal({
					...props,
					// AppInstance: props.AppInstance,
					id: "addNewsUserToChat",
					title: "Добавить пользователя",
					Body: new Input({
						label: "Имя пользователя",
						value: "test_testov",
						name: "login",
					}),
					Actions: [
						new Button({
							text: "Найти",
							class: "modal__footer-btn",
							onClick: async () => {
								const { login } = submit("addNewsUserToChat-form");
								const foundedUser = await user.findUser(login);

								alert(`Пользователь найден: \nUserName: ${foundedUser.login}`);
								this.setProps({
									foundedUser,
								});
							},
						}),
						new Button({
							text: "Добавить",
							class: "modal__footer-btn",
							onClick: () => {
								void chat.addUser(this.props.currentChat.chatId, this.props.foundedUser.id);
								// toggleModal("addNewsUserToChat");
							},
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: () => {
								toggleModal("addNewsUserToChat");
							},
						}),
					],
				}),
				new Modal({
					...props,
					// AppInstance: props.AppInstance,
					id: "deleteUserFromChat",
					title: "Удалить пользователя",
					Body: new Input({
						name: "login",
						label: "Имя пользователя",
						value: "Вася",
					}),
					Actions: [
						new Button({
							text: "Найти",
							class: "modal__footer-btn",
							onClick: async () => {
								const { login } = submit("deleteUserFromChat-form");
								const foundedUser = await user.findUser(login);

								alert(`Пользователь найден: \nUserName: ${foundedUser.login}`);
								this.setProps({
									foundedUser,
								});
							},
						}),
						new Button({
							text: "Удалить",
							class: "modal__footer-btn",
							onClick: () => {
								void chat.deleteUser(this.props.currentChat.chatId, this.props.foundedUser.id);
								// toggleModal("addNewsUserToChat");
							},
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: () => {
								toggleModal("deleteUserFromChat");
							},
						}),
					],
				}),
				new Modal({
					...props,
					// AppInstance: props.AppInstance,
					id: "addNewChat",
					title: "Создать чат",
					Body: new Input({
						label: "Наименование чата",
						name: "title",
					}),
					Actions: [
						new Button({
							text: "Добавить",
							class: "modal__footer-btn",
							onClick: () => {
								const data = submit("addNewChat-form");

								if (data) {
									void chat.createChat(data).then((result) => {
										if (result) {
											toggleModal("addNewChat");
											this.getChats();
										}
									});
								}
							},
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: () => {
								toggleModal("addNewChat");
							},
						}),
					],
				}),
			],
		});
		this.getChats(this.props);
		this.getUser(this.props);
	}

	getUser(props) {
		const userName = user.state;
	}

	getChats(props) {
		const response = chat.getUserChats().then((chats) => {
			// this.setProps({
			// 	title: title, // chat.state.chats[0].id, //chats[0].id,
			// 	Title: "CAPITAL TITLE",
			// 	chats2: chat.state.chats[0].id,
			// 	// ChatBlock: [new MessageCard({}), new MessageCard({})],
			// 	// m
			// });

			const chatList = chat.state.chats.map(
				(chatProps: {
					id: string;
					created_by: number;
					id: number;
					last_message: object;
					title: string;
					unread_count: number;
				}) => {
					return new MessageCard(chatProps);
				},
			);

			this.setLists({
				MessagesBlock: chatList,
			});

			// this.setLists({
			// 	MessagesBlock: [new MessageCard({}), new MessageCard({}), new MessageCard({})],
			// });

			// this.setProps({ chats: new MessageCard({}) });
		});
	}

	// chat.getUserChats()
	// toggleModal(IdModal:string) {
	// 	const modal = document.getElementById(IdModal);
	// 	modal.classList.toggle("modal_active");
	// }

	override render(): string {
		// <div class="avatar-image left-menu__avatar"></div>;
		return `
		<div class="{{class}}">
			<div class="{{class}}__header">
				{{{Avatar}}}
				<div class="profile left-menu__profile">
					{{{ProfileBtn}}}
				</div>
				<input class="search-field left-menu__search-field" type="text" placeholder="Search" />
			</div>

			<div class="{{class}}__main">
				{{{MessagesBlock}}}
			</div>

			<div class="{{class}}__footer">
				{{{Actions}}}
				{{{Modal}}}
			</div>
		</div>
		`;
	}
}

// setTimeout(() => {
// 	menu.setProps({
// 		test: "testProps",
// 	});
// }, 2500);

const LeftMenuState = connect(mapStateToProps)(LeftMenuBase);
export default LeftMenuState;
