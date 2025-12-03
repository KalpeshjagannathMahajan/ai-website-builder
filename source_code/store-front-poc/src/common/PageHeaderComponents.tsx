/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge, FormControl, FormControlLabel, RadioGroup, Menu, MenuItem, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Typography, Icon, Grid, Button, Radio, Image, Chip, Menu as MenuSourceComponent } from 'src/common/@the-source/atoms';
import RouteNames from 'src/utils/RouteNames';
import { set_buyer, update_catalog } from 'src/actions/buyer';
import React, { useEffect, useState } from 'react';
import CustomDialog, { DialogBody, DialogContainer, DialogFooter, DialogSeperator, DialogTitle } from './CustomDialog';
import { ICatalog } from 'src/reducers/buyer';
import { t } from 'i18next';
import cart_management from 'src/utils/api_requests/cartManagement';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import _ from 'lodash';
import CustomText from './@the-source/CustomText';
import { removedProductsCount } from 'src/actions/cart';
import { useTheme } from '@mui/material/styles';
import ImageLinks from 'src/assets/images/ImageLinks';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import { get_customer_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';
import { colors } from 'src/utils/theme';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { update_catalog_mode } from 'src/actions/catalog_mode';

const useStyles = makeStyles((theme: any) => ({
	icon_container: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: is_ultron ? '8px' : '0',
		flexDirection: 'row',
		justifyContent: 'center',
		height: '40px',
		cursor: 'pointer',
		border: `1px solid ${theme?.page_header_component?.tear_sheet}`,
	},
	download_cta: {
		...theme?.order_management?.download_tearsheet,
	},
	download_cta_icon: {
		height: '16px',
		marginRight: '1px',
	},
	cart_icon_container: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '8px',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '40px',
		height: '40px',
		background: '#FCEFD6',
		cursor: 'pointer',
	},
	buyer_container: {
		maxWidth: '160px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		gap: '4px',
		cursor: 'pointer',
		maxHeight: '40px',

		border: '1px solid transparent !important',
	},
	buyer_container2: {
		...theme?.page_header_component?.buyer_switch?.buyer_container2,
	},
	buyer_container_border: {
		'&:hover': {
			border: `1px solid ${colors.black_30}`,
		},
	},

	title_container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
	},
	price_list_container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',

		gap: '4px',
		cursor: 'pointer',
	},
	price_list_container_custom: {
		background: colors.white,
		display: 'flex',
		alignItems: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		border: `1px solid ${colors.dark_midnight_blue}`,
		gap: '4px',
		cursor: 'pointer',
		'&:hover': {
			border: `1px solid ${colors.black}`,
		},
	},
	price_list_modal_title: {
		fontSize: '1.6rem',
	},
	redDot: {
		minHeight: '7px',
		minWidth: '7px',
		background: '#d74c10',
		borderRadius: '50%',
		display: 'inline-block',
		marginRight: '0.5em',
	},
}));

const PAGE_HEADER_MENU_ITEMS = [
	{
		label: 'Create catalog',
		icon: 'IconFilePlus',
	},
];

const get_page_name = (path: string) => {
	switch (true) {
		case _.includes(path, 'collection/products'):
			return 'collection_product_listing_page';
		case _.includes(path, 'collection'):
			return 'collection_listing_page';
		case _.includes(path, 'category/products'):
			return 'category_product_listing_page';
		case _.includes(path, 'category'):
			return 'category_listing_page';
		case _.includes(path, 'recommend'):
			return 'products_reco_listing_page';
		case _.includes(path, 'previously_ordered'):
			return 'previously_ordered_listing_page';
		case _.includes(path, 'cart-summary'):
			return 'cart_page';
		case _.includes(path, 'product-details'):
			return 'product_details_page';
		case _.includes(path, 'all-products/search'):
			return 'product_search_page';
		default:
			return 'all_products_page';
	}
};

const Scanner = ({ onClick }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<div className={classes.icon_container} onClick={onClick} style={theme?.page_header_component?.icon_container}>
			<Icon iconName='IconBarcode' color={theme?.page_header_component?.primary} />
		</div>
	);
};

const Export = ({ onClick }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<CustomText type='H6' onClick={onClick} className={classes.download_cta}>
			<Icon color={theme?.page_header_component?.tear_sheet} iconName='IconDownload' className={classes.download_cta_icon} />
			<span>{t('CartSummary.TearSheet.Download')}</span>
		</CustomText>
	);
};

