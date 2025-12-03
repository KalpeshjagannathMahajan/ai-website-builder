import { makeStyles } from '@mui/styles';
import { colors } from 'src/utils/theme';

export const useErrorModalStyles = makeStyles(() => ({
	view_response_text: {
		color: colors.primary_500,
		marginLeft: '0.6rem',
		cursor: 'pointer',
		fontSize: '14px',
		fontWeight: 700,
	},
	reason_text: {
		whiteSpace: 'pre-wrap',
		wordWrap: 'break-word',
		wordBreak: 'break-word',
		color: colors.secondary_text,
		fontSize: '14px',
		fontWeight: 500,
		maxHeight: '50vh',
		overflowY: 'scroll',
		overflowX: 'hidden',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	copy_response_text: {
		cursor: 'pointer',
		marginTop: '1rem',
	},
}));
