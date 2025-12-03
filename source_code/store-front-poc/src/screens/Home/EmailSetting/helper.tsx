import { Alert, AlertColor } from '@mui/material';
import classes from './EmailSetting.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Icon, Image } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import naylas_config from 'src/utils/api_requests/email_config';
import utils from 'src/utils/utils';
import { t } from 'i18next';

const render_alert = (severity: AlertColor, icon: any, message: string, borderColor: string) => {
	return (
		<Alert
			severity={severity}
			icon={icon}
			className={classes.alert_style}
			sx={{
				border: `1px solid ${borderColor || 'transparent'}`,
			}}>
			<CustomText type='Body' color='#000000DE'>
				<div dangerouslySetInnerHTML={{ __html: message }} />
			</CustomText>
		</Alert>
	);
};

export const handle_disconnect = async (dispatch: any, set_open: any) => {
	//is_remove: boolean = false
	try {
		const res: any = await naylas_config.disconnected();
		if (res.status === 200) {
			utils.handle_connected_account(dispatch);
			set_open(false);
		}
	} catch (err) {
		console.error(err);
	}
};

export const handle_alert = (configure_type: string) => {
	switch (configure_type) {
		case 'send_email':
			return render_alert(
				'info',
				<Icon className={classes.icon_style} sx={{ color: '#4578C4' }} iconName='IconMoodSmileBeam' />,
				t('ConfigureEmail.SendEmail.AlertMessage'),
				'#4578c4',
			);
		case 'email_connected':
			return render_alert(
				'success',
				<Icon className={classes.icon_style} sx={{ color: '#5B7C00' }} iconName='IconConfetti' />,
				t('ConfigureEmail.EmailConnected.AlertMessage'),
				'#5B7C00',
			);
		case 'email_disconnected':
			return render_alert(
				'warning',
				<Icon className={classes.icon_style} sx={{ color: '#CE921E' }} iconName='IconAlertTriangle' />,
				t('ConfigureEmail.EmailDisConnected.AlertMessage'),
				'#CE921E',
			);
		default:
			return null;
	}
};

export const handle_footer_buttons = (
	configure_type: string,
	set_disconnect_modal: any,
	handle_connect: any,
	set_open: any,
	dispatch: any,
) => {
	const config: any =
		{
			send_email: [
				{
					label: t('ConfigureEmail.SendEmail.Cancel'),
					color: 'secondary',
					action: () => {
						set_open(false);
					},
				},
				{
					label: t('ConfigureEmail.SendEmail.Connect'),
					color: 'primary',
					action: () => {
						handle_connect();
					},
				},
			],
			email_connected: [
				{
					label: t('ConfigureEmail.EmailConnected.DisConnect'),
					color: 'secondary',
					action: () => {
						set_disconnect_modal(true);
					},
				},
				{
					label: t('ConfigureEmail.EmailConnected.Okay'),
					color: 'primary',
					action: () => {
						set_open(false);
					},
				},
			],
			email_disconnected: [
				{
					label: t('ConfigureEmail.EmailDisConnected.RemoveAccount'),
					color: 'secondary',
					action: () => {
						handle_disconnect(dispatch, set_open);
					},
				},
				{
					label: t('ConfigureEmail.EmailDisConnected.ReConnect'),
					color: 'primary',
					action: () => {
						handle_connect();
					},
				},
			],
		}[configure_type] || [];

	return config?.map(({ label, color, action }: any, index: number) => (
		<Button sx={{ padding: '5px 20px', color }} onClick={action} variant={index === 0 ? 'outlined' : 'contained'}>
			<CustomText type='H3' style={{ color: index === 1 ? 'white' : 'inherit' }}>
				{label}
			</CustomText>
		</Button>
	));
};

export const handle_image = (configure_type: string) => {
	let src: any;
	switch (configure_type) {
		case 'send_email':
			src = ImageLinks.send_mail;
			break;
		case 'email_connected':
			src = ImageLinks.connected;
			break;
		default:
			src = ImageLinks.disconnect;
	}

	return <Image src={src} height={'200px'} width={'230px'} />;
};
