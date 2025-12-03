import { useContext, useEffect, useState, useRef } from 'react';
import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import Header from './component/Common/Header';
import CartCheckoutCard from './component/Cart/CartCheckoutCard';
import useOrderManagement from './useOrderManagement';
import OrderManagementContext from './context';
import OrderManagementContainer from './component/Common/OrderManagementContainer';
import SkeletonContainer from './component/Common/Skeleton';
import Alert from 'src/common/@the-source/atoms/Alert/Alert';
import { DRAWER_TYPES, QUOTE_SUCCESS_MESSAGE, STEPPER_CONSTANTS, GROUPING_ALERT } from './constants';
import ConfirmationModal from './component/Common/ConfirmationModal';
import { show_document_alert, show_document_toast, show_document_toast_message } from 'src/actions/document';
import CustomToast from 'src/common/CustomToast';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import RouteNames from 'src/utils/RouteNames';
import AddPaymentModal from '../BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import { updateBreadcrumbs } from 'src/actions/topbar';
import useStyles from './styles';
import { useTheme } from '@mui/material/styles';
import { secondary } from 'src/utils/light.theme';
import { warning } from 'src/utils/common.theme';
import utils from 'src/utils/utils';
import { useNavigate } from 'react-router-dom';
import ChangeFulfilmentStatusModal from './component/Common/ChangeFulfilmentStatusModal';
import DocumentTagModal from './component/Common/DocumentTagModal';
import ChangePaymentStatusModal from './component/Common/ChangePaymentStatusModal';

const alert_style = {
	padding: '0 2rem',
	border: 'none',
	width: '99%',
	background: warning[50],
};

export const OrderManagementComp = () => {
	const {
		document_data,
		section_data,
		show_add_card,
		set_show_add_card,
		customer_id,
		handle_drawer_state,
		handle_drawer_type,
		payment_config,
		buyer_addresses,
		active_step,
		loader,
		status_404,
		set_selected_payment_opt,
		saved_payment_methods_data,
	} = useContext(OrderManagementContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const show_alert = useSelector((state: any) => state.document?.show_alert);
	const cart_grouping_config = useSelector((state: any) => state?.settings?.cart_grouping_config) || {};

	const document_state = useSelector((state: any) => state?.document);
	const document_toast = document_state?.show_toast;
	const document_message = document_state?.toast_message;
	const classes = useStyles();
	const theme: any = useTheme();
	const reference_storing = useRef(null);
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const { document_change_loader } = loader;
	const [grouping_alert, set_grouping_alert] = useState(true);
	const grouping_data = document_data?.cart_details?.meta?.grouping_data?.groups || {};
	const show_grouping_data = utils.show_grouping_data(cart_grouping_config, grouping_data);
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Sales',
			link: `${RouteNames.order_management.order_list.path}`,
		},
		{
			id: 3,
			linkTitle: `${document_data?.system_id}`,
			link: `${RouteNames.product.review.path}`,
		},
	];

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [document_data]);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (reference_storing?.current) {
			reference_storing?.current?.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [active_step?.stepper_key]);

	const handle_close = () => {
		dispatch(
			show_document_toast_message({
				title: document_message?.title,
				sub: document_message?.sub,
				is_custom: true,
				show_icon: true,
			}),
		);
		dispatch(show_document_toast(false));
	};

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={document_toast}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				container_style={{
					padding: '4px 8px',
					gap: '10px',
				}}
				text_container_style={{
					gap: '0px',
				}}
				show_icon={document_message?.show_icon}
				is_custom={document_message?.is_custom}
				custom_icon={document_message?.is_custom && 'IconConfetti'}
				autoHideDuration={3000}
				onClose={handle_close}
				state='success'
				title={document_message?.title}
				subtitle={document_message?.sub}
				showActions={false}
			/>
		);
	};

	const handle_render_alert = () => {
		return (
			<Box mb={1.5} ml={1}>
				<Alert
					style={{
						padding: '0 2rem',
						border: 'none',
						width: '99%',
						background: theme?.order_management?.order_management?.alert_background,
					}}
					icon={<Icon color={theme?.order_management?.order_management?.icon_color} iconName='IconCircleCheckFilled' />}
					// style={alert_style}
					// icon={<Icon color={secondary?.main} iconName='IconCircleCheckFilled' />}
					message={QUOTE_SUCCESS_MESSAGE}
					severity={'success'}
					open={show_alert}
					handle_close={() => dispatch(show_document_alert(false))}
				/>
			</Box>
		);
	};

	const handle_grouping_alert = () => {
		return (
			<Box mb={1.5} ml={1}>
				<Alert
					style={alert_style}
					icon={<Icon iconName='IconInfoCircle' color={secondary?.main} />}
					message={GROUPING_ALERT}
					severity={'success'}
					open={grouping_alert}
					handle_close={() => set_grouping_alert(false)}
					is_cross={false}
				/>
			</Box>
		);
	};

	const handle_render_container = () => {
		if (status_404 && !document_change_loader) navigate('/404', { replace: true });

		return (
			<Grid container className={classes.container} id='order_content_container'>
				{!_.isEmpty(document_data) && !_.isEmpty(section_data) && !document_change_loader ? (
					<Grid container justifyContent={'space-between'}>
						<OrderManagementContainer />
						<CartCheckoutCard show_container={true} />
					</Grid>
				) : (
					<SkeletonContainer />
				)}
			</Grid>
		);
	};

	const handle_add_card = (is_refetch: boolean = true) => {
		set_show_add_card({ state: false, refetch: is_refetch });
		if (is_ultron || active_step?.stepper_key !== STEPPER_CONSTANTS.PAYMENT_DETAILS.key) {
			handle_drawer_state(true);
			set_selected_payment_opt({ mode: 'edit', type: 'card' });
			handle_drawer_type(DRAWER_TYPES.add_edit_payment);
		}
	};

	return (
		<Grid ref={reference_storing}>
			<Header />
			{document_toast && handle_render_toast()}
			{handle_render_alert()}
			{show_grouping_data && handle_grouping_alert()}
			{!_.isEmpty(document_data) && <ConfirmationModal />}
			{handle_render_container()}
			{show_add_card?.state && (
				<AddPaymentModal
					all_address={buyer_addresses}
					customer_id={customer_id}
					web_token={payment_config?.web_token}
					is_visible={show_add_card?.state}
					close={handle_add_card}
					source={'collect_payment'}
					buyer_id={document_data.buyer_id}
					payment_source={payment_config?.payment_gateway}
					all_cards={{
						...saved_payment_methods_data,
						payment_method_ids: [
							..._.values(saved_payment_methods_data?.saved_bank_accounts),
							..._.values(saved_payment_methods_data?.saved_payment_methods),
						],
					}}
				/>
			)}
			<ChangePaymentStatusModal />
			<ChangeFulfilmentStatusModal />
			<DocumentTagModal />
		</Grid>
	);
};

const OrderManagement = () => {
	const value = useOrderManagement();

	return (
		<OrderManagementContext.Provider value={value}>
			<OrderManagementComp />
		</OrderManagementContext.Provider>
	);
};

export default OrderManagement;
