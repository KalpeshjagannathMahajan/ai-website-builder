import { useContext, useState } from 'react';
import { Button, Grid, Modal, SingleSelect } from 'src/common/@the-source/atoms';
import CatalogManagementContext from '../context';
import { useTranslation } from 'react-i18next';
import { import_export_props } from '../mock/constant';
import '../styles.css';
import { SingleSelectOptions } from 'src/common/ImportSidePanel/components/SelectTemplate';

const ImportModal = ({ open, handle_close, handle_confirm }: import_export_props) => {
	const { catalog_options } = useContext(CatalogManagementContext);
	const [catalog_id, set_catalog_id] = useState<string>('');
	const { t } = useTranslation();

	const handle_selection_change = (data: SingleSelectOptions) => {
		const option = catalog_options.find((item: any) => data.value === item.value);
		if (option) set_catalog_id(option.value);
	};

	return (
		<Grid>
			<Modal
				open={open}
				onClose={handle_close}
				title={t('CatalogManager.Modal.Import.Heading')}
				footer={
					<Grid container justifyContent='end'>
						<Button variant='outlined' onClick={handle_close} sx={{ marginRight: '1rem' }}>
							{t('CatalogManager.Modal.Button.Cancel')}
						</Button>
						<Button onClick={() => handle_confirm(catalog_id)}>{t('CatalogManager.Modal.Button.Confirm')}</Button>
					</Grid>
				}
				children={
					<Grid bgcolor={'#FFFFFF'} sx={{ borderRadius: '8px', height: '5.5rem' }}>
						<SingleSelect label={'Select Catalog'} options={catalog_options} handleChange={handle_selection_change} />
					</Grid>
				}
			/>
		</Grid>
	);
};

export default ImportModal;
