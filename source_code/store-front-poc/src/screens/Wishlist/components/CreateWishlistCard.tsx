import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { primary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import CreateWishListModal from '../Modals/CreateWishListModal';
import { useState } from 'react';

interface CreateWishlistCardProps {
	handle_create_wishlist: () => void;
}

const useStyles = makeStyles(() => ({
	card_container: {
		borderRadius: '12px',
		gap: '16px',
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		padding: '16px',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: primary[50],
		cursor: 'pointer',
		userSelect: 'none',
		height: '272px',
	},
	add_cta: {
		backgroundColor: primary[100],
		borderRadius: '200px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '50px',
		height: '50px',
	},
}));

const CreateWishlistCard = ({ handle_create_wishlist }: CreateWishlistCardProps) => {
	const classes = useStyles();
	const [create_wishlist_modal_open, set_create_wishlist_modal_open] = useState(false);

	const handle_close_modal = () => {
		set_create_wishlist_modal_open(false);
	};

	return (
		<>
			<Grid onClick={handle_create_wishlist} item className={classes.card_container}>
				<Grid className={classes.add_cta} display={'flex'} alignItems={'center'} justifyContent={'center'}>
					<Icon iconName='IconPlus' color={colors.primary_500} fontSize='large' />
				</Grid>
				<Grid display={'flex'} direction={'column'} alignItems={'center'} justifyContent={'space-between'} gap={0.5}>
					<CustomText type='Subtitle'>{t('Wishlist.CreateCard.Heading')}</CustomText>
					<CustomText type='Body' color={colors.secondary_text}>
						{t('Wishlist.CreateCard.Body')}
					</CustomText>
				</Grid>
			</Grid>

			{create_wishlist_modal_open && <CreateWishListModal open={create_wishlist_modal_open} on_close={handle_close_modal} />}
		</>
	);
};

export default CreateWishlistCard;
