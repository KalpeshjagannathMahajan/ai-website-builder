/* eslint-disable*/
import { Divider, InputAdornment, TextField } from '@mui/material';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import api_requests from 'src/utils/api_requests';
import { t } from 'i18next';
import { makeStyles } from '@mui/styles';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import CollectDrawerSkeleton from 'src/screens/OrderManagement/component/Drawer/CollectDrawerSkeleton';
import OrderManagementContext from '../../context';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';

const useStyles = makeStyles(() => ({
	handle_add_card: {
		marginTop: '2.4rem',
		cursor: 'pointer',
	},
}));

interface Props {
	is_visible: boolean;
	close: any;
	set_is_payment_modal_visible?: any;
	document_id?: string;
	prefilled_data?: any;
	currency: string;
}

const AddCreditsComp = ({ is_visible, close, set_is_payment_modal_visible, document_id = '', prefilled_data, currency }: Props) => {
	const { set_success_toast, set_refetch } = useContext(OrderManagementContext);
	const [input_value, set_input_value] = useState<any>(prefilled_data?.ampunt || '0');
	const [attributes, set_attributes] = useState<any>({});
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [saved_payment_methods, set_saved_payment_methods] = useState<any>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [data, set_data] = useState<any>();
	const [disabled, set_disabled] = useState<boolean>(false);
	const classes = useStyles();

	const get_config = () => {
		api_requests.order_management
			.get_payment_details({ document_id, payment_entity: 'order' })
			.then((res: any) => {
				if (res?.status === 200) {
					set_data(res);
				}
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_is_loading(false);
			});
	};

	useEffect(() => {
		get_config();
	}, []);

	const handle_submit = () => {
		set_is_button_loading(true);
		let payload = {
			document_id,
			authorize_amount: input_value,
			payment_entity: 'order',
			payment_method_id: selected_payment_method_id,
			buyer_id: data?.buyer_address?.buyer_id,
		};
		api_requests.order_management
			.authorised_card(payload)
			.then((res: any) => {
				if (res?.transaction_status === 'failed')
					set_success_toast({ open: true, title: 'Authorization Failed', subtitle: '', state: 'warning' });
				else set_success_toast({ open: true, title: 'Authorization Successful', subtitle: '', state: 'success' });

				set_refetch((prev: boolean) => !prev);
			})
			.catch((err: any) => {
				console.error(err);
				set_success_toast({ open: true, title: 'Authorization Failed', subtitle: '', state: 'warning' });
			})
			.finally(() => {
				set_is_button_loading(false);
				close();
			});
	};

	useEffect(() => {
		set_attributes({ payment_method_id: selected_payment_method_id });
	}, [selected_payment_method_id]);

	const selected_payment = 'card';

	useEffect(() => {
		const selected = _.filter(data?.saved_payment_methods, (value: any) => value.payment_method_type === selected_payment);
		set_saved_payment_methods(selected);
		const assigned_payment_method = _.find(selected, (method) => method.is_selected);
		const default_payment_method = _.find(selected, (method) => method.is_default);
		const random_payment_method = _.find(selected, () => true);
		set_selected_payment_method_id(
			assigned_payment_method?.payment_method_id ||
				default_payment_method?.payment_method_id ||
				random_payment_method?.payment_method_id ||
				'',
		);
	}, [data, selected_payment]);

	const check_charge_disabled = () => {
		if (Number(input_value) === 0) return true;
		return !attributes?.payment_method_id || attributes.payment_method_id === '';
	};

	useEffect(() => {
		const temp = check_charge_disabled();
		set_disabled(temp);
	}, [input_value, attributes, selected_payment_method_id]);

	const handleInputChange = (event: any) => {
		let inputValue = event.target.value.replace(/^0+/, '');
		if (inputValue === '' || inputValue[0] === '.') inputValue = 0 + inputValue;
		const isValidNumber = /^(|\d+\.?\d{0,2}|\.\d{0,2})$/.test(inputValue);
		if (isValidNumber) {
			if (!inputValue.endsWith('.')) {
				set_input_value(inputValue);
			} else {
				set_input_value(inputValue);
			}
		}
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Authorize card</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent={'flex-end'}>
				<Button variant='outlined' disabled={is_button_loading} onClick={close}>
					Cancel
				</Button>
				<Button disabled={disabled} loading={is_button_loading} onClick={handle_submit}>
					Authorize
				</Button>
			</Grid>
		);
	};

	const handle_add_click = () => {
		set_is_payment_modal_visible(true);
		close();
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid
					display='flex'
					justifyContent='space-between'
					sx={{ background: 'rgba(254, 247, 234, 1)', borderRadius: '12px', padding: '12px 16px' }}>
					<CustomText type='H3'>Total Amount Due</CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, prefilled_data?.amount)}</CustomText>
				</Grid>
				<TextField
					InputProps={{
						startAdornment: <InputAdornment position='start'>{get_currency(currency)}</InputAdornment>,
					}}
					onChange={handleInputChange}
					label='Amount to be collected'
					name='Amount to be collected'
					value={input_value}
					fullWidth
				/>

				<hr></hr>

				<Grid pl={0.1} mt={-2.4} sx={{ paddingLeft: '1rem' }}>
					{saved_payment_methods?.length > 0 && (
						<SavedCardListing
							section_heading={t('Payment.AvailableCards')}
							default_payment_id={selected_payment_method_id}
							saved_payment_methods={saved_payment_methods}
							update_selected_payment_method={set_selected_payment_method_id}
							from_auth={true}
						/>
					)}
					<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
						<Grid display='flex' alignItems='center' className={classes.handle_add_card} onClick={handle_add_click}>
							<Icon color='#16885F' sx={{ marginLeft: '-0.5rem' }} iconName='IconPlus' />
							<CustomText type='Subtitle' children='Add card' color='#16885F' />
						</Grid>
					</Can>
				</Grid>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer width={480} open={is_visible} onClose={close} content={is_loading ? <CollectDrawerSkeleton /> : handle_render_drawer()} />;
};

const AuthorisedDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <AddCreditsComp {...props} />;
};

export default AuthorisedDrawer;