const NavigatePage = ({ onClick }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<div className={classes.icon_container} onClick={onClick} style={theme?.page_header_component?.icon_container}>
			<Icon iconName='IconExternalLink' color={theme?.page_header_component?.primary} />
		</div>
	);
};

interface Data {
	buyer_id: string;
	items: number;
}

interface CartProps {
	data?: Data;
	from_parent?: boolean;
}

const Wishlist = ({ buyer_id, custom }: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const theme: any = useTheme();
	const dispatch = useDispatch();

	const badgeStyle = {
		background: '#D74C10',
		fontSize: '10px',
		fontWeight: '700',
		color: 'white',
		height: '20px',
		margin: '2px 4px',
		border: `1px solid ${theme?.palette?.warning[100]}`,
		padding: '0.2rem',
	};

	const handle_wishlist = () => {
		if (buyer_id !== 'all_buyers' && custom) {
			dispatch<any>(set_buyer({ buyer_id, is_guest_buyer: false, callback: () => navigate(RouteNames?.wishlist?.path) }));
		} else {
			navigate(RouteNames?.wishlist?.path);
		}
	};

	return (
		<Grid onClick={handle_wishlist} className={classes.icon_container}>
			<Badge
				slotProps={{
					badge: {
						style: { ...badgeStyle, maxWidth: '20px' },
					},
				}}
				color='error'>
				<Icon iconName='IconHeart' color={colors.grey_800} sx={{ height: '24px', width: '24px', color: colors.grey_800 }} />
			</Badge>
		</Grid>
	);
};

