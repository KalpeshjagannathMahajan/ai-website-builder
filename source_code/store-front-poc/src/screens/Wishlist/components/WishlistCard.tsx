import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Avatar, Box, Grid, Icon, Image, Menu } from 'src/common/@the-source/atoms';
import CustomCheckbox from 'src/common/@the-source/atoms/Checkbox/CustomCheckbox';
import CustomText from 'src/common/@the-source/CustomText';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import CreateWishListModal from '../Modals/CreateWishListModal';
import { get, head, isEmpty, isUndefined, map, size, values } from 'lodash';
import { useNavigate } from 'react-router-dom';
import DeleteWishListModal from '../Modals/DeleteWishlistModal';
import { get_short_name } from '../utils';
import constants from 'src/utils/constants';
import { get_initials } from 'src/utils/common';
import ImageLinks from 'src/assets/images/ImageLinks';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { WISHLIST_DATE_FORMAT, wishlist_source } from '../constants';

const MENU_ITEMS = [
	{
		label: t('Wishlist.Card.Rename'),
	},
	{
		label: t('Wishlist.Card.Delete'),
	},
];

const useStyles = makeStyles((theme: any) => ({
	card_container: {
		borderWidth: '1px',
		borderStyle: 'solid',
		borderRadius: theme?.wishlist_style?.border_radius,
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		position: 'relative',
		cursor: 'pointer',
		userSelect: 'none',
		height: '272px !important',
		overflow: 'hidden',
	},
	image_style: {
		width: '100%',
		height: '100% !important',
		objectFit: 'contain',
	},
	images_container: {
		flex: 1,
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gridTemplateRows: '1fr 1fr',
		width: '100%',
		placeItems: 'center',
		overflow: 'hidden',
		borderTopLeftRadius: theme?.wishlist_style?.border_radius,
		borderTopRightRadius: theme?.wishlist_style?.border_radius,
		background: 'white',
	},
	content_container: {
		padding: '8px 16px',
		display: 'flex',
		flexDirection: 'column',
		gap: '2px',
		height: 'max-content',
		backgroundColor: colors.text_50,
	},
	custom_avatar: {
		backgroundColor: theme?.palette?.info[600],
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '200px',
		width: '25px',
		height: '25px',
	},
	review_checkbox: {
		position: 'absolute',
		right: '12px',
		top: '12px',
		zIndex: 1,
		cursor: 'pointer',
		boxShadow: '0px 4px 8px 0px #0000001F',
		height: '16px',
	},
	dot_menu: {
		position: 'absolute',
		top: '8px',
		right: '8px',
		backgroundColor: colors.white,
		borderRadius: theme?.wishlist_style?.border_radius,
		boxShadow: `0px 1px 3px ${colors.black_20}`,
		zIndex: 1,
		width: 'max-content',
		border: `1px solid ${colors.dark_midnight_blue}`,
		justifyContent: 'center',
		alignItems: 'center',
	},
	menu: {
		marginTop: '0px',
		boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
		borderRadius: theme?.wishlist_style?.border_radius,
		padding: '0px 0',
	},
	menuItem: {
		fontSize: '14px',
		padding: '8px 24px',
	},
	wishlist_name: {
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
	},
	empty_image: {
		width: '100%',
		height: '70% !important',
		objectFit: 'contain',
		gridArea: '1/1/3/3',
	},
	wishlist_image: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		padding: '4px 0px',
	},
}));

const images = Array.from({ length: 4 }).fill(null);

interface WishlistCardProps {
	update_selected_wishlists?: (id: string) => void;
	data: any;
	is_selected?: boolean;
	from_wishlist_listing?: boolean;
	for_is_guest_buyer?: boolean;
}

