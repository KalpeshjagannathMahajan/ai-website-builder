/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import CartSummaryContext from '../context';
import ProductCard from './ProductCard';
import _ from 'lodash';
import utils from 'src/utils/utils';
import { Divider } from '@mui/material';
import { Grid, Button, Icon } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import AccordionProductListing from 'src/common/AccordionProductListing';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import VirtualList from 'src/common/VirtualList';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		paddingTop: '8px',
		gap: '8px',
	},

	close_error: { marginRight: '8px', cursor: 'pointer' },

	product_card: {
		padding: '1.5rem 1rem',
		margin: '1rem 0',
		background: 'white',
	},
}));

interface Props {
	products: any;
	items: any;
	items_with_unit_prices: any;
	errors?: any;
	show_grouping_data: boolean;
	show_errors_only_product?: boolean;
}

const ProductList = ({ products, items, items_with_unit_prices, errors, show_grouping_data, show_errors_only_product }: Props) => {
	const [expanded, set_expanded] = useState<string[]>([]);
	const settings = useSelector((state: any) => state?.settings);
	const {
		handle_delete_entity,
		handle_change_quantity,
		toggle_global_error,
		set_open_custom_product,
		cart_group_data,
		toggle_button_value,
		cart_metadata,
		customer_metadata,
		show_only_price_updated,
		edit_product_price_change,
	} = useContext(CartSummaryContext);
	const classes = useStyles();
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const handle_render_product_card = (product_index: any, index: number) => {
		const product_line_item = items[product_index];
		const product = products[product_index];
		const is_discount_applied = _.size(product_line_item) > 1;

		if (!product_line_item) return null;

		return (
			<div key={product_index}>
				{Object.entries(product_line_item)?.map(([key]) => {
					if (_.isObject(product_line_item?.[key])) {
						const product_items = product_line_item[key];
						const cart_item_id = key;
						const error = _.head(errors?.[product_index]);

						return (
							<Grid
								key={cart_item_id}
								width={'100%'}
								className={show_grouping_data ? classes.product_card : ''}
								sx={{ borderRadius: is_ultron ? '1rem' : '0rem' }}>
								<ProductCard
									item={product_items}
									cart_item_id={cart_item_id}
									product={product}
									product_line_item={product_line_item}
									unit_price={items_with_unit_prices?.[cart_item_id]}
									unit_volume={products?.[product_index]?.volume_data}
									handle_delete_entity={handle_delete_entity}
									handle_change_quantity={handle_change_quantity}
									toggle_global_error={toggle_global_error}
									custom_id={product_index}
									cart_error={error}
									is_discount_applied={is_discount_applied}
								/>
								{index !== Object?.values(products)?.length - 1 && !show_grouping_data && <Divider sx={{ my: '8px' }} />}
							</Grid>
						);
					}
				})}
			</div>
		);
	};

	const handle_product_card = (products_array: any) => {
		const sorted_products = utils.sort_according_to_customise(products_array, items);
		const product_count = sorted_products?.length;
		const filtered_products = show_errors_only_product
			? _.filter(sorted_products, (item) => errors && errors[item])
			: show_only_price_updated
			? edit_product_price_change
			: sorted_products;

		return (
			<VirtualList
				list_style={{ overflowY: 'auto', height: product_count > 3 ? 600 : 'auto' }}
				render_item={handle_render_product_card}
				data={filtered_products}
				item_height={30}
				item_key={(item: any) => item}
			/>
		);
	};

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded(newExpanded ? [...expanded, panel] : _.remove(expanded, (_panel) => _panel !== panel));
	};

	const handle_custom_line_clicked = () => {
		set_open_custom_product(true);
		Mixpanel.track(Events.ADD_CUSTOM_LINE_CLICKED, {
			tab_name: 'Home',
			page_name: 'cart_page',
			section_name: 'custom_line_item_side_&_bottom_sheet',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
		});
	};

	return (
		<div className={classes.container}>
			{show_grouping_data ? (
				<AccordionProductListing
					cart_group_data={cart_group_data}
					handle_product_card={handle_product_card}
					expanded={expanded}
					handleChange={handleChange}
					toggle_button_value={toggle_button_value}
					set_expanded={set_expanded}
					show_errors_only_product={show_errors_only_product}
					errors={errors}
				/>
			) : (
				handle_product_card(products)
			)}

			{settings?.enable_custom_line_item && (
				<>
					<Divider sx={{ my: '8px' }} />
					<Button tonal fullWidth onClick={handle_custom_line_clicked}>
						<Icon iconName='IconPlus' color={theme?.product?.inventory_status?.product_list?.color} />
						<CustomText color={theme?.product?.inventory_status?.product_list?.color}> Custom line item</CustomText>
					</Button>
				</>
			)}
		</div>
	);
};

export default ProductList;
