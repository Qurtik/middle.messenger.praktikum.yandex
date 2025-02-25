import Block from "@/app/core";
import { connect } from "@/app/core/hoc";
import { IEvents } from "@/shared/types";

interface IProps {
	id?: string;
	class?: string;
	onClick?: any;
	userName?: string;
	events?: IEvents;
	user: any;
	avatarSrc: any;
}

const mapStateToProps = (state) => ({
	user: state.user,
});

class AvatarBase extends Block<IProps> {
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
	}

	private _getAvatar() {
		console.log(this.props.user.avatar);

		this.setProps({
			// avatarSrc: this.props.user.avatar,
			avatarSrc: "/img/avatar_default.jpg",
		});
	}

	override render(): string {
		return `
		<div class="profile-title profile-page__profile-title">
			<img src="{{avatarSrc}}" alt="Avatar" class="avatar-image avatar-image_icon_big">
			<input type="file" class="avatar-upload" name="avatar" accept="image/*" style="display: none;">
			<span class="avatar__label">{{userName}}</span>
		</div>
		`;
	}
}

const AvatarState = connect(mapStateToProps)(AvatarBase);
export default AvatarState;
