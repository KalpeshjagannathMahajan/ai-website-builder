import styled from '@emotion/styled';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductData } from '../mock/ProductInterface';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { product_listing } from 'src/utils/api_requests/productListing';
import { Avatar, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import RouteNames from 'src/utils/RouteNames';
import SkeletonRecommendedCard from './SkeletonRecommendedCard';
import RecommendCard from 'src/common/@the-source/molecules/RecommendCard/RecommendCard';
import ProductTemplateTwo from './ProductTemplate2';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import usePricelist from 'src/hooks/usePricelist';

export interface ITemplate {
	template_id: number;
	attributes: {
		keys: [];
		style: {
			[key: string]: any;
		};
	};
	rows: any[];
}

export interface IConfig {
	type: string;
	settings: any;
}

interface ICustom {
	title: string;
	card_template: ITemplate;
	config: IConfig;
}

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
`;
const useStyles = makeStyles(() => ({
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

const CustomRail = ({ title = '', card_template, config }: ICustom) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const buyer = useSelector((state: any) => state.buyer);
	const scrollCustomRailRef = useRef() as MutableRefObject<HTMLDivElement>;

	const [products, set_products] = useState<ProductData>({});
	const [nb_hits, set_nbhits] = useState(0);
	const [_page, set_page] = useState(0);
	const [is_loading, set_is_loading] = useState(false);
	const [isRecFirst, setIsRecFirst] = useState(true);
	const [isRecLast, setIsRecLast] = useState(false);
	const theme: any = useTheme();

	const pricelist_value = usePricelist();

	const hits_response_setter = (nbHits: number = 0, page: number = 0, hits: any = {}) => {
		set_nbhits(nbHits);
		set_page(page);
		set_products(hits);
		set_is_loading(false);
	};

	const get_products_by_config = async () => {
		try {
			const catalog_ids = [pricelist_value?.value || ''];
			const response: any = await product_listing.get_products_by_config(config, _page + 1, 10, buyer.buyer_info?.id, catalog_ids);
			if (response?.status === 200) {
				const { nbHits, page, hits } = response?.data;
				hits_response_setter(nbHits, page, hits);
				set_is_loading(false);
			}
		} catch (error) {
			set_is_loading(false);
			console.error(error);
		}
	};

	const scroll = (scrollOffset: number) => {
		scrollCustomRailRef.current.scroll({
			left: scrollCustomRailRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	const handleViewAllClick = () => {
		// Change this
		const _template = encodeURIComponent(JSON.stringify(card_template));
		const _config = encodeURIComponent(JSON.stringify(config));
		navigate(`${RouteNames.product.all_products.custom.routing_path}${title}?card_template=${_template}&config=${_config}`);
	};

	const template_selector = (item: any) => {
		switch (card_template?.template_id) {
			case 1:
				return (
					<RecommendCard
						handleClick={(id: any) => navigate(`${RouteNames.product.product_detail.routing_path}${id}`)}
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
					/>
				);
		}
	};

	useEffect(() => {
		const node = scrollCustomRailRef.current;

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
	}, [products]);

	useEffect(() => {
		get_products_by_config();
	}, [pricelist_value]);

	return (
		<React.Fragment>
			<Grid container justifyContent='space-between' direction='row' sx={{ marginTop: '2rem' }}>
				{nb_hits > 0 && !is_loading && (
					<Grid item>
						<CustomText type='H6' style={{ lineHeight: '2.4rem' }}>
							{title}
						</CustomText>
					</Grid>
				)}
				{(!isRecLast || !isRecFirst) && (
					<Grid item>
						<Button variant='text' onClick={handleViewAllClick} sx={{ paddingTop: '0' }}>
							{t('ProductList.Main.ViewAll')}
						</Button>
					</Grid>
				)}
			</Grid>
			<Grid container direction='row' alignItems='center' flexWrap='nowrap' zIndex={2}>
				{!isRecFirst && (
					<Grid item sx={{ zIndex: 2, marginRight: '-5rem' }} onClick={() => scroll(-450)}>
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
				<StyledDiv ref={scrollCustomRailRef}>
					{nb_hits > 0 && !is_loading && (
						<React.Fragment>
							{Object.keys(products)?.map((item: any, index) => (
								<Grid item key={item?.id} style={{ margin: index === 0 ? '0 0.8rem 0 0' : '0 0.8rem' }}>
									{template_selector(products[item])}
								</Grid>
							))}
						</React.Fragment>
					)}
					{is_loading && <SkeletonRecommendedCard />}
				</StyledDiv>
				{!isRecLast && (
					<Grid item sx={{ marginLeft: '-4rem' }} onClick={() => scroll(450)}>
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
		</React.Fragment>
	);
};

export default CustomRail;
