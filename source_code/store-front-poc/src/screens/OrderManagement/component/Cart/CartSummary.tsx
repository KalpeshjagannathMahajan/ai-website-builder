import { Accordion, Chip, Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import CartSummaryItem from './CartSummaryItem';
import { CART_SUMMARY_CONSTANTS } from '../../constants';
import React, { useContext, useEffect, useState } from 'react';
import OrderManagementContext from '../../context';
import CartSkeleton from './CartSkeleton';
import { useParams } from 'react-router-dom';
import { document } from '../../mock/document';
import CustomToast from 'src/common/CustomToast';
import { useSelector } from 'react-redux';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import { useDispatch } from 'react-redux';
import { update_catalog } from 'src/actions/buyer';
import { Divider } from '@mui/material';
import { cartContainerConfig } from 'src/actions/setting';
import settings from 'src/utils/api_requests/setting';
import _ from 'lodash';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { error } from 'src/utils/common.theme';
import AccordionProductListing from 'src/common/AccordionProductListing';
import VirtualList from 'src/common/VirtualList';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';

const CartSummary = () => {
	const theme: any = useTheme();
	const { document_data, loader, handle_edit_cart, show_error, set_show_error, cart_errors } = useContext(OrderManagementContext);
	const params = useParams();
	const { document_type } = params;
	const { catalog_name, cart_details } = document_data;
	const { items = {}, container_data, errors } = cart_details;
	const cart_container_config = useSelector((state: any) => state?.settings?.cart_container_config);
	const cart_grouping_config = useSelector((state: any) => state?.settings?.cart_grouping_config) || {};
	const products = cart_details?.products || {};
	const document_type_data: any = document_type === document?.DocumentTypeEnum.ORDER ? document?.ORDER_ACTIONS : document?.QUOTE_ACTIONS;
	const is_editable = document_type_data[document_data?.document_status]?.edit_cart;
	const is_submitted_edit_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_pending_edit_quote = useSelector((state: any) => state?.document?.is_editable_order);
	const [expanded, set_expanded] = useState<string[]>([]);
	const dispatch = useDispatch();
	const classes = useStyles();
	const cart_group_data = cart_details?.meta?.grouping_data?.groups;
	const toggle_button_value = container_data?.cart_volume_unit;
	const show_grouping_data = utils.show_grouping_data(cart_grouping_config, cart_group_data);
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const { loading, edit_cart_loading } = loader;

	const handle_render_toast = () => {
		return (
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
		);
	};

	const total_count = Object.keys(products)?.length;

	const handle_render_title = () => {
		const size = cart_errors?.errors_count;
		return (
			<Grid className={classes.cartSummaryTitleContainer}>
				<CustomText type='H6'>{CART_SUMMARY_CONSTANTS.CART_TITLE}</CustomText>
				{size > 0 && (
					<Chip
						variant='filled'
						size='small'
						bgColor={error[50]}
						label={
							<Grid container gap={1}>
								<Icon iconName='IconAlertTriangle' color={error.main} sx={{ width: '18px', height: '18px' }} />
								<CustomText type='Subtitle' color={error.main}>
									{size} errors
								</CustomText>
							</Grid>
						}
					/>
				)}
				<CustomText type='Body' color={theme?.order_management?.cart_summary?.color}>
					{total_count} {CART_SUMMARY_CONSTANTS.CART_PRODUCTS}
				</CustomText>
				<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
					{(is_editable || is_submitted_edit_quote || is_pending_edit_quote) && (
						<React.Fragment>
							<Typography
								onClick={(e: any) => {
									if (edit_cart_loading) return;
									e.stopPropagation();
									if (cart_details?.catalog_ids?.length > 0 && document_data?.catalog_name) {
										dispatch<any>(update_catalog({ catalog: { value: _.head(cart_details?.catalog_ids), label: catalog_name } }));
									}

									handle_edit_cart('');
								}}
								sx={{
									cursor: 'pointer',
									color: theme?.button?.color,
									fontSize: 14,
									textDecorationLine: theme?.order_management?.style?.text_decoration_line,
								}}
								variant='h6'>
								{CART_SUMMARY_CONSTANTS.CART_EDIT}
							</Typography>
							{edit_cart_loading && (
								<CircularProgressBar
									style={{ width: '20px', height: '20px', color: 'rgb(22, 136, 95)', marginTop: 'auto' }}
									variant='indeterminate'
								/>
							)}
						</React.Fragment>
					)}
				</Can>
			</Grid>
		);
	};

	const handle_render_product_card = (product_key: any, index: number) => {
		const product = products[product_key];
		const error_message = _.get(_.head(errors?.[product_key]), 'error_message', '');
		return (
			<div key={product_key}>
				<CartSummaryItem
					key={product_key}
					product={product}
					item={items?.[product_key]}
					unit_price={product?.pricing.price}
					is_last={Object?.keys(products)?.length - 1 === index}
					currency_symbol={product?.pricing?.currency}
					container_is_display={container_data?.container_is_display}
					error_message={error_message}
					unit={_.get(container_data, 'cart_volume_unit', '')}
					show_grouping_data={show_grouping_data}
				/>
			</div>
		);
	};

	const handle_product_card = (products_array: any) => {
		const sorted_products = utils.sort_according_to_customise(products_array, items);

		return (
			<VirtualList
				list_style={{ overflowY: 'auto', height: sorted_products?.length > 3 ? 600 : 'auto', paddingRight: '10px' }}
				render_item={handle_render_product_card}
				data={sorted_products}
				item_height={30}
				item_key={(item: any) => item}
			/>
		);
	};

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded(newExpanded ? [...expanded, panel] : _.remove(expanded, (_panel) => _panel !== panel));
	};

	const handle_render_content = () => {
		return (
			<Grid
				sx={{
					overflow: 'scroll',
					paddingX: 1,
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}
				height={Object?.keys(products)?.length >= 5 && !show_grouping_data ? '70vh' : ''}>
				{loading ? (
					<CartSkeleton />
				) : (
					<>
						{is_ultron && (
							<Grid container gap={1}>
								<CustomText type='Subtitle'>Pricelist : </CustomText>
								<CustomText type='Body'>{catalog_name}</CustomText>
							</Grid>
						)}
						<Divider sx={{ borderBottomStyle: 'dashed', margin: '2rem 0rem' }} />
						{!show_grouping_data && handle_product_card(products)}
						<Grid container gap={1}>
							{show_grouping_data && (
								<AccordionProductListing
									cart_group_data={cart_group_data}
									handle_product_card={handle_product_card}
									expanded={expanded}
									handleChange={handleChange}
									toggle_button_value={toggle_button_value}
									set_expanded={set_expanded}
								/>
							)}
						</Grid>
					</>
				)}
			</Grid>
		);
	};

	const get_containers_detail = async () => {
		try {
			if (_.isEmpty(cart_container_config)) {
				const { data: response_data }: any = await settings.get_containers_data();
				if (response_data?.tenant_container_enabled === true) {
					dispatch(cartContainerConfig(response_data));
				} else {
					dispatch(cartContainerConfig({ tenant_container_enabled: false }));
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		get_containers_detail();
	}, []);

	return (
		<React.Fragment>
			{handle_render_toast()}
			<Accordion
				titleStyle={{ padding: is_ultron ? '' : 0 }}
				contentBackground={theme?.order_management?.cart_summary?.content_background}
				titleBackgroundColor={theme?.order_management?.cart_summary?.title_background_color}
				accordionDetailsClassName={classes.mobile_cart_summary}
				expanded={expanded}
				id={document_data?.id}
				on_change={handleChange}
				content={[
					{
						expandedContent: handle_render_content(),
						title: handle_render_title(),
					},
				]}
			/>
		</React.Fragment>
	);
};

export default CartSummary;
