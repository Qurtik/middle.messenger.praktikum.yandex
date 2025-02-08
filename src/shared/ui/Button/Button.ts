import Block from "@/app/core";
import "./Button.pcss";

interface IProps {
	id?: string;
	class?: string;
	onClick?: any;
	text?: string;
}

export default class Button extends Block {
	constructor(props: IProps) {
		super({
			// Defaul values
			// text: "No label",
			...props,
			events: {
				click: (e: Event) => {
					e.preventDefault();
					e.stopPropagation();

					if (!!props.onClick) {
						console.log("props.onClick");
						console.log(props.onClick);
						console.log(e);
						props.onClick(e);
					}
				},
			},
		});
	}

	protected override render(): string {
		return `
			<button id="{{id}}" class="btn {{class}}">{{text}}</button>
		`;
	}
}
