import App, { PAGES } from "@/app";
import Block from "@/app/core";

import LeftMenu from "@/widgets/left-menu";
// import "../widgets/left-menu/ui/LeftMenu.pcss";

interface IProps {
	AppInstance: App;
}

export default class ChatPage extends Block {
	constructor(props: IProps) {
		super({
			...props,
			class: "chat-page",
			LeftMenu: new LeftMenu({...props}),
		});
	}

	protected override render(): string {
		return `
		<div class="{{class}}">
			{{{LeftMenu}}}
			<div class="{{class}}__main">
				Modal
			</div>
		</div>
		`;
	}
}

// <div class="chat-page">
// 	{{> LeftMenu}}
// 	<div class="chat-page__main">
// 		{{> Modal title="MyModal" showCloseBtn="true"}}
// 	</div>
// </div>
