import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme: any) => ({
	commonStyle: {
		margin: '2rem 1rem 1rem',
		backgroundColor: theme?.inventory_management?.common_style?.backgroundColor,
		cursor: 'pointer',
		boxShadow: theme?.inventory_management?.common_style?.boxShadow,
		'&:hover': {
			background: 'none',
		},
	},
}));
