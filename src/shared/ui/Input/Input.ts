import Block from "@/app/core";
import "./TextField.pcss";
import { IEvents } from "@/shared/types";

interface IProps {
	// id?:string
	name?: string;
	label: string;
	value?: string;
	class?: string;
	placeholder?: string;
	errorText?: string;
	required?: boolean;
	readonly?: boolean;
	events?: IEvents;
	onBlur?: (event: Event) => void;
}

// FIXME: Исправить отображение span, убрать выход за пределы div'a
export default class Input extends Block<IProps> {
	constructor(props: IProps) {
		super({
			...props,
			events: {
				blur: (e: Event) => {
					if (props.onBlur) {
						props.onBlur(e);
					}
				},
			},
		});
	}

	override render(): string {
		return `
			<div class="{{class}} text-field">
				<input class="text-field__input" {{#if readonly}}readonly{{/if}} {{#if required}}required{{/if}} type="text" name="{{name}}" id="{{name}}" placeholder="{{placeholder}}" value="{{value}}"/>
				<label class="text-field__label" for="{{name}}">{{label}}</label>
				<span class="input-error-description text-field__input-error-description">{{errorText}}</span>
			</div>
		`;
	}
}
