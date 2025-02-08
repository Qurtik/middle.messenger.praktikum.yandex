import Block from "@/app/core";
import "./MessageCard.pcss";

interface IProps {}

export default class MessageCard extends Block {
	constructor(props: IProps) {
		super({
			...props,
		});
	}

	protected override render(): string {
		return `
		<div class="message-card">
			<div class="message-card__avatar">
				<img src="/img/avatar_default.jpg" alt="Avatar" class="avatar-image">
			</div>
			<div  class="message-card__body">
				<div class="message-card__user-name">
					Владислав
				</div>
				<div class="message-card__last-message">
					Hello!
				</div>
			</div>
			<div class="message-card__metadata">
				<div class="message-time">
					11:52
				</div>
				<div class="chip">
					5
				</div>
			</div>
		<div>
		`;
	}
}
