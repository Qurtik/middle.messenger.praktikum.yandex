import Block from "@/app/core";
import { IEvents } from "@/shared/types";

interface IProps {
	id?: string;
	class?: string;
	onClick?: any;
	userName?: string;
	events?: IEvents
}

export default class Avatar extends Block<IProps> {
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
	}

	override render(): string {
		return `
		<div class="profile-title profile-page__profile-title">
			<img src="/img/avatar_default.jpg" alt="Avatar" class="avatar-image avatar-image_icon_big">
			<input type="file" class="avatar-upload" name="avatar" accept="image/*" style="display: none;">
			<span class="avatar__label">{{userName}}</span>
		</div>
		`;
	}
}
