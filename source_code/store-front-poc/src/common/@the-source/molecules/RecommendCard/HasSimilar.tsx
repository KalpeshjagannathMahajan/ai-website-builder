import { makeStyles } from '@mui/styles';
import CustomText from '../../CustomText';
import { Grid, Icon } from '../../atoms';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
interface IHasSimilarProps {
	similarDrawer: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'inline-flex',
		gap: '2px',
		zIndex: 2,
		right: 8,
		bottom: 4,
		position: 'absolute',
		borderRadius: '32px',
		padding: '3px 4px',
		cursor: 'pointer',
		maxHeight: '24px',
		alignItems: 'center',
	},
	text: {
		lineHeight: 'normal',
		textAlign: 'center',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		...theme?.product?.view_similar_chip_text,
	},
}));

const HasSimilar: React.FC<IHasSimilarProps> = ({ similarDrawer }) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Grid
			onClick={similarDrawer}
			sx={{
				...theme?.product?.view_similar_chip,
			}}
			className={classes.container}>
			<Icon
				iconName='IconCards'
				sx={{
					fontSize: '11px',
					width: '14px',
					height: '14px',
					color: theme?.product?.view_similar_chip?.color,
				}}
			/>
			<CustomText type='CaptionBold' className={classes.text}>
				{t('Product.Similar')}
			</CustomText>
		</Grid>
	);
};

export default HasSimilar;
