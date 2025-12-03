/* eslint-disable @typescript-eslint/no-shadow */
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { formattedValue } from 'src/utils/common';
import { secondary } from 'src/utils/light.theme';
import utils from 'src/utils/utils';
import CustomText from './@the-source/CustomText';

interface Props {
	from_order?: boolean;
	item: any;
	entity: 'addresses' | 'contacts';
	buyer_fields: any;
	is_editable: boolean;
	text_type?: 'H1' | 'H2' | 'H3' | 'H6' | 'Title' | 'Subtitle' | 'Body' | 'Caption' | 'CaptionBold' | 'Micro' | 'Body2' | 'BodyLarge' | '';
	is_bold?: boolean;
	address_display_settings?: any;
}

const text_style = {
	wordWrap: 'break-word' as const,
	color: secondary[700],
};

const bold_text_style = {
	...text_style,
	fontWeight: 'bold',
	color: '#000',
};

const getStyles = ({ is_bold, priority, text_type, text_style, bold_text_style, from_order, is_editable }: any) => {
	const textType = is_bold && priority >= 0 && priority < 1 ? 'Title' : text_type;
	const textStyle = is_bold && priority >= 0 && priority < 1 ? bold_text_style : { ...text_style, ...(from_order && { color: '#000' }) };
	const maxWidthStyle = is_editable
		? { ...textStyle, ...(!from_order && { maxWidth: '350px' }) }
		: { ...textStyle, ...(!from_order && { maxWidth: '300px' }) };
	return { textType, maxWidthStyle };
};

const DisplayPriorityCard = ({
	item,
	entity,
	buyer_fields,
	is_editable,
	text_type = 'Title',
	from_order = false,
	is_bold = true,
	address_display_settings = [],
}: Props) => {
	const display_priority_redux = useSelector((state) => _.get(state, 'settings.display_priority', []));
	const display_priority = address_display_settings?.length > 0 ? address_display_settings : display_priority_redux;
	const module_display_priority = _.get(display_priority, entity, []);

	const renderFieldsByPriority = () => {
		const sortedPriorities = _.sortBy(module_display_priority, 'display_priority');
		const groupedPriorities = _.groupBy(sortedPriorities, (field: any) => Math.floor(field?.display_priority || 0));

		return _.map(groupedPriorities, (group: any, priority: number) => {
			const renderedFields = group
				.map((field: any) => {
					const value = item[field?.key] || item?.additional_field_values?.[field?.key] || '';
					if (!value) return null;
					if (value === 'billing' || value === 'shipping') {
						return null;
					}
					if (field?.key === 'country_code') return null;
					let formatted_value;

					// Check if the field is a phone number
					if (field?.key === 'phone' && item?.country_code) {
						formatted_value = utils?.format_phone_number(value, item?.country_code);

						const buyerField = _.find(buyer_fields?.sections, (section: any) => section?.key === entity)?.[entity]?.[0]?.attributes?.find(
							(attr: any) => attr?.id === field?.key,
						);

						if (buyerField?.is_label_display) {
							const label = buyerField.name || '';
							formatted_value = (
								<>
									<strong style={priority < 1 ? bold_text_style : text_style}>{label}</strong> : {formatted_value}
								</>
							);
						}
					} else {
						const buyerField = _.find(buyer_fields?.sections, (section: any) => section?.key === entity)?.[entity]?.[0]?.attributes?.find(
							(attr: any) => attr?.id === field?.key,
						);
						formatted_value = formattedValue(value, buyerField);

						// If is_label_display is true, show the label and value
						if (buyerField?.is_label_display) {
							const label = buyerField.name || '';
							formatted_value = (
								<>
									<strong style={priority < 1 ? bold_text_style : text_style}>{label}</strong> : {formatted_value}
								</>
							);
						}
					}

					if (!formatted_value) return null;

					return <React.Fragment key={field.key}>{formatted_value}</React.Fragment>;
				})
				.filter(Boolean);

			const { textType, maxWidthStyle } = getStyles({
				is_bold,
				priority,
				text_type,
				text_style,
				bold_text_style,
				from_order,
				is_editable,
			});
			return (
				<CustomText key={priority} type={textType} style={maxWidthStyle}>
					{renderedFields?.length > 0
						? renderedFields.reduce((prev: any, curr: any) => (
								<>
									{prev}
									{priority < 1 ? ' ' : ', '}
									{curr}
								</>
						  ))
						: null}
				</CustomText>
			);
		});
	};

	return <div>{renderFieldsByPriority()}</div>;
};

export default DisplayPriorityCard;
