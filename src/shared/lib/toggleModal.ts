export function toggleModal(IdModal: string) {
	const modal = document.getElementById(IdModal);
	if (!!modal) {
		modal.classList.toggle("modal_active");
	}
}
