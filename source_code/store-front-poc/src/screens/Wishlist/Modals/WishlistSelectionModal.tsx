import { Divider, Menu, Tooltip, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Grid, Icon, Image, Skeleton } from 'src/common/@the-source/atoms';
import WishlistIcon from '../components/WishlistIcon';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { colors } from 'src/utils/theme';
import useWishlistActions from '../hooks/useWishlistActions';
import { filter, find, get, intersection, isEmpty, isEqual, isNull, isUndefined, map, size, sortBy, uniq, xor } from 'lodash';
import { useSelector } from 'react-redux';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { get_session_for_wishlist, get_short_name, update_session_for_wishlist } from '../utils';
import { useDispatch } from 'react-redux';
import { close_toast, show_toast } from 'src/actions/message';
import { get_product_id } from 'src/utils/utils';
import types from 'src/utils/types';
import CustomCheckbox from 'src/common/@the-source/atoms/Checkbox/CustomCheckbox';
import CreateWishListModal from './CreateWishListModal';
import WishlistToast from '../components/WishlistToast';
import ImageLinks from 'src/assets/images/ImageLinks';
import { wishlist_source } from '../constants';

interface WishlistSelectionModalProps {
	product: Product;
	icon_size?: 'SMALL' | 'LARGE';
	buyer_wishlist_data?: any;
	from_drawer?: boolean;
}

const useStyles = makeStyles((theme: any) => ({
	header: {
		padding: '8px 16px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	footer: {
		padding: '8px 16px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	list_item: {
		padding: '6px 16px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
	},
	empty_state: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '16px',
	},
	tooltip: {
		zIndex: 1,
		padding: 0,
		backgroundColor: colors.white,
		border: `1px solid ${colors.dark_midnight_blue}`,
		borderRadius: theme?.wishlist_style?.border_radius,
		boxShadow: '0px 2px 12px 0px #00000014',
	},
	arrow: {
		color: colors.white,
		'&::before': {
			border: `1px solid ${colors.dark_midnight_blue}`,
		},
	},
}));

const arr = [1, 2, 3, 4, 5];

const WishlistSelectionCard = ({ wishlist, update_temp_selected_wishlists, default_selected }: any) => {
	const classes = useStyles();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const product_count = get(wishlist, 'meta.product_count', '-');
	const [is_selected, set_is_selected] = useState(Boolean(default_selected));
	const handle_select = () => {
		update_temp_selected_wishlists(wishlist?.id);
		set_is_selected((prev: boolean) => !prev);
	};

	useEffect(() => {
		set_is_selected(Boolean(default_selected));
	}, [default_selected]);

	return (
		<Grid onClick={handle_select} className={classes.list_item}>
			<Grid container flexDirection={'row'} alignItems={'center'} gap={1}>
				<Grid sx={{ display: 'flex' }} height={'max-content'} alignItems={'center'}>
					{is_ultron ? <CustomCheckbox selected={is_selected} /> : <Checkbox checked={is_selected} />}
				</Grid>
				<CustomText type='Body'>{get_short_name(wishlist?.name, 18)}</CustomText>
			</Grid>
			<CustomText
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: '30px' }}
				type='Body'>
				{product_count === 0 ? '-' : product_count}
			</CustomText>
		</Grid>
	);
};

