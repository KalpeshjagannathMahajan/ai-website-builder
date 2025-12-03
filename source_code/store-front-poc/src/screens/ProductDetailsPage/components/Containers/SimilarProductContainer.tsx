import { Grid, Icon, Avatar } from 'src/common/@the-source/atoms';
import { useEffect, useState, useRef, MutableRefObject, useContext } from 'react';
import styled from '@emotion/styled';
import SkeletonProductCard from 'src/screens/ProductListing/components/SkeletonProductCard';
import ProductDetailsContext from '../../context';
import { card_template } from 'src/screens/ProductListing/constants';
import RailProductCard from '../RailProductCard';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import useStyles from '../../styles';

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

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

const SimilarProductContainer = () => {
	const { similar_products, get_similar_products, discount_campaigns } = useContext(ProductDetailsContext);
	const scrollSimilarRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isSimilarFirst, setIsSimilarFirst] = useState(true);
	const [isSimilarLast, setIsSimilarLast] = useState(false);
	const { t } = useTranslation();
	const arr = [1, 2, 3, 4];
	const theme: any = useTheme();
	const classes = useStyles();

	useEffect(() => {
		get_similar_products();
	}, []);

	const scroll = (scrollOffset: number) => {
		scrollSimilarRef.current.scroll({
			left: scrollSimilarRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollSimilarRef.current;

		const checkScrollPosition = () => {
			const scrollPosition = node.scrollLeft + node.clientWidth;
			const maxScrollPosition = node.scrollWidth;
			setIsSimilarFirst(node.scrollLeft === 0);
			setIsSimilarLast(scrollPosition >= maxScrollPosition - 1);
		};

		if (node) {
			checkScrollPosition();

			const handleScroll = () => {
				checkScrollPosition();
			};

			const resizeObserver = new ResizeObserver(() => {
				checkScrollPosition();
			});

			node.addEventListener('scroll', handleScroll);
			resizeObserver.observe(node);

			return () => {
				node.removeEventListener('scroll', handleScroll);
				resizeObserver.disconnect();
			};
		}
	}, [similar_products]);

	return (
		<>
			{similar_products?.length > 0 && (
				<>
					<Grid container className={classes.rails_container} mt={3}>
						<Grid item>
							{is_store_front ? (
								<CustomText className={classes.rails_title}>{t('PDP.SimilarProductContainer.SimilarProducts')}</CustomText>
							) : (
								<CustomText type='H6'>{t('PDP.SimilarProductContainer.SimilarProducts')}</CustomText>
							)}
						</Grid>
					</Grid>

					<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
						{!isSimilarFirst && (
							<Grid item className={classes.chevron_left} onClick={() => scroll(-220)}>
								<Avatar
									isImageAvatar={false}
									style={{ background: theme?.product?.chevron?.background, width: '40px', height: '40px', cursor: 'pointer' }}
									content={<Icon iconName='IconChevronLeft' sx={{ width: '20px', height: '20px', ...theme?.product?.chevron }} />}
									size='large'
									variant='circular'
								/>
							</Grid>
						)}

						{similar_products?.length > 0 ? (
							<StyledDiv ref={scrollSimilarRef}>
								{similar_products.map((card: any) => (
									<Grid key={card.id} item>
										<RailProductCard
											container_style={{ justifyContent: 'space-around' }}
											product={card}
											cards_template={card_template}
											page_name='product_details_page'
											section_name='similar_products_rail'
											discount_campaigns={discount_campaigns}
										/>
									</Grid>
								))}
							</StyledDiv>
						) : (
							<>
								{arr.map((a: any) => (
									<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
										<SkeletonProductCard />
									</Grid>
								))}
							</>
						)}

						{!isSimilarLast && (
							<Grid item className={classes.chevron_right} onClick={() => scroll(220)}>
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
				</>
			)}
		</>
	);
};

export default SimilarProductContainer;
