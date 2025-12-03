import { IconButton, InputAdornment, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { show_toast } from 'src/actions/message';
import user from 'src/utils/api_requests/user';
import { Box, Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import useStyles from '../style';
import CustomText from 'src/common/@the-source/CustomText';
import InputField from 'src/common/@the-source/atoms/Input';
import { useTheme } from '@mui/material/styles';
import _, { get } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { secondary } from 'src/utils/light.theme';
import { error } from 'src/utils/common.theme';

const password_validation = {
	required: t('AuthFlow.ResetPassword.EmptyPasswordErrorMessage'),
	minLength: {
		value: 8,
		message: t('AuthFlow.ResetPassword.PasswordLength'),
	},
	maxLength: {
		value: 16,
		message: 'Password cannot be more than 16 characters long',
	},
};

const config = [
	{
		name: t('AuthFlow.ResetPassword.CurrentPassword'),
		id: 'current_password',
		type: 'text',
		validation: password_validation,
	},
	{
		name: t('AuthFlow.ResetPassword.NewPassword'),
		id: 'password',
		type: 'text',
		validation: password_validation,
	},
	{
		name: t('AuthFlow.ResetPassword.ConfirmPassword'),
		id: 'confirm_password',
		type: 'text',
		validation: password_validation,
	},
];

export default function ChangePassword({ modal_open, set_modal_open }: any) {
	const classes = useStyles();
	const theme: any = useTheme();
	const dispatch = useDispatch();

	const user_data = useSelector((state: any) => state?.login?.userDetails);
	const token = useSelector((state: any) => state?.persistedUserData?.auth_access_token);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));
	const [loading, set_loading] = useState<boolean>(false);

	const methods = useForm({
		defaultValues: {
			current_password: '',
			password: '',
			confirm_password: '',
		},
	});
	const {
		reset,
		setError,
		register,
		handleSubmit,
		formState: { errors },
	} = methods;

	const [show_password, set_show_password] = useState<any>({
		current_password: false,
		password: false,
		confirm_password: false,
	});

	const handle_show_password = (key: any) => {
		set_show_password((prev: any) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const close_modal = () => {
		reset({});
		set_modal_open(false);
	};

	const submit = async (formData: any) => {
		set_loading(true);
		const { password, confirm_password, current_password } = formData;
		if (password !== confirm_password) {
			setError('confirm_password', {
				type: 'manual',
				message: 'New password and confirm password does not match',
			});
			set_loading(false);
			return;
		}

		const payload = {
			user_id: user_data.id,
			current_password,
			password,
			token,
		};
		try {
			const response: any = await user.wizshop_reset_password(payload);

			if (response.status === 200) {
				dispatch<any>(
					show_toast({
						open: true,
						autoHideDuration: 3000,
						state: 'success',
						title: '',
						subtitle: 'Password changed successfully',
					}),
				);

				setTimeout(() => {
					localStorage.clear();
					sessionStorage.clear();
					localStorage.setItem('logout-event', `logout${Math.random()}`);
					window.location.href = window.location.origin;
				}, 500);
			}
		} catch (err: any) {
			console.error('error', err);
			if (err?.response?.data?.error_code === 'USER__CURRENT_PASSWORD_DOES_NOT_MATCH') {
				setError('current_password', {
					type: 'manual',
					message: err?.response?.data?.message,
				});
			} else {
				setError('password', {
					type: 'manual',
					message: err?.response?.data?.message,
				});
			}
		} finally {
			set_loading(false);
		}
	};

	const render_footer = () => {
		return (
			<Grid container direction={is_small_screen ? 'column-reverse' : 'row'} className={classes.change_password_modal_footer}>
				<Button type='submit' onClick={close_modal} variant='outlined' disabled={loading}>
					{t('AuthFlow.ResetPassword.Cancel')}
				</Button>
				<Button type='submit' onClick={handleSubmit(submit)} loading={loading}>
					{t('AuthFlow.ResetPassword.ChangePassword')}
				</Button>
			</Grid>
		);
	};

	const render_body = () => {
		return (
			<Box className={classes.change_password_modal}>
				<CustomText
					style={{
						color: theme?.authflow?.login?.modal_subtitle_color,
					}}
					type='Body'>
					{t('AuthFlow.ResetPassword.ChangePasswordBody')}
				</CustomText>
				<Grid container>
					{_.map(config, (field: any) => (
						<Grid item mt={2} sx={{ position: 'relative' }} className={classes.full_width_style}>
							<InputField
								children={undefined}
								{...register(field?.id, field?.validation)}
								sx={{ width: '100%' }}
								id={field?.id}
								error={get(errors, `${field?.id}`)}
								label={field?.name}
								key={field?.id}
								variant='outlined'
								type={show_password[field?.id] ? 'text' : 'password'}
								InputProps={{
									style: {
										borderRadius: theme?.authflow?.login?.border_radius,
									},
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={() => handle_show_password(field?.id)}>
												{show_password[field?.id] ? (
													<Icon iconName='IconEye' color={secondary[600]} />
												) : (
													<Icon iconName='IconEyeOff' color={secondary[600]} />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							{get(errors, `${field?.id}`) && (
								<Grid container sx={{ marginBlock: '5px', padding: '2px 4px', flexWrap: 'wrap' }}>
									<CustomText type='Caption' color={error?.main}>
										{get(errors, `${field?.id}.message`)}
									</CustomText>
								</Grid>
							)}
						</Grid>
					))}
				</Grid>
			</Box>
		);
	};

	return (
		<Modal
			open={modal_open}
			onClose={close_modal}
			width={is_small_screen ? 345 : 400}
			// _height="600px"
			title='Change your password'
			footer={render_footer()}
			slotProps={{
				backdrop: {
					onClick: close_modal,
				},
			}}>
			<FormProvider {...methods}>{render_body()}</FormProvider>
		</Modal>
	);
}
