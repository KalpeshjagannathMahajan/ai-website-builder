import { Grid } from 'src/common/@the-source/atoms';
import { useContext, useEffect } from 'react';
import ProductInfoHeader from '../ProductInfoHeader';
import PriceTier from '../PriceTier';
import ProductDetailsContext from '../../context';
import ProductSections from '../ProductSections';
import { SECTION_TYPE } from '../../constants';
import ProductActionSection from '../ProductActionSection';
import VariantContainer from './VariantContainer';
import { updateBreadcrumbs } from 'src/actions/topbar';
import RouteNames from 'src/utils/RouteNames';
import { useDispatch } from 'react-redux';
import useStyles from '../../styles';
const { VITE_APP_REPO } = import.meta.env;
import { get_attributes_mapping } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import DeleteProductModal from '../DeleteProductModal';

const ProductInfoContainer = () => {
	const { product_details, product_section, _page } = useContext(ProductDetailsContext);
	const { sku_id = '', name = '', pricing = {}, custom_attributes = [], category, collections } = product_details;
	const moq = pricing?.min_order_quantity ?? 0;
	const { currency = '', volume_tiers = [] } = pricing;
	const dispatch = useDispatch();
	const classes = useStyles();
	const is_ultron = VITE_APP_REPO === 'ultron';
	const { product_card_config = [] } = useSelector((state: any) => state?.settings);

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: is_ultron ? 'Dashboard' : 'Home',
			link: is_ultron ? RouteNames.dashboard.path : RouteNames.home.path,
		},
		{
			id: 2,
			linkTitle: is_ultron ? 'Products' : 'All products',
			link: `${RouteNames.product.all_products.path}?search=&page=${_page}`,
		},
		{
			id: 3,
			linkTitle: `${name}`,
			link: `${RouteNames.product.product_detail.path}`,
		},
	];
	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);
	const custom_variant_template = get_attributes_mapping(product_card_config, product_details);
	// const custom_variant_template = {
	// 	attributes: {
	// 		keys: _.map(product_details?.variants_meta?.hinge_attributes, (v: any) => `custom_attributes::${v?.id}::value`),
	// 	},
	// };
	return (
		<Grid item xl={6} lg={6} md={6} sm={12} xs={12} className={classes.details_container}>
			<ProductInfoHeader name={name} pricing_info={pricing} moq_value={moq} sku_id={sku_id} />
			{volume_tiers?.length > 0 && <PriceTier data={volume_tiers} currency={currency} />}
			<VariantContainer />
			<ProductSections
				category={category}
				collections={collections}
				data={product_section}
				custom_attributes={custom_attributes}
				section_type={SECTION_TYPE.open_section}
			/>
			<ProductActionSection currency={currency} custom_variant_template={custom_variant_template} />
			<ProductSections
				category={category}
				collections={collections}
				data={product_section}
				custom_attributes={custom_attributes}
				section_type={SECTION_TYPE.collapsible}
			/>
			<DeleteProductModal />
		</Grid>
	);
};

export default ProductInfoContainer;
