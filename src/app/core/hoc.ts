import store, { StoreEvents } from "@/app/stores";

export function connect(mapStateToProps: (state: any) => any) {
	return function (Component: any) {
		return class extends Component {
			constructor(...args: any[]) {
				// console.log("Register connect");

				super({ ...args, ...mapStateToProps(store.getState()) });

				store.on(StoreEvents.Updated, () => {
					this.setProps({ ...mapStateToProps(store.getState()) });
				});
				// console.log(store);
			}
		};
	};
}
