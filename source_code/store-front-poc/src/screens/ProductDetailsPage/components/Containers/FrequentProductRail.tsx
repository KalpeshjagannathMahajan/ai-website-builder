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
	// width: 100%;
	overflow-x: auto; /* Enable horizontal scrolling */
	white-space: nowrap; /* Prevent content from wrapping to the next line */
	display: flex;
	flex-direction: row;
	gap: 0.75em;
	margin: 1rem 0;
`;

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

const FrequentProductRail = () => {
	// const { t } = useTranslation();
	const { frequent_products, get_frequently_bought_products, discount_campaigns } = useContext(ProductDetailsContext);
	const scrollFreqRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isCatFirst, setIsCatFirst] = useState(true);
	const [isCatLast, setIsCatLast] = useState(false);
	const { t } = useTranslation();
	const [loading_product, set_loading_product] = useState(false);
	const theme: any = useTheme();
	const arr = [1, 2, 3, 4];
	const classes = useStyles();

	useEffect(() => {
		get_frequently_bought_products(set_loading_product);
	}, []);
	const scroll = (scrollOffset: number) => {
		scrollFreqRef.current.scroll({
			left: scrollFreqRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollFreqRef.current;

		if (node) {
			setIsCatFirst(node.scrollLeft === 0);
			setIsCatLast(Math.ceil(node.scrollLeft + node.clientWidth) >= node.scrollWidth);

			const handleScroll = () => {
				setIsCatFirst(node.scrollLeft === 0);
				setIsCatLast(Math.ceil(node.scrollLeft + node.clientWidth) >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
		set_loading_product(false);
	}, [frequent_products, loading_product]);
	return (
		<>
			{!loading_product ? (
				<>
					{frequent_products?.length > 0 && (
						<>
							<Grid container className={classes.rails_container} justifyContent='space-between' direction='row' mt={1}>
								<Grid item>
									{is_store_front ? (
										<CustomText className={classes.rails_title}>{t('PDP.FrequentProductRail.FrequentlyBoughtTogether')}</CustomText>
									) : (
										<CustomText type='H6'>{t('PDP.FrequentProductRail.FrequentlyBoughtTogether')}</CustomText>
									)}
								</Grid>
							</Grid>

							<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
								{!isCatFirst && (
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

								<StyledDiv ref={scrollFreqRef}>
									{frequent_products.map((card: any) => (
										<Grid key={card.id} item>
											<RailProductCard
												container_style={{ justifyContent: 'space-around' }}
												product={card}
												cards_template={card_template}
												page_name='product_details_page'
												section_name='fbt_rail'
												discount_campaigns={discount_campaigns}
											/>
										</Grid>
									))}
								</StyledDiv>

								{!isCatLast && (
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

export default FrequentProductRail;
