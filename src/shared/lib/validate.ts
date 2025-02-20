// eslint-disable-next-line @typescript-eslint/naming-convention
export const enum INPUT_RULES {
	EMAIL = "^[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\-\\.]+\\.[a-zA-Z]+$",
	PASSWORD = "^(?=.*[A-Z])(?=.*\\d).{8,40}$",
	LOGIN = "^(?=.*[a-zA-Z])[a-zA-Z0-9_\\-]{3,20}$",
	FIRST_NAME = "^[A-ZА-Я][a-zа-яё\\-]*$",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	SECOND_NAME = "^[A-ZА-Я][a-zа-яё\\-]*$",
	PHONE = "^\\+?\\d{10,15}$",
	MESSAGE = "^\\s*\\S.*+$",
}

export function setInputValidity(el: HTMLElement, isValid: boolean): void {
	const parent: HTMLElement = el.parentElement!;
	const errorDescription = parent.querySelector(".input-error-description");

	if (isValid) {
		el.style.borderColor = "green";
		errorDescription?.classList.remove("input-error-description-active");
	} else {
		el.style.borderColor = "red";
		errorDescription?.classList.add("input-error-description-active");
	}
}

export function isValidate(el: HTMLInputElement, rules: INPUT_RULES[]): boolean {
	if (!rules) {
		return true;
	}

	const value = el.value;
	for (const rule of rules) {
		const regex = new RegExp(rule);
		const isValid = regex.test(value);

		setInputValidity(el, isValid);
		if (!isValid) {
			return false;
		}
	}
	return true;
}

type FieldRules = Record<string, INPUT_RULES[]>;

export function submit<T extends FieldRules>(
	idForm: string,
	formRules?: T,
	// callback?: (formResult: Record<string, string>, formRules: INPUT_RULES) => void,
): { [K in keyof T]: string } | boolean {
	const applicantForm = document.getElementById(idForm);
	console.log(applicantForm);

	if (applicantForm) {
		const formFields = applicantForm.querySelectorAll("input");
		const formResult: Record<string, string> = {};
		console.log(formFields);

		let isFormValid: boolean = true;
		formFields.forEach((element) => {
			const inputValue = element.value;
			const inputName = element.name;

			if (!inputName) {
				return;
			}

			formResult[inputName] = inputValue;

			if (!!formRules) {
				const rules: INPUT_RULES[] = formRules[inputName];
				const result = isValidate(element, rules);
				setInputValidity(element, result);

				if (!result) {
					isFormValid = false;
				}
			}
		});

		if (isFormValid) {
			console.log("formResult");
			console.log(formResult);
			console.log("SUBMITED");
			return formResult as { [K in keyof T]: string };
		}
		return false;
	} else {
		throw new Error(`Form не найден по ид ${idForm}`);
	}
}