const Cart = ({ data, from_parent }: CartProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme: any = useTheme();
	const login = useSelector((state: any) => state.login);
	const buyer = useSelector((state: any) => state.buyer);
	const linked_catalog = useSelector((state: any) => state?.linked_catalog);

	const [page_name, set_page_name] = useState('');

	useEffect(() => {
		const _path = get_page_name(window.location.pathname);
		set_page_name(_path);
	}, [window.location.pathname]);

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const active_style = {
		background: '#FCEFD6',
		border: 'none',
	};

	const badgeStyle = {
		fontSize: '10px',
		fontWeight: '700',
		height: '20px',
		margin: '2px 4px',
		border: '1px solid #FCEFD6',
		padding: '0.2rem',
	};

	const cart_length_from_reducer = useSelector((state: any) => {
		const products = state?.cart?.products;
		if (!products) return 0;

		let totalLength = _.sumBy(_.values(products), () => 1);

		return totalLength;
	});
	const buyer_id_from_reducer = useSelector((state: any) => state?.buyer?.buyer_id);

	const final_data: any = from_parent
		? { buyer_id: data?.buyer_id, items: data?.items }
		: { buyer_id: buyer_id_from_reducer, items: cart_length_from_reducer };

	const handle_cart_on_click = () => {
		if (final_data.buyer_id !== 'all_buyers' && from_parent) {
			dispatch<any>(set_buyer({ buyer_id: final_data?.buyer_id, is_guest_buyer: false, callback: () => navigate(RouteNames?.cart?.path) }));
		} else {
			navigate(RouteNames?.cart?.path);
		}
		Mixpanel.track(Events.CART_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
	};

	return (
		<Grid
			onClick={handle_cart_on_click}
			className={classes.icon_container}
			style={final_data?.items > 0 ? { ...theme?.product?.cart?.active_style } : { ...theme?.page_header_component?.icon_container }}>
			<Badge
				slotProps={{
					badge: {
						style: { ...badgeStyle, ...theme?.product?.cart?.badge_style, maxWidth: final_data?.items > 99 ? 'auto' : '20px' },
					},
				}}
				id={'cart-badge'}
				badgeContent={final_data?.items}
				color='error'>
				{is_ultron ? (
					<Image src={ImageLinks.cart_icon} style={{ height: '24px', width: '24px', color: theme?.product?.cart?.color }} />
				) : (
					<strong>Cart</strong>
				)}
			</Badge>
		</Grid>
	);
};

const check_show_red_dot = (title: string, buyer_name: string) => {
	if (title) {
		return title !== 'All Customers' && title !== 'All customers';
	} else {
		return buyer_name !== 'Guest Customer';
	}
};
const BuyerSwitch = ({ onClick, title, custom_styles = {}, show_filter = false, disable = false }: any) => {
	const buyer_name = useSelector((state: any) => {
		if (state?.buyer?.is_guest_buyer) return 'Guest Customer';
		return state?.buyer?.buyer_info?.name;
	});
	const classes = useStyles();
	const theme: any = useTheme();
	const showRedDot = show_filter && check_show_red_dot(title, buyer_name);

	return (
		<div
			className={`${classes.buyer_container} ${disable ? '' : classes.buyer_container_border} ${
				show_filter || disable ? '' : classes.buyer_container2
			}`}
			onClick={onClick}
			style={{
				...theme?.page_header_component?.buyer_switch?.buyer_container,
				...custom_styles,
				border: showRedDot && !disable ? theme?.page_header_component?.buyer_switch?.show_red_dot?.border : 'none',
			}}>
			{showRedDot && <span className={classes.redDot} />}
			<Typography
				color={theme?.page_header_component?.buyer_switch?.text?.color}
				sx={{
					fontWeight: showRedDot ? 700 : 400,
					fontSize: '14px',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}>
				{title ? title : buyer_name}
			</Typography>
			{!disable && <Icon iconName='IconChevronDown' color={theme?.page_header_component?.buyer_switch?.icon?.color} />}
		</div>
	);
};

const CatalogSwitch = ({ handle_on_change = () => {} }: any) => {
	const classes = useStyles();
	const buyer = useSelector((state: any) => state.buyer);
	const dispatch = useDispatch();
	const [page_name, set_page_name] = useState('');
	const { handle_pricelist_change_in_catalog } = useCatalogActions();
	const { catalog_mode, catalog_selected_pricelist } = useSelector((state: any) => state?.catalog_mode);
	const { catalog_data } = useSelector((state: any) => state?.catalog);
	const { linked_catalog_data } = useSelector((state: any) => state?.linked_catalog);

	useEffect(() => {
		const _path = get_page_name(window.location.pathname);
		set_page_name(_path);
	}, [window.location.pathname]);

	const [show_modal, set_show_modal] = useState(false);
	const [selected_catalog_name, set_selected_catalog_name] = useState(
		catalog_mode ? catalog_selected_pricelist?.label ?? '' : buyer?.catalog?.label,
	);
	const [selected_catalog, set_selected_catalog] = useState<string>(
		catalog_mode ? catalog_selected_pricelist?.value : buyer?.catalog?.value,
	);
	const [catalog_list, set_catalogs] = useState<ICatalog[]>([]);
	const [applying, set_applying] = useState(false);
	const [linked_catalog, set_linked_catalog] = useState<ICatalog>({});
	const theme: any = useTheme();
	const customer_metadata = get_customer_metadata();

	const handle_close = () => {
		set_show_modal(false);
		if (catalog_mode) return;
		Mixpanel.track(Events.CATALOG_SELECTION_CANCELLED, {
			tab_name: 'Products',
			page_name,
			section_name: 'catalog_popup',
			subtab_name: '',
			customer_metadata,
		});
	};

	const handle_show = () => {
		set_show_modal(true);
		if (catalog_mode) return;
		Mixpanel.track(Events.CATALOG_SWITCHER_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
	};

	const attach_catalog = async (_selected: ICatalog) => {
		try {
			const response: any = await cart_management.post_attach_catalog(buyer?.buyer_cart?.id, [_selected?.value]);
			dispatch(removedProductsCount(response?.products_removed));
			if (response?.status === 200) {
				set_selected_catalog_name(_selected?.label);
				dispatch<any>(update_catalog({ catalog: { value: _selected?.value, label: _selected?.label } }));
				set_show_modal(false);
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 3000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(''));
						},
						state: types.SUCCESS_STATE,
						title: t('PDP.Common.CatalogSwitch'),
						subtitle: '',
						showActions: false,
					}),
				);
			}
		} catch (error: any) {
			const _data = error?.response?.data;
			set_applying(false);
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						console.log(event);
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: _data?.message,
					showActions: false,
				}),
			);
			console.error(error);
		}
	};

	const handle_apply = async () => {
		const _selected = _.head(catalog_list?.filter((_p: any) => _p?.value === selected_catalog));
		if (catalog_mode) {
			handle_pricelist_change_in_catalog({
				pricelist: _selected,
				set_show_modal,
				set_applying,
			});
			handle_on_change();
			return;
		}
		set_applying(true);
		attach_catalog(_selected);
		handle_on_change();
	};

	const update_selection = (value: string) => {
		set_selected_catalog(value);
	};

	const handle_change = (event: any) => {
		update_selection(event.target.value);
		if (catalog_mode) return;
		Mixpanel.track(Events.CATALOG_SELECTED, {
			tab_name: 'Products',
			page_name,
			section_name: 'catalog_popup',
			subtab_name: '',
			customer_metadata,
		});
	};

	const get_body = () => {
		return (
			<>
				<Typography>Choose a Pricelist to display</Typography>
				<Grid container mt={1.2}>
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-controlled-radio-buttons-group'
							name='controlled-radio-buttons-group'
							value={selected_catalog}
							onChange={handle_change}>
							{catalog_list?.map((option: any) => (
								<FormControlLabel
									key={option?.value}
									value={option?.value}
									control={<Radio checked={option?.value === selected_catalog} size='small' />}
									label={
										<Grid container gap={2}>
											<CustomText>{option?.label}</CustomText>
											{linked_catalog?.value === option?.value && (
												<Chip
													size='small'
													label={
														<CustomText type='CaptionBold' color={theme?.product?.catalog_switch?.linked_catalog?.color}>
															Linked to customer
														</CustomText>
													}
													color={theme?.product?.catalog_switch?.linked_catalog?.background}
												/>
											)}
										</Grid>
									}
								/>
							))}
						</RadioGroup>
					</FormControl>
				</Grid>
			</>
		);
	};

	const get_selected_or_default = (data: any) => {
		return (
			_.head(data?.filter((_p: any) => _p?.value === buyer?.catalog?.value)) || _.head(data?.filter((_p: any) => _p?.is_default === true))
		);
	};

	const update_catalogs_everywhere = (data: any) => {
		set_catalogs(data);
		const _selected: any = get_selected_or_default(data);
		if (buyer?.catalog?.value !== _selected?.value) {
			const cart_id = _.get(buyer, 'buyer_cart.id', '');
			if (cart_id !== '') {
				attach_catalog(_selected);
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (_event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(''));
						},
						state: types.WARNING_STATE,
						title: types.WARNING_TITLE,
						subtitle: 'Current price list unavailable. Searching for a new price list',
						showActions: false,
					}),
				);
			}
		}

		if (buyer?.catalog?.value === '' || buyer?.catalog?.label === '') {
			set_selected_catalog_name(_selected?.label);
			set_selected_catalog(_selected?.value);
		}
	};

	const get_catalogs = async (data: any) => {
		try {
			if (_.isEmpty(data)) return;
			update_catalogs_everywhere(data);
		} catch (error) {
			console.error(error);
		}
	};

	const get_linked_catalog = async (data: any) => {
		try {
			if (_.head(data)) set_linked_catalog(data[0]);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (catalog_list?.length > 0) {
			const selected_catalog_now: any = _.find(catalog_list, (catalog: ICatalog) => catalog?.value === buyer?.catalog?.value);
			set_selected_catalog_name(selected_catalog_now?.label);
			if (selected_catalog_now) set_selected_catalog(selected_catalog_now?.value);
		}
	}, [buyer?.catalog?.value]);

	useEffect(() => {
		get_catalogs(catalog_data);
		if (!buyer?.is_guest_buyer) get_linked_catalog(linked_catalog_data);
		else set_linked_catalog({});
	}, [buyer?.is_guest_buyer, catalog_data, linked_catalog_data]);

	useEffect(() => {
		set_selected_catalog(catalog_mode ? catalog_selected_pricelist?.value : buyer?.catalog?.value);
		set_selected_catalog_name(catalog_mode ? catalog_selected_pricelist?.label ?? '' : buyer?.catalog?.label);
	}, [catalog_mode]);

	useEffect(() => {
		set_applying(false);
	}, [show_modal]);

	useEffect(() => {
		if (catalog_mode && !_.isEmpty(catalog_selected_pricelist) && !_.isEmpty(catalog_list)) {
			const selected_label =
				catalog_selected_pricelist?.label ?? _.find(catalog_list, (item) => item?.value === catalog_selected_pricelist?.value)?.label;
			set_selected_catalog_name(selected_label);
			set_selected_catalog(catalog_selected_pricelist?.value);
		}
	}, [catalog_mode, catalog_selected_pricelist, catalog_list]);

	return (
		<>
			<div
				style={{ ...theme?.product?.catalog_switch?.price_list_container }}
				className={catalog_mode ? classes.price_list_container_custom : classes.price_list_container}
				onClick={handle_show}>
				<Icon iconName='IconCurrencyDollar' color={theme?.product?.catalog_switch?.icon?.color} />
				<Typography color={theme?.product?.catalog_switch?.selected_calatog?.color} sx={{ fontWeight: 500, fontSize: '14px' }}>
					{selected_catalog_name || 'Select Pricelist'}
				</Typography>
				<Icon iconName='IconChevronDown' color={theme?.product?.catalog_switch?.icon?.color} />
			</div>
			<CustomDialog show_modal={show_modal} handle_close={handle_close} style={{ width: '480px' }}>
				<DialogContainer>
					<DialogTitle value='Select Pricelist' show_close={true} handle_close={handle_close} />
					<DialogSeperator />
					<DialogBody style={{ minHeight: '10rem' }} value={get_body()} />
					<Alert sx={{ my: 1, mx: 2 }} severity='warning'>
						{t('Catalog.Alert')}
					</Alert>
					<DialogSeperator />
					<DialogFooter>
						<Button onClick={handle_close} variant='outlined' color='secondary'>
							Cancel
						</Button>
						<Button loading={applying} onClick={handle_apply}>
							Apply
						</Button>
					</DialogFooter>
				</DialogContainer>
			</CustomDialog>
		</>
	);
};

