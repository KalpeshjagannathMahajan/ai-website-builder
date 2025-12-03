import { Box, Button, Grid, Image } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { EmptyReviewScreenProps } from 'src/@types/presentation';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	empty_state: {
		width: '100%',
		top: '83px',
		display: 'flex',
		gap: '12px',
		flexDirection: 'column',
		minHeight: 'calc(100vh - 140px)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	seondary_title: {
		marginTop: '8px',
	},
}));

const EmptyReviewScreen: React.FC<EmptyReviewScreenProps> = ({ handle_add_products }) => {
	const classes = useStyles();

	return (
		<Grid container className={classes.empty_state}>
			<Image src={ImageLinks.empty_catalog} alt='empty_catalog' width={'222px'} height={'195px'} />
			<Box pt={1} textAlign={'center'}>
				<CustomText type='H2'>{t('Presentation.EmptyReview.Heading')}</CustomText>
				<CustomText type='Title' className={classes.seondary_title}>
					{t('Presentation.EmptyReview.Body')}
				</CustomText>
			</Box>
			<Box mt={2}>
				<Button onClick={handle_add_products} color='primary'>
					{t('Presentation.EmptyReview.AddProducts')}
				</Button>
			</Box>
		</Grid>
	);
};

export default EmptyReviewScreen;
