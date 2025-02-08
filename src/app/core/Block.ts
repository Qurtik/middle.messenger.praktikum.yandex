import Handlebars from "handlebars";
import EventBus from "./event-bus";

type EventCallback = (...args: any[]) => void;

interface IBlockProps {
	[key: string]: any;
}

export default class Block {
	static EVENTS = {
		INIT: "init",
		FLOW_CDM: "flow:component-did-mount",
		FLOW_CDU: "flow:component-did-update",
		FLOW_RENDER: "flow:render",
	};

	protected _element: HTMLElement | null = null;

	protected props: IBlockProps;

	protected children: Record<string, Block>;

	private _id: string = crypto.randomUUID();

	protected lists: Record<string, any[]>;

	protected eventBus: () => EventBus;

	constructor(propsAndChild: IBlockProps = {}) {
		const eventBus = new EventBus();

		const { props, children, lists } = this._getPropsAndChildren(propsAndChild);

		this.props = this._makePropsProxy({ ...props });
		this.children = children;
		this.lists = this._makePropsProxy({ ...lists });

		this.eventBus = () => eventBus;
		this._registerEvents(eventBus);

		eventBus.emit(Block.EVENTS.INIT);
	}

	private _addEvents(): void {
		const { events = {} } = this.props;
		Object.keys(events).forEach((eventName) => {
			if (this._element) {
				if (this._element.tagName === "DIV" && eventName === "blur") {
					const innerInput = this._element.querySelector("input");
					if (!!innerInput) {
						innerInput.addEventListener(eventName, events[eventName]);
					}
				} else {
					this._element.addEventListener(eventName, events[eventName]);
				}
			}
		});
	}

	private _registerEvents(eventBus: EventBus): void {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as EventCallback);
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this) as EventCallback);
	}

	protected init() {
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
	}

	private _componentDidMount(): void {
		this.componentDidMount();
		Object.values(this.children).forEach((child) => {
			child.dispatchComponentDidMount();
		});
	}

	// Может переопределять пользователь, необязательно трогать
	protected componentDidMount(): void {}

	public dispatchComponentDidMount(): void {
		this.eventBus().emit(Block.EVENTS.FLOW_CDM);
	}

	_componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps) {
		const response = this.componentDidUpdate(oldProps, newProps);
		if (!response) {
			return;
		}
		this._render();
	}

	// Может переопределять пользователь, необязательно трогать
	protected componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps) {
		console.log(oldProps);
		console.log(newProps);
		return true;
	}

	_getPropsAndChildren(propsAndChild: IBlockProps): {
		children: Record<string, Block>;
		props: IBlockProps;
		lists: Record<string, any[]>;
	} {
		const children: Record<string, Block> = {};
		const props: IBlockProps = {};
		const lists: Record<string, any[]> = {};

		Object.entries(propsAndChild).forEach(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value;
			} else if (Array.isArray(value)) {
				lists[key] = value;
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				props[key] = value;
			}
		});

		return { children, props, lists };
	}

	protected addAttributes(): void {
		const { attr = {} } = this.props;

		Object.entries(attr).forEach(([key, value]) => {
			if (this._element) {
				this._element.setAttribute(key, value as string);
			}
		});
	}

	public setProps = (nextProps: Record<string, unknown>): void => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	public setLists = (nextList: Record<string, any[]>): void => {
		if (!nextList) {
			return;
		}

		Object.assign(this.lists, nextList);
	};

	get element() {
		return this._element;
	}

	_render() {
		const propsAndStubs = { ...this.props };
		const tmpId = crypto.randomUUID();

		Object.entries(this.children).forEach(([key, child]) => {
			propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
		});

		Object.entries(this.lists).forEach(([key]) => {
			propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
		});

		const fragment = this._createDocumentElement("template");
		fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

		Object.values(this.children).forEach((child) => {
			const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
			if (stub) {
				stub.replaceWith(child.getContent());
			}
		});

		Object.entries(this.lists).forEach(([, child]) => {
			const listCont = this._createDocumentElement("template");
			child.forEach((item) => {
				if (item instanceof Block) {
					listCont.content.append(item.getContent());
				} else {
					listCont.content.append(`${item}`);
				}
			});

			const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
			if (stub) {
				stub.replaceWith(listCont.content);
			}
		});

		const newElement = fragment.content.firstElementChild as HTMLElement;
		if (this._element && newElement) {
			this._element.replaceWith(newElement);
		}
		this._element = newElement;
		this._addEvents();
		this.addAttributes();
	}

	// Может переопределять пользователь, необязательно трогать
	protected render(): string {
		return "";
	}

	getContent(): HTMLElement {
		if (!this.element) {
			throw new Error("No element");
		}
		return this.element;
	}

	_makePropsProxy(props: IBlockProps) {
		// Можно и так передать this
		// Такой способ больше не применяется с приходом ES6+
		// const self = this;

		return new Proxy(props, {
			get: (target: IBlockProps, prop: string) => {
				const value = target[prop];

				if (prop.startsWith("_")) {
					throw new Error(`Нет доступа к свойству ${prop}`);
				}

				return typeof value === "function" ? value.bind(target) : value;
			},
			set: (target: IBlockProps, prop: string, newValue: unknown) => {
				if (prop.startsWith("_")) {
					throw new Error(`Нет доступа к свойству ${prop}`);
				} else {
					const oldTarget = { ...target };
					target[prop] = newValue;
					this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);

					return true;
				}
			},
			deleteProperty(target: IBlockProps, prop: string) {
				throw new Error(`Нет доступа для удаления параметра ${target[prop]}`);
			},
		});
	}

	_createDocumentElement(tagName: string): HTMLTemplateElement {
		// Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
		return document.createElement(tagName) as HTMLTemplateElement;
	}

	public show(): void {
		const content = this.getContent();
		if (content) {
			content.style.display = "block";
		}
	}

	hide() {
		// this._element.style.display = "none";
		const content = this.getContent();
		if (content) {
			content.style.display = "none";
		}
	}
}