interface PageTitleProps {
	title?: string;
	subtitle?: string;
	allow_back?: boolean;
	handle_navigate?: () => void;
	additional_header_left?: any;
	title_style?: any;
	page_title_style?: any;
	button?: any;
}

const PageTitle = ({
	title,
	subtitle = '',
	allow_back = true,
	handle_navigate,
	additional_header_left,
	title_style,
	page_title_style,
	button,
}: PageTitleProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const theme: any = useTheme();

	const handle_click = () => {
		if (handle_navigate) {
			handle_navigate();
		} else {
			navigate(-1);
		}
	};

	return (
		<Grid display='flex' container className={classes.title_container}>
			{allow_back === true && (
				<Icon
					iconName='IconArrowLeft'
					sx={{ cursor: 'pointer', marginRight: 0.8, color: theme?.typography?.color, transition: 'color 0.2ms ease-in-out' }}
					onClick={handle_click}
				/>
			)}
			<div className='page-title' style={{ maxWidth: '100%', textOverflow: 'ellipsis', ...page_title_style }}>
				<CustomText type='H6' style={{ maxWidth: '100%', textOverflow: 'ellipsis', ...title_style }}>
					{title}
				</CustomText>
				<Grid display='flex' gap={1} alignItems={'center'}>
					<CustomText>{subtitle}</CustomText>
					{button}
				</Grid>
			</div>
			{additional_header_left}
		</Grid>
	);
};

