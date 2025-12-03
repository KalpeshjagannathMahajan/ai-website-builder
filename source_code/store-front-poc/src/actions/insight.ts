export const insight_list = (data: any) => {
	return {
		type: 'INSIGHT_LIST',
		data,
	};
};
export const insight_version = (data: any) => {
	return {
		type: 'INSIGHT_VERSION',
		data,
	};
};

export const insight_config = (data: any) => {
	return {
		type: 'INSIGHT_CONFIG',
		data,
	};
};
