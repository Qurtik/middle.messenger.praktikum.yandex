import Block from "@/app/core";

interface IProps {
	id?: string;
	class?: string;
	onClick?: any;
	userName?: string;
}

export default class Avatar extends Block {
	constructor(props: IProps) {
		super({
			...props,
			events: {
				click: (e) => {
					if (!!props.onClick) {
						props.onClick(e);
					}
					// e.preventDefault();
					e.stopPropagation();
				},
			},
		});
	}
	protected override render(): string {
		return `
		<div class="profile-title profile-page__profile-title">
			<img src="/img/avatar_default.jpg" alt="Avatar" class="avatar-image avatar-image_icon_big">
			<input type="file" class="avatar-upload" name="avatar" accept="image/*" style="display: none;">
			<span class="avatar__label">{{userName}}</span>
		</div>
		`;
	}
}
