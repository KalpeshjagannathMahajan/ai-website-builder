import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import EmailInput from './EmailInput';

interface PaymentLinkProps {
	set_email_data: any;
	email_data: any;
}

const PaymentLink2 = ({ set_email_data, email_data }: PaymentLinkProps) => {
	const [query, set_query] = useState<any>('');
	const [error, set_error] = useState(false);
	const methods = useForm({ mode: 'onChange' });
	const theme: any = useTheme();
	const [emails, set_emails] = useState<String[]>([]);

	const handle_click = (value: string) => {
		const newEmails = [...emails, value];
		set_emails(newEmails);
		set_email_data((prev: any) => ({ ...prev, to_emails: newEmails }));
		set_query('');
	};

	const handle_delete = (id: number) => {
		const updated_emails = _.filter(emails, (_email, index: number) => index !== id);
		set_emails(updated_emails);
		set_email_data((prev: any) => ({ ...prev, to_emails: updated_emails }));
	};

	useEffect(() => {
		set_emails(email_data?.to_emails || []);
	}, [email_data]);

	return (
		<Grid display='flex' direction='column' gap={1.6}>
			<CustomText type='H3' style={{ marginBottom: '12px' }}>
				{t('Payment.SendEmailTo')}
			</CustomText>
			<EmailInput
				methods={methods}
				query={query}
				set_query={set_query}
				set_error={set_error}
				handle_click={handle_click}
				error={error}
				selected_emails={emails}
				label='Emails ID'
			/>
			{emails?.map((item: any, index: number) => {
				return (
					<Grid display='flex' justifyContent='space-between' key={item.id} alignItems={'baseline'} gap={2}>
						<CustomText>{item}</CustomText>
						<Icon
							color={theme?.order_management?.payment_link?.icon_color}
							sx={{ cursor: 'pointer', transition: '0.2s ease-in-out' }}
							onClick={() => handle_delete(index)}
							iconName='IconTrash'
						/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default PaymentLink2;
