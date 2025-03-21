/* eslint-disable @typescript-eslint/no-unused-vars */
const enum METHODS {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

export class BaseApi {
	// private _baseUrl: string;

	// constructor(baseUrl: string) {
	// 	this._baseUrl = baseUrl;
	// }

	protected create(): Promise<any> {
		throw new Error("Not implemented");
	}

	protected request() {
		throw new Error("Not implemented");
	}

	protected update() {
		throw new Error("Not implemented");
	}

	protected delete() {
		throw new Error("Not implemented");
	}
}

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
// function queryStringify(data) {
// 	// Можно делать трансформацию GET-параметров в отдельной функции
// }

// function urlWithParams(url, data) {
// 	console.log("urlWithParams");
// 	console.log(data);
// }

// function fetchWithRetry(url, options) {
// 	// код
// }

interface IRequestOptions {
	[key: string]: unknown;
	timeout?: number;
	headers?: {
		[key: string]: string;
	};
	method?: METHODS;
}

const BASE_URL = "https://ya-praktikum.tech/api/v2";
// type HTTPMethod = (url: string, options?: IRequestOptions) => Promise<XMLHttpRequest>;
type HTTPMethod<T> = (url: string, options?: IRequestOptions) => Promise<T>;

export default class HTTPTransport<T> {
	constructor(private _baseUrl?: string) {
		this._baseUrl = !_baseUrl ? BASE_URL : _baseUrl;
	}

	public get: HTTPMethod<T> = (url, options = {}) => {
		return this.request(
			`${this._baseUrl}${url}`,
			{ ...options, method: METHODS.GET },
			options.timeout,
		);
	};

	public post: HTTPMethod<T> = (url, options = {}) => {
		return this.request(
			`${this._baseUrl}${url}`,
			{ ...options, method: METHODS.POST },
			options.timeout,
		);
	};

	public put: HTTPMethod<T> = (url, options = {}) => {
		return this.request(
			`${this._baseUrl}${url}`,
			{ ...options, method: METHODS.PUT },
			options.timeout,
		);
	};

	public delete: HTTPMethod<T> = (url, options = {}) => {
		return this.request(
			`${this._baseUrl}${url}`,
			{ ...options, method: METHODS.DELETE },
			options.timeout,
		);
	};

	private request = (url: string, options: IRequestOptions, timeout = 5000): Promise<T> => {
		const { method, data, headers = {} } = options;

		return new Promise((resolve, reject) => {
			// 1. Создаём новый XMLHttpRequest-объект
			const xhr = new XMLHttpRequest();
			const isGet = method === METHODS.GET;

			// 2. Настраиваем его: GET-запрос по URL
			xhr.open(
				method as string,
				isGet && !!data
					? this._urlWithParams(url, data) // Добавить url с параметрами
					: url,
			);

			xhr.withCredentials = true;
			// xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

			Object.keys(headers).forEach((key) => {
				xhr.setRequestHeader(key, headers[key]);
			});

			if (isGet || !data) {
				xhr.send();
			} else if (data instanceof FormData) {
				xhr.send(data);
			} else {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				xhr.send(JSON.stringify(data));
			}

			// 3. Отсылаем запрос
			// if (!isGet && data) {
			// 	// const form = new FormData();
			// 	const formData = JSON.stringify(data);
			// 	// form.append("data", formData);

			// 	// form.append("data", formData);
			// 	xhr.send(formData);
			// } else {
			// 	xhr.send();
			// }

			// if(data instanceof FormData){}

			xhr.timeout = timeout;

			xhr.onload = function () {
				if (xhr.status != 200) {
					// анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
					// alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
					// console.error(`Ошибка при получении ответа, ${xhr.status}: ${xhr.statusText}`);
					reject("Code is not 200");
				} else {
					// если всё прошло гладко, выводим результат
					// console.log(`Ответ успешно получен`);
				}

				const response = xhr.response;

				try {
					resolve(JSON.parse(response));
				} catch (err) {
					resolve(response);
				}
			};

			const handleError = (err: object) => {
				// console.log(err);
				reject(err);
			};

			xhr.onabort = handleError;
			xhr.onerror = handleError;
			xhr.ontimeout = handleError;
		});
	};

	private _urlWithParams(url: string, data: Record<string, any>): string {
		const params = new URLSearchParams();

		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const value = data[key];

				if (value !== undefined && value !== null) {
					// Обработка undefined и null
					if (typeof value === "object") {
						try {
							params.append(key, JSON.stringify(value));
						} catch (error) {
							console.error(`Error stringifying value for key ${key}:`, error);
							// Handle error or skip the parameter
						}
					} else {
						params.append(key, String(value)); // Явное преобразование в строку
					}
				}
			}
		}

		const paramsString = params.toString();
		return url + (paramsString ? "?" + paramsString : "");
	}
}

// const testMethod = new HTTPTransport();

// testMethod
// 	.get("123/test", { headers: { header: "Key", otherHeader: "Key2" }, tries: 5 })
// 	.then((response) => {
// 		// console.log(response);
// 	});

// testMethod
// 	.post("/mock/userData.json", {
// 		data: { key1: "value1", key2: "value2", c: { d: 123 }, k: [1, 2, 3] },
// 	})
// 	.then((response) => {
// 		console.log(response);
// 	});

// testMethod
// 	.put("/mock/userData.json", {
// 		data: { key1: "value1", key2: "value2", c: { d: 123 }, k: [1, 2, 3] },
// 	})
// 	.then((response) => {
// 		console.log(response);
// 	});

// testMethod
// 	.delete("/mock/userData.json", {
// 		data: { key1: "value1", key2: "value2", c: { d: 123 }, k: [1, 2, 3] },
// 	})
// 	.then((response) => {
// 		console.log(response);
// 	});

// console.log(response);
