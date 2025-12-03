import { Badge } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set_buyer } from 'src/actions/buyer';
import { useTheme } from '@mui/material/styles';
import { Icon, Grid } from 'src/common/@the-source/atoms';
import { get_initials } from 'src/utils/common';
import CircularProgressBar from '../@the-source/atoms/ProgressBar/CircularProgressBar';
import CustomText from '../@the-source/CustomText';

interface CartProps {
	cart_length?: number;
	background?: string;
	can_navigate?: boolean;
	address?: string;
	buyer?: any;
}

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		gap: '16px',
		padding: '16px',
		borderRadius: '8px',
		cursor: 'pointer',
	},
	left_section: {},
	right_section: {
		display: 'flex',
		gap: '4px',
		flexDirection: 'column',
	},
	image_box: {
		height: '45px',
		width: '45px',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cart_icon_container: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '8px',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '40px',
		height: '40px',
		cursor: 'pointer',
	},
	selected_cart_icon_container: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '8px',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '40px',
		height: '40px',
		background: 'rgba(22, 136, 95, 0.08)',
		cursor: 'pointer',
	},
	buyer_card: {
		display: 'flex',
		gap: '16px',
		padding: '16px',
		borderRadius: '8px',
		cursor: 'pointer',
		justifyContent: 'space-between',
	},
	selected_buyer_card: {
		display: 'flex',
		gap: '16px',
		padding: '16px',
		borderRadius: '8px',
		cursor: 'pointer',
		justifyContent: 'space-between',
	},
	all_buyer_section: {
		display: 'flex',
		alignItems: 'center',
	},
}));

export const Cart = ({ cart_length = 0, background = 'white', can_navigate, address, buyer }: CartProps) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handle_navigate = () => {
		navigate(`/${address}`);
	};
	const badgeStyle = {
		width: '16px',
		borderRadius: '50%',
		background: '#D74C10',
		fontSize: '10px',
		fontWeight: '700',
		color: 'white',
		height: '20px',
		margin: '2px 4px',
		border: '1px solid #FCEFD6',
		padding: '0.2rem',
	};

	const clickHandler = () => {
		dispatch<any>(set_buyer({ buyer_id: buyer.buyer_info?.id, is_guest_buyer: false }));
		if (can_navigate) {
			handle_navigate();
		}
	};

	return (
		<Grid
			className={classes.cart_icon_container}
			style={{ ...theme?.select_buyer_panel?.cart_icon_container, background }}
			onClick={clickHandler}>
			<Badge
				slotProps={{
					badge: {
						style: { ...badgeStyle, maxWidth: cart_length > 99 ? '' : '20px', ...theme?.select_buyer_panel?.cart?.badge_style },
					},
				}}
				badgeContent={cart_length}
				color='error'>
				<Icon iconName='IconShoppingCart' color={theme?.select_buyer_panel?.cart?.icon?.color} />
			</Badge>
		</Grid>
	);
};

