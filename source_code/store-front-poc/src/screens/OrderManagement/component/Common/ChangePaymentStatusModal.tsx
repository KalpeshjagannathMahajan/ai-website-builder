import { useContext, useEffect, useMemo, useState } from 'react';
import { capitalize, find, get, isEmpty, map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Modal, Radio } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import order_management from 'src/utils/api_requests/orderManagment';
import OrderManagementContext from '../../context';

const ChangePaymentStatusModal = () => {
	const {
		document_data: { id = '', type = '', payment_status = '' },
		set_success_toast,
		is_status_updating,
		set_document_details,
		set_is_status_updating,
		manual_payment_status_form,
		manual_payment_status_modal,
		set_manual_payment_status_modal,
	} = useContext(OrderManagementContext);
	const [selected_option, set_selected_option] = useState({ label: '', value: '' });
	const { t } = useTranslation();

	const options = useMemo(() => {
		const form_attributes = get(manual_payment_status_form, 'payment_status.attributes', {});
		const payment_status_attrs = find(form_attributes, { id: 'payment_status' });
		return payment_status_attrs?.options || [];
	}, [manual_payment_status_form]);

	const handle_submit = async () => {
		try {
			set_is_status_updating(true);
			const payload = {
				document_id: id,
				payment_status: selected_option?.value,
			};
			const response: any = await order_management.update_payment_status(payload);
			if (response?.status === 200) {
				set_success_toast({
					open: true,
					title: t('OrderManagement.ManualPaymentStatusModal.SuccessStateMsg', { doc_type: capitalize(type) }),
					subtitle: '',
					state: 'success',
				});
				set_document_details((prev: any) => ({
					...prev,
					payment_status: selected_option?.value,
				}));
			}
		} catch (error) {
			set_success_toast({
				open: true,
				title: t('OrderManagement.ManualPaymentStatusModal.FailedStateMsg', { doc_type: capitalize(type) }),
				subtitle: '',
				state: 'warning',
			});
			console.error('Error updating payment status:', error);
		} finally {
			set_is_status_updating(false);
			set_manual_payment_status_modal(false);
		}
	};

	useEffect(() => {
		if (!manual_payment_status_modal || isEmpty(options)) return;
		const default_status = find(options, (item) => item?.value === payment_status);
		set_selected_option(default_status);
	}, [manual_payment_status_modal, options, payment_status]);

	return (
		<Modal
			open={manual_payment_status_modal}
			onClose={() => set_manual_payment_status_modal(false)}
			title={t('OrderManagement.ManualPaymentStatusModal.Title')}
			footer={
				<Grid display='flex' gap={1.5} justifyContent='flex-end'>
					<Button variant='outlined' onClick={() => set_manual_payment_status_modal(false)} color='inherit'>
						{t('OrderManagement.ManualPaymentStatusModal.Cancel')}
					</Button>
					<Button loading={is_status_updating} onClick={handle_submit}>
						{t('OrderManagement.ManualPaymentStatusModal.Submit')}
					</Button>
				</Grid>
			}
			children={
				<Grid container p={0.5}>
					<CustomText type='Body'>{t('OrderManagement.ManualPaymentStatusModal.SubTitle')}</CustomText>
					<Grid container gap={1} pt={1.5}>
						{map(options, (item, index) => (
							<Grid container key={`${item?.value}-${index}`} alignItems='center' gap={1.6}>
								<Radio onChange={() => set_selected_option(item)} checked={selected_option?.value === item?.value} sx={{ padding: 0 }} />
								<CustomText>{item?.label}</CustomText>
							</Grid>
						))}
					</Grid>
				</Grid>
			}
		/>
	);
};

export default ChangePaymentStatusModal;
