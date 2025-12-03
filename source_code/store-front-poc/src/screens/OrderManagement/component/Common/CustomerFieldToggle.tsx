import React, { memo } from 'react';
import { Box } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { DOCUMENT_LEVEL_ATTRS_KEY_MAP } from '../../constants';
import { colors } from 'src/utils/theme';

interface CustomerFieldToggleProps {
	label: string;
	defaultValue: boolean;
}

const CustomerFieldToggle: React.FC<CustomerFieldToggleProps> = memo(({ label = '', defaultValue = true }) => {
	return (
		<Box
			bgcolor={colors.grey_600}
			pl={2}
			py={1}
			borderRadius={'20px 20px 0px 0px'}
			sx={{
				margin: '-17px -20px', // to override drawer body padding
			}}
			border={`1px solid ${colors.grey_300}`}
			borderBottom={'none'}>
			<FormBuilder
				placeholder='type'
				label={label}
				name={DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_KEY}
				validations={{ required: false }}
				defaultValue={defaultValue}
				type='checkbox'
				checkbox_value={true}
				is_array={false}
			/>
		</Box>
	);
});

export default CustomerFieldToggle;
