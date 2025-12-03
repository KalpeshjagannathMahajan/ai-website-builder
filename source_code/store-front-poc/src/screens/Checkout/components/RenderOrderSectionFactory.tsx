import NotesSection from 'src/screens/OrderManagement/component/Sections/NotesSection';
import OrderQuoteDetailsSection from 'src/screens/OrderManagement/component/Sections/OrderQuoteDetailsSection';
import ChangeBillingAddressDrawer from 'src/screens/OrderManagement/component/Drawer/ChangeBillingAddressDrawer';
import ChangeShippingAddressDrawer from 'src/screens/OrderManagement/component/Drawer/ChangeShippingAddress';
import PaymentCardMethodSection from './PaymentCardMethodSection';
import PaymentDetailsSection from 'src/screens/OrderManagement/component/Sections/PaymentSection';
import TermsSection from 'src/screens/OrderManagement/component/Sections/TermsSection';
import PaymentMethodSection from 'src/screens/OrderManagement/component/Sections/PaymentMethodSection';
import UserDetailSection from 'src/screens/OrderManagement/component/Sections/UserDetailSection';
import { useContext } from 'react';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import _ from 'lodash';

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

interface Props {
	section: string;
	section_data?: any;
	style?: any;
	is_accordion?: boolean;
}

const RenderOrderSectionFactory = ({ section, section_data, style, is_accordion }: Props) => {
	const { document_data } = useContext(OrderManagementContext);

	switch (section) {
		case 'shipping_address':
			return <ChangeShippingAddressDrawer data={section_data} is_ultron={false} is_store_front={true} />;
		case 'billing_address':
			return <ChangeBillingAddressDrawer data={section_data} is_ultron={false} is_store_front={true} />;
		case 'user_details':
			return <UserDetailSection data={section_data} />;
		case 'payment_method':
			return <PaymentCardMethodSection />;
		case 'payment_method_review': {
			return (
				section_data &&
				section_data?.is_display !== false &&
				document_data.type === 'order' && <PaymentMethodSection data={section_data} style={{ ...style, padding: 0 }} />
			);
		}
		case 'specific_section':
			return section_data && section_data?.is_display !== false && <OrderQuoteDetailsSection data={section_data} />;
		case 'notes':
			return <NotesSection data={section_data} />;
		case 'payment_section':
			return (
				<PaymentDetailsSection
					container_style={style}
					is_accordion={is_accordion}
					data={section_data}
					additional_styles={is_store_front ? { fontSize: '16px' } : {}}
				/>
			);
		case 'terms_and_conditions':
			return (
				section_data &&
				_.head(section_data)?.is_display !== false && (
					<TermsSection container_style={style} is_accordion={is_accordion} data={section_data} />
				)
			);
	}
};

export default RenderOrderSectionFactory;
