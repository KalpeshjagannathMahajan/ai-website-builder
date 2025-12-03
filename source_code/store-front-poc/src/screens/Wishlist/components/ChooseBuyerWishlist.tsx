import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '@mui/material';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import { colors } from 'src/utils/theme';
import ChooseBuyerWishlistModal from '../Modals/ChooseBuyerWishlistModal';
import useEffectOnDependencyChange from 'src/hooks/useEffectOnDependencyChange';

interface CreateWishlistProps {
	choose_wishlist_modal_open: boolean;
	set_choose_wishlist_modal_open: (flag: boolean) => void;
	buyer_panel: boolean;
	set_buyer_pannel: (flag: boolean) => void;
	handle_assign_wishlist: () => void;
	handle_proceed_as_self: () => void;
	open_selection_drawer: () => void;
}

const ChooseBuyerWishlist = ({
	choose_wishlist_modal_open,
	set_choose_wishlist_modal_open,
	buyer_panel,
	set_buyer_pannel,
	handle_assign_wishlist,
	handle_proceed_as_self,
	open_selection_drawer,
}: CreateWishlistProps) => {
	const buyer = useSelector((state: any) => state.buyer);

	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [buyer_data, set_buyer_data] = useState<any>();
	const [from_assign_customer_button, set_from_assign_customer_button] = useState(false);

	const handle_on_buyer_switch = (data: any) => {
		set_buyer_data(data);
		set_buyer_pannel(false);
	};

	const handle_close_modal = () => {
		set_choose_wishlist_modal_open(false);
	};

	const temp_handle_assign_wishlist = () => {
		set_from_assign_customer_button(true);
		handle_assign_wishlist();
	};

	useEffectOnDependencyChange(() => {
		set_from_assign_customer_button(false);
		if (buyer?.is_guest_buyer) return;
		if (from_assign_customer_button) open_selection_drawer();
	}, [buyer]);

	return (
		<>
			{buyer_panel && (
				<SelectBuyerPanel
					show_drawer={buyer_panel}
					toggle_drawer={set_buyer_pannel}
					set_is_buyer_add_form={set_is_buyer_add_form}
					buyer_data={buyer_data}
					set_buyer_data={handle_on_buyer_switch}
				/>
			)}

			{is_buyer_add_form && (
				<Drawer
					PaperProps={{ sx: { width: 600, background: colors.white } }}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
				</Drawer>
			)}

			{choose_wishlist_modal_open && (
				<ChooseBuyerWishlistModal
					open={choose_wishlist_modal_open}
					on_close={handle_close_modal}
					handle_assign_wishlist={temp_handle_assign_wishlist}
					handle_proceed_as_self={handle_proceed_as_self}
				/>
			)}
		</>
	);
};

export default ChooseBuyerWishlist;
