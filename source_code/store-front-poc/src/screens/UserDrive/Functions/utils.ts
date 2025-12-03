export function extract_data_from_response(data: any) {
	const refactoredData = [];

	for (const key in data) {
		if (!isNaN(Number(key))) {
			refactoredData.push(data[key]);
		}
	}
	return refactoredData;
}

export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
};

export const getFilenameWithoutExtension = (filename: string): string => {
	if (filename?.includes('.')) {
		let parts = filename?.split('.');
		parts?.pop();
		return parts?.join('.');
	} else {
		return filename;
	}
};

export const getFileExtension = (filename: string): string => {
	const parts = filename?.split('.');
	if (parts?.length > 1) {
		return parts?.pop() || '';
	}
	return '';
};
