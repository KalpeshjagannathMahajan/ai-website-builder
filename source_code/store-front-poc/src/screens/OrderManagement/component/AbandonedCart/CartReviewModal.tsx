import { useTranslation } from 'react-i18next';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

const CartReviewModal = ({ open_modal, close_modal, handle_add_to_proceed }: any) => {
	const { t } = useTranslation();
	return (
		<Modal
			open={open_modal}
			onClose={() => {
				close_modal(false);
			}}
			title={'Replace Cart?'}
			children={
				<Grid>
					<CustomText type='Body'>{t('OrderManagement.AbandonedCart.ModalTitle')}</CustomText>
				</Grid>
			}
			footer={
				<Grid container justifyContent='end' gap={2}>
					<Button
						variant='outlined'
						onClick={() => {
							close_modal(false);
						}}>
						{t('OrderManagement.AbandonedCart.ModalBackButton')}
					</Button>
					<Button variant='contained' color='primary' onClick={() => handle_add_to_proceed()}>
						{t('OrderManagement.AbandonedCart.ModalProceed')}
					</Button>
				</Grid>
			}
		/>
	);
};
export default CartReviewModal;
