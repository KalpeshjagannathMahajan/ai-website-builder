import { useContext, useEffect, useState } from 'react';
import { Button, Grid, Modal, SingleSelect, Typography } from 'src/common/@the-source/atoms';
import CatalogManagementContext from '../context';
import { useTranslation } from 'react-i18next';
import { import_export_props } from '../mock/constant';
import '../styles.css';
import { SingleSelectOptions } from 'src/common/ImportSidePanel/components/SelectTemplate';

const ExportModal = ({ open, handle_close, handle_confirm }: import_export_props) => {
	const { catalog_options } = useContext(CatalogManagementContext);
	const [catalog_id, set_catalog_id] = useState<string>('');
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const { t } = useTranslation();

	const handle_selection_change = (data: SingleSelectOptions) => {
		const option = catalog_options.find((item: any) => data.value === item.value);
		if (option) set_catalog_id(option.value);
	};

	const on_confirm_click = () => {
		set_btn_loading(true);
		handle_confirm(catalog_id);
	};

	useEffect(() => {
		set_btn_loading(false);
	}, [open]);

	return (
		<Grid>
			<Modal
				open={open}
				onClose={handle_close}
				title={t('CatalogManager.Modal.Export.Heading')}
				footer={
					<Grid container justifyContent='end'>
						<Button variant='outlined' onClick={handle_close} sx={{ marginRight: '1rem' }}>
							{t('CatalogManager.Modal.Button.Cancel')}
						</Button>
						<Button loading={btn_loading} onClick={on_confirm_click}>
							{t('CatalogManager.Modal.Button.Confirm')}
						</Button>
					</Grid>
				}
				children={
					<>
						<Typography variant='body' color='rgba(0, 0, 0, 0.60)'>
							{t('CatalogManager.Modal.Export.SubHeading')}
						</Typography>
						<Grid bgcolor={'#FFFFFF'} sx={{ borderRadius: '8px', height: '5.5rem', marginTop: '1rem' }}>
							<SingleSelect label={'Select Pricelist'} options={catalog_options} handleChange={handle_selection_change} />
						</Grid>
					</>
				}
			/>
		</Grid>
	);
};

export default ExportModal;
