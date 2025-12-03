import { Card } from '@mui/material';
import { Grid, Button, Image, Icon, Avatar } from 'src/common/@the-source/atoms';
import { CardData } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import SkeletonCategory from './SkeletonCategory';
import RouteNames from 'src/utils/RouteNames';
import styled from '@emotion/styled';
import constants from 'src/utils/constants';
import get_product_image from 'src/utils/ImageConstants';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';

import _ from 'lodash';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

const StyledDiv = styled.div`
	// width: 100%;
	overflow-y: hidden;
	overflow-x: scroll;
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	display: flex;
	flex-direction: row;
	gap: 0.75em;
	margin: 0;
	margin-right: 16px;
`;

interface ICategoriesRail {
	categories: CardData[];
	containerStyle?: any;
	customer_metadata?: any;
}
const useStyles = makeStyles(() => ({
	card_container: {
		width: '200px',
		height: '206px',
		background: 'none',
		boxShadow: 'none',
		cursor: 'pointer',
	},
	image: {
		borderRadius: '8px',
		objectFit: 'contain',
	},
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

const CategoriesRail = ({ categories, containerStyle, customer_metadata }: ICategoriesRail) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const scrollCategoryRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [containers, setContainers] = useState<CardData[]>([]);
	const [isCatFirst, setIsCatFirst] = useState(true);
	const [isCatLast, setIsCatLast] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const theme: any = useTheme();

	useEffect(() => {
		const filteredCategories = _.filter(
			categories,
			(item: any) => item?.level === 1 && !isNaN(item?.product_count) && item?.product_count > 0,
		);
		setContainers(filteredCategories);
		setIsLoading(false);
	}, [categories]);

	const handleCategoryViewAllClick = () => {
		navigate(RouteNames.product.all_products.category.path);
		Mixpanel.track('view_all_button_clicked', {
			tab_name: 'Products',
			page_name: 'all_products_page',
			section_name: 'category_rail',
			subtab_name: '',
			customer_metadata,
		});
	};

	const handle_card_click = (name: string, id: string) => {
		navigate(`${RouteNames.product.all_products.category_listing.routing_path}${name}/${id}?search=`);
		Mixpanel.track(Events.CATEGORY_CLICKED, {
			tab_name: 'Products',
			page_name: 'all_products_page',
			section_name: 'category_rail',
			subtab_name: '',
			customer_metadata,
			rail_rank: '1',
		});
	};

	const scroll = (scrollOffset: number) => {
		scrollCategoryRef.current.scroll({
			left: scrollCategoryRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollCategoryRef.current;

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
	}, [containers]);

	return (
		<>
			{isLoading ? (
				<SkeletonCategory />
			) : (
				<>
					{containers?.length > 0 && (
						<Grid container justifyContent='space-between' alignItems='center' direction='row' style={containerStyle}>
							<Grid item>
								<CustomText type='H6'>{t('ProductList.CategoriesRail.Category')}</CustomText>
							</Grid>
							<Grid item>
								{(!isCatFirst || !isCatLast) && (
									<Button variant='text' onClick={handleCategoryViewAllClick} sx={{ paddingTop: '0' }}>
										{t('ProductList.Main.ViewAll')}
									</Button>
								)}
							</Grid>
						</Grid>
					)}

					{containers && (
						<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
							{!isCatFirst && (
								<Grid item sx={{ zIndex: 2, marginRight: '-5rem', marginBottom: '3rem' }} onClick={() => scroll(-220)}>
									<Avatar
										isImageAvatar={false}
										className={classes.chevron}
										style={theme?.product?.chevron}
										content={<Icon sx={theme?.product?.chevron} iconName='IconChevronLeft' className={classes.chev_icon} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}

							<StyledDiv ref={scrollCategoryRef}>
								{_.map(containers, (card, index) => (
									<Grid key={card?.id} item>
										<Card
											className={classes.card_container}
											style={{ margin: index === 0 ? '0 0.4rem 0 0' : '0 0.4rem' }}
											key={card?.id}
											onClick={() => handle_card_click(card?.name, card?.id)}>
											<Image
												src={get_product_image(card, 'CATEGORY_RAIL')}
												width='198px'
												height='180px'
												alt='Category Image'
												id={'category-image'}
												style={theme?.product?.category_image}
												imgClass={classes.image}
												fallbackSrc={constants.FALLBACK_IMAGE}
											/>
											<Grid container direction='column' justifyContent='flex-end' alignItems='center'>
												<CustomText type='Title'>{card?.name}</CustomText>
											</Grid>
										</Card>
									</Grid>
								))}
							</StyledDiv>

							{!isCatLast && (
								<Grid item sx={{ marginLeft: '-5rem', marginBottom: '3rem' }} onClick={() => scroll(220)}>
									<Avatar
										isImageAvatar={false}
										className={classes.chevron}
										style={theme?.product?.chevron}
										content={<Icon sx={theme?.product?.chevron} iconName='IconChevronRight' className={classes.chev_icon} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
						</Grid>
					)}
				</>
			)}
		</>
	);
};

export default CategoriesRail;