const Dropdown = () => {
	const classes = useStyles();
	const theme: any = useTheme();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleGenerateLabel = () => {
		navigate('/labels');
		handleClose();
	};

	return (
		<div>
			<div className={classes.icon_container} onClick={handleClick} style={theme?.page_header_component?.icon_container}>
				<Icon iconName='IconDotsVertical' color={theme?.page_header_component?.primary} />
			</div>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem onClick={handleGenerateLabel}>{t('Common.Main.GenerateLabel')}</MenuItem>
			</Menu>
		</div>
	);
};

const PageHeaderMenuOptions = () => {
	const dispatch = useDispatch();
	const { handle_initialise_create_mode } = useCatalogActions();

	const handle_menu_click = () => {
		handle_initialise_create_mode();
		dispatch(update_catalog_mode({ catalog_mode: true }));
	};
	return (
		<Grid
			container
			sx={{
				width: 'max-content',
				backgroundColor: '#fff',
				borderRadius: 1,
				border: '1px solid #0000001F',
			}}
			justifyContent={'center'}
			alignItems={'center'}>
			<MenuSourceComponent
				closeOnItemClick
				LabelComponent={<Icon iconName='IconDotsVertical' />}
				onClickMenuItem={handle_menu_click}
				btnStyle={{ marginTop: '0.5rem', cursor: 'pointer', padding: '0px 8px' }}
				menu={PAGE_HEADER_MENU_ITEMS}
				menuItemStyle={{ padding: '0.5rem 1rem' }}
			/>
		</Grid>
	);
};

export { Scanner, Export, BuyerSwitch, PageTitle, Cart, NavigatePage, Dropdown, CatalogSwitch, PageHeaderMenuOptions, Wishlist };
