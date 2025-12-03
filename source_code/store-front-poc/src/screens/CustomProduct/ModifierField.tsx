import CustomCounter from '../../common/@the-source/molecules/CustomCounter';
import ChipComponent from './ModifierComponents/ChipComponent';
import RadioComponent from './ModifierComponents/RadioComponent';
import ImageComponent from './ModifierComponents/ImageComponent';
import DropDownComponent from './ModifierComponents/DropDownComponent';
import { useTheme } from '@mui/material/styles';
import CustomTextComponent from './ModifierComponents/CustomTextComponent';
import { MAX_TEXT_VALIDATION } from './constants';

interface ModifierFieldProps {
	dType: string;
	modifier: string;
	values?: any;
	handleValues: any;
	data: any;
	options: any;
	id: string;
	handleError: any;
	searchString: string;
	is_retail_mode?: boolean;
	is_edit?: boolean;
	currency: string;
	is_error?: boolean;
}

const prevent_overflow = {
	textOverflow: 'ellipsis',
	maxWidth: '100px',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
};

const search_string_style = {
	padding: '1rem',
	borderRadius: '8px',
	marginTop: '0.5rem',
};

const ModifierField = ({
	dType,
	modifier,
	values,
	data,
	handleValues,
	options,
	id,
	handleError,
	searchString,
	is_retail_mode,
	is_edit,
	currency,
	is_error = false,
}: ModifierFieldProps) => {
	const theme: any = useTheme();
	const defaultValue = is_edit ? options : options || data?.value;

	switch (dType) {
		case 'Single Select':
			switch (modifier) {
				case 'Chip':
					return (
						<ChipComponent
							values={values}
							prevent_overflow={prevent_overflow}
							default_value={defaultValue}
							id={id}
							onChange={handleValues}
							is_mandatory={data?.mandatory}
							handleError={handleError}
							is_retail_mode={is_retail_mode}
							search_string_style={
								searchString
									? { ...search_string_style, background: theme?.product?.custom_product_drawer?.modifier_select_value?.background }
									: {}
							}
							currency={currency}
						/>
					);

				case 'Radio Button':
					return (
						<RadioComponent
							values={values}
							prevent_overflow={prevent_overflow}
							id={id}
							default_value={defaultValue}
							onChange={handleValues}
							is_mandatory={data?.mandatory}
							handleError={handleError}
							is_retail_mode={is_retail_mode}
							search_string_style={
								searchString
									? { ...search_string_style, background: theme?.product?.custom_product_drawer?.modifier_select_value?.background }
									: {}
							}
							currency={currency}
						/>
					);
				case 'Dropdown':
					return (
						<DropDownComponent
							values={values}
							options={defaultValue}
							label={data?.name}
							show_checkbox={data?.type === 'multi_select'}
							onChange={handleValues}
							is_mandatory={data?.mandatory}
							id={id}
							is_retail_mode={is_retail_mode}
							min_selection_quantity={data?.min_selection_quantity}
							max_selection_quantity={data?.max_selection_quantity}
							handleError={handleError}
							currency={currency}
						/>
					);
				case 'Swatch':
					return (
						<ImageComponent
							values={values}
							options={defaultValue}
							id={id}
							onChange={handleValues}
							is_mandatory={data?.mandatory}
							min_selection_quantity={data?.min_selection_quantity}
							max_selection_quantity={data?.max_selection_quantity}
							handleError={handleError}
							is_retail_mode={is_retail_mode}
							search_string_style={
								searchString
									? { ...search_string_style, background: theme?.product?.custom_product_drawer?.modifier_select_value?.background }
									: {}
							}
							currency={currency}
						/>
					);
				default:
					return null;
			}
		case 'Multi Select':
			switch (modifier) {
				case 'Dropdown':
					return (
						<DropDownComponent
							values={values}
							options={defaultValue}
							label={data?.name}
							show_checkbox={data?.type === 'Multi Select'}
							onChange={handleValues}
							is_mandatory={data?.mandatory}
							id={id}
							is_retail_mode={is_retail_mode}
							min_selection_quantity={data?.min_selection_quantity}
							max_selection_quantity={data?.max_selection_quantity > 0 ? data?.max_selection_quantity : Infinity}
							handleError={handleError}
							currency={currency}
						/>
					);
				case 'Swatch':
					return (
						<ImageComponent
							values={values}
							options={defaultValue}
							show_checkbox={dType === 'Multi Select'}
							onChange={handleValues}
							id={id}
							is_retail_mode={is_retail_mode}
							is_mandatory={data?.mandatory}
							min_selection_quantity={data?.min_selection_quantity}
							max_selection_quantity={data?.max_selection_quantity > 0 ? data?.max_selection_quantity : Infinity}
							handleError={handleError}
							search_string_style={
								searchString
									? { ...search_string_style, background: theme?.product?.custom_product_drawer?.modifier_select_value?.background }
									: {}
							}
							currency={currency}
						/>
					);
				default:
					return null;
			}

		case 'Counter':
			switch (modifier) {
				case 'Counter':
					return (
						<CustomCounter
							is_mandatory={data?.mandatory}
							min={data?.min_selection_quantity || 0}
							max={data?.max_selection_quantity > 0 ? data?.max_selection_quantity : Infinity}
							onChange={handleValues}
							id={id}
							label={data?.name}
							handleError={handleError}
							defaultValue={defaultValue}
						/>
					);
				default:
					return null;
			}
		case 'Text':
			switch (modifier) {
				case 'Text Input':
					return (
						<CustomTextComponent
							id={id}
							is_error={is_error}
							handle_errors={handleError}
							is_mandatory={data?.mandatory}
							min_quantity={data?.min_selection_quantity || 0}
							max_quantity={data?.max_selection_quantity > 0 ? data?.max_selection_quantity : MAX_TEXT_VALIDATION}
							handleValues={handleValues}
							defaultValue={defaultValue}
						/>
					);
				default:
					return null;
			}
		default:
			return null;
	}
};

export default ModifierField;
