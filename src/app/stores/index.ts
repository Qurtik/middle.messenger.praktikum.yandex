// import Block from "../core";
import EventBus from "../core/event-bus";

export enum StoreEvents {
	Updated = "updated",
}

class Store extends EventBus {
	// private state: Indexed = {};
	private state: Record<string, any> = {};

	public getState() {
		return this.state;
	}

	public set(path: string, value: unknown) {
		// set(this.state, path, value);
		this.state[path] = value;

		this.emit(StoreEvents.Updated);
	}
}
// const store = new Store();

// export function connect(Component: any) {
// 	return class extends Component {
// 		constructor(...args: any[]) {
// 			console.log("Register connect");
// 			super(...args);

// 			store.on(StoreEvents.Updated, () => {
// 				this.setProps({ ...store.getState() });
// 			});
// 			console.log(store);
// 		}
// 	};
// }

export default new Store();
