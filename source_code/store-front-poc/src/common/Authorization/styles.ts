import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	auth_txn_item: {
		background: theme?.payments?.background,
		padding: '12px 16px',
		borderRadius: '8px',
		alignItems: 'center',
		minWidth: '83%',
	},
	auth_txn_item_full_width: {
		width: '100%',
	},
}));

export default useStyles;
