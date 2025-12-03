import { Button, Grid, Modal, Typography } from 'src/common/@the-source/atoms';

interface ICartItemProps {
	open: boolean;
	set_open: React.Dispatch<React.SetStateAction<boolean>>;
	handle_review_cart: any;
	is_discount_campaign_issue?: boolean;
}

const CartItemModal = ({ open, set_open, handle_review_cart, is_discount_campaign_issue = false }: ICartItemProps) => {
	return (
		<Modal
			open={open}
			onClose={() => {
				set_open(false);
			}}
			title={is_discount_campaign_issue ? 'Discounts on your cart have changed' : 'Some items in your cart are unavailable'}
			children={
				<Typography variant='body2'>
					{is_discount_campaign_issue
						? 'The discounts applied to your cart have been updated. Please review your cart before proceeding.'
						: 'Requested quantity of some items is not available in your cart. Please adjust the quantity and try again or proceed with available cart items'}
				</Typography>
			}
			footer={
				<Grid container justifyContent='flex-end' spacing={2}>
					<Grid item>
						<Button onClick={handle_review_cart} variant='contained'>
							Review cart
						</Button>
					</Grid>
				</Grid>
			}
		/>
	);
};

export default CartItemModal;
