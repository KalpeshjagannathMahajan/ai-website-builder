import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import { useEffect, useState } from 'react';
import AddEditLabelDrawer from './AddEditLabelDrawer';
import { labels_module_config } from './mock';
import settings from 'src/utils/api_requests/setting';
import { useTranslation } from 'react-i18next';

const Labels = () => {
	const { t } = useTranslation();
	const [label_drawer, set_label_drawer] = useState<boolean>(false);
	const [pre_data, set_pre_data] = useState({});
	const [row_data, set_row_data] = useState([]);
	const [refetch_data, set_refetch_data] = useState<boolean>(false);

	const actions = [
		{
			name: 'Edit',
			action: 'edit',
			icon: 'IconEdit',
			key: 'edit',
		},
	];

	const handle_edit = (params: any) => {
		set_pre_data(params?.node?.data);
		set_label_drawer(true);
	};
	const columnDef = [...labels_module_config, utils.create_action_config(actions, handle_edit, 'Actions')];
	useEffect(() => {
		settings
			.get_labels()
			.then((res: any) => {
				set_row_data(res?.data);
			})
			.catch((err: any) => {
				console.error(err);
			});
	}, [refetch_data]);

	return (
		<>
			<Grid className={classes.content}>
				<Grid className={classes.content_header}>
					<CustomText type='H2'>{t('Settings.Label.header')}</CustomText>
				</Grid>

				<Grid container py={2} gap={2}>
					<Grid container direction={'column'}>
						<CustomText type='H6'>{t('Settings.Label.template')}</CustomText>
						<CustomText type='Body' color='#00000099'>
							{t('Settings.Label.select')}
						</CustomText>
					</Grid>
					<Grid width={'100%'}>
						<AgGridTableContainer
							columnDefs={columnDef}
							hideManageColumn
							rowData={row_data}
							containerStyle={{ width: '100%' }}
							showStatusBar={false}
						/>
					</Grid>
					<Box>
						<Button onClick={() => set_label_drawer(true)} variant='text'>
							{t('Settings.Label.add')}
						</Button>
					</Box>
				</Grid>
			</Grid>
			{label_drawer && (
				<AddEditLabelDrawer
					open={label_drawer}
					set_open={set_label_drawer}
					pre_data={pre_data}
					set_pre_data={set_pre_data}
					set_refetch_data={set_refetch_data}
				/>
			)}
		</>
	);
};

export default Labels;
