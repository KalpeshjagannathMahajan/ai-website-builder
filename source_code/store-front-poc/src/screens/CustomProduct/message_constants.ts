import types from 'src/utils/types';
import { t } from 'i18next';

export const error_message = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.ERROR_STATE,
	title: types.ERROR_TITLE,
	subtitle: 'Please fill all mandatory fields before proceeding',
	showActions: false,
};

export const success_message = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.SUCCESS_STATE,
	title: t('CustomProduct.Toast.Title'),
	subtitle: t('CustomProduct.Toast.SubTitle'),
	showActions: false,
};

export const update_message = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.SUCCESS_STATE,
	title: types.SUCCESS_TITLE,
	subtitle: 'Custom product updated!',
	showActions: false,
};
