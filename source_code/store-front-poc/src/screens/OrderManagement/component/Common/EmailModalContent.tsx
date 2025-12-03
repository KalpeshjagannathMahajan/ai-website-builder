import { Checkbox, Chip, Icon } from 'src/common/@the-source/atoms';
import { Button, Grid } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { DRAWER_TYPES } from '../../constants';
import Alert from 'src/common/@the-source/atoms/Alert';
import { background_colors, primary, secondary, text_colors } from 'src/utils/light.theme';
import { info } from 'src/utils/common.theme';
import order_management from 'src/utils/api_requests/orderManagment';
import { Skeleton } from '@mui/material';
import { t } from 'i18next';
import { EMAIL_EXCLUDE_ACTIONS } from '../../mock/document';

const chip_style = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '1.5rem 0.5rem',
	cursor: 'pointer',
};

const parent_container = {
	background: background_colors?.secondary,
	padding: '1rem 0rem',
	marginTop: '1rem',
	borderRadius: '0.8rem',
};

export default function EmailModalContent({
	modal_message,
	payload,
	email_data,
	set_email_data,
	email_checkbox,
	set_email_checkbox,
	handle_drawer_state,
	handle_drawer_type,
	set_email_drawer,
	add_edit_permission = true,
}: any) {
	const [loading, set_loading] = useState(false);

	const handle_chip_emails = (emails: any) => {
		const max_visible = 4; // Change this number to the desired amount of initially visible emails
		const visible_emails = _.take(emails, max_visible);
		const remaining_email_count = _.size(emails) - max_visible;

		return (
			_.size(emails) > 0 && (
				<Grid container gap={1.5} sx={{ padding: '0rem 0rem 0rem 3rem', alignItems: 'center' }}>
					{_.map(visible_emails, (item, ind) => (
						<Chip key={ind} size='small' label={item} bgColor={primary?.contrastText} textColor={text_colors.black} sx={chip_style} />
					))}
					{remaining_email_count > 0 && <CustomText color={secondary[600]} type='H3'>{`+${remaining_email_count} more`}</CustomText>}
				</Grid>
			)
		);
	};

	const handle_show_content = () => {
		if (!email_data?.is_enable) return;

		const alert_msg = !email_checkbox
			? t('Common.EmailModal.NoEmailSent')
			: _.size(email_data?.to_emails) > 0
			? ''
			: _.size(email_data.bcc_emails) > 0 || _.size(email_data.cc_emails) > 0
			? t('Common.EmailModal.NoEmailSent')
			: t('Common.EmailModal.NoCustomerFound');

		if (alert_msg)
			return (
				<Alert
					style={{ padding: '0rem 1rem', margin: '1rem ', background: info[50], border: `1px solid ${info[500]}` }}
					icon={<Icon iconName='IconAlertCircle' color={info[500]} />}
					is_cross={false}
					message={<CustomText color={info[500]}>{alert_msg}</CustomText>}
					severity={'warning'}
					open={true}
				/>
			);

		return handle_chip_emails(email_data?.to_emails);
	};

	const handle_email_drawer = () => {
		if (handle_drawer_state && handle_drawer_type) {
			handle_drawer_state(true);
			handle_drawer_type(DRAWER_TYPES.notification_email_ids);
		} else if (set_email_drawer) {
			set_email_drawer(true);
		}
	};

	const get_email_config_info = () => {
		set_loading(true);
		order_management
			.get_email_config_info(payload)
			.then((res: any) => {
				set_email_data(res?.data);
				set_email_checkbox(res?.data?.is_auto_trigger);
			})
			.catch((err) => console.error(err))
			.finally(() => set_loading(false));
	};

	useEffect(() => {
		if (EMAIL_EXCLUDE_ACTIONS.includes(payload?.action)) {
			set_email_data([]);
			set_email_checkbox(false);
		} else get_email_config_info();
	}, []);

	return (
		<Grid>
			<CustomText type='Body'>{modal_message?.sub}</CustomText>
			{loading ? (
				<Skeleton variant='rounded' width={400} height={70} sx={{ margin: '1rem 0rem' }} />
			) : (
				email_data?.is_enable && (
					<Grid container sx={parent_container}>
						<Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Grid item sx={{ display: 'flex', alignItems: 'center' }}>
								<Checkbox
									checked={email_checkbox}
									onChange={() => set_email_checkbox((prev: boolean) => !prev)}
									disabled={!email_data?.user_permission_flag}
								/>
								<CustomText>{t('Common.EmailModal.SendEmail')}</CustomText>
							</Grid>
							<Grid item>
								<Button variant='text' onClick={handle_email_drawer} disabled={!email_checkbox || !add_edit_permission}>
									Add/Edit
								</Button>
							</Grid>
						</Grid>
						{handle_show_content()}
					</Grid>
				)
			)}
		</Grid>
	);
}
