import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Avatar, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { CategoryData, ChevronAvatar, StyledDiv } from '../constants';
import styles from './CategoryFilter.module.css';
import { useTranslation } from 'react-i18next';
import constants from 'src/utils/constants';
import get_product_image from 'src/utils/ImageConstants';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
interface CatHeaderProps {
	CategoriesData: CategoryData[];
	CategoryLevels: string[];
	handleCategory: any;
	handleAllCategory: any;
	category_levels: {
		categoryLevel2: string;
		categoryLevel3: string;
	};
}

const useStyles = makeStyles((theme: any) => ({
	not_selected: {
		...theme?.product?.category_rail?.not_selected,
	},
	selected: {
		...theme?.product?.category_rail?.selected,
	},
	imageContainer: {
		...theme?.product?.category_rail?.imageContainer,
		'@media (max-width: 600px)': {
			width: '50px !important',
			height: '50px !important',
		},
	},
	category_spacing: {
		width: '100px',
		'@media (max-width: 600px)': {
			width: '50px',
		},
	},
	categoryNameHeader: {
		margin: '8px 2px 4px !important',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		maxWidth: '100%',
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		lineHeight: '1.2em',
		maxHeight: '2.4em',
		textAlign: 'center',
		width: '100%',
		whiteSpace: 'normal',
		wordBreak: 'break-word',
	},
}));

const CategoryHeaderFilters = ({ CategoriesData, CategoryLevels, handleCategory, handleAllCategory, category_levels }: CatHeaderProps) => {
	const CategoryHeaderFilterRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isFirstHeader, setIsFirstHeader] = useState(true);
	const [isLastHeader, setIsLastHeader] = useState(false);
	const { t } = useTranslation();
	const theme: any = useTheme();
	const classes = useStyles();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const is_multiple_words = (text: string) => {
		if (!text) return false;
		return text?.split(' ')?.length > 1;
	};

	const should_show_truncation = (text: string) => {
		if (!text) return false;
		if (text?.length > 12) {
			return true;
		}
		return is_multiple_words(text);
	};

	useEffect(() => {
		const node = CategoryHeaderFilterRef.current;

		const checkScrollPosition = () => {
			const scrollPosition = node.scrollLeft + node.clientWidth;
			const maxScrollPosition = node.scrollWidth;
			setIsFirstHeader(node.scrollLeft === 0);
			setIsLastHeader(scrollPosition >= maxScrollPosition - 1);
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
	}, [CategoriesData]);

	const scrollHeader = (scrollOffset: number) => {
		CategoryHeaderFilterRef?.current?.scroll({
			left: CategoryHeaderFilterRef?.current?.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	const is_over_flowing = () => {
		if (CategoryHeaderFilterRef) {
			return CategoryHeaderFilterRef?.current?.scrollWidth > CategoryHeaderFilterRef?.current?.clientWidth;
		}
	};

	return (
		<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
			{!isFirstHeader && (
				<Grid item className={styles.category_left_chevron} onClick={() => scrollHeader(-100)}>
					<Avatar
						isImageAvatar={false}
						style={{ ...ChevronAvatar, background: theme?.product?.chevron?.background }}
						content={
							<Icon
								sx={{
									...theme?.product?.chevron,
								}}
								iconName='IconChevronLeft'
								className={styles.chevronIcon}
							/>
						}
						size='large'
						variant='circular'
					/>
				</Grid>
			)}
			<StyledDiv
				style={{
					justifyContent: is_over_flowing() ? 'flex-start' : 'center',
					display: 'flex',
					...(is_small_screen ? { display: 'flex', alignItems: 'flex-start' } : {}),
				}}
				ref={CategoryHeaderFilterRef}>
				<Grid item height={94} onClick={handleAllCategory} className={styles.Category}>
					<Grid
						container
						direction='column'
						justifyContent='space-between'
						alignItems='center'
						className={is_ultron ? (category_levels?.categoryLevel2 === '' ? styles.SelectedCategory : '') : ''}>
						<Grid bgcolor={theme?.product?.filter?.all_products?.background} className={`${classes.imageContainer}`}>
							<Icon
								iconName='IconLayoutGrid'
								sx={{
									...theme?.product?.filter?.all_products?.icon,
									...theme?.product?.filter?.all_products_icon_style,
								}}
								className={styles.AllProductIcon}
							/>
						</Grid>
						<CustomText
							type={is_ultron ? 'Body' : category_levels?.categoryLevel2 === '' ? 'Subtitle' : 'Body'}
							className={classes.categoryNameHeader}>
							{t('ProductList.CategoryHeaderFilters.AllProducts')}
						</CustomText>
					</Grid>
				</Grid>

				{CategoriesData?.filter((item) => CategoryLevels?.includes(item?.id))?.map((item: any) => (
					<Grid
						key={item?.id}
						item
						height={is_ultron ? 94 : 125}
						onClick={() => handleCategory(item?.id)}
						className={styles.Category}
						sx={{ alignItems: is_small_screen ? 'flex-start !important' : 'center' }}>
						<Grid
							container
							direction='column'
							justifyContent='space-between'
							alignItems='center'
							className={is_ultron ? (category_levels?.categoryLevel2 === item?.id ? styles.SelectedCategory : '') : ''}>
							<Grid
								className={`${classes.imageContainer} ${
									category_levels?.categoryLevel2 === item?.id ? classes.selected : classes.not_selected
								}`}>
								<Image
									src={get_product_image(item, 'CATEGORY_FILTER')}
									alt=''
									imgClass={styles.headerImage}
									fallbackSrc={constants.FALLBACK_IMAGE}
								/>
							</Grid>
							<CustomText
								type={category_levels?.categoryLevel2 === item?.id ? 'Subtitle' : 'Body'}
								className={classes.categoryNameHeader}
								style={{
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									whiteSpace: should_show_truncation(item?.name) ? 'normal' : 'nowrap',
									WebkitLineClamp: should_show_truncation(item?.name) ? 2 : 'none',
									display: should_show_truncation(item?.name) ? '-webkit-box' : 'block',
								}}
								id={item?.id}>
								{item?.name}
							</CustomText>
						</Grid>
					</Grid>
				))}
			</StyledDiv>
			{!isLastHeader && (
				<Grid item className={styles.category_right_chevron} onClick={() => scrollHeader(100)}>
					<Avatar
						isImageAvatar={false}
						style={{ ...ChevronAvatar, background: theme?.product?.chevron?.background }}
						content={
							<Icon
								sx={{
									...theme?.product?.chevron,
								}}
								iconName='IconChevronRight'
								className={styles.chevronIcon}
							/>
						}
						size='large'
						variant='circular'
					/>
				</Grid>
			)}
		</Grid>
	);
};

export default CategoryHeaderFilters;
