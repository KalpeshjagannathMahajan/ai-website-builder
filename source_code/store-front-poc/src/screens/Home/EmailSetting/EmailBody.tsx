import { TextField } from '@mui/material';
import classes from './EmailSetting.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { get_initials, validate_email } from 'src/utils/common';
import { Grid } from 'src/common/@the-source/atoms';
import { t } from 'i18next';

interface EmailBodyProps {
	email: string;
	set_email: any;
	configure_type: string;
}

const EmailBody = ({ email, set_email, configure_type }: EmailBodyProps) => {
	return (
		<>
			{configure_type === 'send_email' ? (
				<CustomText type='Title' color='#00000099'>
					{t('ConfigureEmail.EmailBody.SendEmail.Title')}
				</CustomText>
			) : (
				<CustomText type='Title' color='#00000099'>
					{t('ConfigureEmail.EmailBody.EmailConnected.Title')}
				</CustomText>
			)}
			{configure_type === 'send_email' && (
				<TextField
					label={t('ConfigureEmail.EmailBody.SendEmail.Label')}
					type='email'
					fullWidth
					value={email}
					onChange={(e) => {
						set_email(e.target.value.trim());
					}}
					placeholder={t('ConfigureEmail.EmailBody.SendEmail.PlaceHolder')}
					error={email?.length > 0 && !validate_email(email)}
					helperText={
						email?.length > 0 && !validate_email(email) ? (
							<CustomText type='Body' color='red'>
								{t('ConfigureEmail.EmailBody.SendEmail.ErrorMessage')}
							</CustomText>
						) : (
							''
						)
					}
				/>
			)}

			{(configure_type === 'email_connected' || configure_type === 'email_disconnected') && (
				<Grid container direction={'row'} alignItems={'center'} mt='15px'>
					<div className={classes.image_box}>
						<CustomText type='H1' style={{ fontWeight: 400 }} color={'#AE3500'}>
							{get_initials(email, 2)}
						</CustomText>
					</div>

					<CustomText type='H3' color='#000000DE'>
						{email}
					</CustomText>
				</Grid>
			)}
		</>
	);
};

export default EmailBody;
