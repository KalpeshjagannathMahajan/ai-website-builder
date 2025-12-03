import { Grid, Icon, Menu } from 'src/common/@the-source/atoms';
import { wishlist_details_menu_type } from '../constants';
import { useState } from 'react';
import CreateWishListModal from '../Modals/CreateWishListModal';
import DeleteWishListModal from '../Modals/DeleteWishlistModal';
import { useNavigate } from 'react-router-dom';

interface PageHeaderMenuOptionsProps {
	wishlist: any;
}

const PAGE_HEADER_MENU_ITEMS = [
	{
		label: wishlist_details_menu_type.RENAME,
	},
	{
		label: wishlist_details_menu_type.DELETE,
	},
];

const PageHeaderMenuOptions = ({ wishlist }: PageHeaderMenuOptionsProps) => {
	const navigate = useNavigate();

	const [create_wishlist_modal_open, set_create_wishlist_modal_open] = useState(false);
	const [delete_wishlist_modal_open, set_delete_wishlist_modal_open] = useState(false);

	const handle_close = () => set_create_wishlist_modal_open(false);
	const handle_close_delete_wishlist = () => set_delete_wishlist_modal_open(false);
	const on_delete = () => navigate(-1);

	const handle_menu_click = (val: any) => {
		switch (val) {
			case wishlist_details_menu_type.RENAME:
				set_create_wishlist_modal_open(true);
				break;
			case wishlist_details_menu_type.DELETE:
				set_delete_wishlist_modal_open(true);
				break;
		}
	};

	return (
		<>
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
				<Menu
					closeOnItemClick
					LabelComponent={<Icon iconName='IconDotsVertical' />}
					onClickMenuItem={handle_menu_click}
					btnStyle={{ marginTop: '0.5rem', cursor: 'pointer', padding: '0px 8px' }}
					menu={PAGE_HEADER_MENU_ITEMS}
				/>
			</Grid>

			{create_wishlist_modal_open && (
				<CreateWishListModal open={create_wishlist_modal_open} on_close={handle_close} modal_type={'RENAME'} wishlist={wishlist} />
			)}

			{delete_wishlist_modal_open && (
				<DeleteWishListModal
					on_delete={on_delete}
					open={delete_wishlist_modal_open}
					on_close={handle_close_delete_wishlist}
					wishlist={wishlist}
				/>
			)}
		</>
	);
};

export default PageHeaderMenuOptions;
