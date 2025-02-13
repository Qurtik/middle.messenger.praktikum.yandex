import Block from "../core";

function isEqual(lhs: string, rhs: string): boolean {
	return lhs === rhs;
}

interface IRoute {
	navigate: (pathname: string) => void;
	leave: () => void;
	match: (pathname: string) => boolean;
	render: () => void;
}

interface IRouter<T extends { rootQuery?: string }> {
	use: (pathname: string, block: TBlockClass) => Router<T>;
	start: () => void;
	go: (pathname: string) => void;
	back: () => void;
	forward: () => void;
	getRoute: (pathname: string) => Route | undefined;
	// getRoute: (pathname: string) => Route<T> | undefined;
}

type TBlockClass<T extends Record<string, any> = any> = new (props?: T) => Block<T>;

// class Route<T extends { rootQuery: string }> implements IRoute {
class Route implements IRoute {
	private _pathname: string;

	// private _blockClass: TBlockClass<T>;
	private _blockClass: TBlockClass;

	private _block: Block | null;

	private _props: { rootQuery: string };

	constructor(pathname: string, view: TBlockClass, props: { rootQuery: string }) {
		this._pathname = pathname;
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	public leave(): void {
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string): boolean {
		return isEqual(pathname, this._pathname);
	}

	public render(): void {
		if (!this._block) {
			console.log("Block Class: ", this._blockClass);

			this._block = new this._blockClass();

			console.log("this._block");
			console.log(this._block);
			// render(this._props.rootQuery, this._block);
			console.log("render from route");
			this._block?.render();
			// return;
		}

		this._block.show(this._props.rootQuery);
	}
}

// export class Router<T extends { rootQuery: string }> implements IRouter<T> {
export class Router<T extends { rootQuery?: string }> implements IRouter<T> {
	private static __instance: Router<any>;

	// public routes: Route<T>[] = [];
	public routes: Route[] = [];

	public history: History = window.history;

	// private _currentRoute: Route<T> | null = null;
	private _currentRoute: Route | null = null;

	private _rootQuery: string = "#app";

	constructor(rootQuery?: string) {
		if (Router.__instance) {
			return Router.__instance as Router<T>;
		}

		if (rootQuery) {
			this._rootQuery = rootQuery;
		}

		if (!document.querySelector(this._rootQuery)) {
			throw new Error(`Root element with selector "${this._rootQuery}" not found`);
		}

		Router.__instance = this;
	}

	public use(pathname: string, block: TBlockClass) {
		const route = new Route(pathname, block, { rootQuery: this._rootQuery });
		this.routes.push(route);
		return this;
	}

	public start(): void {
		window.onpopstate = (event: Event) => {
			console.log(event);
			this._onRoute(window.location.pathname);
		};
		this._onRoute(window.location.pathname);
	}

	// Текущий роут
	private _onRoute(pathname: string): void {
		const route = this.getRoute(pathname);

		if (!route) {
			return;
		}

		console.log("CurrentRoute");
		console.log(route);

		if (this._currentRoute) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		route.render();
	}

	public go(pathname: string): void {
		this.history.pushState({}, `Title ${pathname}`, pathname);
		this._onRoute(pathname);
	}

	public back(): void {
		this.history.back();
	}

	public forward(): void {
		this.history.forward();
	}

	// public getRoute(pathname: string): Route<T> | undefined {
	public getRoute(pathname: string): Route | undefined {
		return this.routes.find((route) => route.match(pathname));
	}
}
