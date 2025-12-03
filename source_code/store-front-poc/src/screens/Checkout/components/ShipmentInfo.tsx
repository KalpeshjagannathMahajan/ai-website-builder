import _ from 'lodash';
import React, { useContext } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import RenderOrderSectionFactory from './RenderOrderSectionFactory';
import {
	BUYER_INFO_SECTION,
	NON_PAYMENT_SECTION,
	PAYMENT_METHOD_SECTION,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from 'src/screens/OrderManagement/constants';
import useMediaQuery from '@mui/material/useMediaQuery';

const ShipmentInfo = ({ section_settings }: any) => {
	const { section_data, original_section_data } = useContext(OrderManagementContext);
	const shipping_section = _.filter(section_data?.other_section?.payment_section, { key: 'shipping_method' });
	const [notes_section] = _.filter(section_data, { key: SPECIAL_DOCUMENT_ATTRIBUTE.notes });
	const billing_address_data = section_data?.user_details?.find((item: any) => item?.key === 'billing_address');
	const shipping_address_data = section_data?.user_details?.find((item: any) => item?.key === 'shipping_address');
	const is_small_screen = useMediaQuery('(max-width:600px)');

	const default_section_settings = [
		{ key: SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address, data: shipping_address_data },
		{ key: SPECIAL_DOCUMENT_ATTRIBUTE.billing_address, data: billing_address_data },
		{
			key: SPECIAL_DOCUMENT_ATTRIBUTE.notes,
			data: notes_section,
		},
		{
			key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_section,
			data: shipping_section,
			style: {
				padding: '1.5rem 0rem',
			},
		},
	];

	const handle_get_section_settings = () => {
		const filtered_data = _.filter(original_section_data, (data) => _.get(section_settings, 'sections', [])?.includes(data?.key));
		const matching_key_data = _.intersectionBy(default_section_settings, filtered_data, 'key');
		const difference_key_data = _.differenceBy(filtered_data, default_section_settings, 'key');

		const payment_section = _.filter(
			difference_key_data,
			(item) => ![...NON_PAYMENT_SECTION, ...BUYER_INFO_SECTION, ...PAYMENT_METHOD_SECTION].includes(item?.key),
		);

		const transformed_data = [
			...matching_key_data,
			{
				key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_section,
				data: payment_section,
				is_accordion: false,
				style: {
					padding: is_small_screen ? '0rem' : '1.5rem 0rem',
				},
			},
		];
		return transformed_data;
	};

	const handle_render_content = () => {
		const settings_data = section_settings?.show_all ? default_section_settings : handle_get_section_settings();

		return _.map(settings_data, (item: any, index: number) => {
			return (
				<React.Fragment key={index}>
					<RenderOrderSectionFactory
						section={item?.key}
						section_data={item?.data || []}
						style={item?.style || {}}
						is_accordion={item?.is_accordion || false}
					/>
					{index !== settings_data?.length - 1 && <hr style={{ margin: '32px 0px' }}></hr>}
				</React.Fragment>
			);
		});
	};

	return <Grid>{handle_render_content()}</Grid>;
};

export default ShipmentInfo;
