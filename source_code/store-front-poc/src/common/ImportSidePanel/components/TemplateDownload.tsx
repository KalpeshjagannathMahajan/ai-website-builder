import { useState } from 'react';
import { makeStyles } from '@mui/styles';

import { Typography, Button, Icon } from 'src/common/@the-source/atoms';
import { SelectedTemplate, Entity } from 'src/@types/manage_data';
import ManageDataApis from 'src/utils/api_requests/manageData';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	template_container: {
		justifyContent: 'space-between',
		padding: '16px',
		borderRadius: '12px',
		background: '#F7F8FA',
		display: 'flex',
	},
	left_section: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		maxWidth: '255px',
	},
	right_section: {
		display: 'flex',
		alignItems: 'center',
	},
	icon_text_box: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
	},
}));

interface Props {
	selected_template: SelectedTemplate | null;
	blocked: boolean;
	entity: Entity;
	sub_entity: any;
}

const TemplateDownload = ({ entity, selected_template, blocked, sub_entity }: Props) => {
	const classes = useStyles();
	const is_disabled = !selected_template || blocked;
	const manage_array = ['collections', 'categories'];
	const [loading, set_loading] = useState(false);

	const handle_template = async () => {
		try {
			set_loading(true);
			const response: any = manage_array.includes(entity)
				? await ManageDataApis.get_template(entity)
				: await ManageDataApis.get_template(entity, sub_entity?.value);

			// Create a Blob URL from the fetched blob
			const blob_url = response?.data?.template_url;

			// Create a temporary link element
			const temp_link = document.createElement('a');
			temp_link.href = blob_url;

			// Trigger a click event to download the file
			temp_link.dispatchEvent(new MouseEvent('click'));

			// Clean up by revoking the Blob URL
			URL.revokeObjectURL(blob_url);
		} catch (error) {
			console.error(t('ManageData.TemplateDownload.ErrorFetching'), error);
		} finally {
			set_loading(false);
		}
	};

	return (
		<div className={classes.template_container} style={{ opacity: is_disabled ? 0.5 : 1, pointerEvents: is_disabled ? 'none' : 'auto' }}>
			<div className={classes.left_section}>
				<div className={classes.icon_text_box}>
					<Icon iconName='IconFileSpreadsheet' style={{ transform: 'scale(1.1)' }} color='#16885F' />
					<Typography sx={{ fontSize: '14px', fontWeight: 700 }} variant='subtitle2'>
						{t('ManageData.TemplateDownload.TemplateExcel')}
					</Typography>
				</div>
				<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2'>
					{t('ManageData.TemplateDownload.Download', { entity })}
				</Typography>
			</div>
			<div className={classes.right_section}>
				<Button loading={loading} loaderSize={'16px'} color='primary' variant='outlined' onClick={handle_template}>
					{t('ManageData.Main.Download')}
				</Button>
			</div>
		</div>
	);
};

export default TemplateDownload;
