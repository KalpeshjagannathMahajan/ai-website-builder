interface Config {
	web_updated_to_latest_version: boolean;
}

const initialState: Config = {
	web_updated_to_latest_version: true,
};

const version_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		// TODO: All the configs should be stored in the redux store
		case 'UPDATE_TO_LATEST_VERSION':
			return {
				...state,
				web_updated_to_latest_version: action.data,
			};
		default:
			return state;
	}
};

export default version_reducer;
