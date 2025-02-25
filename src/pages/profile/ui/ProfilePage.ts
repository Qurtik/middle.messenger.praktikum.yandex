// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import App, { PAGES } from "@/app";
import Block from "@/app/core";
import { Router } from "@/app/router";

import { Avatar, Button, Input, Modal } from "@/shared/ui";

import "./ProfilePage.pcss";
import { toggleModal } from "@/shared/lib/toggleModal";

import { IUserProfile, useUser } from "@/entities/User";
import { INPUT_RULES, submit } from "@/shared/lib/validate";
import { connect } from "@/app/core/hoc";
const user = new useUser();


// import store from "@/app/stores";

// const u = new userStore();
// console.log(u);

// console.log(user);
const router = new Router();

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

const mapStateToProps = (state) => ({
	user: state.user,
});

class ProfilePageBase extends Block<IProps> {
	constructor(props: IProps) {
		const fieldRulesChangePassword = {
			oldPassword: [],
			newPassword: [INPUT_RULES.PASSWORD],
			confirmNewPassword: [INPUT_RULES.PASSWORD],
		};

		const fieldRules = {
			login: [INPUT_RULES.LOGIN],
			email: [INPUT_RULES.EMAIL],
			first_name: [INPUT_RULES.FIRST_NAME],
			second_name: [INPUT_RULES.SECOND_NAME],
			phone: [INPUT_RULES.PHONE],
		};

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
				new Button({
					text: "Сохранить",
					onClick: () => {
						const avatar: HTMLElement = document.querySelector(".avatar-upload").files[0];
						console.log(avatar);
						const formData = new FormData();
						formData.append("avatar", avatar);
						void user.changeAvatar(formData);
					},
				}),
			],
			Body: [
				new Input({
					...props,
					name: "email",
					label: "Почта",
					value: props.user.email,
					// value: "vladislav@yandex.ru",
					class: "profile-main__input",
				}),
				new Input({
					name: "login",
					label: "Логин",
					value: props.user.login,
					class: "profile-main__input",
				}),
				new Input({
					name: "first_name",
					label: "Имя",
					value: props.user.first_name,
					class: "profile-main__input",
				}),
				new Input({
					name: "second_name",
					label: "Фамилия",
					value: props.user.second_name,
					class: "profile-main__input",
				}),
				new Input({
					name: "display_name",
					label: "Имя в чате",
					value: props.user.display_name,
					class: "profile-main__input",
				}),
				new Input({
					name: "phone",
					label: "Телефон",
					value: props.user.phone,
					class: "profile-main__input",
				}),
			],
			Actions: [
				new Button({
					text: "Изменить данные",
					class: "profile-page__action main-color btn_bg_color_green",
					onClick: async () => {
						const result = submit("profile-page-form", fieldRules);

						if (result && typeof result !== "boolean") {
							await user.userChangeProfile(result as IUserProfile);
						}
					},
				}),
				new Button({
					text: "Изменить пароль",
					class: "profile-page__action main-color",
					onClick: () => {
						toggleModal("changePassword");
					},
				}),
				new Button({
					text: "Выйти",
					class: "profile-page__action btn_bg_color_red",
					onClick: () => {
						user
							.userLogout()
							.then(() => {
								router.go(PAGES.CHAT);
							})
							.catch((err) => {
								alert(`Произошла ошибка при выходе из системы,${err}`);
							});
					},
				}),
			],
			BtnBack: new Button({
				class: "goToChatsBtn ",
				text: "Вернуться",
				onClick: () => {
					router.go(PAGES.CHAT);
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
							value: "",
						}),
						new Input({
							label: "Новый пароль",
							name: "newPassword",
						}),
						new Input({
							label: "Подтвердите новый пароль",
							name: "confirmNewPassword",
						}),
					],
					Actions: [
						new Button({
							text: "Сохранить",
							class: "modal__footer-btn",
							onClick: async () => {
								const result = submit("changePassword-form", fieldRulesChangePassword);

								if (result && typeof result !== "boolean") {
									if (result.newPassword !== result.confirmNewPassword) {
										alert("Пароли не совпадают");
									} else {
										const response = await user.userChangePassword(
											result.oldPassword,
											result.newPassword,
										);
										if (response) {
											toggleModal("changePassword");
										}
									}
								}
							},
						}),
						new Button({
							text: "Закрыть",
							class: "modal__footer-btn",
							onClick: () => {
								toggleModal("changePassword");
							},
						}),
					],
				}),
			],
		});
		// this.getUserData();
	}

	// private getUserData() {
	// 	void user.getUser().then(() => {
	// 		console.log("user.state", user.state.user.email);
	// 		this.setProps({
	// 			title: user.state, // chat.state.chats[0].id, //chats[0].id,
	// 			email: "Email", //user.state.user.email,
	// 		});
	// 	});
	// 	// console.log("getUserData this.props", this.props);
	// 	// console.log(this.props);
	// }

	private _uploadAvatar() {
		const avatarUpload: HTMLElement = document.querySelector(".avatar-upload")!;
		avatarUpload.click();
	}

	override render(): string {
		console.log("Render Props from ProfilePage", this.props.user);
		return `
		<form id="profile-page-form">
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
		</form>
		`;
	}
}

const ProfilePageState = connect(mapStateToProps)(ProfilePageBase);
export default ProfilePageState;
// export default ProfilePageState(ProfilePageBase);
