import { Box, Grid } from '@mui/material';

import { Button, Icon, PageHeader } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';

import GlobalSearch from 'src/common/@the-source/molecules/GlobalSearch/GlobalSearch';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';

export const UpperHeader = ({
	showBack,
	headerName,
	client,
	options,
	set_open_create_folder_modal = (val: boolean) => {
		val;
	},
	upload_modal_open,
	set_parent_folder_data,
	visited_folder_data,
	set_visited_folder_data,
	search,
	set_search,
	handle_clear_file_selections_func,
	data_present = false,
}: {
	showBack: boolean;
	headerName: string;
	client: any;
	options: any;
	set_open_create_folder_modal: any;
	upload_modal_open: boolean;
	set_parent_folder_data: any;
	visited_folder_data: any;
	set_visited_folder_data: any;
	search: string;
	set_search: any;
	handle_clear_file_selections_func: any;
	data_present: any;
}) => {
	const theme: any = useTheme();
	const [search_options, set_search_options] = useState<string[]>([]);

	async function fetch_search_options_from_local_storage() {
		let data = await localStorage.getItem('search_options');
		if (data !== null && data !== undefined) set_search_options(JSON.parse(data));
	}
	async function set_search_options_to_local_storage(data: string[]) {
		await localStorage.setItem('search_options', JSON.stringify(data));
	}

	useEffect(() => {
		if (search_options.length === 0) {
			fetch_search_options_from_local_storage();
		}
	}, [search_options]);

	let debounce: any = null;

	useEffect(() => {
		debounce = setTimeout(() => {
			if (search_options.findIndex((data) => data === search) === -1 && search?.length > 0) {
				set_search_options([...search_options, search]);
				set_search_options_to_local_storage([...search_options, search]);
			}
		}, 2000);
		return () => clearTimeout(debounce);
	}, [search]);

	return (
		<PageHeader
			leftSection={
				<Grid container display='flex' alignItems='center'>
					{showBack && (
						<Icon
							sx={{ mr: 1 }}
							iconName='IconArrowLeft'
							onClick={() => {
								set_search('');
								let temp = visited_folder_data;
								let removed_ele = temp.pop();
								if (visited_folder_data.length === 0) set_parent_folder_data(null);
								else set_parent_folder_data({ ...removed_ele });
								set_visited_folder_data([...temp]);
								handle_clear_file_selections_func();
							}}
						/>
					)}
					<CustomText type='H2' style={{ marginRight: '20px' }}>
						{headerName?.length > 0 ? `${headerName?.substring(0, 20)}${headerName?.length > 20 ? '...' : ''}` : 'Files'}
					</CustomText>
					{!(headerName === 'File' && !data_present) && (
						<Grid sm={7}>
							<GlobalSearch
								search_in_config={[
									{
										large_label: 'Search in all',
										short_label: 'All',
										value: 'all',
										is_default: true,
									},
									{
										large_label: 'In Folder',
										short_label: 'Folder',
										value: 'folders',
										is_default: false,
									},
									{
										large_label: 'In Files',
										short_label: 'Files',
										value: 'files',
										is_default: false,
									},
								]}
								search={search}
							/>
						</Grid>
					)}
				</Grid>
			}
			rightSection={
				<Can I={PERMISSIONS.create_files_dam.slug} a={PERMISSIONS.view_files_dam.permissionType}>
					<Box sx={{ display: !(headerName === 'Assets' && !data_present) ? 'flex' : 'none' }}>
						<Button variant='outlined' sx={{ marginRight: 1 }} onClick={() => set_open_create_folder_modal(true)}>
							{t('Files.Folder')}
						</Button>
						<Button
							variant='contained'
							onClick={async () => {
								if (!upload_modal_open) {
									client.picker(options).open();
								} else {
									const file_picker_instance = document?.querySelector<HTMLElement>('.fsp-picker');
									if (file_picker_instance) {
										file_picker_instance!.style!.display = 'flex';
									}
								}
							}}>
							<Icon iconName='IconCloudUpload' color={theme?.user_drive?.upper_header?.icon_color} sx={{ marginRight: 1 }} />
							{t('Files.Upload')}
						</Button>
					</Box>
				</Can>
			}
		/>
	);
};
