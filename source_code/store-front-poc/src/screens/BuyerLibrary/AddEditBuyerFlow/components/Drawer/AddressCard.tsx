/* eslint-disable @typescript-eslint/no-shadow */
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import useStyles from '../../../styles';
import { useTheme } from '@mui/material/styles';
import { text_colors } from 'src/utils/light.theme';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import api_requests from 'src/utils/api_requests';
import { useEffect, useState } from 'react';

const text_style = {
	color: text_colors.primary,
	wordWrap: 'break-word',
};

interface Props {
	item: any;
	on_card_press: any;
	address_country_options?: any;
	access_token?: string;
	base_url?: string;
}

const AddressCard = ({ item, on_card_press, address_country_options, access_token, base_url }: Props) => {
	const [selected_country_data, set_selected_country_data] = useState<any>({});
	const state = useSelector((state: RootState) => state);
	const sections = _.get(state, 'settings.details_buyer_form.sections', []);
	const first_address = _.get(_.find(sections, { key: 'addresses' }), 'addresses[0]', {});
	const countries_data_redux = _.get(_.find(first_address.attributes, { id: 'country' }), 'options', []);
	const countries_data = address_country_options?.length > 0 ? address_country_options : countries_data_redux;
	const classes = useStyles();
	const theme: any = useTheme();

	const country_item = _.find(countries_data, { value: _.lowerCase(item?.country) }) || {};
	const country_label = country_item?.label || selected_country_data?.country?.label || item?.country || '';

	const state_label = _.find(selected_country_data?.states, { value: item?.state })?.label || item?.state || '';

	useEffect(() => {
		api_requests.buyer.get_country_states({ country_code: item?.country }, access_token, base_url).then((res: any) => {
			if (res?.status === 200) {
				set_selected_country_data(res || {});
			}
		});
	}, [item?.country]);

	return (
		<Grid
			display='flex'
			flexDirection='column'
			p={2}
			onClick={on_card_press}
			border={theme?.quick_add_buyer?.border}
			borderRadius={1.2}
			style={{ borderRadius: theme?.card_?.borderRadius }}>
			<CustomText type='Subtitle' className={classes.address_card_text}>
				{item?.first_name || ''} {item?.last_name || ''}
			</CustomText>

			{item?.phone && (
				<CustomText type='Body' style={text_style} className={classes.address_card_text}>
					{item?.phone || ''}
				</CustomText>
			)}
			{item?.email && (
				<CustomText type='Body' style={text_style} className={classes.address_card_text}>
					{item?.email || ''}
				</CustomText>
			)}
			<CustomText type='Body' style={text_style} className={classes.address_card_text}>
				{item?.street_address || ''}
			</CustomText>
			<CustomText type='Body' className={classes.address_card_text}>
				{item?.address_line_2 || ''}
			</CustomText>

			<CustomText type='Body' style={text_style} className={classes.address_card_text}>
				{_.capitalize(item?.city || '')}, {_.capitalize(state_label)}, {item?.pincode || ''}
			</CustomText>

			<CustomText type='Body' style={text_style} className={classes.address_card_text}>
				{country_label || ''}
			</CustomText>
		</Grid>
	);
};

export default AddressCard;
