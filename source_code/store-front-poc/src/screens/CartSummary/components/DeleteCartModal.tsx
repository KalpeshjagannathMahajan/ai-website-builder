import { useContext } from 'react';

import { Button } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogTitle, DialogBody, DialogSeperator, DialogFooter } from 'src/common/CustomDialog';
import CartSummaryContext from '../context';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const DeleteCartModal = ({ show_modal, toggle_modal }: any) => {
	const { handle_discard_cart } = useContext(CartSummaryContext);
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const { t } = useTranslation();
	// TODO: change the types!
	return (
		<CustomDialog show_modal={show_modal} handle_close={() => toggle_modal(false)} style={{ width: '420px', ...theme?.modal_ }}>
			<DialogContainer>
				<DialogTitle value={t('CartSummary.DeleteCartModal.Discarditems')} show_close={true} handle_close={() => toggle_modal(false)} />
				<DialogSeperator />
				<DialogBody value={t('CartSummary.DeleteCartModal.RemoveAllItems')} />
				<DialogSeperator />
				<DialogFooter>
					<Button onClick={() => toggle_modal(false)} variant='outlined' color='secondary'>
						{is_small_screen ? t('CartSummary.DeleteCartModal.is_Small_Back') : t('CartSummary.DeleteCartModal.Back')}
					</Button>
					<Button
						color='error'
						onClick={async () => {
							await handle_discard_cart();
							toggle_modal(false);
						}}>
						{is_small_screen ? t('CartSummary.DeleteCartModal.is_Small_Discard') : t('CartSummary.DeleteCartModal.Discard')}
					</Button>
				</DialogFooter>
			</DialogContainer>
		</CustomDialog>
	);
};

export default DeleteCartModal;
