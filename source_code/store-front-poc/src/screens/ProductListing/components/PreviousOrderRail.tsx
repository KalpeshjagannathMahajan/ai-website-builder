import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Grid, Avatar, Icon, Button } from 'src/common/@the-source/atoms';
import { product_listing } from 'src/utils/api_requests/productListing';
import SkeletonPrevOrderCard from './SkeletonPrevOrderCard';
import PrevOrderCard from 'src/common/@the-source/molecules/PreviosOrderCard/PreviousOrderCard';
import { useSelector } from 'react-redux';
import { StyledDivScroll } from '../constants';
import { t } from 'i18next';
import _ from 'lodash';
import { CartWithoutRedux } from 'src/common/@the-source/atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { useDispatch } from 'react-redux';
import { set_buyer } from 'src/actions/buyer';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

const useStyles = makeStyles(() => ({
	chevron: {
		width: '40px',
		height: '40px',
		cursor: 'pointer',
	},
	chev_icon: {
		width: '20px',
		height: '20px',
	},
}));

interface Props {
	card_template: any;
	buyer_data?: Buyer;
	title_style?: any;
	catalog_id?: string;
	cart_data?: CartWithoutRedux;
	set_cart_data?: any;
	from_redux?: boolean;
	is_buyer_dashboard?: boolean;
	customer_metadata?: any;
	page_name?: any;
	section_name?: any;
	wishlist_data?: any;
}

const PreviousOrderRail: React.FC<Props> = ({
	card_template = {},
	buyer_data,
	title_style,
	catalog_id = '',
	cart_data,
	set_cart_data,
	from_redux = true,
	is_buyer_dashboard = false,
	customer_metadata,
	page_name,
	section_name,
	wishlist_data,
}) => {
	const classes = useStyles();
	const [previous_ordered_product, set_previous_ordered_product] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const buyer_from_redux = useSelector((state: any) => state?.buyer);
	const buyer_id = buyer_data?.id || buyer_from_redux?.buyer_id;
	const [isPrevOrderFirst, setIsPrevOrderFirst] = useState(true);
	const [isPrevOrderLast, setIsPrevOrderLast] = useState(false);
	const scrollPrevOrderRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [is_loading, set_is_loading] = useState(false);
	const theme: any = useTheme();

	const get_previous_ordered_product = async () => {
		set_is_loading(true);
		try {
			const catalog_ids = catalog_id !== '' ? [catalog_id] : [_.get(buyer_data, 'catalog.value') || ''];
			const response: any = await product_listing.get_previous_ordered_product(buyer_id, catalog_ids, 10);
			if (response?.status_code === 200) {
				set_previous_ordered_product(response?.data);
			}
			set_is_loading(false);
		} catch (error) {
			set_is_loading(false);
			console.error(error);
		}
	};

	const handleViewAll = () => {
		if (is_buyer_dashboard === true) {
			dispatch<any>(set_buyer({ buyer_id, is_guest_buyer: false }));
		}
		if (from_redux) {
			navigate(RouteNames.product.all_products.previously_ordered.path, {
				state: { buyer_data, cart_data, from_redux, card_template },
			});
		} else {
			dispatch<any>(
				set_buyer({
					buyer_id: buyer_data?.id,
					is_guest_buyer: false,
					callback: () =>
						navigate(RouteNames.product.all_products.previously_ordered.path, {
							state: { buyer_data, cart_data, from_redux, card_template },
						}),
				}),
			);
		}
		Mixpanel.track(Events.VIEW_ALL_BUTTON_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
		});
	};

	useEffect(() => {
		get_previous_ordered_product();
	}, [buyer_id, buyer_data, catalog_id]);

	const scroll = (scrollOffset: number) => {
		scrollPrevOrderRef.current.scroll({
			left: scrollPrevOrderRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollPrevOrderRef.current;

		if (node) {
			setIsPrevOrderFirst(node.scrollLeft === 0);
			setIsPrevOrderLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);

			const handleScroll = () => {
				setIsPrevOrderFirst(node.scrollLeft === 0);
				setIsPrevOrderLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
	}, [previous_ordered_product]);

	return (
		<>
			{!is_loading ? (
				<React.Fragment>
					{previous_ordered_product?.length > 0 && (
						<Grid container justifyContent='space-between' alignItems='center' direction='row' sx={{ ...title_style }}>
							<Grid item>
								<CustomText type='H6'>{t('ProductList.PreviousOrderRail.PreviouslyOrdered')}</CustomText>
							</Grid>
							{(!isPrevOrderFirst || !isPrevOrderLast) && (
								<Button variant='text' onClick={handleViewAll} sx={{ padding: '0' }}>
									{t('ProductList.Main.ViewAll')}
								</Button>
							)}
						</Grid>
					)}

					{previous_ordered_product?.length > 0 && (
						<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
							{!isPrevOrderFirst && (
								<Grid item sx={{ zIndex: 2, marginRight: '-5rem', marginBottom: '3em' }} onClick={() => scroll(-220)}>
									<Avatar
										isImageAvatar={false}
										style={{
											background: theme?.product?.chevron?.background,
										}}
										className={classes.chevron}
										content={
											<Icon
												sx={{
													...theme?.product?.chevron,
												}}
												iconName='IconChevronLeft'
												className={classes.chev_icon}
											/>
										}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
							<StyledDivScroll ref={scrollPrevOrderRef}>
								{previous_ordered_product?.map((item: any) => (
									<Grid item key={item?.id}>
										<PrevOrderCard
											prev_card_template={card_template}
											prev_data={item}
											buyer={buyer_data}
											cart_data={cart_data}
											set_cart={set_cart_data}
											from_redux={from_redux}
											customer_metadata={customer_metadata}
											page_name={page_name}
											section_name={section_name}
											catalog_ids={[catalog_id]}
											wishlist_data={wishlist_data}
										/>
									</Grid>
								))}
							</StyledDivScroll>

							{!isPrevOrderLast && (
								<Grid item sx={{ marginLeft: '-5rem', marginBottom: '3rem' }} onClick={() => scroll(461)}>
									<Avatar
										isImageAvatar={false}
										className={classes.chevron}
										style={{
											background: theme?.product?.chevron?.background,
										}}
										content={
											<Icon
												sx={{
													...theme?.product?.chevron,
												}}
												iconName='IconChevronRight'
												className={classes.chev_icon}
											/>
										}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
						</Grid>
					)}
				</React.Fragment>
			) : (
				<SkeletonPrevOrderCard />
			)}
		</>
	);
};

export default PreviousOrderRail;
