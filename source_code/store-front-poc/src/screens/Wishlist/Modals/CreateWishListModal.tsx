import { TextField, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { isEmpty, slice, trim, upperCase } from 'lodash';
import useWishlistActions from '../hooks/useWishlistActions';

interface CreateWishlistModal {
	open: boolean;
	on_close: () => void;
	modal_type?: 'CREATE' | 'RENAME';
	wishlist?: any;
	for_is_guest_buyer?: boolean;
	on_create?: (wishlist: any) => void;
	custome_buyer_id?: string;
}

const CreateWishListModal = ({
	open,
	on_close,
	modal_type = 'CREATE',
	wishlist,
	for_is_guest_buyer,
	on_create,
	custome_buyer_id,
}: CreateWishlistModal) => {
	const theme: any = useTheme();

	const is_rename = modal_type === 'RENAME';
	const [wishlist_name, set_wishlist_name] = useState<string>(is_rename ? wishlist?.name ?? '' : '');
	const [loader, set_loader] = useState(false);
	const { create_wishlist, rename_wishlist } = useWishlistActions();

	const handle_close = () => {
		set_wishlist_name('');
		on_close();
	};

	const handle_create_wishlist = async () => {
		if (loader) return;
		try {
			set_loader(true);
			if (is_rename) {
				wishlist?.id && (await rename_wishlist(wishlist?.id, { name: wishlist_name }, for_is_guest_buyer));
				if (wishlist?.name) {
					wishlist.name = wishlist_name;
				}
			} else {
				const data: any = await create_wishlist(wishlist_name, for_is_guest_buyer, custome_buyer_id);
				on_create && on_create(data);
			}

			on_close();
		} catch (err) {
			console.error(err);
		} finally {
			set_loader(false);
		}
	};

	const handle_cancel_create_wishlist = () => {
		handle_close();
	};

	return (
		<Modal
			open={open}
			title={!is_rename ? t('Wishlist.CreateWishlistModal.CreateNewWishList') : t('Wishlist.CreateWishlistModal.RenameWishList')}
			onClose={handle_close}
			children={
				<TextField
					fullWidth
					label={'Wishlist Name'}
					value={wishlist_name}
					onChange={(e) => {
						const value = e.target.value;
						const capitalized_value = upperCase(value.charAt(0)) + slice(value, 1).join('');
						set_wishlist_name(capitalized_value);
					}}
					placeholder='Wishlist name'
					sx={{
						'& .MuiInputBase-root': {
							borderRadius: theme?.wishlist_style?.border_radius,
						},
					}}
				/>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={handle_cancel_create_wishlist}>
						{t('Wishlist.CreateWishlistModal.Cancel')}
					</Button>
					<Button color='primary' loading={loader} onClick={handle_create_wishlist} disabled={isEmpty(trim(wishlist_name))}>
						{t('Wishlist.CreateWishlistModal.Save')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default CreateWishListModal;
