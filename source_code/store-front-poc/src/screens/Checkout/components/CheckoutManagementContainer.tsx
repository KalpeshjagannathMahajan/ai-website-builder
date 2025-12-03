import React, { useContext } from 'react';
import ShipmentInfo from './ShipmentInfo';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import { STEPPER_CONSTANTS } from 'src/screens/OrderManagement/constants';
import PaymentInfo from './PaymentInfo';
import _ from 'lodash';
import ReviewPage from './ReviewPage';

const CheckoutManagementContainer = () => {
	const { active_step, wizshop_settings } = useContext(OrderManagementContext);

	const shipping_data = _.find(wizshop_settings?.pages, { key: STEPPER_CONSTANTS.SHIPPING_INFO.key });
	const payment_data = _.find(wizshop_settings?.pages, { key: STEPPER_CONSTANTS.PAYMENT_DETAILS.key });
	const review_data = _.find(wizshop_settings?.pages, { key: STEPPER_CONSTANTS.REVIEW.key });

	const handle_render_content = () => {
		if (wizshop_settings?.pages) {
			switch (active_step?.stepper_key) {
				case STEPPER_CONSTANTS.SHIPPING_INFO.key:
					return <ShipmentInfo section_settings={shipping_data} />;
				case STEPPER_CONSTANTS.PAYMENT_DETAILS.key:
					return <PaymentInfo section_settings={payment_data} />;
				case STEPPER_CONSTANTS.REVIEW.key:
					return <ReviewPage section_settings={review_data} />;
				default:
					return <ShipmentInfo section_settings={shipping_data} />;
			}
		}
	};

	return <React.Fragment>{handle_render_content()}</React.Fragment>;
};

export default CheckoutManagementContainer;
