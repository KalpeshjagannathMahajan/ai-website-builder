import { makeStyles } from '@mui/styles';
import { primary, secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';

export const useStyles = makeStyles(() => ({
	card: {
		width: '289px',
		height: '93px',
		borderRadius: '8px',
		padding: '12px',
		display: 'flex',
		gap: 3,
		alignItems: 'center',
		cursor: 'pointer',
	},
	selected_card: {
		border: `1px solid ${primary[500]}`,
	},
	not_selected_card: {
		border: `1px solid ${secondary[400]}`,
	},
	cancel_btn: {
		color: colors.grey_800,
		border: `1px solid ${secondary[500]}`,
		'&:hover': {
			border: `1px solid ${secondary[500]}`,
		},
	},
	field: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		padding: '4px 0 32px 0',
		borderBottom: `1px dashed ${secondary[500]}`,
	},
	required: {
		color: colors.red,
	},
}));
