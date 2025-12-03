import { useCallback, useEffect, useState } from 'react';
import { Box, Icon } from 'src/common/@the-source/atoms';
import { AgGridTableContainer } from 'src/common/@the-source/molecules/Table/table';
import { Container, Modal } from '@mui/material';
import _ from 'lodash';
import driveApis from 'src/utils/api_requests/userDriveApis';
import TableSkeleton from 'src/common/TableSkeleton';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { columns } from '../utils/constants';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: any) => ({
	container: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: '90vh',
		backgroundColor: theme?.user_details?.manage_access_modal?.background1,
	},
	detail: { marginLeft: 'auto', display: 'flex', flexDirection: 'row' },
	select: {
		backgroundColor: theme?.user_details?.manage_access_modal?.background2,
		display: 'flex',
		flexDirection: 'row',
		borderRadius: '10px',
	},
	box_detail: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
}));

export const ManageAcessModal2 = ({
	open_manage_access_modal = false,
	set_open_manage_access_modal = (val: any) => {
		val;
	},
	selected_file_dat_for_updation,
	onSelectionChanged,
	selected_files,
	set_show_loader,
	parent_id,
}: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const [row_data, set_row_data] = useState<any[]>([]);
	const [selected_count, set_selected_count] = useState(0);
	const [selected_ids, set_selected_ids] = useState<any>([]);
	const [grid_api, set_grid_api] = useState<any>();
	const [refresh, set_refresh] = useState<any>(false);

	async function fetch_table_row_data() {
		let user_data: any = await driveApis.get_user_with_file_access(
			selected_file_dat_for_updation?.id ? selected_file_dat_for_updation?.id : selected_files[0]?.id,
		);
		let users = user_data?.user;
		let temp = [];
		if (users?.length > 0) {
			for (let i = 0; i < users?.length; i++) {
				temp.push({
					id: i,
					userDesignation: users[i]?.role ? users[i]?.role : '',
					name: `${users[i]?.name ? users[i]?.name : ''} `,
					userEmail: users[i]?.email ? users[i]?.email : '',
					userId: users[i]?.reference_id ? users[i]?.reference_id : '',
					selected: false,
					grantAccess: users[i]?.access_granted ? users[i]?.access_granted : false,
				});
			}
		}
		set_row_data(temp);
	}
	const getRowNodeId = (data: any) => {
		return data?.data?.id;
	};
	const handleSelectionChanged = useCallback(
		(params: any) => {
			const selectedNodes = params.api.getSelectedNodes();
			const temp_selected_ids = selectedNodes?.map((node: any) => {
				return node?.data?.userId;
			});

			set_selected_ids(temp_selected_ids);
			set_selected_count(temp_selected_ids?.length);
		},
		[onSelectionChanged],
	);
	const onGridReady = (params: any) => {
		set_grid_api(params?.api);
		let grid_api_alt = params?.api;
		row_data?.forEach((row) => {
			if (row?.selected) {
				grid_api_alt?.getRowNode(row?.id)?.setSelected(true);
			}
		});
	};
	const clearSelection = () => {
		let temp = row_data;
		for (let i = 0; i < row_data.length; i++) {
			grid_api?.getRowNode(row_data[i]?.id)?.setSelected(false);
			temp[i].selected = false;
		}
		set_row_data([...temp]);
	};
	const handleChange = async (rowIndex: any, colDef: any, newValue: any, event: any) => {
		set_show_loader(true);
		if (newValue) {
			await driveApis.share_acess_to_a_file(event?.data?.userId, selected_file_dat_for_updation?.id);
		} else {
			await driveApis.unshare_acess_to_a_file(event?.data?.userId, selected_file_dat_for_updation?.id);
		}
		set_show_loader(false);
	};
	const handleGrantAccess = async () => {
		set_show_loader(true);
		let temp = row_data;
		await driveApis.share_bulk_acess_to_a_file_api(
			selected_ids,
			selected_files?.length > 0 ? selected_files?.map((opt: any) => opt?.id) : [selected_file_dat_for_updation?.id],
			parent_id,
		);
		for (let i = 0; i < selected_ids.length; i++) {
			let tempIndx = temp.findIndex((opt: any) => opt?.userId === selected_ids[i]);
			temp[tempIndx].grantAccess = true;
			temp[tempIndx].selected = false;
		}
		set_selected_count(0);
		set_selected_ids([]);
		set_refresh(true);
		set_row_data([...temp]);
		set_show_loader(false);
	};
	const handleRevokeAccess = async () => {
		set_show_loader(true);
		let temp = row_data;
		await driveApis.unshare_bulk_acess_to_a_file_api(
			selected_ids,
			selected_files.length > 0 ? selected_files.map((opt: any) => opt.id) : [selected_file_dat_for_updation?.id],
			parent_id,
		);
		for (let i = 0; i < selected_ids.length; i++) {
			let tempIndx = temp.findIndex((opt: any) => opt.userId === selected_ids[i]);
			temp[tempIndx].grantAccess = false;
			temp[tempIndx].selected = false;
		}
		set_selected_count(0);
		set_selected_ids([]);
		set_refresh(true);
		set_row_data([...temp]);
		set_show_loader(false);
	};

	useEffect(() => {
		if (row_data?.length === 0) {
			fetch_table_row_data();
		}
	}, []);
	useEffect(() => {
		if (row_data.length > 0) set_refresh(false);
	}, [row_data]);

	return (
		<Modal
			open={open_manage_access_modal}
			onClose={() => set_open_manage_access_modal(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box borderRadius={2} p={3} className={classes.container}>
				<Box className={classes.box_detail}>
					<CustomText type='H6'>Manage Access</CustomText>
					<Icon
						iconName='IconX'
						sx={{ marginLeft: 'auto' }}
						onClick={() => {
							set_open_manage_access_modal(false);
						}}
					/>
				</Box>
				{selected_count > 0 && (
					<Box my={2} p={1} pl={3} className={classes.select}>
						<CustomText type='Body'>{selected_count} items selected</CustomText>
						<Box ml={3} display='flex' alignItems='center' onClick={() => clearSelection()}>
							<Icon iconName='IconCircleX' color={theme?.user_details?.manage_access_modal?.primary} sx={{ marginRight: 1 }} />
							<CustomText color={theme?.user_details?.manage_access_modal?.primary} type='Subtitle'>
								Clear
							</CustomText>
						</Box>
						<Box className={classes.detail}>
							<CustomText
								color={theme?.user_details?.manage_access_modal?.primary}
								type='H6'
								style={{ marginRight: 2, cursor: 'pointer' }}
								onClick={() => handleRevokeAccess()}>
								{t('Files.RemoveAccess')}
							</CustomText>
							<CustomText
								color={theme?.user_details?.manage_access_modal?.secondary}
								type='H6'
								style={{ cursor: 'pointer' }}
								onClick={() => handleGrantAccess()}>
								{t('Files.GrantAccess')}
							</CustomText>
						</Box>
					</Box>
				)}
				{row_data.length > 0 && !refresh ? (
					<Container>
						<AgGridTableContainer
							getRowId={getRowNodeId}
							onGridReady={onGridReady}
							onSelectionChanged={handleSelectionChanged}
							onCellChange={handleChange}
							rowData={row_data}
							columnDefs={selected_files.length > 0 ? _.filter(columns, (opt) => !(opt?.field === 'grantAccess')) : columns}
							containerStyle={{ height: '80vh', minHeight: '400px' }}
						/>
					</Container>
				) : (
					<TableSkeleton />
				)}
			</Box>
		</Modal>
	);
};
