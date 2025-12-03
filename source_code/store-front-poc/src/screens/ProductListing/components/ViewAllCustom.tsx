import { useEffect, useState } from 'react';
import { Grid, PageHeader, Typography } from 'src/common/@the-source/atoms';
import { product_listing } from 'src/utils/api_requests/productListing';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BuyerSwitch, Cart, CatalogSwitch, PageTitle } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
import { Drawer } from '@mui/material';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import SkeletonProductCard from './SkeletonProductCard';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import ProductTemplateTwo from './ProductTemplate2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IConfig } from './CustomRail';
import { Trans } from 'react-i18next';
import RecommendCard from 'src/common/@the-source/molecules/RecommendCard/RecommendCard';
import { ProductData } from '../mock/ProductInterface';
import { card_template } from '../constants';
import usePricelist from 'src/hooks/usePricelist';
import useEffectOnDependencyChange from 'src/hooks/useEffectOnDependencyChange';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const arr = [1, 2, 3, 4, 5];

const ViewAllCustom = () => {
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const buyer = useSelector((state: any) => state.buyer);

	const [products, set_products] = useState<ProductData>({});
	const [nb_hits, set_nbhits] = useState(0);
	const [_page, set_page] = useState(0);
	const [_pages, set_pages] = useState(0);
	const [is_loading, set_is_loading] = useState(true);
	const [is_loading_more, set_is_loading_more] = useState(false);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [has_more, set_has_more] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [buyer_data, set_buyer_data] = useState({});

	const { initialize_cart } = useProductListingPageTemplate();
	const path = location.pathname;
	const path_elements = path.split('/');
	const title = decodeURIComponent(path_elements[3]);
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	// const card_template:ITemplate = JSON.parse(searchParams.get('card_template') || '{}');

	const config: IConfig = JSON.parse(searchParams.get('config') || '{}');

	const pricelist_value = usePricelist();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Products',
			link: `${RouteNames.product.all_products.path}`,
		},
		{
			id: 3,
			linkTitle: title,
		},
	];

	const hits_response_setter = (nbHits: number = 0, page: number = 0, hits: any = {}, pages: number = 0) => {
		set_nbhits(nbHits);
		set_page(page);
		set_products(hits);
		set_pages(pages);
		set_has_more(pages > page);
		set_is_loading(false);
		set_is_loading_more(false);
	};

	const get_custom_products = async () => {
		try {
			const catalog_ids = [pricelist_value?.value || ''];
			const response: any = await product_listing.get_products_by_config(config, _page + 1, 50, buyer.buyer_info?.id, catalog_ids);
			if (response?.status === 200) {
				const { nbHits, page, hits, pages } = response?.data;
				hits_response_setter(nbHits, page, hits, pages);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const refine_next = () => {
		if (_pages > _page) {
			set_is_loading_more(true);
			get_custom_products();
		}
	};

	const template_selector = (item: any) => {
		switch (card_template.template_id) {
			case 1:
				return (
					<RecommendCard
						handleClick={(id: any) => navigate(`/product-details/${id}`)}
						recommend={item}
						rec_card_template={card_template}
						border={true}
						hasSimillar={true}
					/>
				);
			case 2:
				return (
					<ProductTemplateTwo
						container_style={{ justifyContent: 'space-around' }}
						product={item}
						cards_template={card_template}
						has_similar={true}
						input_style={{ width: '120px' }}
					/>
				);
		}
	};

	const infiniteHits = () => {
		return (
			<InfiniteScroll
				dataLength={Object.keys(products).length}
				scrollableTarget='rootContainer'
				loader={
					is_loading_more && (
						<Grid className='Loader' direction='row' container columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
							{arr.map((a: any) => (
								<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
									<SkeletonProductCard />
								</Grid>
							))}
						</Grid>
					)
				}
				next={refine_next}
				hasMore={has_more}>
				<Grid container sx={{ paddingTop: '2rem' }} spacing={2.4} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }} alignItems='stretch'>
					{Object.keys(products).length > 0 ? (
						<>
							{Object.keys(products).map((product: any) => {
								return (
									<Grid key={product?.id} xs={6} sm={4} md={4} lg={3} xl={3} item>
										{template_selector(products[product])}
									</Grid>
								);
							})}
						</>
					) : (
						<>
							{arr.map((a: any) => (
								<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
									<SkeletonProductCard />
								</Grid>
							))}
						</>
					)}
				</Grid>
			</InfiniteScroll>
		);
	};

	useEffect(() => {
		set_is_loading(true);
		get_custom_products();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	useEffect(() => {
		initialize_cart();
	}, [buyer?.buyer_cart, buyer?.catalog]);

	useEffectOnDependencyChange(() => {
		get_custom_products();
	}, [buyer?.buyer_cart, pricelist_value]);

	return (
		<>
			<Grid container justifyContent='space-between' direction='row'>
				<PageHeader
					leftSection={<PageTitle title={title} allow_back={true} />}
					rightSection={
						is_ultron ? (
							<div style={{ display: 'flex', gap: '10px' }}>
								<BuyerSwitch onClick={() => toggle_buyer_panel(true)} />
								{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer) && <CatalogSwitch />}
								{/* <Scanner onClick={handle_bar_code} /> */}
								<Cart />
							</div>
						) : null
					}
				/>
				{!is_loading && (
					<Grid container>
						<Typography>
							<Trans i18nKey='ProductList.Main.ShowingProducts' count={nb_hits}>
								Showing {{ nb_hits }} product
							</Trans>
						</Typography>
					</Grid>
				)}
				{infiniteHits()}
				{is_ultron && (
					<SelectBuyerPanel
						show_drawer={show_buyer_panel}
						toggle_drawer={toggle_buyer_panel}
						set_is_buyer_add_form={set_is_buyer_add_form}
						buyer_data={buyer_data}
						set_buyer_data={set_buyer_data}
					/>
				)}
				{is_buyer_add_form && (
					<Drawer PaperProps={{ sx: { width: 600 } }} anchor='right' open={is_buyer_add_form} onClose={() => set_is_buyer_add_form(false)}>
						<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
					</Drawer>
				)}
			</Grid>
		</>
	);
};

export default ViewAllCustom;
