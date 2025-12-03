import React, { useState, useRef, useContext } from 'react';
import { IconButton, TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Button, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import get_product_image from 'src/utils/ImageConstants';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { includes, keys, map, debounce } from 'lodash';
import { ProductCardLoader } from './LoadingPage';
import { get_product_detail } from 'src/screens/ProductListing/utils';
import PriceView from 'src/common/@the-source/PriceView';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import { useSelector } from 'react-redux';
import ImageLinks from 'src/assets/images/ImageLinks';
import { t } from 'i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import useIsCustomization from 'src/hooks/useIsCustomization';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
import CartSummaryContext from '../context';
import { primary } from 'src/utils/light.theme';

const ExpandingSearch = styled(Box)(({ is_expanded }: { is_expanded: boolean }) => ({
	display: 'flex',
	alignItems: 'center',
	transition: 'all 0.3s ease',
	width: is_expanded ? '500px' : '40px',
	border: '1px solid rgba(0, 0, 0, 0.12)',
	borderRadius: '8px',
	backgroundColor: '#fff',
	height: '42px',
}));

const useStyles = makeStyles(() => ({
	product_name: {
		width: '100%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontWeight: 700,
		color: 'rgba(0, 0, 0, 0.87)',
	},
	image_box: {
		position: 'relative',
		borderRadius: '6px',
		padding: '2px 4px 4px 2px',
		border: '1px solid rgba(0, 0, 0, 0.12)',
	},
	section_1_info: {
		display: 'flex',
		flexDirection: 'row',
		gap: '8px',
	},
	add_button: {
		width: '120px',
		height: '40px',
		display: 'flex',
		gap: '5px',
		alignItems: 'center',
	},
	product_container: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: 'white',
		borderRadius: '8px',
		padding: '16px',
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
		height: '300px',
		maxHeight: '400px',
		overflowY: 'scroll',
		boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.12)',
	},
}));

interface SearchProductItemProps {
	on_search: (value: string, page_number?: number) => void;
	products_added_in_cart: String[];
	searched_product_data: any;
	loading: boolean;
	set_searched_product_data: any;
	handle_change_quantity: any;
	discount_campaigns: any;
	is_search_clicked?: boolean;
	set_is_search_clicked?: any;
}

const ProductCard = ({ is_added, product_data, key, handle_change_quantity, ref, discount_campaigns }: any) => {
	const classes = useStyles();
	const buyer = useSelector((state: any) => state?.buyer);
	const data_values = get_product_detail(product_data);
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(master_discount_rule, discount_campaigns, product_data, buyer);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const { is_customization_required, customize_id, grouping_identifier } = useIsCustomization(product_data);
	const { cart } = useContext(CartSummaryContext);
	const { refetch } = cart;

	const handle_customisation = () => {
		set_show_customization_drawer(true);
	};

	const disabled = product_data?.inventory?.inventory_status === 'OUT_OF_STOCK';

	return (
		<>
			<Grid container justifyContent={'space-between'} ref={ref} key={key}>
				<Grid className={classes.section_1_info}>
					<Box className={classes.image_box}>
						<Image
							width={'64px'}
							height={'64px'}
							style={{ borderRadius: '6px' }}
							src={get_product_image(product_data, 'CART_SUMMARY_PAGE')}
							alt='test'
						/>
					</Box>
					<Grid>
						<CustomText type='Subtitle' className={classes.product_name}>
							{product_data?.name ? product_data?.name?.substring(0, 30) : ''}
						</CustomText>
						<CustomText type='Body' color='rgba(0, 0, 0, 0.60)'>
							{product_data?.sku_id ? product_data?.sku_id?.substring(0, 30) : ''}
						</CustomText>
						<Box>
							<PriceView
								product={product_data}
								discount_campaigns={discount_campaigns}
								currency_symbol={product_data?.pricing?.currency}
								data_values={data_values}
								column={{ variant_key: 'pricing::price', type: 'price' }}
								styles={{ fontWeight: 700, fontSize: '14px' }}
							/>
						</Box>
					</Grid>
				</Grid>
				<Grid>
					{is_added ? (
						<Grid height='32px' container alignItems='center' justifyContent='center'>
							<Icon iconName='IconCheck' color='#16885F' />
							<CustomText type='Subtitle' color='#16885F'>
								Added
							</CustomText>
						</Grid>
					) : (
						<Button
							tonal
							className={classes.add_button}
							disabled={disabled}
							sx={{
								color: disabled ? primary[200] : '',
								background: disabled ? primary?.contrastText : '',
								'&:hover': { background: disabled ? primary?.contrastText : '', color: disabled ? primary[200] : '' },
							}}
							onClick={() => {
								if (disabled) return;

								is_customization_required
									? handle_customisation()
									: handle_change_quantity({
											product_id: product_data?.id,
											quantity: product_data?.pricing?.min_order_quantity,
											discount_campaign_id: discount_applied?.id,
											discount_campaign_name: discount_applied?.name,
									  });
							}}>
							<Grid>
								Add
								{is_customization_required && <CustomizeText />}
							</Grid>
						</Button>
					)}
				</Grid>
			</Grid>
			{show_customization_drawer && (
				<CommonCustomizationComponent
					customize_id={customize_id}
					product_details={product_data}
					grouping_identifier={grouping_identifier}
					get_and_initialize_cart={refetch}
					show_customization_drawer={show_customization_drawer}
					set_show_customization_drawer={set_show_customization_drawer}
					page_name={'cart_summary'}
					section_name={''}
				/>
			)}
		</>
	);
};

