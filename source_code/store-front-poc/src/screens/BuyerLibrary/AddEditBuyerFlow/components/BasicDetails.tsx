import { Grid } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { isUUID } from 'src/screens/Settings/utils/helper';
import { useTheme } from '@mui/material/styles';
import usePricelist from 'src/hooks/usePricelist';

interface BasicDetailsProps {
	item: any;
	is_loading: boolean;
	from_cart?: boolean;
	handle_blur?: any;
	set_display_name_changed: (params: boolean) => void;
	setValue?: any;
}

const BasicDetails = ({ item, is_loading, from_cart = false, handle_blur, set_display_name_changed, setValue }: BasicDetailsProps) => {
	const theme: any = useTheme();
	const catalog_id = usePricelist();

	item.attributes = item?.attributes?.map((i: any) => {
		if (i.id === 'sales_reps') {
			i.required = true;
			i.disabled = i?.disabled || i?.options?.length === 1;
		}

		return i;
	});
	return (
		<Grid
			container
			p={2}
			justifyContent={'space-between'}
			rowGap={2.5}
			sx={{
				background: theme?.quick_add_buyer?.background,
				borderRadius: '16px',
			}}>
			{_.filter(item?.attributes, (att: any) => isUUID(att?.id) || att?.is_display !== false)?.map((attribute) => {
				let default_value = attribute?.id === 'catalog_group' ? (from_cart ? catalog_id?.value : attribute?.value) : attribute?.value;

				if (attribute?.view_only) {
					return;
				}
				return (
					<Grid sm={12} md={5.8} lg={5.8} key={attribute.name}>
						<FormBuilder
							placeholder={attribute?.name}
							label={attribute?.name}
							name={`${attribute?.id}`}
							validations={{
								required: Boolean(attribute?.required),
								number: attribute?.type === 'number',
								email: attribute?.key === 'email' || attribute?.id === 'email' || attribute?.type === 'email',
								phone: attribute?.type === 'phone',
								...attribute?.validations,
							}}
							disabled={attribute?.disabled}
							defaultValue={default_value}
							type={attribute?.type}
							options={attribute?.options}
							setValue={setValue}
							editable={!is_loading}
							on_blur={(value: string) => handle_blur(attribute, value)}
							on_change={() => {
								if (attribute?.id === 'display_name') {
									set_display_name_changed(true);
								}
							}}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default BasicDetails;
