import App, { PAGES } from "@/app";
import Block from "@/app/core";

interface IProps {
	AppInstance: App;
}

export default class NotFoundPage extends Block {
	constructor(props: IProps) {
		super({
			...props,
			class: "",
		});
	}

	protected override render(): string {
		return `
		
		`;
	}
}
