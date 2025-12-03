import { Avatar, Box, Button, Grid, Image, Menu, Typography } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import BottomSheet from './BottomDrawer';
import CatalogManagementContext from '../context';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { commonStyle } from '../mock/constant';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import ImageLinks from 'src/assets/images/ImageLinks';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import { Entity } from 'src/@types/manage_data';
import api_requests from 'src/utils/api_requests';
import { useDispatch } from 'react-redux';
import { set_notification_feedback } from 'src/actions/notifications';
import LabelTableSkeleton from 'src/screens/LabelManagement/LabelsGrid/LabelTableSkeleton';
import ConfirmationModal from 'src/common/@the-source/molecules/ConfirmationModal/ConfirmationModal';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
const CatalogTable = () => {
	const { t } = useTranslation();
	const [export_modal, set_export_modal] = useState<boolean>(false);
	const [import_modal, set_import_modal] = useState<boolean>(false);
	const [start_import, set_start_import] = useState<boolean>(false);
	const _permissions = useSelector((state: any) => state.login.permissions);

	const {
		is_loading,
		columns_defs,
		row_data,
		open_sheet,
		handle_close_sheet,
		selected_catalog,
		selected_catalog_id,
		set_selected_catalog_id,
		transformColumns,
		get_all_catalog_table,
		handle_create_catalog,
		catalog_action,
		show_delete_confirm,
		deleting,
		handle_delete_confirm,
		set_show_delete_confirm,
		handle_delete,
	} = useContext(CatalogManagementContext);
	const dispatch = useDispatch();

	const actions = [];

	if (
		_.find(
			_permissions,
			(permission) =>
				permission.slug === PERMISSIONS.edit_catalog.slug && permission.permissionType === PERMISSIONS.edit_catalog.permissionType,
		)?.toggle
	) {
		actions.push({
			name: 'Edit',
			action: 'edit',
			icon: 'IconEdit',
			key: 'edit',
		});
	}
	if (
		_.find(
			_permissions,
			(permission) =>
				permission.slug === PERMISSIONS.delete_catalog.slug && permission.permissionType === PERMISSIONS.delete_catalog.permissionType,
		)?.toggle
	) {
		actions.push({
			name: 'Menu',
			action: 'menu',
			icon: 'IconDotsVertical',
			key: 'menu',
			vals: [
				{ label: 'Import Catalog', value: 'import' },
				{ label: 'Export Catalog', value: 'export' },
				{ label: 'Delete Catalog', value: 'delete' },
			],
		});
	}

	useEffect(() => {
		get_all_catalog_table();
	}, []);

	const columnDefs = [...transformColumns(columns_defs, actions)];

	const menu_options = [
		{ value: 'import', label: 'Import Catalog' },
		{ value: 'export', label: 'Export Catalog' },
	];

	const handle_click = (event: string) => {
		if (event === 'Import Catalog') {
			set_import_modal(true);
		} else {
			set_export_modal(true);
		}
	};

	const handle_import_flow = (catalog_id: string) => {
		set_selected_catalog_id(catalog_id);
		set_start_import(true);
		set_import_modal(false);
	};

	const handle_export_flow = async (catalog_id: string) => {
		try {
			await api_requests.manage_data.export_module(Entity.Catalog, [catalog_id as string]);
			dispatch(set_notification_feedback(true));
		} catch (error) {
			console.log(error);
		}
		set_export_modal(false);
	};

	useEffect(() => {
		switch (catalog_action.action) {
			case 'import':
				set_start_import(true);
				break;
			case 'export':
				handle_export_flow(catalog_action.id);
				break;
			case 'delete':
				handle_delete(catalog_action.id);
		}
	}, [catalog_action]);

	return (
		<Box padding={'2rem 1rem'}>
			<ImportSidePanel
				entity={Entity.Catalog}
				show_drawer={start_import}
				entity_ids={[selected_catalog_id as string]}
				toggle_drawer={() => {
					set_start_import((prev) => !prev);
				}}
			/>
			{!is_loading ? (
				<AgGridTableContainer
					has_serials={false}
					columnDefs={columnDefs}
					rowData={row_data}
					customRowName={'Total Rows'}
					containerStyle={{ height: 'calc(100vh - 15rem)' }}
					showSWHeader
					suppressFieldDotNotation={true}
					title={<Typography sx={{ fontSize: '18px', fontWeight: 700, mt: 1 }}>{t('CatalogManager.Header.Title')} </Typography>}
					primaryBtn={
						<Can I={PERMISSIONS.create_catalog.slug} a={PERMISSIONS.create_catalog.permissionType}>
							<Avatar
								style={commonStyle}
								isImageAvatar={false}
								content={
									<Menu
										LabelComponent={<Image style={{ cursor: 'pointer' }} src={ImageLinks.icon_import_export} width='25px' height='25px' />}
										menu={menu_options}
										onClickMenuItem={(e: any) => handle_click(e)}
										closeOnItemClick={true}
									/>
								}
								size='large'
								variant='circular'
							/>
						</Can>
					}
					secondaryBtn={
						<Grid>
							<Can I={PERMISSIONS.create_catalog.slug} a={PERMISSIONS.create_catalog.permissionType}>
								<Button onClick={handle_create_catalog}>{t('CatalogManager.Header.AddCatalog')}</Button>
							</Can>
						</Grid>
					}
				/>
			) : (
				<LabelTableSkeleton />
			)}
			<BottomSheet open_drawer={open_sheet} on_close={handle_close_sheet} catalog_id={selected_catalog_id} title={selected_catalog} />
			<ExportModal open={export_modal} handle_close={() => set_export_modal(false)} handle_confirm={handle_export_flow} />
			<ImportModal open={import_modal} handle_close={() => set_import_modal(false)} handle_confirm={handle_import_flow} />
			<ConfirmationModal
				title={`Delete catalog "${selected_catalog}"`}
				show={show_delete_confirm}
				primary_button={
					<Button loading={deleting} onClick={handle_delete_confirm}>
						Delete
					</Button>
				}
				secondary_button={
					<Button variant='outlined' color='secondary' onClick={() => set_show_delete_confirm(false)}>
						Cancel
					</Button>
				}
				content='This will permanently delete catalog.'
				set_show={set_show_delete_confirm}
			/>
		</Box>
	);
};

export default CatalogTable;
