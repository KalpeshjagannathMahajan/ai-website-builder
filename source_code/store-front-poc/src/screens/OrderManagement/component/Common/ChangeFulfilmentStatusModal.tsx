import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, Radio } from 'src/common/@the-source/atoms';
import order_management from 'src/utils/api_requests/orderManagment';
import OrderManagementContext from '../../context';
import { fulfilment_status_constants } from '../../mock/document';

const ChangeFulfilmentStatusModal = () => {
	const {
		document_data,
		set_success_toast,
		// set_refetch,
		fulfilment_status_modal,
		set_fulfilment_status_modal,
		ful_fillment_form,
		set_document_details,
		is_status_updating,
		set_is_status_updating,
	} = useContext(OrderManagementContext);
	const { id = '', type = '', fulfillment_status = '' } = document_data;
	const [selected_option, set_selected_option] = useState({ label: '', value: '' });
	const form_attributes = _.get(ful_fillment_form, 'fulfillment_status.attributes', {});
	const ful_fillment_attr = _.find(form_attributes, { id: 'fulfillment_status' });
	const { options = [] } = ful_fillment_attr || {};

	const shipment_status_chip_label = fulfillment_status ? fulfilment_status_constants[fulfillment_status]?.label || fulfillment_status : '';

	const handle_submit = () => {
		set_is_status_updating(true);
		order_management
			.update_fulfillment_status({
				document_id: id,
				fulfillment_status: selected_option?.value,
			})
			.then((response: any) => {
				if (response?.status === 200) {
					set_success_toast({
						open: true,
						title: `${type === 'order' ? 'Order' : 'Quote'} fulfillment status updated`,
						subtitle: '',
						state: 'success',
					});

					set_document_details((prev: any) => {
						return {
							...prev,
							fulfillment_status: selected_option?.value,
						};
					});

					// [Suyash 26/09/24] commentted for testing, do not delete
					// set_refetch((prev: boolean) => !prev);
				}
			})
			.catch((e) => {
				set_success_toast({
					open: true,
					title: `${type === 'order' ? 'Order' : 'Quote'} fulfillment status failed`,
					subtitle: '',
					state: 'warning',
				});

				console.error(e);
			})
			.finally(() => {
				set_is_status_updating(false);
				set_fulfilment_status_modal(false);
			});
	};

	useEffect(() => {
		const match = _.find(options, (item) => item?.label?.toLowerCase() === shipment_status_chip_label?.toLowerCase());
		set_selected_option(match);
	}, [shipment_status_chip_label, open, options]);

	return (
		<Modal
			open={fulfilment_status_modal}
			onClose={() => set_fulfilment_status_modal(false)}
			title={'Change fulfillment status'}
			footer={
				<Grid display='flex' gap={1.5} justifyContent={'flex-end'}>
					<Button variant='outlined' onClick={() => set_fulfilment_status_modal(false)} color='inherit'>
						Cancel
					</Button>
					<Button loading={is_status_updating} onClick={handle_submit}>
						Submit
					</Button>
				</Grid>
			}
			children={
				<Grid container p={0.5}>
					<CustomText type='Body'>Update your fulfillment status</CustomText>
					<Grid container gap={1} pt={1.5}>
						{_.map(options, (item) => {
							return (
								<Grid container key={item?.value} sx={{ alignItems: 'center', gap: '1.6rem' }}>
									<Radio
										onChange={() => set_selected_option(item)}
										checked={selected_option?.value === item?.value}
										sx={{ padding: '0' }}
									/>
									<CustomText>{item?.label}</CustomText>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			}
		/>
	);
};

export default ChangeFulfilmentStatusModal;
