import React, { useContext } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import useStyles from '../../OrderManagement/styles';
import AddEditPayment from 'src/screens/OrderManagement/component/Drawer/AddEditPayment';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import useMediaQuery from '@mui/material/useMediaQuery';

const PaymentCardMethodSection = () => {
	const { document_data } = useContext(OrderManagementContext);
	const { document_status } = document_data;
	const classes = useStyles();
	const is_small_screen = useMediaQuery('(max-width:600px)');

	return (
		<React.Fragment>
			{document_status === 'draft' && (
				<Grid container className={classes.card_warning} gap={1} padding={'8px 15px'}>
					<Icon iconName='IconInfoCircle' className={classes.charge_warning_icon} />
					<CustomText type={is_small_screen ? 'Caption' : 'Body'}>Your card will be charged once the order gets shipped</CustomText>
				</Grid>
			)}
			<AddEditPayment is_ultron={false} is_store_front={true} />
		</React.Fragment>
	);
};

export default PaymentCardMethodSection;
