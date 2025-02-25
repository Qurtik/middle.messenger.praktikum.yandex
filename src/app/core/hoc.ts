import store, { StoreEvents } from "@/app/store";

// function isEqual() {
// 	return true;
// }

export function connect(mapStateToProps: (state: any) => any) {
	return function (Component: any) {
		return class extends Component {
			// constructor(...args: any[]) {
			constructor(props: any) {
				// console.log("Register connect");

				// сохраняем начальное состояние
				let state = mapStateToProps(store.getState());

				// console.log("-------------");
				// console.log("state", state);
				// console.log("store.getState()", store.getState());
				// console.log("props", props);
				// console.log("args", args);
				// console.log("-------------");

				super({ ...props, ...state });
				// super({ ...args, ...mapStateToProps(store.getState()) });

				store.on(StoreEvents.Updated, () => {
					// console.log("Store был обновлен значением:" );
					// при обновлении получаем новое состояние
					const newState = mapStateToProps(store.getState());
					// console.log("newState", newState);

					// если что-то из используемых данных поменялось, обновляем компонент
					// if (!isEqual(state, newState)) {
					this.setProps({ ...newState });
					// }

					// не забываем сохранить новое состояние
					state = newState;
				});
				// console.log(store);
			}
		};
	};
}
