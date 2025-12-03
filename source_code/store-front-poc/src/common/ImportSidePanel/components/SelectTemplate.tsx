import { makeStyles } from '@mui/styles';

import { SingleSelect, Typography } from 'src/common/@the-source/atoms';
import { SelectedTemplate, SubEntity, Entity } from 'src/@types/manage_data';
import TemplateDownload from './TemplateDownload';
import { t } from 'i18next';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
	},
	task_box: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		borderRadius: '74px',
		padding: '7px 10px',
		width: 'fit-content',
		background: 'linear-gradient(240deg, #E8F0FC 0%, rgba(201, 228, 223, 0.48) 100%)',
	},
}));

export interface SingleSelectOptions {
	label: string;
	value: SubEntity;
}

interface Props {
	selected_template: SelectedTemplate | null;
	blocked: boolean;
	entity: Entity;
	sub_entities?: any[];
	sub_entity: any;
	set_sub_entity: any;
	csv_ready?: boolean;
}

const SelectTemplate = ({ entity, selected_template, blocked, sub_entities, sub_entity, set_sub_entity, csv_ready }: Props) => {
	const classes = useStyles();

	const templates = _.filter(sub_entities, (curr) => curr?.can_import) ?? [];
	const is_multi = templates.length > 1;

	const handle_template_change = (data: SingleSelectOptions) => {
		const option = templates.find((item) => data.value === item.value);
		if (option) set_sub_entity(option);
	};

	const single_select_options: SingleSelectOptions[] = templates.map((temp) => ({
		label: temp?.label,
		value: temp?.value || temp?.dynamic_col,
	}));

	return (
		<div className={classes.container} style={blocked ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
			<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2' color='#171717'>
				{is_multi ? t('ManageData.SelectTemplate.MultipleInfo') : t('ManageData.SelectTemplate.DownloadOrImport')}
			</Typography>

			{is_multi && (
				<SingleSelect
					label={t('ManageData.SelectTemplate.SelectOption')}
					handleChange={handle_template_change}
					options={single_select_options}
					disabled={!csv_ready}
					value={single_select_options[0]}
					defaultValue={single_select_options[0]?.value}
				/>
			)}
			<TemplateDownload entity={entity} selected_template={selected_template} blocked={blocked} sub_entity={sub_entity} />
		</div>
	);
};

export default SelectTemplate;
