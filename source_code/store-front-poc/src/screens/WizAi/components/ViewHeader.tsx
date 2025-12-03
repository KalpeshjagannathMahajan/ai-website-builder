import { Button, Grid, Icon, Tooltip, Image } from 'src/common/@the-source/atoms';
import useStyles from '../style';
import ViewMenu from './ViewMenu';
import { Badge, useTheme } from '@mui/material';
import ViewActions from './ViewActions';
import CustomText from 'src/common/@the-source/CustomText';
import { useContext, useEffect } from 'react';
import WizAiContext from '../context';
import ImageLinks from 'src/assets/images/ImageLinks';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import _ from 'lodash';

const badgeStyle = {
	padding: 0,
	margin: '2px 4px',
};

const ViewHeader = ({
	is_default,
	// view_columns,
	total_rows,
	set_manage_cols,
	set_open_sort,
	all_sorting_dta,
	handle_revert_changes,
	handle_save_changes,
	handle_close_view,
}: any) => {
	const { view, states_changed, first_opened, set_export_modal, handle_clear_filter, set_is_filter_active, is_filter_active } =
		useContext(WizAiContext);
	const classes = useStyles();
	const theme: any = useTheme();
	const { columns, sort, filters } = states_changed;

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const filtersParam = urlParams.get('filter');

		if (filtersParam && !_.isEmpty(filtersParam)) {
			set_is_filter_active(true);
		} else {
			set_is_filter_active(false);
		}
	}, [window.location.search]);

	const IconContainer = ({ children }: any) => <Grid className={classes.icon_container}>{children}</Grid>;

	const ManageColumnsIcon = () => (
		<Tooltip title='Manage columns' placement='top' arrow>
			<div>
				<Grid className={is_default ? classes.icon_style : classes.view_icon_style} onClick={() => set_manage_cols(true)}>
					<Icon iconName='IconColumns2' className={classes.icon} />
				</Grid>
			</div>
		</Tooltip>
	);

	const SavedViewsIcon = () => (
		<Tooltip title='Saved views' placement='top' arrow>
			<div>
				<ViewMenu is_default={is_default} />
			</div>
		</Tooltip>
	);

	const SortIcon = () => (
		<Tooltip title='Sort' placement='top' arrow>
			<div>
				<Grid className={is_default ? classes.icon_style : classes.view_icon_style} onClick={() => set_open_sort(true)}>
					<Badge
						slotProps={{
							badge: {
								style: { ...badgeStyle },
							},
						}}
						invisible={all_sorting_dta?.length > 0 ? false : true}
						variant='dot'
						color='error'>
						<Icon iconName='IconSortDescending' className={classes.icon} />
					</Badge>
				</Grid>
			</div>
		</Tooltip>
	);

	const ExportAction = () => (
		<Tooltip title='Export Excel' placement='top' arrow>
			<div>
				<Grid className={is_default ? classes.icon_style : classes.view_icon_style} onClick={() => set_export_modal(true)}>
					<Image style={{ cursor: 'pointer' }} src={ImageLinks.icon_import_export} width='25px' height='25px' imgClass={classes.icon} />
					{/* <Icon iconName='IconColumns2' className={classes.icon} /> */}
				</Grid>
			</div>
		</Tooltip>
	);
	const DefaultView = () => (
		<Grid className={is_default ? classes.filter_container : classes.view_filter_container}>
			<Grid display={'flex'} alignItems={'center'} gap={1} ml={1}>
				<CustomText type='Body' color={colors.secondary_text}>
					{t('OrderManagement.OrderListing.Showing', { count: total_rows ?? 0 })}
				</CustomText>
				{is_filter_active && (
					<Button
						variant={'text'}
						onClick={handle_clear_filter}
						sx={{
							fontSize: 14,
							fontWeight: '600',
							textTransform: 'inherit',
						}}>
						<CustomText type='Subtitle' color={colors.primary_600}>
							Clear filters
						</CustomText>
					</Button>
				)}
			</Grid>

			<IconContainer>
				<ExportAction />
				<ManageColumnsIcon />
				<SavedViewsIcon />
				<SortIcon />
			</IconContainer>
		</Grid>
	);

	const CustomView = () => (
		<Grid className={classes.view_info_container}>
			<Grid>
				<CustomText type='H6'>{view?.name}</CustomText>
			</Grid>
			<Grid className={classes.view_icons_box}>
				{(columns || sort || filters) && !first_opened && (
					<>
						<Button
							variant='outlined'
							sx={{
								mr: 1,
								color: theme?.insights?.header?.color,
								borderColor: theme?.insights?.header?.color,
								height: '32px',
								'&:hover': { borderColor: theme?.insights?.header?.color, background: theme?.insights?.header?.bg_color },
							}}
							onClick={handle_revert_changes}>
							Revert Changes
						</Button>
						<Button variant='outlined' sx={{ height: '32px', mr: 1 }} onClick={handle_save_changes}>
							Save Changes
						</Button>
					</>
				)}
				<IconContainer>
					<ExportAction />
					<ManageColumnsIcon />
					<SavedViewsIcon />
					<SortIcon />
				</IconContainer>
				<ViewActions />
				<Grid className={classes.icon_style}>
					<Icon iconName='IconX' onClick={handle_close_view} className={classes.icon} />
				</Grid>
			</Grid>
		</Grid>
	);

	return is_default ? <DefaultView /> : <CustomView />;
};

export default ViewHeader;
