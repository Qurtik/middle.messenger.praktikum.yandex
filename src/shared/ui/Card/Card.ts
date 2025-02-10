import Block from "@/app/core";
import "./Card.pcss";

interface IProps {
	title?: string;
	class?: string;
	Body?: Block[];
	Actions?: Block[];
}

export default class Card extends Block<IProps> {
	constructor(props: IProps) {
		super({
			...props,
		});
	}

	protected override render(): string {
		return `
		<div class="{{class}}">
			<div class="card card__{{class}}">
				<div class="card__title card__title-{{class}}">
					<h1>{{title}}</h1>
				</div>
				<div class=" card__body-{{class}} card__body">
					{{{Body}}}
				</div>
				<div class="card__actions card__actions-{{class}}">
					{{{Actions}}}
				</div>
			</div>
		</div>
		`;
	}
}
