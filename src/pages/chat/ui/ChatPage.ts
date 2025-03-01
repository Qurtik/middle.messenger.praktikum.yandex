import App from "@/app";
import Block from "@/app/core";
import { connect } from "@/app/core/hoc";
// import { Router } from "@/app/router";
import Chat from "@/widgets/chat";

import LeftMenu from "@/widgets/left-menu";
// import "../widgets/left-menu/ui/LeftMenu.pcss";

import "./ChatPage.pcss";

// const router = new Router();

interface IProps {
	AppInstance: App;
	class?: string;
	LeftMenu?: Block;
	Chat?: Block;
}

const mapStateToProps = (state: any) => ({
	chat: state.chat,
	user: state.user,
});

class ChatPageBase extends Block {
	constructor(props: IProps) {
		super({
			...props,
			class: "chat-page",
			LeftMenu: new LeftMenu({ ...props }),
			Chat: new Chat({ ...props }),
		});
	}

	override render(): string {
		return `
		<div class="{{class}}">
			{{{LeftMenu}}}
			<div class="{{class}}__main">
				{{{Chat}}}
			</div>
		</div>
		`;
	}
}

const ChatPageState = connect(mapStateToProps)(ChatPageBase);
export default ChatPageState;
