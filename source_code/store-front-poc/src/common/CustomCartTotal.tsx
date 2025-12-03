import { Accordion, Grid } from './@the-source/atoms';
import { Divider, useTheme } from '@mui/material';
import CustomText from './@the-source/CustomText';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import utils from 'src/utils/utils';
import { colors } from 'src/utils/theme';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { text_colors } from 'src/utils/light.theme';

import { get_each_items_count } from 'src/screens/CartSummary/helper';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface Props {
	cart_group_data: any;
	handle_display_total: any;
	expanded: any;
	handleChange: any;
	cart: any;
}

const CustomCartTotal = ({ cart_group_data, handle_display_total, expanded, handleChange, cart }: Props) => {
	const { cart_grouping_config = {} } = useSelector((state: any) => state?.settings) || {};
	const show_grouping_data =
		utils.show_grouping_data(cart_grouping_config, cart_group_data) && (cart_grouping_config?.show_detail_cart_summary || is_ultron);
	const theme: any = useTheme();

	const handle_cart_total_content = () => {
		return (
			<Grid container>
				<Divider sx={{ marginBottom: '10px' }} />
				<Grid container>
					{_.map(cart_group_data, (item, index: number) => {
						const { base_name = '', sub_group_name = '', group_total_price = 0, group_currency = '' } = item;
						const count = get_each_items_count(cart, item?.products);

						if (count === 0) return;
						const is_last = index === _.size(cart_group_data) - 1;
						return (
							<Grid container justifyContent='space-between' p={'6px'} mb={is_last ? 1 : 0}>
								<Grid item xs={8}>
									<CustomText type='Body'>
										{base_name} ({count})
									</CustomText>

									<CustomText color={text_colors?.primary} type='Caption'>
										{sub_group_name}
									</CustomText>
								</Grid>
								<Grid item xs={4} sx={{ textAlign: 'right' }}>
									<CustomText type='Body'>{get_formatted_price_with_currency(group_currency, group_total_price)}</CustomText>
								</Grid>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
		);
	};

	if (!show_grouping_data) return handle_display_total();

	return (
		show_grouping_data && (
			<Accordion
				expanded={expanded}
				id={'cart_total'}
				on_change={handleChange}
				content={[
					{
						expandedContent: handle_cart_total_content(),
						title: handle_display_total(),
					},
				]}
				style={{
					...theme?.cart_summary?.custom_cart_total,
				}}
				contentBackground={theme?.cart_summary?.background}
				containerStyle={{ padding: 0 }}
				titleStyle={{
					padding: 0,
				}}
				expandIconColor={colors.secondary_text}
			/>
		)
	);
};

export default CustomCartTotal;
