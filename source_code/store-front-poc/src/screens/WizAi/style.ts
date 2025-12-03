import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	view_info_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: `1px solid ${theme?.insights?.container}`,
		borderTopLeftRadius: '12px',
		borderTopRightRadius: '12px',
		background: '#fff',
		padding: '12px 20px',
		height: '48px',
	},
	view_icons_box: {
		display: 'flex',
		flexDirection: 'row',
	},
	view_action_icon: {
		width: '24px',
		height: '24px',
	},
	view_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: '10px',
	},
	filter_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: '4px',
	},
	view_filter_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		background: theme?.insights?.dashboard?.background,
		padding: '8px',
	},
	icon_container: {
		display: 'flex',
		flexDirection: 'row',
		gap: '10px',
	},
	icon_style: {
		width: '33px',
		height: '33px',
		padding: '4px',
		borderRadius: '8px',
		background: theme?.insights?.dashboard?.background,
		cursor: 'pointer',
		justifyContent: 'center',
		alignItems: 'center',
	},
	view_icon_style: {
		width: '33px',
		height: '33px',
		padding: '4px',
		borderRadius: '8px',
		background: theme?.insights?.dashboard?.background,
		cursor: 'pointer',
		border: theme?.insights?.chip_border,
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		width: '24px',
		height: '24px',
		color: theme?.insights?.dashboard?.text_color,
	},
	table_container: {
		padding: '4px 0px',
	},
	view_table_container: {
		padding: '4px 0px',
		background: theme?.insights?.dashboard?.background,
		borderBottomLeftRadius: '16px',
		borderBottomRightRadius: '16px',
	},
	menu_container: {
		width: 'auto',
		marginTop: '0.2rem',
		cursor: 'pointer',
	},
	menu_action_container: {
		width: '120px',
		marginTop: '0.2rem',
		cursor: 'pointer',
	},
	sorting_child: {
		padding: '8px 12px',
		borderRadius: '16px',
		background: theme?.insights?.sorting,
	},
	sorting_parent: {
		padding: '8px 12px',
		borderRadius: '16px',
		background: theme?.insights?.sorting,
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
	},
	insight_icon_chip: {
		background: theme?.insights?.background,
		borderRadius: '50%',
		padding: '8px',
		color: theme?.insights?.header?.color,
	},
	insight_divider: {
		width: '1px',
		minHeight: '24px',
		maxHeight: '140px',
	},
}));

export default useStyles;
