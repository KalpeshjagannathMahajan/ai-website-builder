import { t } from 'i18next';
import { isEmpty } from 'lodash';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

function RegenerateModal({ open, close, handle_regenerate_catalog_pdf, set_is_refetch, set_in_progress_rows }: any) {
	return (
		<Modal
			open={!isEmpty(open)}
			onClose={close}
			title={'Catalog Generation Failed'}
			footer={
				<Grid container justifyContent='end'>
					<Button variant='outlined' onClick={close} sx={{ marginRight: '1rem' }}>
						{t('CatalogManager.Modal.Button.Cancel')}
					</Button>
					<Button
						onClick={() => {
							handle_regenerate_catalog_pdf(open?.id);
							close();
							set_is_refetch((prev) => prev + 1);
							set_in_progress_rows([{ ...open, pdf_status: 'In Progress' }]);
						}}>
						{t('CatalogManager.Modal.Button.Confirm')}
					</Button>
				</Grid>
			}
			children={
				<CustomText color='rgba(0, 0, 0, 0.60)'>
					There was an issue generating the catalog. Would you like to attempt regeneration?{' '}
				</CustomText>
			}
		/>
	);
}

export default RegenerateModal;
