import Handlebars from "handlebars";
import EventBus, { type EventCallback } from "./event-bus";

interface IBlockProps {
	[key: string]: any;
}

export default abstract class Block<Props extends Record<string, any> = Record<string, any>> {
	static EVENTS = {
		INIT: "init",
		FLOW_CDM: "flow:component-did-mount",
		FLOW_CDU: "flow:component-did-update",
		FLOW_RENDER: "flow:render",
	};

	protected _element: HTMLElement | null = null;

	protected props: Props;

	protected children: Record<string, Block>;

	private _id: string = crypto.randomUUID();

	protected lists: Record<string, any[]>;

	protected eventBus: () => EventBus;

	constructor(propsAndChild: Props = {} as Props) {
		const eventBus = new EventBus();

		const { props, children, lists } = this._getPropsAndChildren(propsAndChild);

		this.props = this._makePropsProxy({ ...props }) as Props;
		this.children = children;
		this.lists = this._makePropsProxy({ ...lists });

		this.eventBus = () => eventBus;
		this._registerEvents(eventBus);

		eventBus.emit(Block.EVENTS.INIT);
	}

	private _removeEvents(): void {
		const { events = {} } = this.props;
		Object.keys(events).forEach((eventName) => {
			if (events[eventName]) {
				this._element?.removeEventListener(eventName, events[eventName]);
			}
		});
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps) {
		// console.log(oldProps);
		// console.log(newProps);
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

	public setProps = (nextProps: Partial<Props>): void => {
		// console.log("SetProps:", nextProps);
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
		const propsAndStubs: Record<string, any> = { ...(this.props as Record<string, any>) };
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
		this._removeEvents();
		// console.log("this._element");
		// console.log(this._element);
		this._element = newElement;
		this._addEvents();
		this.addAttributes();
	}

	// Может переопределять пользователь, необязательно трогать
	public render(): string {
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

	public show(query: string): void {
		// console.log("Show from Block");
		// console.log("query");
		// console.log(query);
		const content = this.getContent();
		if (content) {
			document.querySelector(query)?.replaceChildren(content);
			// content.style.display = "block";
		} else {
			throw new Error("No content to render");
		}
	}

	hide() {
		// console.log("Hide from Block");
		// this._element.style.display = "none";
		// const content = this.getContent();
		// if (content) {
		// content.style.display = "none";
		// }
	}
}
