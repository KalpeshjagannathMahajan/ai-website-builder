import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	page_container: {
		display: 'flex',
		gap: '0px',
		flexDirection: 'column',
	},
	buyer_card: {
		display: 'flex',
		gap: '16px',
		padding: '16px',
		borderRadius: '8px',
		border: '1px solid rgba(0, 0, 0, 0.12)',
		cursor: 'pointer',
		justifyContent: 'space-between',
	},
	image_box: {
		height: '45px',
		width: '45px',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	skeleton_container_style: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	page_header_left_section: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: '10px',
		height: '36px',
	},
	page_header_right_section: {
		display: 'flex',
		gap: '10px',
	},
	body_container: {
		marginTop: '8px',
		display: 'flex',
		flexDirection: 'column',
	},
	section: {
		display: 'flex',
		flexDirection: 'column',
	},
	analytics_list: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: '16px',
	},
	analytics_header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: '8px',
	},
	right_section: {
		gap: '0.75rem',
		display: 'flex',
		flexDirection: 'row',
	},
	button_style: {
		padding: '7px 40px',
	},
	insights_sales_section: {
		display: 'flex',
		gap: '3rem',
		alignItems: 'center',
		flexDirection: 'row',
	},
	insights_sales_section_item: {
		display: 'flex',
		gap: '1rem',
		alignItems: 'center',
		flexDirection: 'row',
	},
	insights_activity: {
		display: 'flex',
		gap: '1rem',
		alignItems: 'center',
		flexDirection: 'row',
	},
	insights_activity_cont: {
		display: 'flex',
		gap: '3rem',
		justifyContent: 'space-between',
		flexDirection: 'column',
	},
	insights_icon_style: {
		background: theme?.insights?.background,
		borderRadius: '50%',
		padding: '8px',
		color: theme?.insights?.header?.color,
	},
	insight_divider: {
		width: '1px',
		height: '90px',
	},
	insight_text: {
		padding: '4px 8px',
		display: 'flex',
		flexDirection: 'row',
		gap: '8px',
		alignItems: 'center',
	},
	insight_text_box: {
		width: '270px',
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
	},
	insight_activity_chip: {
		padding: '4px',
		height: '24px',
		gap: '3px',
		borderRadius: '20px',
		color: theme?.insights?.chip_color,
		border: theme?.insights?.chip_border,
	},
	insight_container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	insight_header: {
		display: 'flex',
		flexDirection: 'row',
		gap: '8px',
		alignItems: 'center',
	},
	insight_buyer_activity_chip: {
		marginRight: 1,
		fontSize: 12,
		textTransform: 'capitalize',
		border: `2px solid ${theme?.insights?.dashboard?.background}`,
	},
	buyer_insight_dividers: {
		height: '1px',
		width: '30px',
		background: `repeating-linear-gradient(90deg, ${theme?.palette?.secondary?.[400]} 0 4px, ${theme?.insights?.black_color} 0 8px)`,
		margin: '1rem 1.5rem',
		transform: 'rotate(90deg)',
	},
	insight_icon_chip: {
		background: theme?.insights?.background,
		borderRadius: '50%',
		padding: '8px',
		color: theme?.insights?.header.color,
	},
	insight_icon_chip_2: {
		width: '16px !important',
		height: '16px !important',
	},
	insight_info_container: {
		display: 'flex',
		padding: '10px 20px',
		borderRadius: '16px',
		background: theme?.insights?.dashboard?.background,
		gap: '48px',
		alignItems: 'center',
		flexDirection: 'row',
	},
}));

export default useStyles;
