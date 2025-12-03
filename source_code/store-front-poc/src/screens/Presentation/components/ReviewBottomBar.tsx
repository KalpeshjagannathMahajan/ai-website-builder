import { useState } from 'react';
import { find, head, filter } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import RouteNames from 'src/utils/RouteNames';
import { remove_all_catalog_products, set_selected_sort } from 'src/actions/catalog_mode';
import { SortOption } from 'src/@types/presentation';
import { Box, Container, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { secondary } from 'src/utils/light.theme';
import ExitCatalogModal from 'src/screens/Presentation/components/ExitCatalogModal';
import CatalogFactory from 'src/utils/catalog.utils';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { t } from 'i18next';
import { colors } from 'src/utils/theme';

const useStyles = makeStyles(() => ({
	content_container: {
		backgroundColor: colors.black_65,
		position: 'sticky',
		bottom: 40,
		padding: '8px 16px',
		margin: '0px auto',
		zIndex: 999,
		borderRadius: '8px',
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},
	info_container: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		gap: '16px',
	},
}));

const paths = [
	RouteNames.product.all_products.category.path,
	RouteNames.product.all_products.category_listing.path,
	RouteNames.product.all_products.collection.path,
	RouteNames.product.all_products.collection_listing.path,
	RouteNames.product.all_products.custom.routing_path,
	RouteNames.product.all_products.previously_ordered.path,
	RouteNames.product.all_products.recommendation.path,
	RouteNames.product.all_products.search.path,
	RouteNames.product.product_detail.routing_path,
];

export default function ReviewBottomBar() {
	const classes = useStyles();
	const [show_exit_modal, set_show_exit_modal] = useState<boolean>(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const view_condition =
		location.pathname !== RouteNames.product.all_products.category.path &&
		location.pathname !== RouteNames.product.all_products.collection.path &&
		(filter(paths, (path: string) => location.pathname.includes(path)).length !== 0 ||
			location.pathname === RouteNames.product.all_products.path);

	const { catalog_mode, catalog_products_length } = useSelector((state: any) => state.catalog_mode);
	const { sorts = [] } = useSelector((state: any) => state?.settings?.product_listing_config);
	const { handle_navigate_to_edit } = useCatalogActions();

	const handle_review = () => {
		const selected_sort = CatalogFactory.MODE.get_selected_sort();
		let sort_to_store = selected_sort;
		if (!sort_to_store) {
			const default_sorting = find(sorts, (sort_option: SortOption) => sort_option?.is_default)?.key || (head(sorts) as any)?.key;
			sort_to_store = default_sorting;
		}
		dispatch(set_selected_sort(sort_to_store));
		const catalog_id = CatalogFactory.MODE.get_catalog_id();
		const edit_catalog_mode = CatalogFactory.MODE.get_edit_catalog_mode();
		if (edit_catalog_mode && catalog_id) {
			handle_navigate_to_edit(catalog_id);
		} else {
			navigate(RouteNames.product.all_products.review.path);
		}
	};

	const handle_clear = () => {
		dispatch(remove_all_catalog_products());
	};

	const handle_cancel = () => {
		set_show_exit_modal(true);
	};

	return (
		catalog_mode &&
		view_condition && (
			<>
				<Container maxWidth='xl' className={classes.content_container}>
					<Box className={classes.info_container}>
						<Grid width={'max-content'} container direction={'row'} alignItems={'center'} flexWrap={'nowrap'} gap={1}>
							<CustomText color={colors.white} type='H6'>
								{catalog_products_length}
							</CustomText>
							<CustomText color={colors.white} type='Body'>
								{t('Presentation.ReviewBottomBar.Selected')}
							</CustomText>
						</Grid>
						{catalog_products_length > 0 && (
							<>
								<Divider sx={{ width: '1px', borderRadius: '100px', height: '70%' }} orientation='vertical' color={secondary['600']} />
								<Grid
									onClick={handle_clear}
									sx={{ cursor: 'pointer' }}
									container
									direction={'row'}
									alignItems={'center'}
									flexWrap={'nowrap'}
									maxWidth={'fit-content'}
									gap={1}>
									<Icon iconName='IconCircleX' color={colors.white} />
									<CustomText color={colors.white} type='Body'>
										{t('Presentation.ReviewBottomBar.Clear')}
									</CustomText>
								</Grid>
							</>
						)}
					</Box>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
						}}>
						<Button
							onClick={handle_cancel}
							tonal={false}
							sx={{ backgroundColor: secondary[700], '&:hover': { backgroundColor: secondary[800] } }}>
							{t('Presentation.ReviewBottomBar.Cancel')}
						</Button>
						<Button onClick={handle_review} tonal={false} color='primary'>
							{t('Presentation.ReviewBottomBar.Review')}
						</Button>
					</div>
				</Container>
				{show_exit_modal && <ExitCatalogModal show_modal={show_exit_modal} set_show_modal={set_show_exit_modal} />}
			</>
		)
	);
}
