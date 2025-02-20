export type TRegisterUser = {
	email: string;
	login: string;
	first_name: string;
	second_name: string;
	phone: string;
	password: string;
};


export interface IUserProfile {
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	phone: string;
}
