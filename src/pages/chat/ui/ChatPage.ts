import App from "@/app";
import Block from "@/app/core";
import Chat from "@/widgets/chat";

import LeftMenu from "@/widgets/left-menu";
// import "../widgets/left-menu/ui/LeftMenu.pcss";

interface IProps {
	AppInstance: App;
	class?: string;
	LeftMenu?: Block;
	Chat?: Block;
}

export default class ChatPage extends Block<IProps> {
	constructor(props: IProps) {
		super({
			...props,
			class: "chat-page",
			LeftMenu: new LeftMenu({ ...props }),
			Chat: new Chat({ ...props }),
		});
	}

	protected override render(): string {
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
