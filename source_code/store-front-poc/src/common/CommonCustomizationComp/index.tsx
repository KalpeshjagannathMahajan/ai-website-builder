/*  eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import CustomProductDrawer from 'src/screens/CustomProduct/CustomProductDrawer';
import CustomProductModal from 'src/screens/CustomProduct/CustomProductModal';
import CustomToast from 'src/common/CustomToast';

interface CommonCustomizationProps {
	customize_id: string;
	product_details: any;
	grouping_identifier: string;
	get_and_initialize_cart: () => void;
	show_customization_drawer: boolean;
	set_show_customization_drawer: React.Dispatch<React.SetStateAction<boolean>>;
	page_name?: string;
	section_name?: string;
}
const CommonCustomizationComponent: React.FC<CommonCustomizationProps> = ({
	customize_id,
	product_details,
	grouping_identifier,
	get_and_initialize_cart,
	show_customization_drawer,
	set_show_customization_drawer,
	page_name = '',
	section_name = '',
}) => {
	const [show_discard_modal, set_show_discard_modal] = useState<boolean>(false);
	const [open_customization_toast, set_open_customization_toast] = useState<boolean>(false);

	const custom_base_price = product_details?.pricing?.price || 0;
	return (
		<>
			{show_customization_drawer && (
				<CustomProductDrawer
					show_customise={show_customization_drawer}
					set_show_customise={set_show_customization_drawer}
					set_show_modal={set_show_discard_modal}
					product_id={customize_id}
					default_sku_id={product_details?.sku_id}
					handle_get_cart_details={get_and_initialize_cart}
					open={open_customization_toast}
					set_open={set_open_customization_toast}
					base_price={custom_base_price}
					currency={product_details?.pricing?.currency}
					page_name={page_name}
					section_name={section_name}
					product_data={product_details}
				/>
			)}
			{open_customization_toast && (
				<CustomToast
					open={open_customization_toast}
					showCross={false}
					is_custom={false}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					autoHideDuration={5000}
					onClose={() => set_open_customization_toast(false)}
					state={'success'}
					title='All Done'
					subtitle='Customised Product added to cart'
					showActions={false}
				/>
			)}
			{show_discard_modal && (
				<CustomProductModal
					show_modal={show_discard_modal}
					set_show_modal={set_show_discard_modal}
					set_show_customise={set_show_customization_drawer}
				/>
			)}
		</>
	);
};

export default CommonCustomizationComponent;
