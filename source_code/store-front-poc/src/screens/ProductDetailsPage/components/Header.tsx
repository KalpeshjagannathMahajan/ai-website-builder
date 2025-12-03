import { Box, Breadcrumb, Grid, Icon, PageHeader, Typography } from 'src/common/@the-source/atoms';
import ProductDetailsContext from '../context';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { BuyerSwitch, Cart, CatalogSwitch, Wishlist } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import { Drawer, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import useStyles from '../styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import useIsNewTab from 'src/hooks/useIsNewTab';
import { useTheme } from '@mui/material/styles';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';

const Header = () => {
	const { product_details, initialize_cart } = useContext(ProductDetailsContext);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const is_new_tab = useIsNewTab();
	const navigate = useNavigate();
	const [buyer_data, set_buyer_data] = useState({});
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const bread_crumb_list = useSelector((state: any) => state.breadcrumb.breadcrumbs);
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const { catalog_mode } = useSelector((state: any) => state.catalog_mode);
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const buyer = useSelector((state: any) => state.buyer);
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		if (is_logged_in) {
			if (catalog_mode) return;
			initialize_cart(buyer);
		}
	}, [buyer]);

	const handle_back_navigation = () => {
		if (is_new_tab) {
			navigate('/all-products');
		} else {
			navigate(-1);
		}
	};

	return (
		<>
			<PageHeader
				shiftToNextLine={true}
				leftSection={
					<Box>
						{is_ultron || is_small_screen ? (
							<Typography
								variant='h5'
								sx={{
									...theme?.product_details?.sku_id_tert,
									display: 'inline-block',
									marginRight: 1.5,
								}}>
								<Icon
									sx={{ marginBottom: '-0.4rem', paddingRight: '1rem' }}
									className={classes.icon_style}
									iconName='IconArrowLeft'
									onClick={handle_back_navigation}
								/>
								{product_details?.sku_id}
							</Typography>
						) : (
							<React.Fragment>
								{bread_crumb_list?.length > 0 && (
									<Grid item>
										<Breadcrumb className={classes.breadcrumbs_style} links={bread_crumb_list} />
									</Grid>
								)}
							</React.Fragment>
						)}
					</Box>
				}
				rightSection={
					is_ultron ? (
						<Grid display={'flex'} gap={'1rem'}>
							{!catalog_mode && <BuyerSwitch onClick={() => toggle_buyer_panel(true)} />}
							{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer || catalog_mode) && <CatalogSwitch />}
							{!catalog_mode && enable_wishlist && <Wishlist />}
							{!catalog_mode && <Cart />}
						</Grid>
					) : null
				}
			/>
			{is_ultron && (
				<SelectBuyerPanel
					show_drawer={show_buyer_panel}
					toggle_drawer={toggle_buyer_panel}
					set_is_buyer_add_form={set_is_buyer_add_form}
					buyer_data={buyer_data}
					set_buyer_data={set_buyer_data}
				/>
			)}
			{is_buyer_add_form && (
				<Drawer PaperProps={{ sx: { width: 600 } }} anchor='right' open={is_buyer_add_form} onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
				</Drawer>
			)}
		</>
	);
};

export default Header;
