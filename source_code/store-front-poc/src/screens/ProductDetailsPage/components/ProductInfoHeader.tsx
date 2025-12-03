import { Box, Grid, Icon, Image, Menu } from 'src/common/@the-source/atoms';
import { useContext } from 'react';
import ProductDetailsContext from '../context';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import TearSheetDrawer from 'src/common/TearSheet/TearSheetDrawer';
import { useTheme } from '@mui/material/styles';
import useStyles from '../styles';
import { useSelector } from 'react-redux';
import ImageLinks from 'src/assets/images/ImageLinks';
import RouteNames from 'src/utils/RouteNames';
import { Mixpanel } from 'src/mixpanel';
import utils, { get_product_metadata } from 'src/utils/utils';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import Events from 'src/utils/events_constants';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import { Divider } from '@mui/material';
// import PriceView from 'src/common/@the-source/PriceView';
import { colors } from 'src/utils/theme';
// import { get_product_detail } from 'src/screens/ProductListing/utils';
import { get_formatted_price_with_currency } from 'src/utils/common';

const menu_items = [
	{
		label: 'Delete',
	},
];
interface Props {
	pricing_info: any;
	name: any;
	moq_value: number;
	sku_id: string;
}

const ProductInfoHeader: React.FC<Props> = ({ pricing_info, name, moq_value, sku_id }) => {
	const {
		catalog_list,
		catalog_id,
		get_product_tear_sheet,
		show_tear_sheet,
		set_show_tear_sheet,
		show_price_on_tear_sheet,
		set_show_price_on_tear_sheet,
		download_loader,
		set_download_loader,
		multiple_template,
		selected_template,
		set_selected_template,
		tier_final_price,
		template_id,
		customer_metadata,
		product_details,
		set_show_delete_product_modal,
		set_delete_action_active,
		set_drawer,
		set_selected_skus,
		set_selected_filters,
		discount_campaigns,
	} = useContext(ProductDetailsContext);
	const theme: any = useTheme();
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);
	const params = useParams();
	const product_id = params.id;
	// const tenant_id = buyer.is_guest_buyer ? undefined : buyer.buyer_cart.tenant_id;
	const { t } = useTranslation();
	const classes = useStyles();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';
	const navigate = useNavigate();
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';

	const product_metadata = get_product_metadata(product_details);
	// const data_values = get_product_detail(product_details);
	const buyer = useSelector((state: any) => state?.buyer);
	const { variants_meta } = product_details;
	const { variant_data_map = [] } = variants_meta;
	const active_variants = utils.get_active_variants(variant_data_map)?.length;
	const base_price_condition =
		!isEmpty(String(pricing_info?.base_price)) &&
		!isNaN(String(pricing_info?.base_price)) &&
		pricing_info?.base_price > pricing_info?.price;
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const selected_discount_campaign = valid_discount_for_product(master_discount_rule, discount_campaigns, product_details, buyer);
	const discounted_value = isEmpty(selected_discount_campaign) ? pricing_info?.price : selected_discount_campaign?.discounted_value;
	const handle_delete_action = () => {
		if (active_variants > 1) {
			set_delete_action_active(true);
			set_drawer(true);
			set_selected_filters({ filters: {}, range_filters: {} });
		} else {
			set_selected_skus([product_id]);
			set_show_delete_product_modal(true);
		}
	};

	const handle_menu_click = (item: any) => {
		switch (item) {
			case 'Delete':
				handle_delete_action();
				break;
			default:
		}
	};

	return (
		<Box className={classes.header_container} alignItems='flex-start' flexDirection='column'>
			<Box className={classes.name_container}>
				<CustomText type='Title' className={classes.sku_id}>
					{is_store_front && 'SKU : '} {sku_id}
				</CustomText>

				{(!is_store_front || template_id) && !is_retail_mode && (
					<Grid sx={{ display: 'flex', alignItems: 'center' }}>
						<CustomText
							onClick={() => {
								is_store_front ? get_product_tear_sheet(product_id, false) : set_show_tear_sheet(true);
								Mixpanel.track('tear_sheet_button_clicked', {
									tab_name: 'Products',
									page_name: 'product_details_page',
									section_name: '',
									subtab_name: '',
									customer_metadata,
									product_metadata,
								});
							}}
							type='H6'
							className={classes.download_cta}>
							<Icon className={classes.custom_icon} iconName='IconDownload' sx={{ height: '16px' }} />
							<span className={classes.tear_sheet_text}>{t('CartSummary.TearSheet.Download')}</span>
						</CustomText>
						{!catalog_mode && (
							<Can I={PERMISSIONS.delete_product.slug} a={PERMISSIONS.delete_product.permissionType}>
								<Menu
									closeOnItemClick
									LabelComponent={<Icon iconName='IconDotsVertical' />}
									onClickMenuItem={(item: any) => {
										handle_menu_click(item);
									}}
									btnStyle={{ marginTop: '0.5rem', cursor: 'pointer' }}
									menu={menu_items}
								/>
							</Can>
						)}
					</Grid>
				)}
			</Box>
			<CustomText type='H2' className={classes.primary_color} style={{ fontSize: '26px' }}>
				{name}
			</CustomText>
			{is_store_front && utils.is_prelogin_inventory(is_logged_in) && moq_value > 0 && (
				<CustomText className={classes.secondary_color} type='Body'>
					{t('PDP.ProductInfoHeader.MOQ', { count: moq_value })}
				</CustomText>
			)}
			<Divider style={{ margin: '0.5rem 0' }} />
			{!is_retail_mode && (
				<Grid className={classes.price_container}>
					{utils.is_prelogin_price(is_logged_in) ? (
						<>
							<CustomText type='H3' style={{ fontSize: '24px' }}>
								{t('PDP.Common.Price', {
									price: get_formatted_price_with_currency(
										pricing_info?.currency,
										pricing_info?.volume_tiers ? tier_final_price : discounted_value > 0 ? discounted_value : 0,
									),
								})}
							</CustomText>
							{(base_price_condition || !isEmpty(selected_discount_campaign)) && (
								<CustomText
									type='Body'
									style={{
										textDecoration: 'line-through',
										color: colors.secondary_text,
									}}>
									{get_formatted_price_with_currency(
										pricing_info?.currency,
										!isEmpty(selected_discount_campaign) ? pricing_info?.price : pricing_info?.base_price,
									)}
								</CustomText>
							)}
							{!isEmpty(selected_discount_campaign) && (
								<CustomText
									type='CaptionBold'
									style={{
										...theme?.product?.discount_campaign,
									}}>
									{selected_discount_campaign?.configuration?.type === 'percentage'
										? `${selected_discount_campaign?.configuration?.value}% off`
										: ` ${get_formatted_price_with_currency(
												pricing_info?.currency,
												selected_discount_campaign?.configuration?.value > pricing_info?.price
													? pricing_info?.price
													: selected_discount_campaign?.configuration?.value,
										  )} off`}
								</CustomText>
							)}
						</>
					) : (
						<Image
							src={ImageLinks.unlock_price}
							style={{
								cursor: 'pointer',
								width: '150px',
								height: '40px',
							}}
							alt='banner_image'
							onClick={() => navigate(RouteNames?.user_login?.path)}
						/>
					)}

					{is_ultron && <CustomText type='Body'>{t('PDP.ProductInfoHeader.MOQ', { count: moq_value })}</CustomText>}
				</Grid>
			)}
			{/* {!is_retail_mode && utils.is_prelogin_price(is_logged_in) && !isEmpty(selected_discount_campaign) && (
				<Grid
					style={{
						...theme?.product?.discount_campaign_banner,
					}}>
					<Icon iconName='IconDiscount2' color='#FFF' />
					<CustomText type='Subtitle' color='#FFF'>
						{selected_discount_campaign?.name}
					</CustomText>
				</Grid>
			)} */}
			{show_tear_sheet ? (
				<TearSheetDrawer
					open={show_tear_sheet}
					onClose={() => {
						set_show_tear_sheet(false);
						Mixpanel.track(Events.CANCEL_TEAR_SHEET_BUTTON_CLICKED, {
							tab_name: 'Products',
							page_name: 'product_details_page',
							section_name: '',
							subtab_name: '',
							customer_metadata,
							product_metadata,
						});
					}}
					onSubmit={() => {
						set_download_loader(true);
						get_product_tear_sheet(product_id, show_price_on_tear_sheet);
					}}
					options={catalog_list}
					selected_option={catalog_id}
					checked={show_price_on_tear_sheet}
					on_switch_change={() => set_show_price_on_tear_sheet(!show_price_on_tear_sheet)}
					show_toggle
					loading={download_loader}
					show_catalog_selector
					data={multiple_template}
					selected_template={selected_template}
					set_selected_template={set_selected_template}
					show_preview_btn={false}
				/>
			) : null}
		</Box>
	);
};

export default ProductInfoHeader;
