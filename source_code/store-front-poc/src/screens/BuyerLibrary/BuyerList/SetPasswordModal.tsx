import { IconButton, InputAdornment } from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Checkbox, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import InputField from 'src/common/@the-source/atoms/Input';
import user from 'src/utils/api_requests/user';
import { background_colors, secondary, text_colors } from 'src/utils/light.theme';
import { error, success } from 'src/utils/common.theme';

const check_icon = { height: '48px', width: '48px' };
const icons = { height: '24px', width: '24px' };
const icon_container = { background: background_colors?.primary, borderRadius: '44px', padding: '10px', width: '44px', height: '44px' };

const SetPasswordModal = ({ open, on_close, data, set_reload }: any) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		watch,
	} = useForm();
	const [loading, set_loading] = useState<boolean>(false);
	const [send_email, set_send_email] = useState<boolean>(true);
	const [show_new_password, set_show_new_password] = useState<boolean>(false);
	const [show_confirm_password, set_show_confirm_password] = useState<boolean>(false);
	const [password_change_success, set_password_change_success] = useState<boolean>(false);

	const new_password = watch('new_password');

	const handle_show_new_password = () => {
		set_show_new_password(!show_new_password);
	};

	const handle_show_confirm_password = () => {
		set_show_confirm_password(!show_confirm_password);
	};

	const handle_copy_creds = () => {
		const creds: any = {
			email: data?.email,
			password: new_password,
		};
		navigator.clipboard.writeText(`Email: ${creds.email}\nPassword: ${creds.password}`);
	};

	const onSubmit = async (formData: any) => {
		if (formData.new_password !== formData.confirm_password) {
			setError('confirm_password', {
				type: 'manual',
				message: 'Passwords do not match',
			});
			return;
		}

		const payload = {
			user_id: data?.reference_id || data?.id,
			new_password: formData.new_password,
			is_send_email: send_email,
		};
		set_loading(true);
		try {
			const res: any = await user.set_password_wizshop(payload);
			if (res.status === 200) {
				set_password_change_success(true);
			}
		} catch (err) {
			console.error(err);
		} finally {
			set_loading(false);
		}
	};
	const handle_success_close = () => {
		if (_.includes(['Invited', 'Yet to be invited'], data?.status)) {
			set_reload((prev: any) => !prev);
		}
		on_close();
	};
	//react elements
	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={on_close} disabled={loading}>
					Cancel
				</Button>
				<Button disabled={!_.isEmpty(errors)} onClick={handleSubmit(onSubmit)} loading={loading}>
					Set password
				</Button>
			</Grid>
		);
	};
	const handle_render_success_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={handle_copy_creds}>
					Copy credentials
				</Button>
				<Button onClick={handle_success_close}>Got it!</Button>
			</Grid>
		);
	};

	const handle_set_password_form = () => {
		return (
			<Grid display={'flex'} direction={'column'} gap={2}>
				<CustomText>Set password for the user</CustomText>
				<Grid>
					<InputField
						children={undefined}
						{...register('new_password', {
							required: 'Password is required',
							minLength: {
								value: 8,
								message: 'Password must be at least 8 characters long',
							},
							maxLength: {
								value: 16,
								message: 'Password cannot be more than 16 characters long',
							},
						})}
						sx={{ width: '100%' }}
						id={'new_password'}
						error={!!errors.new_password}
						label={'New Password'}
						variant='outlined'
						type={show_new_password ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={handle_show_new_password}>
										{show_new_password ? (
											<Icon iconName='IconEye' color={secondary[600]} />
										) : (
											<Icon iconName='IconEyeOff' color={secondary[600]} />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					{errors?.new_password && (
						<Grid p={1}>
							<CustomText type='Caption' color={error?.main}>
								{errors?.new_password?.message}
							</CustomText>
						</Grid>
					)}
				</Grid>
				<Grid>
					<InputField
						children={undefined}
						{...register('confirm_password', {
							required: 'Password is required',
							minLength: {
								value: 8,
								message: 'Password must be at least 8 characters long',
							},
							maxLength: {
								value: 16,
								message: 'Password cannot be more than 16 characters long',
							},
						})}
						sx={{ width: '100%' }}
						id={'confirm_password'}
						error={!!errors.confirm_password}
						label={'Confirm new password'}
						variant='outlined'
						type={show_confirm_password ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={handle_show_confirm_password}>
										{show_confirm_password ? (
											<Icon iconName='IconEye' color={secondary[600]} />
										) : (
											<Icon iconName='IconEyeOff' color={secondary[600]} />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					{errors?.confirm_password && (
						<Grid p={1}>
							<CustomText type='Caption' color={error?.main}>
								{errors?.confirm_password?.message}
							</CustomText>
						</Grid>
					)}
				</Grid>
				<Grid display={'flex'} alignItems={'center'} gap={1}>
					<Checkbox size='small' checked={send_email} onClick={() => set_send_email(!send_email)} sx={{ padding: 0 }} />
					<CustomText>Email new credentials to the user</CustomText>
				</Grid>
			</Grid>
		);
	};

	const handle_success_password = () => {
		return (
			<Grid display={'flex'} direction={'column'} gap={2}>
				<Grid display={'flex'} direction={'column'} gap={1} alignItems={'center'}>
					<Icon iconName='IconCircleCheckFilled' color={success?.main} sx={check_icon} />
					<CustomText type='Body' color={text_colors?.primary}>
						{send_email ? 'The new credentials have been emailed to the user' : 'The new credentials have been set for the user'}
					</CustomText>
				</Grid>
				<Grid display={'flex'} direction={'column'} gap={1} padding={1.2} bgcolor={background_colors?.secondary}>
					<Grid display={'flex'} gap={1}>
						<Grid sx={icon_container}>
							<Icon iconName='IconMail' sx={icons} />
						</Grid>
						<Grid>
							<CustomText type='Caption' color={text_colors?.primary}>
								Email
							</CustomText>
							<CustomText type='Subtitle' color={text_colors?.black}>
								{data?.email}
							</CustomText>
						</Grid>
					</Grid>
					<Grid display={'flex'} gap={1}>
						<Grid sx={icon_container}>
							<Icon iconName='IconKey' sx={icons} />
						</Grid>
						<Grid>
							<CustomText type='Caption' color={text_colors?.primary}>
								Password
							</CustomText>
							<CustomText type='Subtitle' color={text_colors?.black}>
								{new_password}
							</CustomText>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	return (
		<Modal
			title={password_change_success ? 'Password set successfully!' : 'Create new password'}
			onClose={on_close}
			open={open}
			children={<> {password_change_success ? handle_success_password() : handle_set_password_form()}</>}
			footer={password_change_success ? handle_render_success_footer() : handle_render_footer()}
		/>
	);
};

export default SetPasswordModal;
