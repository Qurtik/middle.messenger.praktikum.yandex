import App, { PAGES } from "@/app";
import Block from "@/app/core";
import "./LeftMenu.pcss";
import { Button, Input, Modal } from "@/shared/ui";
import MessageCard from "@/entities/Chat";

// import Handlebars from "handlebars";

// Handlebars.registerHelper("times", function (n, block) {
// 	let accum = "";
// 	for (let i = 0; i < n; ++i) {
// 		accum += block.fn(i); // Передаем индекс итерации в блок
// 	}
// 	return accum;
// });

interface IProps {
	AppInstance: App;
	class: string;
	Chats: Block | Block[];
	MessageCard: Block;
	ProfileBtn: Block | Block[];
	Actions: Block | Block[];
	Modal?: Block | Block[];
}

export default class LeftMenu extends Block {
	constructor(props?: Partial<IProps>) {
		super({
			...props,
			class: "left-menu",
			ProfileBtn: new Button({
				text: "Профиль",
				class: "btn goToProfileBtn",
				onClick: (e) => {
					props.AppInstance.changePage(PAGES.PROFILE)
				}
			}),
			MessageCard: new MessageCard({
			}),
			Actions: [
				new Button({
					text: "Добавить пользователя",
					class: "btn_bg_color_green btn_size_s",
					onClick: (e) => {
						this.toggleModal("addNewsUserToChat");
					},
				}),
				new Button({
					text: "Удалить пользователя",
					class: "btn_bg_color_red btn_size_s",
					onClick: (e) => {
						this.toggleModal("deleteUserFromChat");
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
						value: "test",
						name: "user_name",
					}),
					Actions: [
						new Button({
							text: "Добавить",
							class: "modal__footer-btn",
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: (e) => {
								this.toggleModal("addNewsUserToChat");
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
						label: "Имя пользователя",
						value: "Вася",
					}),
					Actions: [
						new Button({
							text: "Удалить",
							class: "modal__footer-btn",
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: (e) => {
								this.toggleModal("deleteUserFromChat");
							},
						}),
					],
				}),
			],
		});
	}
	toggleModal(IdModal) {
		const modal = document.getElementById(IdModal);
		modal.classList.toggle("modal_active");
	}

	protected override render(): string {
		return `
		<div class="{{class}}">
			<div class="{{class}}__header">
				<div class="avatar-image left-menu__avatar"></div>
				<div class="profile left-menu__profile">
					{{{ProfileBtn}}}
				</div>
				<input class="search-field left-menu__search-field" type="text" placeholder="Search" />
			</div>

			<div class="{{class}}__main">
				{{{MessageCard}}}
			</div>

			<div class="{{class}}__footer">
				{{{Actions}}}
				{{{Modal}}}
			</div>
		</div>
		`;
	}
}
