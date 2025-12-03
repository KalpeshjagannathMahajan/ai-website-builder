/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import { show_document_toast, show_document_toast_message } from 'src/actions/document';
import CustomToast from 'src/common/CustomToast';
import { useDispatch, useSelector } from 'react-redux';
import OrderEndStatusContainer from './OrderEndStatusContainer';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import OrderManagementContext from '../../context';
import useOrderManagement from '../../useOrderManagement';
import ConfirmationModal from './ConfirmationModal';
import Header from './Header';
import _ from 'lodash';
import SkeletonLoader from './SkeletonLoader';
import { document as document_mock, payment_status_constants } from '../../mock/document';
import Drawer from '../Drawer/index';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import { DRAWER_TYPES } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import QuickViewDrawer from 'src/screens/Account/Components/QuickViewDrawer';

const OrderManagementComp = () => {
	const {
		show_error,
		document_data,
		section_data,
		loader,
		show_add_card,
		customer_id,
		set_show_add_card,
		handle_drawer_state,
		handle_drawer_type,
		payment_config,
		buyer_addresses,
		status_404,
		get_styles,
		set_show_error,
		saved_payment_methods_data,
		set_selected_payment_opt,
		isview,
		set_isview,
		set_success_toast,
	} = useContext(OrderManagementContext);
	const document_state = useSelector((state: any) => state?.document);
	const navigate = useNavigate();
	// const doc_status = document_data?.document_status;
	const document_toast = document_state?.show_toast;
	const document_message = document_state?.toast_message;
	const status_style = get_styles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const dispatch = useDispatch();
	const { payment_status } = document_data;

	const { loading } = loader;

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

	const handle_render_container = () => {
		if (status_404 && !loading) navigate('/404', { replace: true });

		if (loading || _.isEmpty(document_data)) {
			return <SkeletonLoader />;
		} else if (!_.isEmpty(document_data) && !_.isEmpty(section_data)) {
			return <OrderEndStatusContainer />;
		}
	};

	const handle_add_card = (is_refetch: boolean = true) => {
		set_selected_payment_opt({ mode: 'edit', type: 'card' });
		set_show_add_card({ state: false, refetch: is_refetch });
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_edit_payment);
	};

	useEffect(() => {
		const element: any = document?.getElementById('rootContainer');
		element?.scrollTo(0, 0);
	}, []);

	return (
		<Grid>
			{!_.isEmpty(document_data) && !loading && (
				<Header
					payment_status_chip_label={payment_status ? payment_status_constants[payment_status]?.label || payment_status : ''}
					style={{
						padding: is_small_screen ? '1rem 1.4rem' : '1rem 4.4rem',
						zIndex: 1,
						marginLeft: 0,
						marginRight: 0,
						width: '100%',
						...status_style,
					}}
				/>
			)}
			<Drawer />
			{handle_render_container()}
			<ConfirmationModal />
			{document_toast && handle_render_toast()}
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
			{show_error && (
				<CustomToast
					open={show_error}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					autoHideDuration={5000}
					onClose={() => set_show_error(false)}
					state='warning'
					title={'Some fields are empty'}
					subtitle={'Please fill in all mandatory information'}
					showActions={false}
				/>
			)}
			{isview?.state && (
				<QuickViewDrawer
					drawer={isview?.state}
					on_close={() => set_isview({ state: false, data: null })}
					data={isview?.data}
					set_success_toast={set_success_toast}
				/>
			)}
		</Grid>
	);
};

const OrderEndStatusPage = () => {
	const value = useOrderManagement();
	return (
		<OrderManagementContext.Provider value={value}>
			<OrderManagementComp />
		</OrderManagementContext.Provider>
	);
};

export default OrderEndStatusPage;
