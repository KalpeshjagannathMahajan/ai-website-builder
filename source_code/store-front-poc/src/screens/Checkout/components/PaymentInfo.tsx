/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import _ from 'lodash';
import RenderOrderSectionFactory from './RenderOrderSectionFactory';
import {
	BUYER_INFO_SECTION,
	NON_PAYMENT_SECTION,
	PAYMENT_METHOD_SECTION,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from 'src/screens/OrderManagement/constants';

const PaymentInfo = ({ section_settings }: any) => {
	const { section_data, original_section_data } = useContext(OrderManagementContext);
	const { payment_section } = section_data?.other_section;

	const default_section_settings = [
		{
			key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_section,
			data: payment_section,
			style: { padding: '1.5rem 0rem' },
		},
		{ key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_method, data: [] },
	];

	const handle_get_section_settings = () => {
		const filtered_data = _.filter(original_section_data, (data) => _.get(section_settings, 'sections', [])?.includes(data?.key));
		const matching_key_data: any = _.intersectionBy(filtered_data, default_section_settings, 'key');
		const difference_key_data: any = _.differenceBy(filtered_data, default_section_settings, 'key');

		const filtered_payment_section = _.filter(
			difference_key_data,
			(item) => ![...NON_PAYMENT_SECTION, ...BUYER_INFO_SECTION, ...PAYMENT_METHOD_SECTION].includes(item?.key),
		);

		const transformed_data = [
			{
				key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_section,
				data: filtered_payment_section,
				is_accordion: false,
				style: {
					padding: '1.5rem 0rem',
				},
			},
			{ key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_method, data: matching_key_data },
		];

		return transformed_data;
	};

	const handle_render_content = () => {
		const settings_data = section_settings?.show_all ? default_section_settings : handle_get_section_settings();

		return _.map(settings_data, (item: any, index) => {
			return (
				<React.Fragment key={index}>
					<RenderOrderSectionFactory
						section={item?.key}
						section_data={item?.data || []}
						style={item?.style || {}}
						is_accordion={item?.is_accordion || false}
					/>
				</React.Fragment>
			);
		});
	};

	return <React.Fragment>{handle_render_content()}</React.Fragment>;
};

export default PaymentInfo;
