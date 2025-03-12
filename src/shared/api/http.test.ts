import HTTPTransport from "./http";

describe("Check HTTP", () => {
	let xhrMock: any;
	// Создаем экземпляр HTTPTransport
	const http: HTTPTransport<any> = new HTTPTransport("https://example.com");

	beforeEach(() => {
		// Создаем mock для XMLHttpRequest
		xhrMock = {
			open: jest.fn(),
			send: jest.fn(),
			setRequestHeader: jest.fn(),
			withCredentials: false,
			onload: null,
			onerror: null,
			ontimeout: null,
			onabort: null,
			status: 200,
			response: JSON.stringify({ success: true }),
		};

		jest.spyOn(window, "XMLHttpRequest").mockImplementation(() => xhrMock as XMLHttpRequest);
	});

	afterEach(() => {
		jest.restoreAllMocks(); // Восстанавливаем оригинальные функции
	});

	it("should make a GET request", async () => {
		const responsePromise = http.get("/test", {});

		// Симулируем успешный ответ
		if (xhrMock.onload) {
			xhrMock.onload(new Event("load"));
		}

		expect.assertions(3);

		const response = await responsePromise;

		expect(xhrMock.open).toHaveBeenCalledWith("GET", "https://example.com/test");
		expect(xhrMock.send).toHaveBeenCalled();
		expect(response).toEqual({ success: true });
	});

	it("should make a POST request", async () => {
		const data = { key: "value" };
		const responsePromise = http.post("/test", { data });
		expect.assertions(3);

		// Симулируем успешный ответ
		if (xhrMock.onload) {
			xhrMock.onload(new Event("load"));
		}

		const response = await responsePromise;

		expect(xhrMock.open).toHaveBeenCalledWith("POST", "https://example.com/test");
		expect(xhrMock.send).toHaveBeenCalledWith(JSON.stringify(data));
		expect(response).toEqual({ success: true });
	});

	it("should handle network errors", async () => {
		const responsePromise = http.get("/test", {});

		// Симулируем сетевую ошибку
		if (xhrMock.onerror) {
			xhrMock.onerror("Network error");
		}

		expect.assertions(1);

		await expect(responsePromise).rejects.toEqual("Network error");
	});

	it("should handle timeout errors", async () => {
		const responsePromise = http.get("/test", {});

		// Симулируем ошибку тайм-аута
		if (xhrMock.ontimeout) {
			xhrMock.ontimeout("Timeout error");
		}

		expect.assertions(1);

		await expect(responsePromise).rejects.toEqual("Timeout error");
	});

	it("should handle not 200 code", async () => {
		xhrMock.status = 401;
		const responsePromise = http.get("/test", {});

		if (xhrMock.onload) {
			xhrMock.onload(new Event("load"));
		}

		expect.assertions(1);

		await expect(responsePromise).rejects.toEqual("Code is not 200");
	});

	it("should FormData files", async () => {
		const file: File = new File(["content"], "example.txt", { type: "text/plain" });
		const formData = new FormData();
		formData.append("avatar", file);

		const responsePromise = http.put("/user/profile/avatar", { data: formData });

		if (xhrMock.onload) {
			xhrMock.onload();
		}

		expect.assertions(4);

		expect(xhrMock.open).toHaveBeenCalledWith("PUT", "https://example.com/user/profile/avatar");
		expect(xhrMock.send).toHaveBeenCalledWith(formData);
		expect(xhrMock.setRequestHeader).not.toHaveBeenCalled();
		await expect(responsePromise).resolves.toEqual({ success: true });
	});
});
