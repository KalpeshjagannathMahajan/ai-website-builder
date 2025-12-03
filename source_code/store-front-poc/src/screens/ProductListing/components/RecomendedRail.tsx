/* eslint-disable react/no-unused-prop-types */
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Grid, Button, Icon, Avatar } from 'src/common/@the-source/atoms';
import RecommendCard from 'src/common/@the-source/molecules/RecommendCard/RecommendCard';
import SkeletonRecommendedCard from './SkeletonRecommendedCard';
import { product_listing } from 'src/utils/api_requests/productListing';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import RouteNames from 'src/utils/RouteNames';
import { CartWithoutRedux } from 'src/common/@the-source/atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import CustomText from 'src/common/@the-source/CustomText';
import { useDispatch } from 'react-redux';
import { set_buyer } from 'src/actions/buyer';
import { useTheme } from '@mui/material/styles';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import usePricelist from 'src/hooks/usePricelist';

const StyledDiv = styled.div`
	width: 100%;
	overflow-y: hidden;
	overflow-x: scroll;
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	display: flex;
	flex-direction: row;
	margin: 0;
	margin-right: 16px;
`;

interface Props {
	card_template: any;
	title: string;
	containerStyle?: any;
	product_id?: any;
	type: any;
	handle_navigate: any;
	buyer_data?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart_data?: any;
	catalog_id?: string;
	from_redux?: boolean;
	is_buyer_dashboard?: boolean;
	customer_metadata?: any;
	page_name?: any;
	section_name?: any;
	wishlist_data?: any;
}

const RecommendedRail: React.FC<Props> = ({
	card_template = {},
	title,
	type,
	containerStyle,
	handle_navigate,
	buyer_data,
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
	const navigate = useNavigate();
	const { t } = useTranslation();
	const buyer = useSelector((state: any) => state.buyer);
	const scrollRecommendRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isRecLast, setIsRecLast] = useState(false);
	const [isRecFirst, setIsRecFirst] = useState(true);
	const [is_loading, set_is_loading] = useState(false);
	const [recommended_products, set_recommended_products] = useState([]);
	const pricelist_value = usePricelist();
	const catalog_ids = catalog_id !== '' ? [catalog_id] : [pricelist_value?.value || ''];
	const dispatch = useDispatch();
	const theme: any = useTheme();

	const handle_get_recommended_products = async () => {
		const tenent_id = buyer_data?.id ? buyer_data?.id : buyer?.buyer_id;
		if (tenent_id === undefined || tenent_id === '') return;
		set_is_loading(true);
		let filter_params;
		if (type) {
			filter_params = {
				type: type?.replaceAll('_', '-'),
				limit: 10,
			};
		}
		try {
			const response: any = await product_listing.get_recommended_products({
				tenent_id,
				undefined,
				filter_params,
				catalog_ids,
				limit: 10,
			});
			if (response?.status === 200) {
				set_is_loading(false);
				set_recommended_products(response?.data);
			}
		} catch (error) {
			set_is_loading(false);
			console.error(error);
		}
	};

	const handleRecommendationViewAllClick = () => {
		if (is_buyer_dashboard === true) {
			dispatch<any>(set_buyer({ buyer_id: buyer_data?.buyer_id, is_guest_buyer: false }));
		}
		navigate(RouteNames.product.all_products.recommendation.path);
		Mixpanel.track(Events.VIEW_ALL_BUTTON_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
		});
	};

	const scroll = (scrollOffset: number) => {
		scrollRecommendRef.current.scroll({
			left: scrollRecommendRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		handle_get_recommended_products();
	}, [buyer_data?.id, buyer?.buyer_id, catalog_id, pricelist_value]);

	useEffect(() => {
		const node = scrollRecommendRef.current;

		if (node) {
			setIsRecFirst(node.scrollLeft === 0);
			setIsRecLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);

			const handleScroll = () => {
				setIsRecFirst(node.scrollLeft === 0);
				setIsRecLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
	}, [recommended_products]);
	return (
		<React.Fragment>
			{!is_loading ? (
				<React.Fragment>
					{recommended_products?.length > 0 && (
						<Grid container justifyContent='space-between' alignItems='center' direction='row' sx={containerStyle}>
							<CustomText type='H6'>{title}</CustomText>
							{(!isRecLast || !isRecFirst) && (
								<Button variant='text' onClick={handleRecommendationViewAllClick} sx={{ padding: '0' }}>
									{t('ProductList.Main.ViewAll')}
								</Button>
							)}
						</Grid>
					)}
					{recommended_products && (
						<Grid container direction='row' alignItems='center' flexWrap='nowrap' zIndex={2}>
							{!isRecFirst && (
								<Grid item sx={{ zIndex: 2, marginRight: '-5rem' }} onClick={() => scroll(-450)}>
									<Avatar
										isImageAvatar={false}
										style={{ background: theme?.product?.chevron?.background, width: '40px', height: '40px', cursor: 'pointer' }}
										content={<Icon iconName='IconChevronLeft' sx={{ width: '24px', height: '24px', ...theme?.product?.chevron }} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
							<StyledDiv ref={scrollRecommendRef}>
								{recommended_products.map((item: any, index) => (
									<Grid item key={item?.id} style={{ margin: index === 0 ? '0 0.8rem 0 0' : '0 0.8rem' }}>
										<RecommendCard
											handleClick={(id: any) => handle_navigate(id)}
											recommend={item}
											rec_card_template={card_template}
											border={true}
											hasSimillar={true}
											buyer={buyer_data}
											cart_data={cart_data}
											set_cart={set_cart_data}
											from_redux={from_redux}
											catalog_ids={catalog_ids}
											page_name={page_name}
											section_name={section_name}
											customer_metadata={customer_metadata}
											wishlist_data={wishlist_data}
										/>
									</Grid>
								))}
							</StyledDiv>
							{!isRecLast && (
								<Grid item sx={{ marginLeft: '-5rem', zIndex: 2 }} onClick={() => scroll(450)}>
									<Avatar
										isImageAvatar={false}
										style={{ background: theme?.product?.chevron?.background, width: '40px', height: '40px', cursor: 'pointer' }}
										content={<Icon iconName='IconChevronRight' sx={{ width: '24px', height: '24px', ...theme?.product?.chevron }} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
						</Grid>
					)}
				</React.Fragment>
			) : (
				<SkeletonRecommendedCard />
			)}
		</React.Fragment>
	);
};

export default RecommendedRail;
