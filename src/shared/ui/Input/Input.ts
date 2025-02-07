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
	onBlur?: (event: Event) => void;
}

export default class Input extends Block {
	constructor(props: IProps) {
		super({
			...props,
			readonly: props.readonly ? "readonly" : "",
			required: props.required ? "required" : "",
			events: {
				blur: (e: Event) => {
					if (!!props.onBlur) {
						props.onBlur(e);
					}
				},
			},
		});
	}

	protected override render(): string {
		return `
			<div class="{{class}} text-field">
				<input class="text-field__input" {{readonly}} {{required}} type="text" name="{{name}}" id="{{name}}" placeholder="{{placeholder}}" value="{{value}}"/>
				<label class="text-field__label" for="{{name}}">{{label}}</label>
			</div>
		`;
	}
}
