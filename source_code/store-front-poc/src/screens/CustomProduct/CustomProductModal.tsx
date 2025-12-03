import CustomText from '../../common/@the-source/CustomText';
import { Button, Grid, Modal } from '../../common/@the-source/atoms';
import { t } from 'i18next';

interface ModelProps {
	show_modal: boolean;
	set_show_modal: any;
	set_show_customise: any;
}

const CustomProductModal = ({ show_modal, set_show_modal, set_show_customise }: ModelProps) => {
	return (
		<Modal
			width={450}
			open={show_modal}
			onClose={() => {
				set_show_modal(false);
			}}
			title={t('CustomProduct.Modal.Title')}
			footer={
				<Grid container justifyContent='end'>
					<Button
						variant='outlined'
						sx={{ marginRight: '1rem' }}
						onClick={() => {
							set_show_modal(false);
						}}>
						{t('CustomProduct.Modal.Cancel')}
					</Button>
					<Button
						onClick={() => {
							set_show_customise(false);
							set_show_modal(false);
						}}>
						{t('CustomProduct.Modal.Discard')}
					</Button>
				</Grid>
			}
			children={<CustomText type='Body'>{t('CustomProduct.Modal.Text')}</CustomText>}
		/>
	);
};

export default CustomProductModal;
