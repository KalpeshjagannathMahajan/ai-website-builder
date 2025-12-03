import { useTranslation } from 'react-i18next';
import { Button } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogTitle, DialogBody, DialogSeperator, DialogFooter } from 'src/common/CustomDialog';

const CartCheckModal = ({ show_modal, handle_close, handle_proceed, cart_check }: any) => {
	const { t } = useTranslation();

	const get_title = () => {
		// TODO: Ultron 1.5
		if (cart_check === 1) return t('CartSummary.CartCheckModal.NotAvailable.Title');
		if (cart_check === 2) return t('CartSummary.CartCheckModal.PartiallyAvailable.Title');
		if (cart_check === 3) return t('CartSummary.CartCheckModal.OutOfStock.Title');
	};

	const get_body = () => {
		if (cart_check === 1) return t('CartSummary.CartCheckModal.NotAvailable.Body');
		if (cart_check === 2) return t('CartSummary.CartCheckModal.PartiallyAvailable.Body');
		if (cart_check === 3) return t('CartSummary.CartCheckModal.OutOfStock.Body');
	};

	return (
		<CustomDialog show_modal={show_modal} handle_close={handle_close} style={{ width: '420px' }}>
			<DialogContainer>
				<DialogTitle value={get_title()} show_close={true} handle_close={handle_close} />
				<DialogSeperator />
				<DialogBody value={get_body()} />
				<DialogSeperator />
				<DialogFooter>
					<Button onClick={handle_close} variant='outlined' color='secondary'>
						{t('CartSummary.CartCheckModal.Back')}
					</Button>
					{cart_check === 1 && (
						<Button color='error' onClick={handle_proceed}>
							{t('CartSummary.CartCheckModal.Discard')}
						</Button>
					)}
				</DialogFooter>
			</DialogContainer>
		</CustomDialog>
	);
};

export default CartCheckModal;