const SearchProductItem: React.FC<SearchProductItemProps> = ({
	on_search,
	products_added_in_cart,
	searched_product_data,
	loading,
	set_searched_product_data,
	handle_change_quantity,
	discount_campaigns,
	is_search_clicked,
	set_is_search_clicked,
}) => {
	const classes = useStyles();
	const [is_expanded, set_is_expanded] = useState(false);
	const [search_value, set_search_value] = useState('');
	const [page_number, set_page_number] = useState(1);
	const [has_more, set_has_more] = useState(true);
	const search_ref = useRef<HTMLDivElement>(null);
	const searched_product_data_keys = keys(searched_product_data);
	const product_card_ref = useRef<HTMLDivElement>(null);

	const debounced_search = debounce((value: string) => {
		if (value) {
			set_page_number(1); // Reset page number on new search
			on_search(value, 1);
			set_is_search_clicked(true);
			set_has_more(true); // Reset has_more on new search
		}
	}, 500);

	const fetch_more_data = () => {
		if (search_value) {
			const next_page = page_number + 1;
			set_page_number(next_page);
			on_search(search_value, next_page);

			// If no new items were added after fetching, set has_more to false
			// This logic might need adjustment based on your API response
			if (searched_product_data_keys.length === 0 || searched_product_data_keys.length < 50) {
				set_has_more(false);
			}
		}
	};

	const handle_click_outside = () => {
		set_is_expanded(false);
		set_search_value('');
		set_searched_product_data({});
		set_page_number(1);
		set_has_more(true);
	};

	const handle_search_click = () => {
		if (is_expanded && search_value) {
			set_page_number(1); // Reset page number on new search
			on_search(search_value, 1);
			set_is_search_clicked(true);
			set_has_more(true); // Reset has_more on new search
		} else {
			set_is_expanded(!is_expanded);
			set_searched_product_data({});
			set_page_number(1);
		}
	};

	return (
		<Grid sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
			<ExpandingSearch is_expanded={is_expanded} ref={search_ref}>
				<IconButton
					onClick={handle_search_click}
					sx={{
						'&:hover': {
							backgroundColor: 'transparent',
							cursor: 'pointer',
						},
					}}>
					<SearchIcon />
				</IconButton>
				{is_expanded && (
					<>
						<TextField
							autoFocus
							variant='standard'
							placeholder='Search products'
							value={search_value}
							onChange={(e) => {
								const new_value = e.target.value;
								set_search_value(new_value);
								set_searched_product_data({});
								set_is_search_clicked(false);
								set_page_number(1);
								debounced_search(new_value);
							}}
							sx={{
								ml: 1,
								flex: 1,
								'& .MuiInput-underline:before': { borderBottom: 'none' },
								'& .MuiInput-underline:after': { borderBottom: 'none' },
								'& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
							}}
						/>
						<Icon iconName='IconX' sx={{ marginRight: '8px' }} onClick={handle_click_outside} />
					</>
				)}
			</ExpandingSearch>
			{is_expanded &&
				search_value &&
				(loading && searched_product_data_keys.length === 0 ? (
					<Grid className={classes.product_container}>
						{[1, 2, 3].map((value) => {
							return <ProductCardLoader key={value} />;
						})}
					</Grid>
				) : (
					// Only show content when we have data or when search was clicked but no results found
					(searched_product_data_keys.length > 0 || (searched_product_data_keys.length === 0 && is_search_clicked)) && (
						<Grid className={classes.product_container} id='scrollable-product-container'>
							{searched_product_data_keys.length === 0 ? (
								<Grid
									container
									sx={{ height: '300px', overflow: 'hidden' }}
									justifyContent='center'
									alignItems='center'
									direction='column'
									gap='8px'>
									<Image src={ImageLinks.no_products} width={150} height={150} />
									<CustomText type='H2'>{t('Common.ErrorPages.NoResult')}</CustomText>
									<CustomText type='Title'>{t('Common.ErrorPages.Retry')}</CustomText>
								</Grid>
							) : (
								<InfiniteScroll
									dataLength={searched_product_data_keys.length}
									next={fetch_more_data}
									hasMore={has_more}
									loader={<ProductCardLoader />}
									scrollableTarget='scrollable-product-container'
									endMessage={
										<p style={{ textAlign: 'center', marginTop: '10px' }}>
											<CustomText type='Body'>No more products to load</CustomText>
										</p>
									}>
									{map(searched_product_data_keys, (key: string) => {
										const product_data = searched_product_data?.[key];
										const is_added = includes(products_added_in_cart, key);
										return (
											<ProductCard
												ref={product_card_ref}
												key={key}
												is_added={is_added}
												product_data={product_data}
												handle_change_quantity={handle_change_quantity}
												discount_campaigns={discount_campaigns}
											/>
										);
									})}
								</InfiniteScroll>
							)}
						</Grid>
					)
				))}
		</Grid>
	);
};

export default SearchProductItem;
