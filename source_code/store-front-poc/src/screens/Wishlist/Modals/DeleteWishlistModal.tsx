import { t } from 'i18next';
import { useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import useWishlistActions from '../hooks/useWishlistActions';
import CustomText from 'src/common/@the-source/CustomText';
import { get_session_for_wishlist, get_short_name, update_session_for_wishlist } from '../utils';
import { filter } from 'lodash';

interface DeleteWishlistModal {
	open: boolean;
	on_close: () => void;
	wishlist: any;
	on_delete?: () => void;
}

const DeleteWishListModal = ({ open, on_close, wishlist, on_delete }: DeleteWishlistModal) => {
	const [loader, set_loader] = useState(false);
	const { remove_wishlist } = useWishlistActions();

	const handle_close = () => {
		on_close();
	};

	const handle_delete_wishlist = async () => {
		if (loader) return;
		try {
			set_loader(true);
			await remove_wishlist(wishlist?.id);
			const pre_selected = get_session_for_wishlist();
			update_session_for_wishlist(
				'ADD',
				filter(pre_selected, (id: string) => id !== wishlist?.id),
			);
			on_delete && on_delete();
			on_close();
		} catch (err) {
			console.error(err);
		} finally {
			set_loader(false);
		}
	};

	const handle_cancel_delete_wishlist = () => {
		handle_close();
	};

	return (
		<Modal
			open={open}
			title={t('Wishlist.DeleteWishList.ModalTitle', { name: get_short_name(wishlist?.name, 35) })}
			onClose={handle_close}
			children={<CustomText type='Title'>{t('Wishlist.DeleteWishList.ModalText')}</CustomText>}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' disabled={loader} color='secondary' onClick={handle_cancel_delete_wishlist}>
						{t('Wishlist.DeleteWishList.Cancel')}
					</Button>
					<Button color='error' loading={loader} onClick={handle_delete_wishlist}>
						{t('Wishlist.DeleteWishList.Delete')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default DeleteWishListModal;
