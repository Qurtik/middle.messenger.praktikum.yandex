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

// const ProfilePageState = connect((state) => ({
// 	user: state.user,
// 	profileUserId: state.user,
// 	// test: "testData",
// 	userName: { name: "testUserName" },
// }));

// const userStore = store.getState();
// console.log("userStore:", userStore);

// const test = store.getState().user;

// user
// 	.getUser()
// 	.then(() => {
// 		console.log(user);
// 	})
// 	.catch(() => {});

// console.log("ProfilePageState");
// console.log(ProfilePageState);
// console.log(ProfilePageState.user);

// console.log("user", user);

class ProfilePageBase extends Block<IProps> {
	constructor(props: IProps, store: any) {
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

		console.log("props:", { ...props });

		super({
			...props,
			// ...store,
			// currentStore: store,
			class: "profile-page",
			// testUser: "{{store}}",
			title: props,
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
					value: "",
					// value: "vladislav@yandex.ru",
					class: "profile-main__input",
				}),
				new Input({
					name: "login",
					label: "Логин",
					value: props,
					class: "profile-main__input",
				}),
				new Input({
					name: "first_name",
					label: "Имя",
					value: props.class,
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
						// props.AppInstance.toggleModal("changePassword");
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
					// props.AppInstance.changePage(PAGES.CHAT);
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
							value: "test",
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
								// props.AppInstance.toggleModal("changePassword");
								toggleModal("changePassword");
							},
						}),
					],
				}),
			],
		});

		this.CurrentStore = store;

		console.log("this.currentStore", this.currentStore);
		console.log("props2:", this.props);
		// console.log("store.getState().profileUser", store.getState().profileUser);
	}

	private _uploadAvatar() {
		const avatarUpload: HTMLElement = document.querySelector(".avatar-upload")!;
		avatarUpload.click();
	}

	override render(): string {
		return `
		<form id="profile-page-form">
			<div class="{{class}}">
			<h1>title: {{title}}</h1>
			user.state: {{user}} -- {{user.id}} -- test: {{test}}
			</br> testUser -- {{{testUser}}}
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
