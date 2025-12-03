import React from 'react';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useFormContext } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

interface TaxPreferenceProps {
	items: any;
}

const TaxPreferenceField: React.FC<TaxPreferenceProps> = ({ items }) => {
	const theme: any = useTheme();
	const sorted_data = _.sortBy(items?.attributes, 'priority');
	const { watch } = useFormContext();

	const is_taxable = watch('is_taxable');
	const { t } = useTranslation();

	return (
		<Grid container padding={2} direction={'column'}>
			{_.map(sorted_data, (attribute: any) => {
				if (attribute.type === 'percentage' && is_taxable) {
					return (
						<Grid
							item
							sx={{
								background: theme?.quick_add_buyer?.tax_preferences?.background1,
								width: '100%',
								padding: '16px 24px',
								borderRadius: '12px',
								margin: '2rem 0rem',
								display: 'flex',
								flexDirection: 'column',
							}}>
							<CustomText
								type='Title'
								color={theme?.quick_add_buyer?.tax_preferences?.text}
								style={{
									marginBottom: '1rem',
								}}>
								{t('AddEditBuyer.DefaultTaxation')}
							</CustomText>
							<FormBuilder
								placeholder={attribute.name}
								label={attribute.name}
								name={`${attribute.id}`}
								validations={{
									required: Boolean(attribute.required),
								}}
								disabled={attribute.disabled}
								defaultValue={attribute.value}
								type={attribute.type}
								style={{ maxWidth: '300px' }}
								options={attribute.options}
							/>
						</Grid>
					);
				}
				if (attribute.type !== 'percentage') {
					return (
						<Grid item key={attribute.name}>
							<FormBuilder
								placeholder={attribute.name}
								label={attribute.name}
								name={`${attribute.id}`}
								validations={{
									required: Boolean(attribute.required),
								}}
								disabled={attribute.disabled}
								defaultValue={attribute.value}
								type={attribute.type}
								options={attribute.options}
							/>
						</Grid>
					);
				} else {
					return null;
				}
			})}
			{is_taxable && (
				<p
					style={{
						display: 'flex',
						width: '97.5%',
						padding: ' 8px 12px',
						alignItems: 'center',
						gap: '4px',
						borderRadius: '8px',
						background: theme?.quick_add_buyer?.tax_preferences?.background2,
					}}>
					<Icon iconName='IconInfoCircle' />
					{t('AddEditBuyer.TaxSectionNote')}
				</p>
			)}
		</Grid>
	);
};

export default TaxPreferenceField;
