import { useState } from 'react';
import { makeStyles } from '@mui/styles';

import { Typography, Button } from 'src/common/@the-source/atoms';
import { ImportOptions } from 'src/@types/manage_data';
import ActionCard from './ActionCard';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	container: {
		justifyContent: 'space-between',
		padding: '16px',
		borderRadius: '12px',
		background: '#F7F8FA',
		display: 'flex',
		gap: '16px',
		flexDirection: 'column',
	},
	button_section: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
}));

interface Props {
	update_import_options: (option: ImportOptions) => void;
	confirm_load: boolean;
	entity?: any;
}

const ReviewAndSync = ({ update_import_options, confirm_load, entity }: Props) => {
	const classes = useStyles();
	const action_data = [
		{
			title: t('ManageData.ReviewAndSync.AddOnly'),
			value: ImportOptions.Add,
			image: 'add_import',
		},
		{
			title: t('ManageData.ReviewAndSync.Add&Update'),
			value: ImportOptions.AddAndUpdate,
			image: 'add_and_update_import',
		},
		{
			title: t('ManageData.ReviewAndSync.UpdateOnly'),
			value: ImportOptions.Update,
			image: 'update_import',
		},
	];

	if (entity === 'products') {
		//remove update_import option
		action_data.splice(2, 1);
	}

	const [selected_action, set_selected_action] = useState(action_data[1]);

	return (
		<>
			<div className={classes.container}>
				<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2' color='rgba(0, 0, 0, 0.60)'>
					{t('ManageData.ReviewAndSync.HandleDuplicates')}
				</Typography>

				<div style={{ display: 'flex', gap: '12px' }}>
					{action_data.map((item) => {
						return (
							<ActionCard
								key={item.value}
								set_selected_action={set_selected_action}
								item={item}
								selected={item.value === selected_action.value}
							/>
						);
					})}
				</div>

				<div className={classes.button_section}>
					<Button color='primary' loading={confirm_load} loaderSize={'16px'} onClick={() => update_import_options(selected_action.value)}>
						{t('ManageData.Main.Confirm')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default ReviewAndSync;
