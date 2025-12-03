import React from 'react';
import PaymentDetailsSection from './PaymentSection';
import TermsSection from './TermsSection';
import _ from 'lodash';
import { Box } from 'src/common/@the-source/atoms';
import NotesSection from '../Sections/NotesSection';

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

interface Props {
	data: any;
	section_data?: any;
	is_accordion?: boolean;
	container_style?: any;
}

const Index: React.FC<Props> = ({ data, is_accordion = false, container_style, section_data }) => {
	const { payment_section, terms_and_conditions_section } = data;

	return (
		<React.Fragment>
			{!_.isEmpty(payment_section) && (
				<PaymentDetailsSection
					container_style={container_style}
					is_accordion={is_accordion}
					data={payment_section}
					show_attributes={true}
				/>
			)}
			{is_store_front && section_data?.notes && (
				<Box my={1}>
					<NotesSection data={section_data?.notes} />
				</Box>
			)}
			{!_.isEmpty(terms_and_conditions_section) && (
				<TermsSection container_style={container_style} is_accordion={is_accordion} data={terms_and_conditions_section} />
			)}
		</React.Fragment>
	);
};

export default Index;
