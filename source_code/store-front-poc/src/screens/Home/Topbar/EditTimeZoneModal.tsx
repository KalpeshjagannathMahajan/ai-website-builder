// import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import { secondary } from 'src/utils/light.theme';
// import { MenuItem, Select } from '@mui/material';
import SelectEditField from 'src/common/@the-source/atoms/FieldsNew/SelectEditField';
import { isEmpty } from 'lodash';
import Alert from 'src/common/@the-source/atoms/Alert';
import { colors } from 'src/utils/theme';
import user from 'src/utils/api_requests/user';
import { useDispatch } from 'react-redux';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { fetch_user_details } from 'src/actions/login';
import { get_default_timezone } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import TIMEZONES from 'src/utils/timezone';
import { useTheme } from '@mui/material/styles';

interface EditTimeZoneModalProps {
	open: boolean;
	handle_close: () => void;
}

const EditTimeZoneModal = ({ open, handle_close }: EditTimeZoneModalProps) => {
	const dispatch = useDispatch();

	const user_timezone = useSelector((state: any) => state?.login?.userDetails?.timezone);

	const [options] = useState<any[]>(TIMEZONES);
	const [selected_timezone, set_selected_timezone] = useState<string>(user_timezone ?? '');
	const [is_loading, set_is_loading] = useState(false);
	const theme: any = useTheme();

	const methods = useForm();

	const handle_cancel = () => {
		handle_close();
	};

	const handle_save = async () => {
		if (is_loading) return;
		try {
			set_is_loading(true);
			await user.set_timezone(selected_timezone);
			await fetch_user_details()(dispatch);
			handle_close();
		} catch (err) {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					showActions: false,
				}),
			);
		} finally {
			set_is_loading(false);
		}
	};

	useEffect(() => {
		if (isEmpty(user_timezone)) {
			const default_time_zone: string = get_default_timezone();
			set_selected_timezone(default_time_zone);
		} else {
			set_selected_timezone(user_timezone);
		}
	}, [user_timezone]);

	return (
		<Modal
			width={480}
			open={open}
			title={t('Common.Main.Timezone')}
			onClose={handle_cancel}
			children={
				<Grid container flexDirection={'column'} gap={1.5}>
					{/* <Grid container marginLeft={-1} flexDirection={'row'} alignItems={'center'}>
						<Checkbox checked={automatic_timezone} onChange={() => set_automatic_timezone((prev) => !prev)} />
						<CustomText type='Body' color={text_colors.primary}>
							{t('Common.Main.SetTimezoneAutomatic')}
						</CustomText>
					</Grid> */}
					{/* <Select
						fullWidth
						disabled={automatic_timezone}
						value={selected_timezone}
						onChange={(e) => {
							set_selected_timezone(e.target.value);
						}}>
						{map(options, (item: any) => (
							<MenuItem key={`${item?.label}`} value={`${item?.value}`} sx={{ background: 'none' }}>
								{item?.label}
							</MenuItem>
						))}
					</Select> */}
					<FormProvider {...methods}>
						<SelectEditField
							name='timezone'
							label={t('Common.Main.Timezone')}
							value={selected_timezone}
							options={options}
							defaultValue={selected_timezone}
							onChangeCapture={(e: any) => {
								set_selected_timezone(e.target.value);
							}}
						/>
					</FormProvider>
					<Alert
						severity={''}
						icon={<Icon iconName='IconInfoCircle' color={secondary[700]} />}
						style={{
							backgroundColor: theme?.palette?.warning[100],
							color: colors.secondary_text,
							display: 'flex',
							alignItems: 'center',
						}}
						open={true}
						handle_close={() => {}}
						is_cross={false}
						message={t('Common.Main.WarningForUpdateTimezone')}
					/>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={handle_cancel}>
						{t('Common.Main.Cancel')}
					</Button>
					<Button color='primary' loading={is_loading} onClick={handle_save}>
						{t('Common.Main.Save')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default EditTimeZoneModal;
