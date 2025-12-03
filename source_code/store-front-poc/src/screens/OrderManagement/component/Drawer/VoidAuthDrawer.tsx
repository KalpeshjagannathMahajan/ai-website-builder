/* eslint-disable*/
import { Divider } from '@mui/material';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import api_requests from 'src/utils/api_requests';
import CollectDrawerSkeleton from 'src/screens/OrderManagement/component/Drawer/CollectDrawerSkeleton';
import OrderManagementContext from '../../context';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { secondary, text_colors } from 'src/utils/light.theme';
import { useTheme } from '@mui/material/styles';

interface Props {
	is_visible: boolean;
	close: any;
	currency: string;
}

const VoidAuthDrawer = ({ is_visible, close, currency }: Props) => {
	const { table_data, set_refetch, set_success_toast } = useContext(OrderManagementContext);
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [data, set_data] = useState<any>();
	const [total_amt, set_total_amt] = useState(0);
	const theme: any = useTheme();

	const handle_submit = () => {
		set_is_button_loading(true);
		api_requests.order_management
			.void_auth({ transaction_id: selected_payment_method_id })
			.then((res: any) => {
				if (res?.status === 200) {
					set_success_toast({ open: true, title: 'Void Authorization Successful', subtitle: '', state: 'success' });
					set_refetch((prev: boolean) => !prev);
					close();
				}
			})
			.catch((err) => {
				set_success_toast({ open: true, title: 'Void Authorization Failed', subtitle: '', state: 'warning' });
				console.error(err);
			})
			.finally(() => {
				set_is_button_loading(false);
			});
	};

	useEffect(() => {
		set_is_loading(true);
		if (table_data) {
			const authorized_transactions_data = _.get(table_data, 'authorized_transactions', []);
			const auth_data = authorized_transactions_data.filter((curr: any) => curr?.payment_status === 'Authorized');
			const amt = _.sumBy(auth_data, (item: any) => {
				let amount = Number(item?.amount);
				return isNaN(amount) ? 0 : amount;
			});
			const auth_id = _.get(_.head(auth_data), 'id', '');
			set_selected_payment_method_id(auth_id);
			set_total_amt(amt);
			set_data(auth_data);
		}
		set_is_loading(false);
	}, [is_visible, table_data]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Void authorization</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		const selected_id = _.find(data, (item) => item?.id === selected_payment_method_id);

		return (
			<Grid className='drawer-footer' justifyContent={'space-between'}>
				<Grid container p={1} justifyContent={'space-between'} width={'250px'} sx={{ background: secondary[100], borderRadius: '8px' }}>
					<CustomText type='H6'>Void</CustomText>
					<CustomText type='H6' color={text_colors.primary}>
						{get_formatted_price_with_currency(currency, selected_id?.amount)}
					</CustomText>
				</Grid>
				{_.size(data) > 0 && (
					<Button loading={is_button_loading} onClick={handle_submit}>
						Void
					</Button>
				)}
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' gap={1}>
				<Grid
					display='flex'
					justifyContent='space-between'
					sx={{ background: theme?.palette?.warning[50], borderRadius: '12px', padding: '12px 16px' }}>
					<CustomText type='H3'>Total authorized amount </CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, total_amt.toString())}</CustomText>
				</Grid>
				<hr></hr>

				<Grid mt={-2.4}>
					{data?.length > 0 && (
						<SavedCardListing
							section_heading={'Select authorisation to void'}
							default_payment_id={selected_payment_method_id}
							saved_payment_methods={data}
							update_selected_payment_method={set_selected_payment_method_id}
							section_heading_style={{ color: text_colors.primary }}
							void_auth={true}
						/>
					)}
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

export default VoidAuthDrawer;
