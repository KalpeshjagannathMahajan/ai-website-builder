import { t } from 'i18next';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

interface ChooseBuyerWishlistModalProps {
	open: boolean;
	on_close: () => void;
	handle_assign_wishlist: () => void;
	handle_proceed_as_self: () => void;
}

const ChooseBuyerWishlistModal = ({ open, on_close, handle_assign_wishlist, handle_proceed_as_self }: ChooseBuyerWishlistModalProps) => {
	const handle_close = () => {
		on_close();
	};

	return (
		<Modal
			open={open}
			title={t('Wishlist.CreateWishlistModal.CreateNewWishList')}
			onClose={handle_close}
			children={<CustomText type='Title'>{t('Wishlist.CreateWishlistModal.AskForCustomer')}</CustomText>}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={handle_assign_wishlist}>
						{t('Wishlist.CreateWishlistModal.Assign')}
					</Button>
					<Button color='primary' onClick={handle_proceed_as_self}>
						{t('Wishlist.CreateWishlistModal.ProceedSelf')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default ChooseBuyerWishlistModal;
