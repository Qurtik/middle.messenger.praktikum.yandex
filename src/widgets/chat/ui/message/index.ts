import Block from "@/app/core";
import { connect } from "@/app/core/hoc";
import "./message.pcss";

interface IProps {
	message: string;
	time: string;
	authorClass: string;
	[key: string]: any;
}

const mapStateToProps = (state) => ({
	user: state.user,
});

export class MessageCardBase extends Block {
	authorClass: string;

	constructor(props: IProps) {
		super({ ...props });
		this.setAuthorClassMessage();
	}

	private isUserMessageAuthor() {
		console.log(this.props.user.id, this.props.userId);
		return this.props.user.id === this.props.userId;
	}

	private setAuthorClassMessage() {
		if (this.isUserMessageAuthor()) {
			this.setProps({ authorClass: "messageCard__message-my" });
		}
	}

	override render(): string {
		return `
		<div class="messageCard {{authorClass}}">
			<p class="messageCard__header">author:{{author}}</p>
			<span class="messageCard__body">{{message}}</span>
			<p class="messageCard__footer">{{time}}</p>
		</div>
		`;
	}
}

const MessageCardState = connect(mapStateToProps)(MessageCardBase);
export default MessageCardState;
