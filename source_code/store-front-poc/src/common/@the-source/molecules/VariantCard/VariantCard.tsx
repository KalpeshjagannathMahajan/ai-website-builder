import { Box, Divider, Grid } from '@mui/material';

import Counter from '../../atoms/Counter/Counter';
import Image from '../../atoms/Image';
import Typography from '../../atoms/Typography/Typography';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity } from 'src/screens/ProductListing/utils';
import { INVENTORY_STATUS } from '../Inventory/constants';

export interface VariantCardProps {
	data?: any;
	height?: string | number;
	width?: string | number;
	background?: string;
	handleIncrement?: () => void;
	handleDecrement?: () => void;
	handleRemoveFromCart: any;
}

/**
 * We are not using this component anywhere. Will make it deprecated soon.
 */
const VariantCard = ({ data, height, width, background, handleIncrement, handleDecrement, handleRemoveFromCart }: VariantCardProps) => {
	const productImage = `https://res.cloudinary.com/sourcewiz/image/upload/${data?.product_image}`;
	const max_quantity = get_max_quantity(data, data?.inventory?.total_reserved);
	const disable_counter = data?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock;
	return (
		<Box
			flexDirection='column'
			sx={{
				height,
				width,
				background,
				borderRadius: '8px',
			}}>
			<Box sx={{ p: '10px 0.75em' }}>
				<Grid container>
					<Grid item xs={8.8}>
						<Typography variant='body2' sx={{ mb: '4px' }}>
							{data?.heading}
						</Typography>
						<Typography variant='h6'>{data?.sub_heading}</Typography>
					</Grid>
					<Grid item>
						<Image src={productImage} height='48px' width='48px' style={{ borderRadius: '8px' }} />
					</Grid>
				</Grid>
			</Box>
			<Divider sx={{ borderStyle: 'dashed', mx: 2 }} />
			<Box sx={{ p: '0.75em 0.75em 0' }}>
				{data?.attributes &&
					data?.attributes?.map((item: any) => (
						<Grid container marginBottom={1.5}>
							<Grid item margin='0 1px'>
								<Typography variant='body2' color='rgba(0, 0, 0, 0.8)'>
									{item?.key} {' :'}
								</Typography>
							</Grid>
							<Grid item margin='0 3px'>
								<Typography variant='body2' color='rgba(0, 0, 0, 0.8)'>
									{item?.value || '---'}
								</Typography>
							</Grid>
						</Grid>
					))}
			</Box>
			<Box sx={{ paddingBottom: '1em' }}>
				<Counter
					disabled={disable_counter}
					handleIncrement={handleIncrement}
					handleDecrement={handleDecrement}
					product_variant={true}
					handleRemoveFromCart={handleRemoveFromCart}
					min={data?.inventory?.min_order_quantity}
					max={max_quantity}
					product={data}
					product_id={data?.id}
					parent_id={data?.parent_id}
					step={data?.inventory?.incremental_value}
					from_max={from_max_quantity(max_quantity, data?.inventory?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
				/>
			</Box>
		</Box>
	);
};

VariantCard.defaultProps = {
	data: {},
	height: '100%',
	width: '13.125em',
	background: '',
	handleIncrement: () => console.log('++'),
	handleDecrement: () => console.log('--'),
};

export default VariantCard;
