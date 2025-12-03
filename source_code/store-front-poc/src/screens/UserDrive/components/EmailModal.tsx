/* eslint-disable react/no-array-index-key */
import { Box, FormHelperText, Grid, Input, InputAdornment, Modal } from '@mui/material';
import { Button, Icon } from 'src/common/@the-source/atoms';
import React, { useEffect, useRef, useState } from 'react';
import driveApis from 'src/utils/api_requests/userDriveApis';
import { Links_Data } from '../utils/Types';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { validateEmail } from '../Functions/utils';
import { useTheme } from '@mui/material/styles';
import useStyles from './../css/FileComponentStyle';

interface EmailModalProps {
	open_email_modal: boolean;
	set_open_email_modal: any;
	file_links_to_share: Links_Data[];
	set_action_message: any;
	set_open_message_modal: any;
	set_show_action_icon?: any;
	user_info: any;
}

export const EmailModal = ({
	open_email_modal,
	set_open_email_modal,
	file_links_to_share,
	set_action_message,
	set_open_message_modal,
	set_show_action_icon,
	user_info,
}: EmailModalProps) => {
	const classes = useStyles();
	const user_details = useSelector((state: any) => state?.login?.userDetails);
	const [to_mail, set_to_mail] = useState('');
	const [cc_mail, set_cc_mail] = useState('');
	const [bcc_mail, set_bcc_mail] = useState('');
	const [subject_mail, set_subject_mail] = useState(`${user_info?.company_name}: Files_${dayjs().format('YYYY-MM-DD')}`);
	const [error_message, set_error_message] = useState('');
	const email_body_ref = useRef<any>(null);
	const [show_loader, set_show_loader] = useState(false);
	const theme: any = useTheme();

	async function handleSendEmail() {
		if (to_mail?.length === 0) {
			set_action_message('Please Enter Receivers Email!!');
			set_open_message_modal(true);
			return;
		} else if (!validateEmail(to_mail)) {
			set_error_message('Please enter correct email!');
			return;
		}

		set_show_loader(true);
		try {
			let body_html = email_body_ref?.current?.innerHTML;
			let response: any = await driveApis.send_email(to_mail, cc_mail, bcc_mail, subject_mail, body_html);
			if (response.status === 200) {
				set_to_mail('');
				set_cc_mail('');
				set_bcc_mail('');
				set_subject_mail('');
				set_open_email_modal(false);
				set_action_message('Mail sent successfully');
				set_show_action_icon(true);
				set_open_message_modal(true);
				return;
			}
		} catch (err) {
			set_action_message('Error while sending email!!');
			set_open_message_modal(true);
		}
		set_show_loader(false);
	}

	useEffect(() => {
		if (user_details?.email) {
			set_cc_mail(user_details?.email);
		}
	}, [user_details?.email]);

	return (
		<Modal
			open={open_email_modal}
			onClose={() => set_open_email_modal(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box borderRadius={2} className={classes.email_box}>
				<Grid container justifyContent='space-between' alignItems='center'>
					<Grid item>
						<CustomText type='H2'>{t('Files.NewMessage')}</CustomText>
					</Grid>
					<Grid item>
						<Icon iconName='IconX' onClick={() => set_open_email_modal(false)} />
					</Grid>
				</Grid>
				<Box borderRadius={2} className={classes.email_container}>
					<Input
						id='standard-adornment-weight'
						startAdornment={<InputAdornment position='start'>To</InputAdornment>}
						value={to_mail}
						onChange={(e) => {
							set_to_mail(e.target.value);
							set_error_message('');
						}}
						aria-describedby='standard-weight-helper-text'
						className={classes.email_input}
						type='email'
					/>
					<FormHelperText id='email-error-text' sx={{ color: theme?.user_drive?.email_modal?.form_helper_color, fontSize: '14px' }}>
						{error_message}
					</FormHelperText>
					<Input
						id='standard-adornment-weight'
						startAdornment={<InputAdornment position='start'>cc</InputAdornment>}
						value={cc_mail}
						onChange={(e) => set_cc_mail(e.target.value)}
						aria-describedby='standard-weight-helper-text'
						className={classes.email_input}
						type='email'
					/>
					<Input
						id='standard-adornment-weight'
						startAdornment={<InputAdornment position='start'>bcc</InputAdornment>}
						value={bcc_mail}
						onChange={(e) => set_bcc_mail(e.target.value)}
						aria-describedby='standard-weight-helper-text'
						className={classes.email_input}
						type='email'
					/>
					<Input
						id='standard-adornment-weight'
						startAdornment={<InputAdornment position='start'>Subject</InputAdornment>}
						value={subject_mail}
						onChange={(e) => set_subject_mail(e.target.value)}
						aria-describedby='standard-weight-helper-text'
						className={classes.email_input}
					/>
					<div
						ref={(ref) => {
							email_body_ref.current = ref;
						}}
						contentEditable='true'
						className={classes.email_body}>
						<CustomText>{t('Files.FindAttached')}</CustomText>
						{file_links_to_share?.map((data: Links_Data, indx: number) => {
							return (
								<React.Fragment key={indx}>
									<a href={data?.fileLink} style={{ color: theme?.user_drive?.email_modal?.fragment_color }} key={indx}>
										{data?.txt}
									</a>
									<br />
								</React.Fragment>
							);
						})}
					</div>
					<Grid display='flex' flexDirection='row' justifyContent='flex-end'>
						<Button loading={show_loader} onClick={() => handleSendEmail()}>
							{t('Files.Send')}
						</Button>
					</Grid>
				</Box>
			</Box>
		</Modal>
	);
};
