import App from "@/app";
import Block from "@/app/core";
import "./Modal.pcss";

interface IProps {
	AppInstance?: App;
	id: string;
	class?: string;
	title?: string;
	Body?: Block | Block[];
	Actions?: Block | Block[];
	// showCloseBtn: boolean;
}

export default class Modal extends Block<IProps> {
	constructor(props: IProps) {
		// showCloseBtn: false;
		super({
			...props,
		});
		console.log("Modal rendered");
	}

	// attachedEventListenerToggleModal(event) {
	// 	// Проверяем, был ли клик на элементе, который нам интересен
	// 	if (event.target.classList.contains("modal_toggle")) {
	// 		const idModal = event.target.getAttribute("data-id-modal");
	// 		// const modalId = event.target.dataset.modal; // Если есть data атрибут
	// 		const modal = document.getElementById(idModal);
	// 		modal.classList.toggle("modal_active");
	// 	}
	// }

	// {{#if showCloseBtn}}
	// 				{{> ModalButton idModal=id type="img" src="close" class="modal__title-close-btn"}}
	// 			{{/if}}

	override render(): string {
		return `
			<div id="{{id}}" class="modal {{class}}">
				<div class="modal__shadow"></div>
				<div class="modal__wrap">
					<div class="modal__window">
						<div class="modal__title modal__title-{{class}}">
							{{title}}
							<span class="material-icons modal__title-close-btn">
								close
							</span>
						</div>
						<div class="modal__body modal__body-{{class}}">
							{{{Body}}}
						</div>
						<div class="modal__footer modal__footer-{{class}}">
							{{{Actions}}}
						</div>
					</div>
				</div>
			</div>
		`;
	}
}
