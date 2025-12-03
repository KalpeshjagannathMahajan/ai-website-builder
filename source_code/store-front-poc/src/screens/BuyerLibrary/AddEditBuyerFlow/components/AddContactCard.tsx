import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';

interface Props {
	on_card_press: () => void;
}

const AddContactCard = ({ on_card_press }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Grid container className={classes.add_details_card} onClick={on_card_press}>
			<Box textAlign={'center'}>
				<Icon className={classes.icon_style} iconName='addUser' />
				<CustomText type='Subtitle' color={theme?.quick_add_buyer?.card_text}>
					{t('BuyerDashboard.BuyerCard.AddContact')}
				</CustomText>
			</Box>
		</Grid>
	);
};

export default AddContactCard;
