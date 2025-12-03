import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import api_requests from 'src/utils/api_requests';
import CustomText from '../@the-source/CustomText';
import { Box } from '../@the-source/atoms';
import CircularProgressBar from '../@the-source/atoms/ProgressBar/CircularProgressBar';
import { colors } from 'src/utils/theme';

interface Field {
	attribute_id: string;
	field_name: string;
}
interface CalculateButtonProps {
	field: Field;
}

const text_style = {
	fontSize: 14,
	maxWidth: '100%',
	wordWrap: 'break-word',
	cursor: 'pointer',
};

const loader_style = { width: '25px', height: '25px', color: colors.primary_500 };

const CalculateButton: React.FC<CalculateButtonProps> = ({ field }) => {
	const { attribute_id = '', field_name = '' } = field;
	const [is_loading, set_is_loading] = useState<boolean>(false);
	const { setValue } = useFormContext();
	const { document_id = '' } = useParams();
	const { t } = useTranslation();
	const handle_calculate_value = async () => {
		if (!document_id || !attribute_id) return;
		try {
			set_is_loading(true);
			const response: any = await api_requests.order_management.get_dynamic_attribute_value(document_id, attribute_id);
			if (response?.status === 200) {
				const value = _.get(response, 'data.value', undefined);
				if (!value) return;
				setValue(field_name, value);
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_is_loading(false);
		}
	};
	return is_loading ? (
		<Box display='flex' alignItems='center' ml={2}>
			<CircularProgressBar style={loader_style} variant='indeterminate' />
		</Box>
	) : (
		<CustomText onClick={handle_calculate_value} type='H6' color={colors.primary_500} style={text_style}>
			{t('OrderManagement.Buttons.Calculate')}
		</CustomText>
	);
};

export default CalculateButton;
