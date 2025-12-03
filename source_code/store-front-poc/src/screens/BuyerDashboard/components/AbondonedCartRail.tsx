import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Grid, Avatar, Icon, Button } from 'src/common/@the-source/atoms';
import { product_listing } from 'src/utils/api_requests/productListing';
import { useSelector } from 'react-redux';

import { CartWithoutRedux } from 'src/common/@the-source/atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { StyledDivScroll } from 'src/screens/ProductListing/constants';
import RailProductCard from 'src/screens/ProductDetailsPage/components/RailProductCard';
import SkeletonProductCard from 'src/screens/ProductListing/components/SkeletonProductCard';
import { background_colors, custom_stepper_text_color } from 'src/utils/light.theme';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set_buyer } from 'src/actions/buyer';
import RouteNames from 'src/utils/RouteNames';
import { t } from 'i18next';
import _ from 'lodash';
import dayjs from 'dayjs';
import constants from 'src/utils/constants';
import { get_formatted_price_with_currency } from 'src/utils/common';

const useStyles = makeStyles(() => ({
	chevron: {
		background: background_colors?.primary,
		width: '40px',
		height: '40px',
		cursor: 'pointer',
	},
	chev_icon: {
		width: '20px',
		height: '20px',
		background: background_colors?.primary,
	},
}));
const arr = [1, 2, 3, 4];
interface Props {
	card_template: any;
	buyer_data?: Buyer;
	title_style?: any;
	catalog_id?: string;
	cart_data?: CartWithoutRedux;
	set_cart_data?: any;
	from_redux?: boolean;
	wishlist_data?: any;
}

const AbandonedCartRail: React.FC<Props> = ({
	card_template = {},
	buyer_data,
	title_style,
	catalog_id = '',
	cart_data,
	set_cart_data,
	from_redux = true,
	wishlist_data,
}) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [previous_ordered_product, set_previous_ordered_product] = useState([]);
	const [cart_info, set_cart_info] = useState<any>({});
	const buyer_from_redux = useSelector((state: any) => state?.buyer);
	const buyer_id = buyer_data?.id || buyer_from_redux?.buyer_id;
	const [isPrevOrderFirst, setIsPrevOrderFirst] = useState(true);
	const [isPrevOrderLast, setIsPrevOrderLast] = useState(false);
	const scrollAbonededCartRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [is_loading, set_is_loading] = useState(false);

	const get_previous_ordered_product = async () => {
		set_is_loading(true);
		try {
			const response: any = await product_listing.get_analytics_rail(buyer_id);
			if (response?.status_code === 200) {
				const { total_products, total_amount, _currency, last_updated_at, products = [] } = response?.data;
				set_cart_info({ total_products, total_amount, currency: _currency, last_updated_at });
				set_previous_ordered_product(products);
			}
			set_is_loading(false);
		} catch (error) {
			set_is_loading(false);
			console.error(error);
		}
	};

	const handle_view_all = () => {
		dispatch<any>(set_buyer({ buyer_id: buyer_data?.buyer_id, is_guest_buyer: false }));
		navigate(`${RouteNames.product.all_products.abandoned_cart.path}?buyer_id=${buyer_data?.buyer_id}`);
	};

	useEffect(() => {
		get_previous_ordered_product();
	}, [buyer_id, buyer_data, catalog_id]);

	const scroll = (scrollOffset: number) => {
		scrollAbonededCartRef.current.scroll({
			left: scrollAbonededCartRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollAbonededCartRef.current;

		if (node) {
			setIsPrevOrderFirst(node.scrollLeft === 0);
			setIsPrevOrderLast(Math.ceil(node.scrollLeft + node.clientWidth) >= node.scrollWidth);

			const handleScroll = () => {
				setIsPrevOrderFirst(node.scrollLeft === 0);
				setIsPrevOrderLast(Math.ceil(node.scrollLeft + node.clientWidth) >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
	}, [previous_ordered_product]);

	const abondoned_date = dayjs(cart_info?.last_updated_at)?.format(constants.ATTRIBUTE_DATE_FORMAT);
	const count_products = cart_info?.total_products > 1 ? `${cart_info?.total_products} Products` : `${cart_info?.total_products} Product`;
	return (
		<>
			{!is_loading ? (
				<React.Fragment>
					{previous_ordered_product?.length > 0 && (
						<Grid container justifyContent='space-between' alignItems='flex-start' direction='row' sx={{ ...title_style }} mt={1}>
							<Grid item display={'flex'} alignItems={'flex-start'} flexDirection={'column'} gap={'8px'}>
								<CustomText type='Title'>
									<strong>Abandoned cart</strong>
									{cart_info?.last_updated_at && ` on ${abondoned_date}`}
								</CustomText>
								<CustomText
									type='Body'
									color={custom_stepper_text_color.grey}>{`${count_products} • Value: ${get_formatted_price_with_currency(
									cart_info?.currency,
									cart_info?.total_amount,
								)}`}</CustomText>
							</Grid>
							{(!isPrevOrderFirst || !isPrevOrderLast) && (
								<Button variant='text' onClick={handle_view_all} sx={{ padding: '0' }}>
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
										className={classes.chevron}
										content={<Icon color='black' iconName='IconChevronLeft' className={classes.chev_icon} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
							<StyledDivScroll ref={scrollAbonededCartRef}>
								{_.slice(previous_ordered_product, 0, 10)?.map((item: any) => (
									<Grid item key={item?.id}>
										<RailProductCard
											container_style={{ justifyContent: 'space-around' }}
											product={item}
											cards_template={card_template}
											buyer={buyer_data}
											cart_data={cart_data}
											set_cart={set_cart_data}
											from_redux={from_redux}
											is_buyer_dashboard={true}
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
										content={<Icon color='black' iconName='IconChevronRight' className={classes.chev_icon} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
						</Grid>
					)}
				</React.Fragment>
			) : (
				<React.Fragment>
					<Grid container justifyContent='space-between' alignItems='center' direction='row' sx={{ ...title_style }}>
						<Grid item>
							<CustomText type='H6'>Abandoned cart </CustomText>
						</Grid>
					</Grid>
					<Grid container>
						{arr?.map((a: any) => (
							<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
								<SkeletonProductCard />
							</Grid>
						))}
					</Grid>
				</React.Fragment>
			)}
		</>
	);
};

export default AbandonedCartRail;