const BuyerCard = ({ buyer, handle_buyer_change, selected_buyer_id, buyer_card_show_loading, selected = false }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const [buyerColor, setBuyerColor] = useState<{ background: string; color: string } | null>(null);

	useEffect(() => {
		const storedColor = localStorage.getItem(`buyerColor_${buyer.id}`);

		if (storedColor) {
			setBuyerColor(JSON.parse(storedColor));
		} else {
			const dummyArray = theme?.select_buyer_panel?.buyer_card?.dummy_array;
			const x = Math.floor(Math.random() * dummyArray.length);
			const selectedColor = dummyArray[x];
			localStorage.setItem(`buyerColor_${buyer.id}`, JSON.stringify(selectedColor));
			setBuyerColor(selectedColor);
		}
	}, [buyer.id]);

	const ordersCount = buyer.order_details.Orders + 0;
	const quotesCount = buyer.order_details.Quote + 0;
	const draftsCount = buyer.order_details.Drafts + 0;
	return (
		<div
			id={buyer?.id}
			className={selected ? classes.selected_buyer_card : classes.buyer_card}
			onClick={() => handle_buyer_change(buyer)}
			style={{ ...theme?.select_buyer_panel?.card_custom_style }}>
			<div style={{ display: 'flex', gap: '16px', flexDirection: 'row' }}>
				<div className={classes.left_section}>
					<div
						className={classes.image_box}
						style={{ background: buyerColor?.background || theme?.select_buyer_panel?.buyer_card?.initials?.background }}>
						<CustomText
							type='H1'
							style={{ fontWeight: 'normal' }}
							color={buyerColor?.color || theme?.select_buyer_panel?.buyer_card?.initials?.color}>
							{get_initials(buyer?.buyer_name, 2)}
						</CustomText>
					</div>
				</div>
				<div className={classes.right_section}>
					<CustomText type='Title' color={theme?.select_buyer_panel?.buyer_card?.buyer_data?.name}>
						{buyer.buyer_name}
					</CustomText>
					<CustomText type='Body' color={theme?.select_buyer_panel?.buyer_card?.buyer_data?.location}>
						{buyer.location && buyer.location !== ', ' ? buyer.location : 'No location added'}
					</CustomText>
					<CustomText type='Body' color={theme?.select_buyer_panel?.buyer_card?.buyer_data?.sales}>
						<Trans i18nKey='SideSheet.Order.ShowingItems' count={ordersCount <= 1 ? 1 : ordersCount}>
							{{ ordersCount }} order
						</Trans>
						{' · '}
						<Trans i18nKey='SideSheet.Quote.ShowingItems' count={quotesCount <= 1 ? 1 : quotesCount}>
							{{ quotesCount }} quote
						</Trans>
						{' · '}
						<Trans i18nKey='SideSheet.Draft.ShowingItems' count={draftsCount <= 1 ? 1 : draftsCount}>
							{{ draftsCount }} draft
						</Trans>
					</CustomText>
				</div>
			</div>

			<Grid display='flex' flexDirection='column' alignItems='center'>
				{buyer.total_cart_items > 0 && <Cart cart_length={buyer.total_cart_items} buyer={buyer} background={selected ? 'none' : ''} />}
				{selected_buyer_id === buyer?.id && buyer_card_show_loading && (
					<CircularProgressBar
						style={{ width: '20px', height: '20px', marginTop: 'auto', ...theme?.select_buyer_panel?.buyer_card?.progress_bar }}
						variant='indeterminate'
					/>
				)}
			</Grid>
		</div>
	);
};

export const AddBuyerCard = ({ handle_on_click }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();

	return (
		<div className={classes.container} onClick={handle_on_click} style={theme?.select_buyer_panel?.container}>
			<div className={classes.left_section}>
				<div className={classes.image_box} style={theme?.select_buyer_panel?.add_buyer_card?.image_box}>
					<Icon color={theme?.select_buyer_panel?.add_buyer_card?.icon_color} onClick={handle_on_click} iconName='IconUserPlus' />
				</div>
			</div>
			<div className={classes.right_section}>
				<CustomText type='H6' style={{ fontWeight: 600 }} color={theme?.select_buyer_panel?.add_buyer_card?.title}>
					{t('BuyerDashboard.BuyerCard.AddBuyer')}
				</CustomText>

				<CustomText type='Body' color={theme?.select_buyer_panel?.add_buyer_card?.subtitle}>
					{t('BuyerDashboard.BuyerCard.AddDetails')}
				</CustomText>
			</div>
		</div>
	);
};

export const GuestBuyerCard = ({ handle_on_click }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();

	return (
		<div className={classes.container} onClick={handle_on_click} style={theme?.select_buyer_panel?.container}>
			<div className={classes.left_section}>
				<div className={classes.image_box} style={theme?.select_buyer_panel?.guest_buyer_card?.image_box}>
					<Icon color={theme?.select_buyer_panel?.guest_buyer_card?.icon_color} onClick={handle_on_click} iconName='IconUser' />
				</div>
			</div>
			<div className={classes.right_section}>
				<CustomText type='Title' color={theme?.select_buyer_panel?.guest_buyer_card?.title}>
					{t('BuyerDashboard.BuyerCard.GuestBuyer')}
				</CustomText>

				<CustomText type='Body' color={theme?.select_buyer_panel?.guest_buyer_card?.subtitle}>
					{t('BuyerDashboard.BuyerCard.ViewAsGuest')}
				</CustomText>
			</div>
		</div>
	);
};

export const AllBuyerCard = ({ handle_on_click }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();

	return (
		<div className={classes.container} onClick={handle_on_click} style={theme?.select_buyer_panel?.container}>
			<div className={classes.left_section}>
				<div className={classes.image_box} style={theme?.select_buyer_panel?.all_buyer_card?.image_box}>
					<Icon color={theme?.select_buyer_panel?.all_buyer_card?.icon_color} onClick={handle_on_click} iconName='IconUser' />
				</div>
			</div>
			<CustomText className={classes.all_buyer_section} type='Title' color={theme?.select_buyer_panel?.all_buyer_card?.text_color}>
				{t('BuyerDashboard.BuyerCard.AllBuyers')}
			</CustomText>
		</div>
	);
};

export default BuyerCard;
