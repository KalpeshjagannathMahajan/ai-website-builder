import { t } from 'i18next';
import { ExitCatalogModalProps } from 'src/@types/presentation';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import useCatalogActions from 'src/hooks/useCatalogActions';

const ExitCatalogModal: React.FC<ExitCatalogModalProps> = ({ show_modal, set_show_modal }) => {
	const { handle_reset_catalog_mode } = useCatalogActions();

	const handle_exit_catalog = () => {
		handle_reset_catalog_mode();
		set_show_modal(false);
	};

	const render_modal_body = (
		<Grid py={1}>
			<CustomText type='Body'>{t('Presentation.ExitCatalog.Body')}</CustomText>
		</Grid>
	);

	const render_footer = (
		<Grid container justifyContent='flex-end' gap={1.5}>
			<Grid item>
				<Button onClick={() => set_show_modal(false)} variant='outlined'>
					{t('Presentation.ExitCatalog.Cancel')}
				</Button>
			</Grid>
			<Grid item>
				<Button onClick={handle_exit_catalog} variant='contained'>
					{t('Presentation.ExitCatalog.Exit')}
				</Button>
			</Grid>
		</Grid>
	);
	return (
		<Modal
			open={show_modal}
			width={460}
			onClose={() => set_show_modal(false)}
			title='Exit catalog creation'
			children={render_modal_body}
			footer={render_footer}
		/>
	);
};

export default ExitCatalogModal;
