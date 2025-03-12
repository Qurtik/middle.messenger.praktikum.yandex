/* eslint-disable @typescript-eslint/unbound-method */
import Block from "../core";
import { Router } from "./";

// Мок класса Block
class MockBlock extends Block {
	render() {
		return "<div>Test</div>";
	}

	hide() {
		document.querySelector(this.props.rootQuery)!.innerHTML = "";
	}
}


describe("Router", () => {
	beforeEach(() => {
		// Сброс синглтона
		(Router as any).__instance = null;

		// Создание корневого элемента
		// root = document.createElement("div");
		// root.id = "app";
		// document.body.appendChild(root);
		document.body.innerHTML = '<div id="app"></div>';
	});

	afterEach(() => {
		document.body.innerHTML = "";
		// document.body.removeChild(root);
	});

	it("Должен создавать только один экземпляр (singleton)", () => {
		const router1 = new Router();
		const router2 = new Router();

		expect(router1).toBe(router2);
	});

	describe("Инициализация роутера", () => {
		beforeEach(() => {
			document.body.innerHTML = "";
		});

		it("Рендерит компонент в div с id по умолчанию", () => {
			document.body.innerHTML = '<div id="app"></div>';

			expect(() => new Router()).not.toThrow();
		});

		it("Рендерит компонент в div с прокинутым id", () => {
			document.body.innerHTML = '<div id="test"></div>';

			expect(() => new Router("#test")).not.toThrow();
		});

		it("Выкидывает ошибку, если не нашел коневой элемент для рендера", () => {
			document.body.innerHTML = "<div></div>";

			expect(() => new Router()).toThrow('Root element with selector "#app" not found');
			expect(() => new Router("#testApp")).toThrow(
				'Root element with selector "#testApp" not found',
			);
		});
	});

	it("Добавляет маршруты через метод use()", () => {
		const router = new Router();

		router.use("/login", MockBlock).use("/profile", MockBlock).use("/chat", MockBlock);

		expect(router.routes.length).toBe(3);
	});

	it("Проверяет добавленный маршрут в роуте", () => {
		const router = new Router();

		router.use("/test", MockBlock);

		expect(router.routes[0].match("/test")).toBe(true);
	});

	it("Переходит по маршруту обновляя History и вызывает рендер", () => {
		const router = new Router();
		const spyPushState = jest.spyOn(window.history, "pushState");
		// const spyOnRoute = jest.spyOn(router as any, "_onRoute");

		router.use("/test", MockBlock).use("/test2", MockBlock);
		router.start();
		router.go("/test");

		expect(spyPushState).toHaveBeenCalledWith({}, "Title /test", "/test");
		// expect(spyOnRoute).toHaveBeenCalledWith("/test");
	});

	it("Методы back/forward вызывают history.back/forward", () => {
		const router = new Router();
		const mockBack = jest.spyOn(window.history, "back");
		const mockForward = jest.spyOn(window.history, "forward");

		router.back();
		router.forward();

		expect(mockBack).toHaveBeenCalled();
		expect(mockForward).toHaveBeenCalled();
	});

	it("При переходе скрывает предыдущий блок и рендерит новый", () => {
		class MockBlockA extends Block {
			render() {
				return "<div>A</div>";
			}

			hide() {}
		}

		class MockBlockB extends Block {
			render() {
				return "<div>B</div>";
			}

			hide() {}
		}

		const router = new Router();
		router.use("/a", MockBlockA).use("/b", MockBlockB);

		const hideSpyA = jest.spyOn(MockBlockA.prototype, "hide");
		const hideSpyB = jest.spyOn(MockBlockB.prototype, "hide");

		const renderSpyA = jest.spyOn(MockBlockA.prototype, "render");
		const renderSpyB = jest.spyOn(MockBlockB.prototype, "render");

		router.go("/a");
		expect(renderSpyA).toHaveBeenCalled();

		router.go("/b");
		expect(hideSpyA).toHaveBeenCalled();
		expect(hideSpyB).not.toHaveBeenCalled();
		expect(renderSpyB).toHaveBeenCalled();
	});

	it("Не рендерит блок при несуществующем маршруте", () => {
		const router = new Router();

		class MockBlock1 extends Block {
			render() {
				return "<div>MockBlock</div>";
			}
		}

		router.use("/exists", MockBlock1);
		router.go("/invalid");

		const spyRender = jest.spyOn(MockBlock1.prototype, "render");

		expect(spyRender).not.toHaveBeenCalled();
	});

	it("Находит маршрут по пути через getRoute()", () => {
		const router = new Router();
		router.use("/test", MockBlock);
		const route = router.getRoute("/test");

		expect(route).toBeDefined();
	});
});
