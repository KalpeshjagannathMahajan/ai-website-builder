import { Card } from '@mui/material';
import { Grid, Button, Image, Icon, Avatar } from 'src/common/@the-source/atoms';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import SkeletonCollections from './SkeletonCollections';
import RouteNames from 'src/utils/RouteNames';
import styled from '@emotion/styled';
import { CardData } from '../constants';
import constants from 'src/utils/constants';
import get_product_image from 'src/utils/ImageConstants';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

const GradientImage = styled.div`
	position: relative;
	width: 340px;
	height: 200px;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
		z-index: 1;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;
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
	gap: 20px;
	margin: 0;
	margin-right: 16px;
`;

const useStyles = makeStyles(() => ({
	card_container: {
		width: '340px',
		height: '200px',
		borderRadius: '8px',
		boxShadow: 'none',
		cursor: 'pointer',
	},
	chevron: {
		width: '40px',
		height: '40px',
		cursor: 'pointer',
	},
	chev_icon: {
		width: '24px',
		height: '24px',
	},
}));

interface ICollectionsRail {
	collections: CardData[];
	customer_metadata?: any;
}

const CollectionsRail = ({ collections, customer_metadata }: ICollectionsRail) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const scrollCollectionRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [containers, set_containers] = useState<CardData[]>(collections);
	const [isColFirst, setIsColFirst] = useState(true);
	const [isColLast, setIsColLast] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const theme: any = useTheme();

	const handleCollectionViewAllClick = () => {
		navigate(RouteNames.product.all_products.collection.path);
		Mixpanel.track(Events.VIEW_ALL_BUTTON_CLICKED, {
			tab_name: 'Products',
			page_name: 'all_products_page',
			section_name: 'collection_rail',
			subtab_name: '',
			customer_metadata,
		});
	};

	const handle_card_click = (name: string, id: string) => {
		navigate(`${RouteNames.product.all_products.collection_listing.routing_path}${name}/${id}?search=`);
		Mixpanel.track(Events.COLLECTION_CLICKED, {
			tab_name: 'Products',
			page_name: 'all_products_page',
			section_name: 'collection_rail',
			subtab_name: '',
			customer_metadata,
			rail_rank: '1',
		});
	};

	const scroll = (scrollOffset: number) => {
		scrollCollectionRef.current.scroll({
			left: scrollCollectionRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const filteredCollections = _.filter(collections, (item: any) => !isNaN(item?.product_count) && item?.product_count > 0);
		set_containers(filteredCollections);
		setIsLoading(false);
	}, [collections]);

	useEffect(() => {
		const node = scrollCollectionRef.current;

		if (node) {
			setIsColFirst(node.scrollLeft === 0);
			setIsColLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);

			const handleScroll = () => {
				setIsColFirst(node.scrollLeft === 0);
				setIsColLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);
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
				<SkeletonCollections />
			) : (
				<>
					{containers?.length > 0 && (
						<Grid container justifyContent='space-between' alignItems='center' direction='row' my={'6px'}>
							<Grid item>
								<CustomText type='H6' style={{ lineHeight: '2.4rem' }}>
									{t('ProductList.CollectionsRail.Collections')}
								</CustomText>
							</Grid>
							<Grid item>
								{(!isColFirst || !isColLast) && (
									<Button variant='text' onClick={handleCollectionViewAllClick} sx={{ paddingTop: '0' }}>
										{t('ProductList.Main.ViewAll')}
									</Button>
								)}
							</Grid>
						</Grid>
					)}
					{containers && containers?.length > 0 && (
						<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
							{!isColFirst && (
								<Grid item sx={{ zIndex: 2, marginRight: '-5rem' }} onClick={() => scroll(-356)}>
									<Avatar
										isImageAvatar={false}
										className={classes.chevron}
										style={{
											...theme?.product?.chevron,
										}}
										content={<Icon color={theme?.product?.chevron?.color} iconName='IconChevronLeft' className={classes.chev_icon} />}
										size='large'
										variant='circular'
									/>
								</Grid>
							)}
							<StyledDiv ref={scrollCollectionRef}>
								{_.map(containers, (item: CardData) => (
									<Grid item key={item?.id}>
										<Card
											className={classes.card_container}
											sx={{
												...theme?.product?.collection?.collection_rail,
											}}
											onClick={() => handle_card_click(item?.name, item?.id)}
											key={item?.id}>
											<GradientImage>
												<Image
													style={{
														objectFit: 'contain',
													}}
													src={get_product_image(item, 'COLLECTIONS_RAIL')}
													alt='Collection Image'
													fallbackSrc={constants.FALLBACK_IMAGE}
												/>
											</GradientImage>
											<Grid
												container
												direction='column'
												justifyContent='flex-end'
												sx={{ position: 'relative', bottom: '40px', left: '20px', zIndex: '1' }}>
												<CustomText type='H6' color={theme?.product?.collection?.color}>
													{item?.name}
												</CustomText>
											</Grid>
										</Card>
									</Grid>
								))}
							</StyledDiv>
							{!isColLast && (
								<Grid item sx={{ marginLeft: '-5rem', zIndex: 2 }} onClick={() => scroll(356)}>
									<Avatar
										isImageAvatar={false}
										className={classes.chevron}
										style={{
											...theme?.product?.chevron,
										}}
										content={<Icon color={theme?.product?.chevron?.color} iconName='IconChevronRight' className={classes.chev_icon} />}
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

export default CollectionsRail;
