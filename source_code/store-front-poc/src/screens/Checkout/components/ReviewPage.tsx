import React, { useContext } from 'react';
import CartSummary from 'src/screens/OrderManagement/component/Cart/CartSummary';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import { useTheme } from '@mui/material/styles';
import RenderOrderSectionFactory from './RenderOrderSectionFactory';
import _ from 'lodash';
import { useMediaQuery } from '@mui/material';
import {
	BUYER_INFO_SECTION,
	DOCUMENT_SECTION,
	NON_PAYMENT_SECTION,
	PAYMENT_METHOD_SECTION,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from 'src/screens/OrderManagement/constants';

const { VITE_APP_REPO } = import.meta.env;

const ReviewPage = ({ section_settings }: any) => {
	const { section_data, original_section_data } = useContext(OrderManagementContext);
	const is_small_screen = useMediaQuery('(max-width:600px)');
	const theme: any = useTheme();
	const is_ultron = VITE_APP_REPO === 'ultron';
	const default_section_settings = [
		{
			key: 'user_details',
			data: section_data?.user_details,
		},
		{
			key: 'specific_section',
			data: section_data?.specific_section,
		},
		{
			key: 'notes',
			data: section_data?.notes,
		},
		{
			key: 'payment_method_review',
			data: section_data?.payment_method,
			style: {
				borderRadius: '8px',
				backgroundColor: theme?.order_management?.order_manage_container?.background_color,
				padding: is_ultron ? '1.5rem 3rem' : '1rem 0rem',
				marginBottom: is_ultron ? '2rem' : '0rem',
			},
		},
		{
			key: 'payment_section',
			data: section_data?.other_section?.payment_section,
		},
		{
			key: 'terms_and_conditions',
			data: section_data?.other_section?.terms_and_conditions_section,
		},
	];

	const handle_get_section_settings = () => {
		const filtered_data = _.filter(original_section_data, (data) => _.get(section_settings, 'sections', [])?.includes(data?.key));

		const notes_section = _.find(filtered_data, { key: DOCUMENT_SECTION.notes });
		const type_specific_section = _.find(filtered_data, { key: DOCUMENT_SECTION.order_details });
		const user_details_section = _.filter(filtered_data, (item) => BUYER_INFO_SECTION.includes(item.key));
		const payment_section = _.filter(
			filtered_data,
			(item) => ![...NON_PAYMENT_SECTION, ...BUYER_INFO_SECTION, ...PAYMENT_METHOD_SECTION].includes(item?.key),
		);
		const payment_method_section = _.find(filtered_data, { key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_method_v2 });
		const terms_and_conditions = _.filter(filtered_data, (item) => item?.key === DOCUMENT_SECTION.terms_and_conditions);

		let transformed_section: any = {
			notes: notes_section,
			specific_section: type_specific_section,
			user_details: user_details_section,
			payment_method_review: payment_method_section,
			payment_section,
			terms_and_conditions,
		};

		const transformed_data = _.map(
			default_section_settings,
			(item) => transformed_section[item?.key] && { ...item, data: transformed_section[item?.key] },
		);
		return transformed_data;
	};

	const handle_render_content = () => {
		const settings_data = section_settings?.show_all ? default_section_settings : handle_get_section_settings();

		return (
			<React.Fragment>
				<CartSummary />
				<hr
					style={{
						borderTop: theme?.order_management?.order_manage_container?.hr_border_top,
						marginInline: '0',
						width: '100%',
						marginTop: is_small_screen ? '10px' : '20px',
					}}
				/>
				{_.map(settings_data, (item: any, index: number) => (
					<RenderOrderSectionFactory key={index} section={item?.key} section_data={item?.data || []} style={item?.style || {}} />
				))}
			</React.Fragment>
		);
	};

	return <React.Fragment>{handle_render_content()}</React.Fragment>;
};

export default ReviewPage;
