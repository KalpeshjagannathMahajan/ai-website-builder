/* eslint-disable @typescript-eslint/no-unused-vars */
import i18next from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { show_toast } from 'src/actions/message';
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Button, Grid, Modal } from 'src/common/@the-source/atoms';
import SelectEditField from 'src/common/@the-source/atoms/FieldsNew/SelectEditField';
import { user_management } from 'src/utils/api_requests/userManagement';
import types from 'src/utils/types';
import { useTheme } from '@mui/material/styles';

const message = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 5000,
	state: types.SUCCESS_STATE,
	title: types.SUCCESS_TITLE,
	subtitle: i18next.t('UserManagement.DeactivatingUser.Deactivated_successfully'),
	showActions: false,
};

const DeactivationModal = ({ open, onClose, reporting_manager_list, handle_back_click, id }: any) => {
	const [selectedValue, setSelectedValue] = useState('');
	const [loading, set_loading] = useState(false);
	const dispatch = useDispatch();
	const theme: any = useTheme();
	const { t } = useTranslation();

	const handleChange = (e: any) => {
		setSelectedValue(e.target.value);
	};

	const handleClick = () => {
		set_loading(true);
		//API CALL AND CLOSE MODAL AND REDIRECT

		const payload = {
			new_reporting_manager: selectedValue,
			user_id: id,
		};

		user_management
			.deactivating_user(payload)
			.then((res: any) => {
				if (res?.status === 200) {
					set_loading(false);
					dispatch<any>(show_toast(message));
					onClose();
					handle_back_click();
				}
			})
			.catch((err) => {
				set_loading(false);
				console.error(err);
			});
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			bgColor={theme?.user_management?.deactivation_modal?.background}
			title={t('UserManagement.DeactivatingUser.title')}
			width={500}
			footer={
				<Grid container justifyContent={'flex-end'} gap={'2em'}>
					<Button variant='outlined' onClick={onClose} color='secondary'>
						{t('UserManagement.DeactivatingUser.Cancel')}
					</Button>
					<Button disabled={selectedValue === ''} onClick={handleClick} loading={loading} variant='contained' color='primary'>
						{t('UserManagement.DeactivatingUser.Done')}
					</Button>
				</Grid>
			}
			children={
				<>
					<CustomText type='Body'>{t('UserManagement.DeactivatingUser.Deactivating_user')}</CustomText>
					<Box my={2}>
						<SelectEditField
							options={reporting_manager_list}
							name='reporting_to'
							value={selectedValue}
							placeholder='Select User'
							onChangeCapture={(e: any) => handleChange(e)}
						/>
					</Box>
				</>
			}
		/>
	);
};

export default DeactivationModal;
