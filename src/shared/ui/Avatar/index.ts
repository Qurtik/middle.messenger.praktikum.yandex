import Block from "@/app/core";
import { connect } from "@/app/core/hoc";
import { IEvents } from "@/shared/types";
import store from "@/app/store";

// import { useUser } from "@/entities/User";
// const user = new useUser();

import "./Avatar.pcss";

interface IProps {
	id?: string;
	class?: string;
	classAvata?: string;
	onClick?: (e: Event) => void;
	userName?: string;
	events?: IEvents;
	user: any;
	avatarSrc: any;
}

const mapStateToProps = (state: any) => ({
	user: state.user,
});

class AvatarBase extends Block {
	constructor(props: IProps) {
		super({
			...props,
			events: {
				click: (e: Event) => {
					if (!!props.onClick) {
						props.onClick(e);
					}
					// e.preventDefault();
					e.stopPropagation();
				},
			},
		});
		this._getAvatar();
		store.on("avatarChange", () => this._getAvatar());
	}

	private _getAvatar() {
		// alert("Avatar changed");
		// console.log("state", store.getState());
		// console.log(this.props.user.avatar);

		// void user.getAvatar(this.props.user.avatar).then((response) => {
		// 	this.setProps({
		// 		avatarSrc: response,
		// 	});
		// });

		// void user.getAvatar(this.props.user.avatar).then((response) => {
		// 	this.setProps({
		// 		avatarSrc: response,
		// 	});
		// });

		this.setProps({
			avatarSrc: this.props.user.avatar,
		});

		// void user
		// 	.getAvatar(this.props.user.avatar)
		// 	.then((src) => {
		// 		console.log("AvatarSrc:", src);
		// 		this.setProps({
		// 			// avatarSrc: this.props.user.avatar,
		// 			avatarSrc: src,
		// 			// avatarSrc: "/img/avatar_default.jpg",
		// 		});
		// 	});
	}

	override render(): string {
		return `
		<div class="{{class}}">
			<img src="https://ya-praktikum.tech/api/v2/resources/{{avatarSrc}}" alt="Avatar" class="avatar-image {{classAvatar}}">
			<input type="file" class="avatar-upload" name="avatar" accept="image/*" style="display: none;">
			<span class="avatar__label">{{userName}}</span>
		</div>
		`;

		// return `
		// <div class="profile-title profile-page__profile-title">
		// 	<img src="https://ya-praktikum.tech/api/v2/resources/{{avatarSrc}}" alt="Avatar" class="avatar-image avatar-image_icon_big">
		// 	<input type="file" class="avatar-upload" name="avatar" accept="image/*" style="display: none;">
		// 	<span class="avatar__label">{{userName}}</span>
		// </div>
		// `;
	}
}

const AvatarState = connect(mapStateToProps)(AvatarBase);
export default AvatarState;
