import { Grid, Icon, Avatar, Button } from 'src/common/@the-source/atoms';
import { useEffect, useState, useRef, MutableRefObject, useContext } from 'react';
import styled from '@emotion/styled';
import SkeletonProductCard from 'src/screens/ProductListing/components/SkeletonProductCard';
import ProductDetailsContext from '../../context';
import { card_template } from 'src/screens/ProductListing/constants';
import RailProductCard from '../RailProductCard';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { useNavigate, useParams } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { makeStyles } from '@mui/styles';

const StyledDiv = styled.div`
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	width: 100%;
	overflow-x: auto; /* Enable horizontal scrolling */
	white-space: nowrap; /* Prevent content from wrapping to the next line */
	display: flex;
	flex-direction: row;
	gap: 0.75em;
	margin: 1rem 0;
`;
const useStyles = makeStyles((theme: any) => ({
	rails_container: {
		...theme?.product_details?.product_info_container?.rails_container,
	},

	rails_title: {
		...theme?.product_details?.product_info_container?.rails_title,
	},
}));
const RelatedProductRail = () => {
	const navigate = useNavigate();
	const classes = useStyles();
	const { VITE_APP_REPO } = import.meta.env;
	const is_store_front = VITE_APP_REPO === 'store_front';
	const { related_products, get_related_products, discount_campaigns } = useContext(ProductDetailsContext);
	const scrollRelatedRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isCatFirst, setIsCatFirst] = useState(true);
	const [isCatLast, setIsCatLast] = useState(false);
	const { t } = useTranslation();
	const [loading_product, set_loading_product] = useState(false);
	const arr = [1, 2, 3, 4];
	const params = useParams();
	const { id } = params;
	useEffect(() => {
		get_related_products(set_loading_product);
	}, []);
	const scroll = (scrollOffset: number) => {
		scrollRelatedRef.current.scroll({
			left: scrollRelatedRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	const handleRecommendationViewAllClick = () => {
		navigate(`${RouteNames.product.product_detail.routing_path}${id}/related-products`);
	};

	useEffect(() => {
		const node = scrollRelatedRef.current;

		if (node) {
			setIsCatFirst(node.scrollLeft === 0);
			setIsCatLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);

			const handleScroll = () => {
				setIsCatFirst(node.scrollLeft === 0);
				setIsCatLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
		set_loading_product(false);
	}, [related_products]);
	return (
		<>
			{!loading_product ? (
				<>
					{related_products?.length > 0 && (
						<>
							<Grid container justifyContent='space-between' direction='row' mt={1} alignItems={'center'}>
								<Grid container className={classes.rails_container} mt={3}>
									<Grid item>
										{is_store_front ? (
											<CustomText className={classes.rails_title}>{t('PDP.RelatedProductRail.RelatedProducts')}</CustomText>
										) : (
											<CustomText type='H6'>{t('PDP.RelatedProductRail.RelatedProducts')}</CustomText>
										)}
									</Grid>
								</Grid>
								{(!isCatFirst || !isCatLast) && (
									<Button variant='text' onClick={handleRecommendationViewAllClick}>
										{t('PDP.Common.ViewAll')}
									</Button>
								)}
							</Grid>
							<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
								{!isCatFirst && (
									<Grid item sx={{ zIndex: 2, marginRight: '-5rem' }} onClick={() => scroll(-220)}>
										<Avatar
											isImageAvatar={false}
											style={{ background: 'white', width: '40px', height: '40px', cursor: 'pointer' }}
											content={
												<Icon color='black' iconName='IconChevronLeft' sx={{ width: '20px', height: '20px', background: 'white' }} />
											}
											size='large'
											variant='circular'
										/>
									</Grid>
								)}

								<StyledDiv ref={scrollRelatedRef}>
									{related_products.map((card: any) => (
										<Grid key={card.id} item>
											<RailProductCard
												container_style={{ justifyContent: 'space-around' }}
												product={card}
												cards_template={card_template}
												page_name='product_details_page'
												section_name='related_products_rail'
												discount_campaigns={discount_campaigns}
											/>
										</Grid>
									))}
								</StyledDiv>

								{!isCatLast && (
									<Grid item sx={{ marginLeft: '-5rem', zIndex: 2 }} onClick={() => scroll(220)}>
										<Avatar
											isImageAvatar={false}
											style={{ background: 'white', width: '40px', height: '40px', cursor: 'pointer' }}
											content={
												<Icon color='black' iconName='IconChevronRight' sx={{ width: '24px', height: '24px', background: 'white' }} />
											}
											size='large'
											variant='circular'
										/>
									</Grid>
								)}
							</Grid>
						</>
					)}
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
		</>
	);
};

export default RelatedProductRail;