const WishlistCard = ({
	update_selected_wishlists,
	data,
	is_selected = false,
	from_wishlist_listing = false,
	for_is_guest_buyer,
}: WishlistCardProps) => {
	const classes = useStyles();

	const theme: any = useTheme();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const login = useSelector((state: any) => state.login);
	const user_id = login?.userDetails?.id;

	const navigate = useNavigate();
	const product_images: any = values(get(data, 'meta.thumbnails', {}));
	const product_count = get(data, 'meta.product_count', 0);
	const name = get(data, 'created_by_name', '');
	const created_by_id = get(data, 'created_by', '');
	const created_at = convert_date_to_timezone(get(data, 'created_at'), WISHLIST_DATE_FORMAT);
	const updated_at = convert_date_to_timezone(get(data, 'updated_at'), WISHLIST_DATE_FORMAT);

	const [selected, set_selected] = useState(is_selected);
	const [create_wishlist_modal_open, set_create_wishlist_modal_open] = useState(false);
	const [delete_wishlist_modal_open, set_delete_wishlist_modal_open] = useState(false);
	const [is_rename, set_is_rename] = useState(false);
	const is_wizshop_source = get(data, 'source', '') === wishlist_source.WIZSHOP;

	const handle_select_wishlist = () => {
		if (!from_wishlist_listing) {
			update_selected_wishlists && update_selected_wishlists(data?.id ?? '');
			set_selected((prev: boolean) => !prev);
		} else {
			navigate(`/wishlist/${data?.id}`);
		}
	};

	const handle_menu_click = async (label: any) => {
		if (label === 'Rename') {
			set_is_rename(true);
			set_create_wishlist_modal_open(true);
		} else if (label === 'Delete') {
			set_is_rename(false);
			set_delete_wishlist_modal_open(true);
		}
	};

	const handle_close = () => {
		is_rename && set_is_rename(false);
		set_create_wishlist_modal_open(false);
	};

	const handle_close_delete_wishlist = () => {
		set_delete_wishlist_modal_open(false);
	};

	useEffect(() => {
		set_selected(is_selected);
	}, [is_selected]);

	return (
		<>
			<Grid sx={{ position: 'relative' }}>
				{/* {is_wizshop_source && (
					<Chip
						size='small'
						label={<CustomText type='CaptionBold'>{t('Wishlist.Card.Website')}</CustomText>}
						bgColor='#f2f6e7'
						sx={{ position: 'absolute', top: '12px', left: '8px', zIndex: '10' }}
					/>
				)} */}
				{!from_wishlist_listing ? (
					<Box onClick={handle_select_wishlist} className={classes.review_checkbox}>
						<CustomCheckbox selected={selected} />
					</Box>
				) : is_wizshop_source ? (
					<Grid container className={classes.dot_menu}>
						<Menu
							closeOnItemClick
							LabelComponent={<Icon iconName='IconDotsVertical' />}
							onClickMenuItem={handle_menu_click}
							btnStyle={{ marginTop: '8px', cursor: 'pointer', padding: '2px 8px' }}
							menu={MENU_ITEMS}
							sx={{
								'& .MuiPaper-root': {
									borderRadius: theme?.wishlist_style?.border_radius,
								},
							}}
						/>
					</Grid>
				) : (
					<></>
				)}
				<Grid
					item
					onClick={handle_select_wishlist}
					sx={{
						borderColor: is_selected ? secondary[600] : secondary[400],
						boxShadow: is_selected ? `0px 4px 8px 0px ${colors.dark_midnight_blue}` : 'none',
					}}
					className={classes.card_container}>
					<Grid className={classes.images_container}>
						{size(product_images) === 0 ? (
							<Image
								imgClass={classes.empty_image}
								src={is_ultron ? ImageLinks.empty_wishlist : ImageLinks.no_wishlist_storefront}
								alt='No Wishlist'
							/>
						) : (
							map(images, (image: any, index: number) => {
								const image_data: any = product_images[index];
								const product_image_data: any = head(image_data);
								const validate_image = index <= size(product_images) - 1 && !isEmpty(product_image_data?.url);
								return (
									<Box
										className={classes.wishlist_image}
										style={{
											borderTop: index === 2 || index === 3 ? `2px solid ${colors.dark_midnight_blue}` : '',
											borderRight: index === 0 || index === 2 ? `2px solid ${colors.dark_midnight_blue}` : '',
										}}>
										{!isUndefined(image_data) && (
											<Image
												imgClass={classes.image_style}
												key={validate_image ? product_image_data?.id : image}
												src={validate_image ? product_image_data?.url : constants.FALLBACK_IMAGE}
												alt='Product image'
											/>
										)}
									</Box>
								);
							})
						)}
					</Grid>
					<Grid className={classes.content_container}>
						<CustomText type='H3'>{get_short_name(get(data, 'name', ''), 25)}</CustomText>
						<Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
							<CustomText type='Caption' color={colors.secondary_text}>
								{`${product_count} ${product_count > 1 || product_count === 0 ? 'products' : 'product'}`}
							</CustomText>
							<Grid display={'flex'} alignItems={'center'} gap={1}>
								<CustomText type='Caption' color={colors.secondary_text}>
									{created_by_id === user_id ? t('Wishlist.Card.Me') : get_short_name(name, 15)}
								</CustomText>
								<Avatar
									variant='rounded'
									size='medium'
									content={
										<CustomText type='Micro' color={colors.white}>
											{get_initials(name, 2)}
										</CustomText>
									}
									className={classes.custom_avatar}
								/>
							</Grid>
						</Grid>
						<Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
							<CustomText type='Caption' color={colors.secondary_text}>
								{t('Wishlist.Card.CreatedAt', {
									date: created_at,
								})}
							</CustomText>
							<CustomText type='Caption' color={colors.secondary_text}>
								{t('Wishlist.Card.UpdatedAt', {
									date: updated_at,
								})}
							</CustomText>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{create_wishlist_modal_open && (
				<CreateWishListModal
					open={create_wishlist_modal_open}
					on_close={handle_close}
					modal_type={is_rename ? 'RENAME' : 'CREATE'}
					wishlist={data}
					for_is_guest_buyer={for_is_guest_buyer}
				/>
			)}
			{delete_wishlist_modal_open && (
				<DeleteWishListModal open={delete_wishlist_modal_open} on_close={handle_close_delete_wishlist} wishlist={data} />
			)}
		</>
	);
};

export default WishlistCard;
