import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Drawer, Icon } from 'src/common/@the-source/atoms';
import DisconnectModal from './DisconnectModal';
import classes from './EmailSetting.module.css';
import { handle_alert, handle_footer_buttons, handle_image } from './helper';
import { t } from 'i18next';
import EmailBody from './EmailBody';
import naylas_config from 'src/utils/api_requests/email_config';
import RouteNames from 'src/utils/RouteNames';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface ConfigEmailDrawerProps {
	open: boolean;
	set_open: any;
}

const ConfigureEmailDrawer = ({ open, set_open }: ConfigEmailDrawerProps) => {
	const dispatch = useDispatch();
	const user_status = useSelector((state: any) => state?.nylas?.status);
	const email_id = useSelector((state: any) => state?.nylas?.meta?.email_address);
	const [configure_type, set_configure_type] = useState<string>('');
	const [email, set_email] = useState<string>(email_id);
	const [is_connect, set_connect] = useState<boolean>(user_status === 'published');
	const [disconnect_modal, set_disconnect_modal] = useState<boolean>(false);

	const handle_connect = async () => {
		try {
			const absolutePath = window.location.origin;
			const success_url = `${absolutePath}${RouteNames.naylas.path}`;
			let response: any = await naylas_config.genrate_url({ email, success_url });
			const naylas_url = response?.data?.auth_url;

			if (naylas_url) {
				window.location.replace(naylas_url);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		set_connect(user_status === 'published');
		set_email(email_id);

		const newConfigureType = !email?.length ? 'send_email' : is_connect ? 'email_connected' : 'email_disconnected';
		set_configure_type(newConfigureType);
	}, [user_status, email_id]);

	const handle_render_body = () => {
		return (
			<Grid container direction='column' justifyContent='space-between' px='20px' py='16px' sx={{ height: 'calc(100vh - 137px)' }}>
				<Grid container sx={{ gap: '15px' }}>
					<EmailBody email={email} set_email={set_email} configure_type={configure_type} />
				</Grid>
				<Grid container justifyContent={'center'}>
					{handle_image(configure_type)}
				</Grid>
				<Grid>{handle_alert(configure_type)}</Grid>
			</Grid>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={520}
				open={open}
				onClose={() => {
					set_open(false);
				}}
				content={
					<Grid container className={classes.drawer}>
						<Grid container className={classes.header}>
							<CustomText type='H2'>{t('ConfigureEmail.Header')}</CustomText>
							<Icon
								iconName='IconX'
								className={classes.cross_icon}
								onClick={() => {
									set_open(false);
								}}
							/>
						</Grid>
						{handle_render_body()}
						<Grid container className={classes.footer}>
							{handle_footer_buttons(configure_type, set_disconnect_modal, handle_connect, set_open, dispatch)}
						</Grid>
					</Grid>
				}
			/>
			<DisconnectModal open_modal={disconnect_modal} set_modal={set_disconnect_modal} setUserEmail={set_email} set_open={set_open} />
		</>
	);
};

export default ConfigureEmailDrawer;
