import useOrderManagement from '../OrderManagement/useOrderManagement';
import OrderManagementContext from '../OrderManagement/context';
import { OrderManagementComp } from '../OrderManagement/OrderManagement';
import StepperComp from './components/StepperComp';
import { useMediaQuery } from '@mui/material';

const CheckoutManagement = () => {
	const is_small_screen = useMediaQuery('(max-width: 600px)');

	return !is_small_screen && <StepperComp />;
};

const Checkout = () => {
	const value = useOrderManagement();

	return (
		<OrderManagementContext.Provider value={value}>
			<CheckoutManagement />
			<OrderManagementComp />
		</OrderManagementContext.Provider>
	);
};

export default Checkout;
