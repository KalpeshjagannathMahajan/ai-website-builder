import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Avatar, Grid, Icon, Chip } from 'src/common/@the-source/atoms';
import { CategoryData, ChevronAvatar, InnerDiv, StyledDiv } from '../constants';
import styles from './CategoryFilter.module.css';
import { useTheme } from '@mui/material/styles';

interface CatSubHeaderProps {
	CategoriesData: CategoryData[];
	SubCategoryLevels: string[];
	handleSubCategory: any;
	handleAllSubCategory: any;
	category_levels: {
		categoryLevel2: string;
		categoryLevel3: string;
	};
}

const CategorySubHeaderFilters = ({
	CategoriesData,
	SubCategoryLevels,
	handleSubCategory,
	handleAllSubCategory,
	category_levels,
}: CatSubHeaderProps) => {
	const CategorySubHeaderFilterRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isFirstSubHeader, setIsFirstSubHeader] = useState(true);
	const [isLastSubHeader, setIsLastSubHeader] = useState(false);
	const theme: any = useTheme();

	useEffect(() => {
		const node = CategorySubHeaderFilterRef.current;

		const checkScrollPosition = () => {
			setIsFirstSubHeader(node.scrollLeft === 0);
			setIsLastSubHeader(node.scrollLeft + node.clientWidth >= node.scrollWidth);
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
		CategorySubHeaderFilterRef.current.scroll({
			left: CategorySubHeaderFilterRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	return (
		<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
			{!isFirstSubHeader && (
				<Grid item className={styles.LeftChevron} onClick={() => scrollHeader(-100)}>
					<Avatar
						isImageAvatar={false}
						style={{ ...ChevronAvatar, background: theme?.product?.chevron?.background }}
						content={<Icon sx={{ color: theme?.product?.chevron?.color }} iconName='IconChevronLeft' className={styles.chevronIcon} />}
						size='large'
						variant='circular'
					/>
				</Grid>
			)}
			<StyledDiv ref={CategorySubHeaderFilterRef}>
				<InnerDiv>
					<Grid item onClick={handleAllSubCategory}>
						<Chip
							label='All'
							bgColor={theme?.product?.filter?.chips?.background}
							textColor={theme?.product?.filter?.chips?.color}
							variant='outlined'
							sx={
								category_levels?.categoryLevel3 === '' ? { ...theme?.product?.selected_sub_category } : { ...theme?.product?.sub_category }
							}
							className={category_levels?.categoryLevel3 === '' ? styles.SelectedSubCategoryChip : styles.SubCategoryChip}
						/>
					</Grid>
					{CategoriesData?.filter((item) => SubCategoryLevels?.includes(item?.id))?.map((item: any) => (
						<Grid item key={item?.id} onClick={() => handleSubCategory(item?.id)}>
							<Chip
								label={item?.name}
								bgColor={theme?.product?.filter?.chips?.background}
								variant='outlined'
								textColor={theme?.product?.filter?.chips?.color}
								sx={
									category_levels?.categoryLevel3 === item.id
										? { ...theme?.product?.selected_sub_category }
										: { ...theme?.product?.sub_category }
								}
								className={category_levels?.categoryLevel3 === item.id ? styles.SelectedSubCategoryChip : styles.SubCategoryChip}
							/>
						</Grid>
					))}
				</InnerDiv>
			</StyledDiv>
			{!isLastSubHeader && (
				<Grid item className={styles.RightChevron} onClick={() => scrollHeader(100)}>
					<Avatar
						isImageAvatar={false}
						style={{ ...ChevronAvatar, background: theme?.product?.chevron?.background }}
						content={<Icon iconName='IconChevronRight' sx={{ color: theme?.product?.chevron?.color }} className={styles.chevronIcon} />}
						size='large'
						variant='circular'
					/>
				</Grid>
			)}
		</Grid>
	);
};

export default CategorySubHeaderFilters;
