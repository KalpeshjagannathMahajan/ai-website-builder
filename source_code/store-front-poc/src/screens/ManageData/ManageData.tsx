import { useContext, useState } from 'react';
import { AgGridTableContainer } from 'src/common/@the-source/molecules/Table/table';
import { Grid, Button, Icon } from 'src/common/@the-source/atoms';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import { ManageDataItem } from 'src/@types/manage_data';
import DataCard from './components/DataCard';
import ExportModal from './components/ExportModal';
import ManageDataContext from './context';
import useManageData from './useManageData';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import TableSkeleton from 'src/common/TableSkeleton';
import CustomToast from 'src/common/CustomToast';
import CustomText from 'src/common/@the-source/CustomText';
import ImportExportSkeleton from './Skeleton';
import ExportDrawer from './components/ExportDrawer';
import _ from 'lodash';

const ManageDataComp = () => {
	const classes = useStyles();
	const { t } = useTranslation();
	const {
		selected_data_card,
		show_import_drawer,
		toggle_import_drawer,
		set_selected_data_card,
		show_export_modal,
		handle_close_export_modal,
		handle_export_button,
		handle_import_button,
		data_cards,
		task_history,
		show_toast,
		set_show_toast,
	} = useContext(ManageDataContext);
	const [row_count, set_row_count] = useState<null | number>(null);
	const [export_drawer, set_export_drawer] = useState<boolean>(false);
	const [import_toast, set_import_toast] = useState(false);

	function get_rows(total_rows: number) {
		set_row_count(total_rows);
	}

	const visible_data_cards = _.filter(data_cards, (curr) => !curr?.disabled);

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_toast}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				container_style={{
					padding: '4px 8px',
					gap: '10px',
				}}
				text_container_style={{
					gap: '0px',
				}}
				show_icon={true}
				autoHideDuration={3000}
				onClose={() => set_show_toast(false)}
				state='success'
				title={t('ManageData.ExportToast.Title')}
				subtitle={t('ManageData.ExportToast.Sub')}
				showActions={false}
			/>
		);
	};

	if (!visible_data_cards || task_history.loading) return <ImportExportSkeleton />;

	return (
		<div className={classes.page_container}>
			<div
				className={classes.page_container_section}
				style={{
					margin: '8px 0px',
				}}>
				<CustomText type='H2'>{t('ManageData.Main.ManageData')}</CustomText>
				<div className={classes.data_cards_container}>
					<Grid container className={classes.data_cards_row}>
						{visible_data_cards?.map((data_card: ManageDataItem) => {
							return (
								<DataCard
									key={data_card.value}
									item={data_card}
									selected={data_card.value === selected_data_card?.value}
									set_selected_data_card={set_selected_data_card}
								/>
							);
						})}
					</Grid>
					<CustomText style={{ textAlign: 'center' }} type='Title'>
						{t('ManageData.Main.SelectModule')}
					</CustomText>
					<div className={classes.button_container}>
						<Button
							disabled={!selected_data_card?.can_import}
							onClick={handle_import_button}
							sx={{ width: '172px', height: '48px' }}
							color='primary'>
							{t('ManageData.Main.Import')}
						</Button>
						<Button
							disabled={!selected_data_card?.can_export}
							onClick={() => {
								selected_data_card?.value === 'documents' || selected_data_card?.value === 'products'
									? set_export_drawer(true)
									: handle_export_button();
							}}
							sx={{ width: '172px', height: '48px' }}
							variant='outlined'
							color='primary'>
							{t('ManageData.Main.Export')}
						</Button>
					</div>
				</div>
			</div>

			{task_history?.data?.rows?.length > 0 ? (
				<div className={classes.page_container_section}>
					<CustomText type='H2'>History</CustomText>
					{!task_history.loading ? (
						<div style={{ position: 'relative' }}>
							<AgGridTableContainer
								get_total_rows={get_rows}
								customRowName='Total History'
								showSWHeader={false}
								columnDefs={task_history.data.columns}
								rowData={task_history.data.rows}
								containerStyle={{ height: 'calc(100vh - 120px)' }}
							/>
							{row_count === 0 && <EmptyTableComponent top={'120px'} height={'calc(100vh - 300px)'} />}
						</div>
					) : (
						<TableSkeleton />
					)}
				</div>
			) : (
				<div className={classes.page_container_section2}>
					<Icon iconName='IconCircleFilled' className={classes.icon_circle}></Icon>
					<p className={classes.text1}>Your import history will be shown here</p>
					<p className={classes.text2}>Start importing data now!</p>
				</div>
			)}

			<ExportModal selected_value={selected_data_card?.label} show_modal={show_export_modal} handle_close={handle_close_export_modal} />
			{show_import_drawer && (
				<ImportSidePanel
					entity={selected_data_card.value}
					sub_entities={selected_data_card?.sub_entities}
					show_drawer={show_import_drawer}
					toggle_drawer={toggle_import_drawer}
					set_show_toast={set_import_toast}
				/>
			)}
			{handle_render_toast()}
			<ExportDrawer is_visible={export_drawer} close={() => set_export_drawer(false)} />
			<CustomToast
				open={import_toast}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				container_style={{
					padding: '4px 8px',
					gap: '10px',
				}}
				text_container_style={{
					gap: '0px',
				}}
				show_icon={true}
				autoHideDuration={3000}
				onClose={() => set_import_toast(false)}
				state='success'
				title={t('ManageData.ImportToast.Title')}
				subtitle={t('ManageData.ImportToast.Sub')}
				showActions={false}
			/>
		</div>
	);
};

const ManageData = () => {
	const value = useManageData();
	return (
		<ManageDataContext.Provider value={value}>
			<ManageDataComp />
		</ManageDataContext.Provider>
	);
};

export default ManageData;
