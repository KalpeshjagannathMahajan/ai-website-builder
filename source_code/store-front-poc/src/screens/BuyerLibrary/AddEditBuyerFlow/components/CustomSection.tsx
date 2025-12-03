import { Grid } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';

interface CustomSectionProps {
	item: any;
	style: any;
}

const CustomSection = ({ item, style }: CustomSectionProps) => {
	const classes = useStyles();
	const sorted_data = _.sortBy(item.attributes, 'priority').filter((it) => it?.is_display !== false);

	if (sorted_data?.length === 0) return null;

	return (
		<>
			<CustomText type='H2' style={style}>
				{item?.name}
			</CustomText>
			<Grid padding={2} rowGap={2.5} className={classes.add_details_card_container}>
				{_.map(sorted_data, (attribute: any) => {
					return (
						<Grid key={attribute.name}>
							<FormBuilder
								placeholder={attribute.name}
								label={attribute.name}
								name={`${attribute.id}`}
								validations={{
									required: Boolean(attribute.required),
									number: attribute.type === 'number',
									email: attribute.type === 'email',
									...attribute?.validations,
								}}
								disabled={attribute.disabled}
								defaultValue={attribute.value}
								type={attribute.type}
								options={attribute.options}
							/>
						</Grid>
					);
				})}
			</Grid>
		</>
	);
};

export default CustomSection;
