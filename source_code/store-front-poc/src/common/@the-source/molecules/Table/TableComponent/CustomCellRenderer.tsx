import React from 'react';
import {
	TextCellRenderer,
	ImageCellRenderer,
	PriceCellRenderer,
	TagsCellRenderer,
	InternalStatus,
	Tags2CellRenderer,
	TableCellRenderer,
	TextAreaCellRenderer,
	DateCellRenderer,
	SingleSelectCellRenderer,
	// MultiSelectCellRenderer,
	SizeCellRenderer,
	UOMCellRenderer,
	URLCellRenderer,
	HTMLCellRenderer,
	NumberCellRenderer,
	DecimalCellRenderer,
	DeleteIconCellRenderer,
	CategoryCellRenderer,
	ImageTextCellRenderer,
	ImageText2CellRenderer,
	StatusCellRenderer,
	ActionIconCellRenderer,
} from './CellRendererComponent';
import UnixDateCellRenderer from './CellRendererComponent/UnixDate';
import CurrencyIconCellRenderer from './CellRendererComponent/Currency';
import { MultiSelect2CellRenderer } from './CellRendererComponent/MultiSelect';
import ToggleComp from 'src/screens/Settings/components/Buyer/ToggleComp';
import CustomTagCellRenderer from './CellRendererComponent/CustomTag';

interface Props {
	type: string;
	value: any;
	[key: string]: any;
}

const CustomCellRenderer: React.FC<Props> = ({ type, value, data, ...rest }) => {
	const { field } = rest;

	switch (type) {
		case 'text':
			if (field === 'status') {
				return <StatusCellRenderer value={value} {...rest} />;
			} else {
				return <TextCellRenderer value={value} {...rest} />;
			}
		case 'status':
			return <StatusCellRenderer value={value} {...rest} />;
		case 'tag':
			return <CustomTagCellRenderer value={value} {...rest} />;
		case 'internal_status':
			return <InternalStatus value={value} {...rest} />;
		case 'image':
			return <ImageCellRenderer value={value || data?.[field]} {...rest} />;
		case 'imageText':
			return <ImageTextCellRenderer value={value} {...rest} />;
		case 'imageText2':
			return <ImageText2CellRenderer value={value} {...rest} />;
		case 'category':
			return <CategoryCellRenderer value={value} {...rest} />;
		case 'price':
			return <PriceCellRenderer value={value} {...rest} />;
		case 'tags':
			return <TagsCellRenderer value={value} {...rest} />;
		case 'tags2':
			return <Tags2CellRenderer value={value} {...rest} />;
		case 'table':
			return <TableCellRenderer value={value} {...rest} />;
		case 'textarea':
			return <TextAreaCellRenderer value={value} {...rest} />;
		case 'date':
			return <DateCellRenderer value={value} {...rest} />;
		case 'unixdate':
			return <UnixDateCellRenderer value={value} {...rest} />;
		case 'singleSelect':
			return <SingleSelectCellRenderer value={value} {...rest} />;
		case 'multiselect':
			return <MultiSelect2CellRenderer value={value} {...rest} />;
		case 'size':
			return <SizeCellRenderer value={value} {...rest} />;
		case 'uom':
			return <UOMCellRenderer value={value} {...rest} />;
		case 'url':
			return <URLCellRenderer value={value} {...rest} />;
		case 'html':
			return <HTMLCellRenderer value={value} {...rest} />;
		case 'number':
			return <NumberCellRenderer value={value} {...rest} />;
		case 'decimal':
			return <DecimalCellRenderer value={value} {...rest} />;
		case 'delete':
			return <DeleteIconCellRenderer value={value} {...rest} />;
		case 'action':
			return <ActionIconCellRenderer value={value} type={type} {...rest} />;
		case 'currency':
			return <CurrencyIconCellRenderer value={value} {...rest} />;
		case 'toggle':
			return <ToggleComp value={value} {...rest} />;
		default:
			return <TextCellRenderer value={value} {...rest} />;
	}
};

export default CustomCellRenderer;
