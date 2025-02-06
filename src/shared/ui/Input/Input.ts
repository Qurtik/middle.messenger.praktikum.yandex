import Block from "@/app/core";
import "./TextField.pcss";

interface IProps {
	// id?:string
	name?: string;
	label: string;
	value?: string;
	class?: string;
	placeholder?: string;
	required?: boolean;
	readonly?: boolean;
	onBlur?: Function;
}

export default class Input extends Block {
	constructor(props: IProps) {
		super({
			...props,
			readonly: props.readonly ? "readonly" : "",
			required: props.required ? "required" : "",
			events: {
				blur: (e) => {
					if (!!props.onBlur) {
						props.onBlur(e);
					}
				},
				// click: (e) => {
				// 	console.log("clock");
				// },
			},
		});
		// const readonly = props.readonly || "readonly";
	}

	protected override render(): string {
		return `
			<div class="text-field {{class}}">
				<input class="text-field__input" {{readonly}} {{required}} type="text" name="{{name}}" id="{{name}}" placeholder="{{placeholder}}" value="{{value}}"/>
				<label class="text-field__label" for="{{name}}">{{label}}</label>
			</div>
		`;
	}
}
