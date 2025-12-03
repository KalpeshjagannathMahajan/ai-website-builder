export const replaceUndefinedAndEmpty = (obj: any) => {
	if (Array.isArray(obj)) {
		obj.forEach((item, index) => {
			if (item === undefined || item?.length === 0) {
				obj[index] = '';
			} else if (typeof item === 'object' && item !== null) {
				replaceUndefinedAndEmpty(item);
			}
		});
	} else if (typeof obj === 'object' && obj !== null) {
		Object.keys(obj).forEach((key) => {
			if (obj[key] === undefined || obj[key]?.length === 0) {
				obj[key] = '';
			} else if (typeof obj[key] === 'object' && obj[key] !== null) {
				replaceUndefinedAndEmpty(obj[key]);
			}
		});
	}
};
