/* eslint-disable @typescript-eslint/no-unused-vars */
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, PageHeader, Skeleton } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { BuyerSwitch, Cart, CatalogSwitch } from 'src/common/PageHeaderComponents';
import WishlistCard from './components/WishlistCard';
import { Divider, Grid } from '@mui/material';
import { colors } from 'src/utils/theme';
import { makeStyles } from '@mui/styles';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { map, size, groupBy, filter } from 'lodash';
import CreateWishListModal from './Modals/CreateWishListModal';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import Drawer from 'src/common/SelectBuyerPanel/Drawer';
import AddQuickBuyer from '../BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import NoWishlist from './components/NoWishlist';
import WishlistCardSkeleton from './skeletons/WishlistCardSkeleton';
import useWishlistActions from './hooks/useWishlistActions';
import useProductListingPageTemplate from '../ProductListing/useProductListingPageTemplate';
import { wishlist_source } from './constants';

const useStyles = makeStyles(() => ({
	wishlist_container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
	},
}));

const arr = [1, 2, 3, 4];

const Wishlist = () => {
	const navigate = useNavigate();
	const classes = useStyles();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const buyer = useSelector((state: any) => state.buyer);
	const {
		buyer_wishlist = [],
		self_wishlist = [],
		buyer_wishlist_loader,
		self_wishlist_loader,
	} = useSelector((state: any) => state?.wishlist);

	const { wizshop_user_wishlist, wizshop_buyer_wishlist } = groupBy(buyer_wishlist, (item: any) => {
		return item?.source === 'wizshop' ? 'wizshop_user_wishlist' : 'wizshop_buyer_wishlist';
	});

	const { get_self_wishlist, get_buyer_wishlist } = useWishlistActions();
	const { initialize_cart, cart } = useProductListingPageTemplate();

	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [buyer_data, set_buyer_data] = useState();

	const [create_wishlist_modal_open, set_create_wishlist_modal_open] = useState(false);
	const [buyer_panel, set_buyer_pannel] = useState(false);

	const handle_close_modal = () => {
		set_create_wishlist_modal_open(false);
	};

	const handle_on_buyer_switch = (data: any) => {
		set_buyer_data(data);
		set_buyer_pannel(false);
	};

	const scrollToTop = () => {
		const rootContainer = document.getElementById('wishlist_container') as HTMLElement | null;
		// setTimeout is added to wait for the DOM to render, do not remove
		setTimeout(() => {
			if (rootContainer) {
				rootContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 0);
	};

	useLayoutEffect(() => {
		if (is_ultron) scrollToTop();
	}, []);

	useEffect(() => {
		if (!buyer?.is_guest_buyer) {
			get_buyer_wishlist();
		}
		get_self_wishlist();
	}, [buyer?.is_guest_buyer, buyer?.buyer_id]);

	useEffect(() => {
		initialize_cart();
	}, [buyer?.buyer_cart, buyer?.catalog]);

	const sales_rep_wishlsit = filter(buyer_wishlist, (buyer_wishlist_data: any) => buyer_wishlist_data?.source !== wishlist_source.WIZSHOP);
	const wizshop_wishlsit = filter(buyer_wishlist, (buyer_wishlist_data: any) => buyer_wishlist_data?.source === wishlist_source.WIZSHOP);

	const handle_render_label = (wishlist_for: string) => {
		if (
			wishlist_for === wishlist_source.BUYER_SALES_REP ||
			wishlist_for === wishlist_source.BUYER_WIZSHOP ||
			wishlist_for === wishlist_source.BUYER
		) {
			const name = wishlist_for === wishlist_source.BUYER_SALES_REP ? buyer?.buyer_info?.name : 'Website';
			return is_ultron ? t('Wishlist.Wishlist.BuyerWishlist', { name }) : t('Wishlist.Wishlist.RecommendedWishlist');
		}
		return t('Wishlist.Wishlist.SelfWishlist');
	};

	const handle_wishlist_data = (wishlists: any[], wishlist_for: string, loading: boolean) => {
		const full_height_condition = size(buyer_wishlist) === 0 && size(self_wishlist) === 0 && !loading;
		return (
			<Grid
				style={
					full_height_condition
						? {
								flex: 1,
						  }
						: {}
				}
				className={classes.wishlist_container}>
				{(size(buyer_wishlist) > 0 || size(self_wishlist) > 0) && (
					<CustomText type='H3' color={colors.black}>
						{handle_render_label(wishlist_for)}
					</CustomText>
				)}
				<Grid container spacing={2} flex={1}>
					{buyer_wishlist_loader || self_wishlist_loader ? (
						map(arr, (item: any) => (
							<Grid height={'250px'} item xs={12} sm={6} md={4} lg={3} key={item}>
								<WishlistCardSkeleton />
							</Grid>
						))
					) : size(wishlists) > 0 ? (
						map(wishlists, (wishlist) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={wishlist.id}>
								<WishlistCard for_is_guest_buyer={wishlist_for === 'self'} data={wishlist} from_wishlist_listing={true} />
							</Grid>
						))
					) : (
						<NoWishlist
							title={
								wishlist_for === wishlist_source.BUYER_SALES_REP || wishlist_for === wishlist_source.BUYER_WIZSHOP
									? t('Wishlist.NoWishList.NoCustomerWishlist')
									: t('Wishlist.NoWishList.NoTotalWishlist')
							}
							description={t('Wishlist.NoWishList.NoWishlistDescription')}
						/>
					)}
				</Grid>
			</Grid>
		);
	};

	const handle_render_wishlist_data = ({ self_wishlist_data, buyer_wishlist_data }: any) => {
		return (
			<>
				{!buyer.is_guest_buyer && handle_wishlist_data(buyer_wishlist_data?.data, buyer_wishlist_data?.type, buyer_wishlist_data?.loader)}
				{!buyer.is_guest_buyer && size(self_wishlist_data?.data) > 0 && <Divider sx={{ margin: '32px 0px !important' }} />}
				{(buyer.is_guest_buyer || size(self_wishlist_data?.data) > 0) &&
					handle_wishlist_data(self_wishlist_data?.data, self_wishlist_data?.type, self_wishlist_data?.loader)}
			</>
		);
	};

	return (
		<Grid
			container
			id='wishlist_container'
			flexDirection={'column'}
			sx={{
				minHeight: '90vh',
				paddingBottom: '32px',
			}}>
			{is_ultron && (
				<PageHeader
					style={{ height: 'max-content' }}
					leftSection={
						<CustomText type='H6' style={{ display: 'flex', alignItems: 'center' }}>
							<Icon
								iconName='IconArrowLeft'
								sx={{
									cursor: 'pointer',
									paddingRight: '1rem',
								}}
								onClick={() => navigate(-1)}
							/>
							{t('Wishlist.Wishlist.PageHeading')}
						</CustomText>
					}
					rightSection={
						<div style={{ display: 'flex', gap: '10px' }}>
							<BuyerSwitch onClick={() => set_buyer_pannel(true)} />
							<CatalogSwitch />
							<Button onClick={() => set_create_wishlist_modal_open(true)}>{t('Wishlist.Wishlist.CreateWishlist')}</Button>
							<Grid style={{ position: 'relative' }}>
								{cart.loading && (
									<Skeleton
										sx={{
											position: 'absolute',
											top: '0px',
											left: '0px',
											borderRadius: '6px',
										}}
										variant='rectangular'
										width={'100%'}
										height={'100%'}
									/>
								)}
								<div style={{ visibility: cart.loading ? 'hidden' : 'visible' }}>
									<Cart />
								</div>
							</Grid>
						</div>
					}
				/>
			)}

			{handle_render_wishlist_data({
				self_wishlist_data: is_ultron
					? {
							data: self_wishlist,
							loader: self_wishlist_loader,
							type: 'self',
					  }
					: {
							data: wizshop_buyer_wishlist,
							type: 'buyer',
							loader: buyer_wishlist_loader,
					  },
				buyer_wishlist_data: is_ultron
					? {
							data: buyer_wishlist,
							loader: buyer_wishlist_loader,
							type: 'buyer',
					  }
					: {
							data: wizshop_user_wishlist,
							type: 'self',
							loader: buyer_wishlist_loader,
					  },
			})}

			{/* TODO: incoming changes from ultron */}
			{/* {!buyer.is_guest_buyer && handle_wishlist_data(sales_rep_wishlsit, wishlist_source.BUYER_SALES_REP, buyer_wishlist_loader)}
			{!buyer.is_guest_buyer && size(wizshop_wishlsit) > 0 && <Divider sx={{ margin: '32px 0px' }} />}
			{!buyer.is_guest_buyer &&
				size(wizshop_wishlsit) > 0 &&
				handle_wishlist_data(wizshop_wishlsit, wishlist_source.BUYER_WIZSHOP, buyer_wishlist_loader)}
			{!buyer.is_guest_buyer && size(self_wishlist) > 0 && <Divider sx={{ margin: '32px 0px' }} />}
			{(buyer.is_guest_buyer || size(self_wishlist) > 0) && handle_wishlist_data(self_wishlist, 'self', self_wishlist_loader)} */}

			{create_wishlist_modal_open && <CreateWishListModal open={create_wishlist_modal_open} on_close={handle_close_modal} />}

			{buyer_panel && (
				<SelectBuyerPanel
					show_drawer={buyer_panel}
					toggle_drawer={set_buyer_pannel}
					set_is_buyer_add_form={set_is_buyer_add_form}
					buyer_data={buyer_data}
					set_buyer_data={handle_on_buyer_switch}
				/>
			)}

			{is_buyer_add_form && (
				<Drawer
					PaperProps={{ sx: { width: 600, background: colors.white } }}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
				</Drawer>
			)}
		</Grid>
	);
};

export default Wishlist;
