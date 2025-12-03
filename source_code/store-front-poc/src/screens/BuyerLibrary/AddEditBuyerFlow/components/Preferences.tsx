import { Grid } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import { isUUID } from 'src/screens/Settings/utils/helper';
import useStyles from '../../styles';

interface PreferencesProps {
	item: any;
}

const Preferences = ({ item }: PreferencesProps) => {
	const classes = useStyles();
	const sorted_data = _.sortBy(item.attributes, 'priority');

	return (
		<Grid padding={2} rowGap={2.5} className={classes.add_details_card_container}>
			{_.filter(sorted_data, (att: any) => isUUID(att?.id) || att?.is_display !== false).map((attribute: any) => {
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
	);
};

export default Preferences;
