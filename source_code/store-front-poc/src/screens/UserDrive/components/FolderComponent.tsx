import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { Icon } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import { useTheme } from '@mui/material/styles';

interface FolderProps {
	data: any;
	indx: number;
	content_menu_options: any;
	visited_folder_data: any;
	set_parent_folder_data: any;
	set_visited_folder_data: any;
	handle_clear_file_selections_func: any;
	set_search: any;
}

const useStyles = makeStyles((theme: any) => ({
	container: {
		width: '150px',
		display: 'flex',
		paddingTop: '6px',
		paddingBottom: '6px',
		justifyContent: 'space-between',
	},
	label_container: {
		background: theme?.user_drive?.folder_component?.label_container_background,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		gap: '4px',
		cursor: 'pointer',
	},
	folder_component_container: {
		boxShadow: '0',
		backgroundColor: theme?.user_drive?.folder_component?.container_background_color,
		display: 'flex',
		flexDirection: 'row',
		position: 'relative',
		width: '100%',
		'&:hover': {
			boxShadow: theme?.user_drive?.folder_component?.container_box_shadow,
		},
	},
	folder_grid: { display: 'flex', flexDirection: 'row', position: 'relative', zIndex: '0', width: '100%' },
	folder_detail: { marginLeft: 1, cursor: 'pointer', width: '80%', overflow: 'hidden' },
	menu: { marginLeft: 'auto', alignItems: 'center', cursor: 'pointer', position: 'absolute', top: '2vh', right: 4, zIndex: '+2' },
	detail_align: { display: 'flex', alignItems: 'center' },
}));
export const FolderComponent = ({
	data,
	indx,
	content_menu_options,
	visited_folder_data,
	set_parent_folder_data,
	set_visited_folder_data,
	handle_clear_file_selections_func,
	set_search,
}: FolderProps) => {
	visited_folder_data;
	const theme: any = useTheme();
	const classes = useStyles();
	function handle_enter_folder() {
		set_search('');
		let tempState: any = null;
		set_parent_folder_data((state: any) => {
			tempState = state;
			return data;
		});
		set_visited_folder_data((visited_state: any) => [...visited_state, tempState]);
		handle_clear_file_selections_func();
	}
	return (
		<Grid className={classes.folder_component_container} borderRadius={1} key={indx}>
			<Grid p={2} className={classes.folder_grid} onClick={() => handle_enter_folder()}>
				<Icon iconName='IconFolderFilled' color={theme?.user_drive?.folder_component?.icon_color} onClick={() => handle_enter_folder()} />
				<Box className={classes.folder_detail}>
					<CustomText type='Body'>{`${data?.file_name?.substring(0, 20)}${data?.file_name?.length > 20 ? '...' : ''}`}</CustomText>
					<CustomText color={theme?.user_drive?.folder_component?.custom_text_color} type='Body' className={classes.detail_align}>
						{data?.folder_count} folders{' '}
						<Icon iconName='IconPointFilled' color={theme?.user_drive?.folder_component?.custom_icon_color} size='small' />{' '}
						{data?.file_count} files
					</CustomText>
				</Box>
			</Grid>
			<Box className={classes.menu}>
				<Menu
					LabelComponent={<Icon iconName='IconDotsVertical' color={theme?.user_drive?.folder_component?.menu_icon_color} />}
					closeOnItemClick={true}
					commonMenuOnClickHandler={() => {}}
					commonMenuComponent={(_item: any) => {
						return (
							<div className={classes.container} onClick={() => _item.data.handleClickFunc(data)}>
								<CustomText type='Title' className={classes.detail_align} color={theme?.palette?.colors?.black_8}>
									<Icon iconName={_item?.data?.icon} sx={{ marginRight: 1 }} /> {_item?.data?.label}
								</CustomText>
							</div>
						);
					}}
					menu={Object.values(content_menu_options)}
					hideGreenBorder={true}
				/>
			</Box>
		</Grid>
	);
};
