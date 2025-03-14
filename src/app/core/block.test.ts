import Block from "./Block";
import Handlebars from "handlebars";
import EventBus from "./event-bus";

jest.mock("handlebars");
jest.mock("./event-bus");

class TestBlock extends Block {
	public componentDidMount() {
		super.componentDidMount();
	}

	public dispatchComponentDidMount() {
		super.dispatchComponentDidMount();
	}

	public getProps() {
		return this.props;
	}

	public getChildren() {
		return this.children;
	}

	public getLists() {
		return this.lists;
	}

	render() {
		return "<div>Test</div>";
	}
}

describe("Block", () => {
	beforeEach(() => {
		(EventBus as jest.Mock).mockClear();
		(Handlebars.compile as jest.Mock).mockReturnValue(() => "<div>Test</div>");
	});

	it("Инициализирует элемент и шина событий", () => {
		const block = new TestBlock();
		expect(block.element).toBeDefined();
		expect(EventBus).toHaveBeenCalledTimes(1);
	});

	it("Регистрирует ивенты", () => {
		const mockEventBus = {
			on: jest.fn(),
			emit: jest.fn(),
		};
		(EventBus as jest.Mock).mockReturnValue(mockEventBus);

		new TestBlock();
		expect(mockEventBus.on).toHaveBeenCalledTimes(4);
		expect(mockEventBus.on).toHaveBeenCalledWith("init", expect.any(Function));
	});

	it("Проверяет работу прокси у Block", () => {
		const block = new TestBlock({ testProp: "test" });

		// Тест getter
		expect(block.getProps().testProp).toBe("test");

		// Тест setter
		block.setProps({ testProp: "new" });
		expect(block.getProps().testProp).toBe("new");
	});

	it("Рендерит компонент при изменении пропсов", () => {
		const block = new TestBlock({ test: "old" });
		const spy = jest.spyOn(block, "setProps");

		block.setProps({ test: "new" });
		expect(spy).toHaveBeenCalledWith({ test: "new" });
		expect(block.getProps().test).toBe("new");
	});

	it("Рендерит дочерние элементы", () => {
		const childBlock = new TestBlock();
		const parentBlock = new TestBlock({
			children: childBlock,
		});

		expect(parentBlock.getChildren().children).toBeInstanceOf(TestBlock);
	});

	it("Проверка доступа к приватным свойствам компонента", () => {
		const block = new TestBlock();

		expect(() => {
			(block as any).props._privateProp = "test";
		}).toThrow(/Нет доступа к свойству/);
	});
});
