import store, { StoreEvents } from "@/app/stores";

function isEqual() {
	return true;
}

export function connect(mapStateToProps: (state: any) => any) {
	return function (Component: any) {
		return class extends Component {
			constructor(...args: any[]) {
				// console.log("Register connect");

				// сохраняем начальное состояние
				let state = mapStateToProps(store.getState());

				super({ ...args, ...mapStateToProps(store.getState()) });

				store.on(StoreEvents.Updated, () => {
					// при обновлении получаем новое состояние
					const newState = mapStateToProps(store.getState());

					// если что-то из используемых данных поменялось, обновляем компонент
					if (!isEqual(state, newState)) {
						this.setProps({ ...newState });
					}

					// не забываем сохранить новое состояние
					state = newState;
				});
				// console.log(store);
			}
		};
	};
}
