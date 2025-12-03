import CustomText from 'src/common/@the-source/CustomText';
import { Checkbox, Icon, Image } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';
import useStyles from './../css/FileComponentStyle';
import React, { useState } from 'react';
import { Box, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import { filter } from 'lodash';

interface FileComponentProps {
	data: any;
	indx: number;
	files_data: any;
	set_files_data: any;
	set_selected_files_count: any;
	selected_files: any;
	set_selected_files: any;
	selected_files_count: number;
	content_menu_options: any;
	handle_clear_file_selections_func: any;
	search_data: any;
	search: any;
}

export const FileComponent = ({
	data,
	indx,
	files_data,
	set_files_data,
	set_selected_files_count,
	selected_files,
	set_selected_files,
	selected_files_count,
	content_menu_options,
	// handle_clear_file_selections_func,
	search_data,
	search,
}: FileComponentProps) => {
	const styles = useStyles();
	const theme: any = useTheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation(); // Prevent triggering parent click handlers
		setAnchorEl(event.currentTarget); // Set the anchor element
	};

	const handleMenuClose = () => {
		setAnchorEl(null); // Reset the anchor element
	};

	const created_date = new Date(data?.created_at);
	const file_type = data?.file_type;
	const transformed_date = convert_date_to_timezone(created_date, 'DD MMM YYYY');

	return (
		<Grid container direction='column' className={styles.file_container}>
			<Grid container justifyContent='space-between' alignItems='center'>
				<Checkbox
					checked={data?.selected}
					size='20px'
					onChange={() => {
						let temp = search?.length > 0 ? search_data : files_data;
						temp[indx].selected = !data?.selected;
						set_selected_files_count(!data?.selected ? selected_files_count - 1 : selected_files_count + 1);
						if (data?.selected) {
							if (selected_files?.findIndex((opt: any) => opt?.id === temp?.id) === -1) set_selected_files([...selected_files, temp[indx]]);
						} else {
							set_selected_files(filter(selected_files, (alt: any) => !(alt?.id === data?.id)));
						}
						set_files_data([...files_data]);
					}}
				/>
				<IconButton
					aria-label='more'
					aria-controls={anchorEl ? 'file-menu' : undefined}
					aria-haspopup='true'
					className={styles.menu_label}
					onClick={(e) => {
						e.stopPropagation();
						handleMenuOpen(e);
					}}
					sx={{
						borderRadius: '8px',
						background: '#ccc',
						color: 'white',
						height: '28px',
						width: '28px',
						':hover': {
							background: '#ccc',
						},
					}}>
					<Icon iconName='IconDotsVertical' color='white' />
				</IconButton>
				<Menu
					id='file-menu'
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					slotProps={{
						paper: {
							style: {
								zIndex: 9999,
							},
						},
					}}>
					{Object.values(content_menu_options || {}).length > 0 ? (
						Object.values(content_menu_options).map((option: any, index: number) => (
							<MenuItem
								key={index}
								onClick={(e) => {
									e.stopPropagation();
									option?.data?.handleClickFunc?.(data, e);
									handleMenuClose();
								}}>
								<CustomText>{option?.data?.label}</CustomText>
							</MenuItem>
						))
					) : (
						<MenuItem disabled>
							<CustomText>No options available</CustomText>
						</MenuItem>
					)}
				</Menu>
			</Grid>

			{/* <Grid item onClick={() => content_menu_options?.preview?.data?.handleClickFunc(data)}>
				<Box style={{ padding: '16px', textAlign: 'center' }}>
					{file_type?.includes('image') ? (
						<Image src={data?.url} alt={data?.file_name} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
					) : (
						<CustomText type="h6" style={{ color: '#757575' }}>
							{file_type?.includes('video')
								? 'Video File'
								: file_type?.includes('pdf')
									? 'PDF File'
									: 'Unknown File'}
						</CustomText>
					)}
				</Box>

				<Box style={{ padding: '8px 0', borderTop: '1px solid #ddd' }}>
					<CustomText type="body1" style={{ fontWeight: 500 }}>
						{data?.file_name || 'Untitled File'}
					</CustomText>
					<CustomText type="body2" style={{ color: '#757575' }}>
						{data?.created_at ? `Uploaded on ${transformed_date}` : 'Just now'}
					</CustomText>
				</Box>
			</Grid> */}
			<Grid onClick={() => content_menu_options?.preview?.data?.handleClickFunc(data)}>
				<Box p='2vh 0' className={styles.detail}>
					{file_type?.includes('image') ? (
						<Image src={data?.url} imgClass={styles.image} />
					) : (
						<Icon
							iconName={file_type?.includes('video') ? 'IconBrandYoutube' : file_type?.includes('pdf') ? 'IconPdf' : 'IconFileDescription'}
							color={
								file_type?.includes('video')
									? theme?.user_drive?.file_component?.icon_file_color
									: file_type?.includes('pdf')
									? theme?.user_drive?.file_component?.file_include_color
									: theme?.user_drive?.file_component?.file_not_include_color
							}
							size='large'
							sx={{
								backgroundColor: file_type?.includes('video')
									? theme?.user_drive?.file_component?.file_video_color
									: file_type?.includes('pdf')
									? theme?.user_drive?.file_component?.file_video_include_color
									: theme?.user_drive?.file_component?.file_video_not_include_color,
								padding: 1,
								borderRadius: 1,
							}}
						/>
					)}
				</Box>
				<Box borderTop={1} borderColor={theme?.user_drive?.file_component?.box_border_color}>
					<CustomText type='Body' className={styles.file_name}>
						{data?.file_name}
					</CustomText>
					<CustomText color={theme?.user_drive?.file_component?.custom_text_color} type='Body' className={styles.date}>
						{data?.created_at === null || data?.created_at === undefined ? 'Just now' : `Uploaded on ${transformed_date}`}
					</CustomText>
				</Box>
			</Grid>
		</Grid>
	);
};
