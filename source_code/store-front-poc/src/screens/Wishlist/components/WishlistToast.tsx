import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get_short_name } from '../utils';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import { makeStyles } from '@mui/styles';
import { Divider, useTheme } from '@mui/material';
import useWishlistActions from '../hooks/useWishlistActions';
import { useMemo } from 'react';
import { difference, filter, find, head, intersection, isEmpty, map, size } from 'lodash';
import { wishlist_source } from '../constants';

interface WishlistToastProps {
	handle_change: () => void;
	current_selected_wishlists: string[];
	prev_selected_wishlists: string[];
	buyer_wishlist_data?: any;
}

const useStyles = makeStyles((theme: any) => ({
	constainer: {
		backgroundColor: colors.white,
		borderRadius: theme?.wishlist_style?.border_radius,
		width: '248px',
	},
	button_styles: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '4px',
	},
}));

const WishlistToast = ({ handle_change, current_selected_wishlists, prev_selected_wishlists, buyer_wishlist_data }: WishlistToastProps) => {
	const classes = useStyles();
	const theme: any = useTheme();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const { get_active_wishlist } = useWishlistActions();
	const active_wishlists = !isEmpty(buyer_wishlist_data) ? buyer_wishlist_data?.data : get_active_wishlist();

	const filtered_wishlist = filter(
		active_wishlists,
		(wishlist_data: any) => wishlist_data?.source === (is_ultron ? wishlist_source.SALES_REP : wishlist_source.WIZSHOP),
	);
	const current_wishlists = useMemo(() => map(filtered_wishlist, (wishlist_data: any) => wishlist_data.id), [active_wishlists]);

	const active_selected_wishlist = useMemo(
		() => intersection(current_wishlists, current_selected_wishlists),
		[current_wishlists, current_selected_wishlists],
	);

	const product_removed_from = difference(prev_selected_wishlists, current_selected_wishlists);
	const remove_from_condition = isEmpty(active_selected_wishlist) && !isEmpty(product_removed_from);
	const find_wishlist = find(
		active_wishlists,
		(wishlist: any) => wishlist?.id === head(remove_from_condition ? product_removed_from : active_selected_wishlist),
	);

	const wishlist_name = find_wishlist?.name;
	const total_wishlist_session = size(remove_from_condition ? product_removed_from : active_selected_wishlist);

	return (
		<Grid className={classes.constainer}>
			<Grid py={1} px={1.5} flex={1} container flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={0.75}>
				<Icon iconName='IconHeartFilled' color={colors.red} />
				<Grid display={'flex'} alignItems={'center'} gap={0.6}>
					<CustomText type='Subtitle' color={is_ultron ? colors.primary_500 : theme?.wishlist_style?.text_color}>
						{remove_from_condition ? t('Wishlist.Toast.RemovedFrom') : t('Wishlist.Toast.SavedTo')}
					</CustomText>
					<CustomText type='Subtitle' color={is_ultron ? colors.primary_500 : theme?.wishlist_style?.text_color}>{`${get_short_name(
						wishlist_name,
						remove_from_condition ? 5 : 7,
					)}${total_wishlist_session > 1 ? ` +${total_wishlist_session - 1}` : ''}`}</CustomText>
				</Grid>
			</Grid>
			<Divider />
			<Grid py={0.5} flex={1} container flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
				<Button onClick={handle_change} size='small' variant='text'>
					<CustomText
						className={classes.button_styles}
						color={is_ultron ? colors.primary_500 : theme?.wishlist_style?.text_color}
						type='CaptionBold'>
						<Icon iconName='IconEdit' color={is_ultron ? colors.primary_500 : theme?.wishlist_style?.text_color} />
						{t('Wishlist.Toast.Change')}
					</CustomText>
				</Button>
			</Grid>
		</Grid>
	);
};

export default WishlistToast;
