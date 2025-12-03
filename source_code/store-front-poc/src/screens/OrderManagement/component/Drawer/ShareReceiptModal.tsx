/* eslint-disable @typescript-eslint/no-unused-vars */
import { t } from 'i18next';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import { useDispatch } from 'react-redux';
import types from 'src/utils/types';
import { close_toast, show_toast } from 'src/actions/message';
import { useTheme } from '@mui/material/styles';
import EmailInput from '../Common/EmailInput';

interface Props {
	is_visible: boolean;
	close: () => void;
	document_id?: string;
	transaction_id?: string;
	track_id: string;
	prefilled_emails: any;
	type?: string;
}

const ShareReceiptComp = ({
	is_visible,
	close,
	document_id = '',
	track_id,
	prefilled_emails,
	type = 'share_receipt',
	transaction_id = '',
}: Props) => {
	const [emails, setEmails] = useState<string[]>([]);
	const [query, set_query] = useState<any>('');
	const [error, set_error] = useState(false);
	const methods = useForm({ mode: 'onChange' });
	const dispatch = useDispatch();
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const iconStyle = {
		color: theme?.payments?.share_receipt_modal?.icon,
		cursor: 'pointer',
	};
	const iconDisableStyle = {
		color: theme?.payments?.share_receipt_modal?.icon_disabled,
	};

	const make_toast_visible = (state: string) => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					console.log(event);
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: state === 'success' ? types.SUCCESS_STATE : types.ERROR_STATE,
				title:
					state === 'success'
						? type === 'resend_payment_link'
							? t('Payment.PaymentLinkShared')
							: t('Payment.PaymentReceiptShared')
						: type === 'resend_payment_link'
						? t('Payment.PaymentLinkShareFailed')
						: t('Payment.PaymentReceiptShareFailed'),
				subtitle: '',
				showActions: false,
			}),
		);
	};

	const handle_send = () => {
		const payload = {
			emails,
			document_id,
			track_id,
			transaction_id,
		};
		const apiCall =
			type === 'resend_payment_link'
				? api_requests.order_management.resend_payment_link(payload)
				: api_requests.order_management.share_receipt(payload);

		apiCall
			.then((res: any) => {
				if (res.status === 200) {
					make_toast_visible('success');
				} else {
					make_toast_visible('error');
				}
			})
			.catch((err: any) => {
				console.log(err);
				make_toast_visible('error');
			})
			.finally(() => {
				close();
			});
	};

	const handle_click = (value: string) => {
		setEmails((prev) => [...prev, value]);
		set_query('');
	};

	const handle_delete = (id: number) => {
		const updated_emails = _.filter(emails, (email, index: number) => index !== id);
		setEmails(updated_emails);
	};

	const handle_render_content = () => {
		return (
			<Grid display='flex' direction='column' gap={2}>
				<CustomText type='Body'>
					{type === 'resend_payment_link' ? t('Payment.EnterEmailResendPaymentLink') : t('Payment.EnterEmailShareReceipt')}
				</CustomText>

				<EmailInput
					methods={methods}
					query={query}
					set_query={set_query}
					set_error={set_error}
					handle_click={handle_click}
					error={error}
					selected_emails={emails}
				/>
				{is_ultron && (
					<Grid display='flex' direction='column' gap={1} mt={-1}>
						{emails?.map((item: any, index: number) => {
							return (
								<Grid display='flex' justifyContent='space-between' key={item.id} alignItems={'baseline'} gap={1}>
									<CustomText>{item}</CustomText>
									<Icon
										color='#4f555e'
										sx={{ cursor: 'pointer', transition: '0.2s ease-in-out' }}
										onClick={() => handle_delete(index)}
										iconName='IconTrash'
									/>
								</Grid>
							);
						})}
					</Grid>
				)}

				{emails?.map((item: any, index: number) => {
					return (
						<Grid display='flex' justifyContent='space-between' key={item.id} alignItems={'baseline'} gap={2}>
							<CustomText>{item}</CustomText>
							<Icon
								color={theme?.payments?.share_receipt_modal?.delete}
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

	useEffect(() => {
		if (!_.isEmpty(prefilled_emails)) {
			const validEmails = prefilled_emails.filter((email: string) => email.trim() !== '');
			setEmails(validEmails);
		}
	}, [prefilled_emails]);

	return (
		<Modal
			width={480}
			open={is_visible}
			onClose={() => {
				close();
			}}
			title={type === 'resend_payment_link' ? t('Payment.ResendPaymentLink') : t('Payment.ShareReceipt')}
			footer={
				<Grid container justifyContent='flex-end' gap={2}>
					<Button
						variant='outlined'
						onClick={() => {
							close();
						}}>
						{t('ManageData.Main.Cancel')}
					</Button>
					<Button disabled={emails.length === 0} onClick={handle_send}>
						Send
					</Button>
				</Grid>
			}
			children={handle_render_content()}
		/>
	);
};

const ShareReceiptModal = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <ShareReceiptComp {...props} />;
};

export default ShareReceiptModal;
