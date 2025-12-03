import { useNavigate } from 'react-router-dom';
import { Grid, Icon, PageHeader } from 'src/common/@the-source/atoms';
import RenderPaymentFormLayout from './RenderPaymentFormLayout';
import CustomText from 'src/common/@the-source/CustomText';
import React from 'react';
import { useTheme } from '@mui/material';

const PaymentForm = () => {
	const navigate = useNavigate();
	const theme: any = useTheme();

	return (
		<React.Fragment>
			<PageHeader
				leftSection={
					<Grid container>
						<Grid sx={{ cursor: 'pointer', marginTop: '2.8px' }}>
							<Icon color={theme?.payments?.grey_600} onClick={() => navigate(-1)} iconName='IconArrowLeft' />
						</Grid>
						<Grid item ml={1}>
							<CustomText type='H2'>Payments</CustomText>
						</Grid>
					</Grid>
				}
			/>
			<Grid container justifyContent='center' style={{ overflowY: 'auto', height: 'calc(85vh)' }}>
				<Grid display='flex' flexDirection='column' xs={12} sm={10} md={8} lg={4.5} xl={6}>
					<RenderPaymentFormLayout />
				</Grid>
			</Grid>
		</React.Fragment>
	);
};

export default PaymentForm;
