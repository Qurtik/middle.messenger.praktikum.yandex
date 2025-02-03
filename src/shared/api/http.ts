//@ts-nocheck
const enum METHODS {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data) {
	// Можно делать трансформацию GET-параметров в отдельной функции
}

// function urlWithParams(url, data) {
// 	console.log("urlWithParams");
// 	console.log(data);
// }

// function fetchWithRetry(url, options) {
// 	// код
// }

export default class HTTPTransport {
	get = (url, options = {}) => {
		return this.fetchWithRetry(url, { ...options, method: METHODS.GET }, options.timeout);
	};
	post = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
	};
	put = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
	};
	delete = (url, options = {}) => {
		return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
	};

	// PUT, POST, DELETE

	// options:
	// headers — obj
	// data — obj
	request = (url, options, timeout = 5000) => {
		const { method, data, headers = {} } = options;

		const promise = new Promise((resolve, reject) => {
			// 1. Создаём новый XMLHttpRequest-объект
			const xhr = new XMLHttpRequest();
			const isGet = method === METHODS.GET;

			// 2. Настраиваем его: GET-запрос по URL
			xhr.open(
				method,
				isGet && !!data
					? this._urlWithParams(url, data) // Добавить url с параметрами
					: url
			);

			Object.keys(headers).forEach((key) => {
				xhr.setRequestHeader(key, headers[key]);
			});

			// 3. Отсылаем запрос
			if (!isGet && data) {
				const form = new FormData();
				const formData = JSON.stringify(data);
				form.append("data", formData);
				xhr.send(form);
			} else {
				xhr.send();
			}

			xhr.timeout = timeout;

			xhr.onload = function () {
				if (xhr.status != 200) {
					// анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
					// alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
					console.error(`Ошибка при получении ответа, ${xhr.status}: ${xhr.statusText}`);
				} else {
					// если всё прошло гладко, выводим результат
					console.log(`Ответ успешно получен`);
				}
				resolve(xhr);
			};

			const handleError = (err) => {
				console.log(err);
				reject(err);
			};

			xhr.onabort = handleError;
			xhr.onerror = handleError;
			xhr.ontimeout = handleError;
		});

		let { tries = 0 } = options;

		return promise
			.then((resolve) => {
				return resolve;
			})
			.catch((err) => {
				if (tries !== 0) {
					fetchWithRetry(this);
				} else return err;
			});

		// return promise;
	};
	private _urlWithParams(url, data) {
		console.log("data in urlWithParams");
		console.log(data);

		// Object.entries(data).forEach(([key, value])=>{
		// 	console.log(`key: ${key}, value ${value}`)
		// })

		const params = Object.entries(data).reduce((acc, [key, value], index, array) => {
			if (typeof value === "object" && !Array.isArray(value)) {
				return acc;
			}

			return `${acc}${key}=${value}${index !== array.length - 1 ? "&" : ""}`;
		}, "?");

		return url + params;
	}
	private fetchWithRetry(url, options) {
		this.request(url, options);
		// new Proxy(this.request,{
		// 	get(target, prop){
		// 		console.log(target)
		// 	}
		// })
	}
}

const testMethod = new HTTPTransport();

testMethod
	.get("123/test", { headers: { header: "Key", otherHeader: "Key2" }, tries: 5 })
	.then((response) => {
		// console.log(response);
	});

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
