// import Block from "../core";
import set from "@/shared/lib/set";
import EventBus from "../core/event-bus";

export enum StoreEvents {
	Updated = "updated",
}

class Store extends EventBus {
	// private state: Indexed = {};
	private state: Record<string, any> = {};

	public getState() {
		// console.log("State from main store:", this.state);
		return this.state;
	}

	public setMessages(path: string, value: any) {
		set(this.state, path, value);

		this.emit(StoreEvents.Updated);
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
