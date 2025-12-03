import CustomText from 'src/common/@the-source/CustomText';
import { Chip, Grid, Radio } from 'src/common/@the-source/atoms';
import utils from 'src/utils/utils';
import { useTheme } from '@mui/material/styles';
import { formattedValue } from 'src/utils/common';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { makeStyles } from '@mui/styles';
interface Props {
	id: any;
	address: any;
	default_billing_address_id: string;
	address_section: any;
	selected_address_id: any;
}

const text_style = {
	display: 'block',
	fontSize: 16,
	marginBottom: 0.8,
};

const useStyles = makeStyles((theme: any) => ({
	text_style: {
		color: theme?.order_management?.style?.text_style_color,
	},
}));

const BillingAddressCard = ({ id, address, default_billing_address_id, address_section, selected_address_id }: Props) => {
	const theme: any = useTheme();
	const { t } = useTranslation();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';
	const classes = useStyles();

	const address_obj = utils.get_address_object(id, address?.attributes);
	const {
		first_name,
		last_name,
		country_code,
		phone,
		city,
		state_label,
		country_label,
		pincode,
		street_address,
		additional_field_values,
		address_line_2,
	} = address_obj;

	const hangle_render_additional_fields = (additional_fields: any) => {
		return _.map(additional_fields, (value: any, key) => {
			if (!value) {
				return null;
			}
			const attributes =
				_.find(address_section?.addresses, (item) => item?.id === default_billing_address_id) ||
				_.get(address_section, 'addresses[0].attributes');
			const field = _.find(attributes?.attributes, (fld: any) => fld.id === key);
			const formatted_value = formattedValue(value, field);
			return (
				<CustomText key={`additional_${key}`} type='Title' style={{ ...text_style }}>
					{formatted_value}
				</CustomText>
			);
		});
	};

	const padding = is_ultron ? '1.5rem 1rem 1.5rem 0.5rem' : '14px 16px';

	return (
		<Grid container padding={padding}>
			{is_ultron && (
				<Grid item md={1.5} sm={1.5}>
					<Radio checked={id === selected_address_id ? true : false} onChange={function noRefCheck() {}} />
				</Grid>
			)}

			<Grid sx={{ display: 'flex', flexDirection: 'row', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
				<Grid item md={is_ultron ? 8 : 11.5} sm={is_ultron ? 8 : 11} lg={is_ultron ? 8 : 11} xl={is_ultron ? 8 : 11}>
					<CustomText style={text_style} type='Subtitle'>
						{t('OrderManagement.ChangeAddressDrawer.FullName', { first_name, last_name })}
					</CustomText>
					<CustomText style={text_style} className={classes.text_style} type='Body'>
						{utils.format_phone_number(phone, country_code) || '--'}
					</CustomText>
					<CustomText style={text_style} className={classes.text_style} type='Body'>
						{street_address}
					</CustomText>
					<CustomText style={text_style} className={classes.text_style} type='Body'>
						{address_line_2}
					</CustomText>
					<CustomText style={text_style} className={classes.text_style} type='Body'>
						{t('OrderManagement.ChangeAddressDrawer.Address', { city, state_label, country_label })}
					</CustomText>
					<CustomText style={text_style} className={classes.text_style} type='Body'>
						{pincode}
					</CustomText>
					{hangle_render_additional_fields(additional_field_values)}
				</Grid>

				{is_store_front && (
					<Grid container flexDirection='column' justifyContent='space-between' alignItems='end' item md={0.5} sm={0.5} lg={1} xl={1}>
						<Radio
							style={{ padding: '0', ...theme?.radio }}
							checked={id === selected_address_id ? true : false}
							onChange={function noRefCheck() {}}
						/>
					</Grid>
				)}
			</Grid>

			{is_ultron && (
				<Grid item md={2.5} sm={2.5}>
					{default_billing_address_id === id && (
						<Chip
							label={t('OrderManagement.ChangeAddressDrawer.PrimaryAddress')}
							bgColor={theme?.order_management?.change_address?.chip_bg_color}
							textColor={theme?.order_management?.change_address?.chip_text_color}
							size={'small'}
						/>
					)}
				</Grid>
			)}
		</Grid>
	);
};

export default BillingAddressCard;
