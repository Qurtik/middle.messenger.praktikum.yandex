import Block from "@/app/core";
import "./Button.pcss";
import { IEvents } from "@/shared/types";

interface IProps {
	id?: string;
	class?: string;
	onClick?: (e: Event) => void | Promise<void>;
	text?: string;
	events?: IEvents
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
						// console.log("props.onClick");
						// console.log(props.onClick);
						// console.log(e);
						void props.onClick(e);
					}
				},
			},
		});
	}

	override render(): string {
		return `
			<button {{#if id}}id="{{id}}"{{/if}} class="btn {{class}}">{{text}}</button>
		`;
	}
}
