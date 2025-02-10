import App, { PAGES } from "@/app";
import Block from "@/app/core";
import { Avatar, Button, Input, Modal } from "@/shared/ui";

interface IProps {
	AppInstance: App;
	class?: string;
	Header?: Block | Block[];
	Body?: Block | Block[];
	Actions?: Block | Block[];
	Modal?: Block | Block[];
	Avatar?: Block;
	BtnBack?: Block;
}

export default class ProfilePage extends Block<IProps> {
	constructor(props: IProps) {
		super({
			...props,
			class: "profile-page",
			Header: [
				new Avatar({
					userName: "Владислав С.",
					onClick: () => {
						this._uploadAvatar();
					},
				}),
			],
			Body: [
				new Input({
					name: "email",
					label: "Почта",
					value: "vladislav@yandex.ru",
					class: "profile-main__input",
				}),
				new Input({
					name: "login",
					label: "Логин",
					value: "svladislav",
					class: "profile-main__input",
				}),
				new Input({
					name: "first_name",
					label: "Имя",
					value: "Владислав",
					class: "profile-main__input",
				}),
				new Input({
					name: "second_name",
					label: "Фамилия",
					value: "Селезов",
					class: "profile-main__input",
				}),
				new Input({
					name: "display_name",
					label: "Имя в чате",
					value: "Владислав",
					class: "profile-main__input",
				}),
				new Input({
					name: "phone",
					label: "Телефон",
					value: "+7 123 456 78 90",
					class: "profile-main__input",
				}),
			],
			Actions: [
				new Button({
					text: "Изменить данные",
					class: "profile-page__action main-color",
				}),
				new Button({
					text: "Изменить пароль",
					class: "profile-page__action main-color",
					onClick: () => {
						props.AppInstance.toggleModal("changePassword");
					},
				}),
			],
			BtnBack: new Button({
				class: "goToChatsBtn ",
				text: "Вернуться",
				onClick: () => {
					props.AppInstance.changePage(PAGES.CHAT);
				},
			}),
			Modal: [
				new Modal({
					id: "changePassword",
					title: "Смена пароля",
					class: "modal-change-password",
					Body: [
						new Input({
							label: "Старый пароль",
							name: "oldPassword",
							value: "test",
						}),
						new Input({
							label: "Новый пароль",
							name: "newPassword",
						}),
						new Input({
							label: "Подтвердите новый пароль",
						}),
					],
					Actions: [
						new Button({
							text: "Сохранить",
							class: "modal__footer-btn",
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: () => {
								props.AppInstance.toggleModal("changePassword");
							},
						}),
					],
				}),
			],
		});
	}

	private _uploadAvatar() {
		const avatarUpload: HTMLElement = document.querySelector(".avatar-upload")!;
		avatarUpload.click();
	}

	protected override render(): string {
		return `
		<div class="{{class}}">
			{{{Header}}}
			{{{Body}}}

			<div class="profile-page__actions">
				{{{Actions}}}
				{{{Modal}}}
			</div>
			<div class="profile-main__go-back-btn">
				{{{BtnBack}}}
			</div>
		</div>
		`;
	}
}
