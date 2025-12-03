import { makeStyles } from '@mui/styles';
import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { colors } from 'src/utils/theme';

interface EditActionIconProps {
	styles?: React.CSSProperties;
	on_edit_click?: () => void;
}

const useStyles = makeStyles({
	iconStyle: {
		cursor: 'pointer',
		'&:hover': {
			color: colors.black,
		},
	},
});

const tooltipText = {
	fontSize: '1.2rem',
};

const EditActionIcon: React.FC<EditActionIconProps> = ({ styles = {}, on_edit_click = () => {} }) => {
	const classes = useStyles();
	return (
		<Grid item md={1} sm={1} style={styles}>
			<Tooltip arrow title={'Edit'} placement='bottom' textStyle={tooltipText}>
				<span>
					<Icon iconName='IconEdit' color={colors.grey_800} onClick={on_edit_click} className={classes.iconStyle} />
				</span>
			</Tooltip>
		</Grid>
	);
};

export default EditActionIcon;
