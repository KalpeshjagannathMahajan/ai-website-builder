export const nylas_config = (data: any) => {
	return {
		type: 'NYLAS_CONFIG',
		data,
	};
};
export const nylas_clear = () => {
	return {
		type: 'NYLAS_CLEAR',
	};
};
