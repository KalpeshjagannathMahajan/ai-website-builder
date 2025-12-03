import { useEffect } from 'react';
import { Accordion, Grid, Icon, Image } from './@the-source/atoms';
import CustomText from './@the-source/CustomText';
import _ from 'lodash';
import { background_colors, custom_stepper_text_color } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import { useSelector } from 'react-redux';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { useMediaQuery, useTheme } from '@mui/material';
import ImageLinks from 'src/assets/images/ImageLinks';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface Props {
	cart_group_data: any;
	handle_product_card: any;
	expanded: any;
	handleChange: any;
	toggle_button_value: string;
	set_expanded: any;
	show_errors_only_product?: boolean;
	errors?: any;
}

const attr_dot = {
	transform: 'scale(0.72)',
	color: custom_stepper_text_color?.grey,
	width: '15px',
};

const AccordionProductListing = ({
	cart_group_data,
	handle_product_card,
	expanded,
	handleChange,
	toggle_button_value,
	set_expanded,
	show_errors_only_product,
	errors,
}: Props) => {
	const { tenant_container_enabled = false } = useSelector((state: any) => state?.settings?.cart_container_config);
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const { cart_grouping_config = {} } = useSelector((state: any) => state?.settings) || {};
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const handle_render_title = (item: any) => {
		const {
			base_name = '',
			sub_group_name = '',
			group_total_price = 0,
			group_currency = '',
			group_volume_data = {},
			cart_items = [],
		} = item;
		const count = _.size(cart_items);
		return (
			<Grid container justifyContent='space-between' px={1} alignItems='center' id={base_name}>
				<Grid item>
					<Grid
						container
						direction='row'
						alignItems='center'
						gap={0.5}
						sx={{ width: is_small_screen ? 'auto' : '500px', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
						<CustomText type='H3' color={custom_stepper_text_color?.grey}>
							{base_name} ({count} {count > 1 ? 'products' : 'product'})
						</CustomText>
						{sub_group_name && <Icon iconName='IconPointFilled' sx={attr_dot} />}
						<CustomText type='Body'>{sub_group_name}</CustomText>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction='row' alignItems='center' gap={0.5}>
						{(cart_grouping_config?.show_group_total || is_ultron) &&
							(is_retail_mode ? (
								<Image src={ImageLinks.price_locked} width={is_small_screen ? 100 : 140} height={is_small_screen ? 17 : 26} />
							) : (
								<CustomText color={custom_stepper_text_color?.grey} type='Subtitle'>
									{get_formatted_price_with_currency(group_currency, group_total_price)}
								</CustomText>
							))}
						{tenant_container_enabled && group_volume_data && toggle_button_value && (
							<>
								<Icon iconName='IconPointFilled' sx={attr_dot} />
								<CustomText color={custom_stepper_text_color?.grey} type='Subtitle'>
									{group_volume_data?.[toggle_button_value]} {toggle_button_value}
								</CustomText>
							</>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	};

	useEffect(() => {
		const header_names = _.map(cart_group_data, (item, index: number) => `${item?.base_name}_${index}`);
		set_expanded(header_names);
	}, [cart_group_data]);

	return _.map(cart_group_data, (item: any, index: number) => {
		const count = _.size(item?.cart_items);
		if (count === 0) return;

		const filtered_products = show_errors_only_product ? _.filter(item?.products, (key) => errors && errors?.[key]) : item?.products;

		if (filtered_products?.length === 0) return;

		return (
			<Accordion
				expanded={expanded}
				id={`${item?.base_name}_${index}`}
				on_change={handleChange}
				content={[
					{
						expandedContent: handle_product_card(item?.products),
						title: handle_render_title(item),
					},
				]}
				style={{
					...theme?.cart_summary?.product_listing,
				}}
				contentBackground={background_colors?.secondary}
				containerStyle={{ padding: 0, paddingBottom: '1.2rem' }}
				titleStyle={{ padding: 0 }}
				expandIconColor={colors.secondary_text}
			/>
		);
	});
};

export default AccordionProductListing;