const WishlistSelectionModal = ({ product, icon_size, buyer_wishlist_data, from_drawer }: WishlistSelectionModalProps) => {
	const classes = useStyles();
	const theme: any = useTheme();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const wishlist = useRef<any>(null);
	const dispatch = useDispatch();

	const buyer = useSelector((state: any) => state?.buyer);
	const { buyer_wishlist_loader = false, self_wishlist_loader = false } = useSelector((state: any) => state?.wishlist);

	const { get_active_wishlist, add_to_wishlist, update_selected_wishlists } = useWishlistActions();
	const active_wishlists = !isEmpty(buyer_wishlist_data) ? buyer_wishlist_data?.data : get_active_wishlist();
	const filtered_wishlist = filter(
		active_wishlists,
		(wishlist_data: any) => wishlist_data?.source === (is_ultron ? wishlist_source.SALES_REP : wishlist_source.WIZSHOP),
	);

	const [active, set_active] = useState(false);
	const [selected_wishlists, set_selected_wishlists] = useState<string[]>(get(product, 'wishlists', []));
	const [temp_selected_wishlists, set_temp_selected_wishlists] = useState<string[]>([]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [create_wishlist_modal_open, set_create_wishlist_modal_open] = useState(false);
	const [is_loading, set_is_loading] = useState(false);
	const [add_to_loading, set_add_to_loading] = useState(false);
	const [disable_save, set_disable_save] = useState(false);
	const [on_selection_toast, set_on_selection_toast] = useState<any>({
		toast: false,
		prev_selected: get(product, 'wishlists', []),
		current_selected: get(product, 'wishlists', []),
	});
	const [update_preselect, set_update_preselect] = useState(false);
	const [closing_timeout, set_closing_timeout] = useState<any>(null);

	const open = Boolean(anchorEl);
	const product_id = get_product_id(product);
	const current_wishlists = useMemo(() => map(filtered_wishlist, (wishlist_data: any) => wishlist_data.id), [active_wishlists]);
	const active_selected_wishlist = useMemo(
		() => intersection(current_wishlists, selected_wishlists),
		[current_wishlists, selected_wishlists],
	);
	const is_guest_buyer = buyer?.is_guest_buyer;
	const loading = !isEmpty(buyer_wishlist_data)
		? buyer_wishlist_data?.loader
		: is_guest_buyer
		? self_wishlist_loader
		: buyer_wishlist_loader;

	const close_selection_tooltip = () => {
		set_on_selection_toast((prev: any) => ({
			...prev,
			toast: false,
		}));
	};

	const open_selection_tooltip = (current_selected = temp_selected_wishlists, prev_selected = selected_wishlists) => {
		set_on_selection_toast({
			toast: true,
			prev_selected,
			current_selected,
		});
		const timeout = setTimeout(() => {
			set_on_selection_toast((prev: any) => ({
				...prev,
				toast: false,
				prev_selected: current_selected,
			}));
			set_update_preselect(false);
		}, 1500);
		set_closing_timeout(timeout);
	};

	const update_pre_selection_on_change = () => {
		if (!isNull(closing_timeout)) {
			clearTimeout(closing_timeout);
			set_closing_timeout(null);
		}
		if (isEmpty(intersection(current_wishlists, on_selection_toast.prev_selected))) {
			set_update_preselect(true);
		}
		close_selection_tooltip();
	};

	const handle_open = () => {
		setAnchorEl(wishlist.current);
		update_pre_selection_on_change();
	};

	const handle_close = () => {
		setAnchorEl(null);
	};

	const on_heart_icon_click = async () => {
		if (add_to_loading) return;
		set_add_to_loading(true);

		const stored_session_ids = get_session_for_wishlist(buyer_wishlist_data?.id);
		const session_ids = filter(stored_session_ids, (id: any) =>
			Boolean(find(active_wishlists, (wishlist_item: any) => wishlist_item?.id === id)),
		);
		if (isEmpty(active_selected_wishlist) && !isEmpty(session_ids)) {
			const updated_wishlist_ids = uniq([...selected_wishlists, ...session_ids]);
			update_selected_wishlists(product_id, updated_wishlist_ids, selected_wishlists, buyer_wishlist_data?.id).then(() => {
				!isEmpty(buyer_wishlist_data) && buyer_wishlist_data?.fetch_buyer_wishlist && buyer_wishlist_data?.fetch_buyer_wishlist(true);
			}); // It is a promise
			set_selected_wishlists(updated_wishlist_ids);
			add_to_wishlist(updated_wishlist_ids, selected_wishlists);
			set_temp_selected_wishlists(updated_wishlist_ids);
			open_selection_tooltip(updated_wishlist_ids);
			set_add_to_loading(false);
			return;
		}

		handle_open();
		set_add_to_loading(false);
	};

	const update_temp_selected_wishlists = (wishlist_id: string) => {
		set_temp_selected_wishlists((prev: string[]) => {
			const find_wishlist = find(prev, (id: string) => id === wishlist_id);
			if (isNull(find_wishlist) || isUndefined(find_wishlist)) return [...prev, wishlist_id];
			return filter(prev, (id: string) => id !== wishlist_id);
		});
	};

	const handle_save = async () => {
		if (is_loading) return;
		try {
			set_is_loading(true);
			if (
				size(temp_selected_wishlists) !== size(selected_wishlists) ||
				!isEqual(sortBy(selected_wishlists), sortBy(temp_selected_wishlists))
			) {
				update_selected_wishlists(product_id, temp_selected_wishlists, selected_wishlists, buyer_wishlist_data?.id).then(() => {
					!isEmpty(buyer_wishlist_data) && buyer_wishlist_data?.fetch_buyer_wishlist && buyer_wishlist_data?.fetch_buyer_wishlist(true);
				}); // It is a promise
				if (update_preselect) {
					update_session_for_wishlist('ADD', intersection(temp_selected_wishlists, current_wishlists), buyer_wishlist_data?.id);
				}
				set_selected_wishlists(temp_selected_wishlists);
				open_selection_tooltip();
			}
			add_to_wishlist(temp_selected_wishlists, selected_wishlists);
		} catch (err) {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					showActions: false,
				}),
			);
		} finally {
			set_is_loading(false);
			handle_close();
		}
	};

	const on_create = (wishlist_data: any) => {
		if (wishlist_data?.id) {
			buyer_wishlist_data?.on_create && buyer_wishlist_data?.on_create(wishlist_data);
			update_temp_selected_wishlists(wishlist_data?.id);
		}
	};

	useEffect(() => {
		const is_active = size(active_selected_wishlist) > 0;
		set_active(is_active);
	}, [active_selected_wishlist]);

	useEffect(() => {
		const product_wishlist_ids = get(product, 'wishlists', []);
		set_selected_wishlists(product_wishlist_ids);
		set_temp_selected_wishlists(product_wishlist_ids);
		set_on_selection_toast({
			toast: false,
			prev_selected: product_wishlist_ids,
			current_selected: product_wishlist_ids,
		});
	}, [product]);

	useEffect(() => {
		const is_disabled = isEmpty(active_wishlists) || size(xor(temp_selected_wishlists, selected_wishlists)) === 0;
		set_disable_save(is_disabled);
	}, [active_wishlists, temp_selected_wishlists, selected_wishlists]);

	useEffect(() => {
		if (!open) return;
		set_temp_selected_wishlists(selected_wishlists);
	}, [open, selected_wishlists]);

	return (
		<>
			<Tooltip
				componentsProps={{
					tooltip: {
						className: classes.tooltip,
					},
					arrow: {
						className: classes.arrow,
					},
					popper: {
						sx: {
							zIndex: from_drawer ? 1201 : 2,
						},
					},
				}}
				placement='bottom'
				title={
					on_selection_toast?.toast && (
						<WishlistToast
							current_selected_wishlists={on_selection_toast?.current_selected}
							prev_selected_wishlists={on_selection_toast?.prev_selected}
							handle_change={handle_open}
							buyer_wishlist_data={buyer_wishlist_data}
						/>
					)
				}
				open={on_selection_toast?.toast}
				arrow={on_selection_toast?.toast}>
				<div ref={wishlist} style={{ position: 'relative' }} onClick={on_heart_icon_click}>
					<WishlistIcon active={active} icon_size={icon_size} />
				</div>
			</Tooltip>
			<Menu
				MenuListProps={{
					style: {
						paddingTop: '0px',
						paddingBottom: '0px',
						width: '265px',
						height: '310px',
						display: 'flex',
						flexDirection: 'column',
						borderRadius: theme?.wishlist_style?.border_radius,
					},
				}}
				sx={{
					'& .MuiPaper-root': {
						borderRadius: theme?.wishlist_style?.border_radius,
					},
				}}
				open={open}
				anchorEl={anchorEl}
				onClose={handle_close}>
				<Grid>
					<Grid className={classes.header}>
						<CustomText type='H3'>
							{(!is_guest_buyer || !isEmpty(buyer_wishlist_data)) && is_ultron
								? t('Wishlist.WishlistSelectionModal.SelectWishlist', {
										name: buyer?.buyer_info?.name,
								  })
								: t('Wishlist.WishlistSelectionModal.SelfWishlist')}
						</CustomText>
						<Button
							onClick={() => set_create_wishlist_modal_open(true)}
							variant='text'
							size='small'
							sx={{
								paddingX: '0px !important',
								':hover': {
									backgroundColor: 'transparent',
								},
							}}>
							<Icon iconName='IconPlus' color={theme?.wishlist_style?.iconColor} sx={{ marginRight: '4px' }} />
							{t('Wishlist.WishlistSelectionModal.Create')}
						</Button>
					</Grid>
					<Divider />
				</Grid>
				<Grid flex={1} overflow={'auto'}>
					{loading
						? arr.map(() => <Skeleton variant='rectangular' sx={{ margin: '8px 16px' }} height={40} />)
						: map(filtered_wishlist, (wishlist_data: any) => {
								const is_default_select = find(temp_selected_wishlists, (data: string) => data === wishlist_data?.id);
								return (
									<WishlistSelectionCard
										default_selected={is_default_select}
										wishlist={wishlist_data}
										update_temp_selected_wishlists={update_temp_selected_wishlists}
									/>
								);
						  })}
					{!loading && isEmpty(filtered_wishlist) && (
						<Grid className={classes.empty_state}>
							<Image
								width={'70%'}
								height={'auto'}
								style={{ objectFit: 'contain' }}
								src={is_ultron ? ImageLinks.empty_wishlist : ImageLinks.no_wishlist_storefront}
								alt='No Wishlist'
							/>
							<CustomText type='Subtitle'>{t('Wishlist.WishlistSelectionModal.EmptyText')}</CustomText>
						</Grid>
					)}
				</Grid>
				<Grid>
					<Divider sx={{ margin: '0px' }} />
					<Grid className={classes.footer}>
						<Button disabled={disable_save || loading} loading={is_loading} onClick={handle_save} width='100%'>
							{t('Wishlist.WishlistSelectionModal.Done')}
						</Button>
					</Grid>
				</Grid>
			</Menu>
			{create_wishlist_modal_open && (
				<CreateWishListModal
					on_create={on_create}
					open={create_wishlist_modal_open}
					on_close={() => set_create_wishlist_modal_open(false)}
					custome_buyer_id={buyer_wishlist_data?.id}
				/>
			)}
		</>
	);
};

export default WishlistSelectionModal;
