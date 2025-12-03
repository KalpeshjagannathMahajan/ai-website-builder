import { filter, get, includes, isEmpty } from 'lodash';
import { Grid } from './atoms';
import CustomText from './CustomText';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import utils from 'src/utils/utils';
import { master_discount_rule, valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { colors } from 'src/utils/theme';
import { useTheme } from '@mui/material';

const useStyles = makeStyles(() => ({
	text_overflow: {
		display: 'flex',
		alignItems: 'center',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		flexDirection: 'row',
		gap: '5px',
	},
}));

interface PriceViewProps {
	styles?: any;
	product?: any;
	discount_campaigns?: any;
	currency_symbol?: string;
	column?: any;
	data_values?: any;
	show_stack_ui?: boolean;
	custom_data?: any;
	custom_text_types?: {
		base_price_type?: any;
		discount_applied_type?: any;
		discount_value_type?: any;
	};
}

const PriceView: React.FC<PriceViewProps> = ({
	styles,
	product,
	discount_campaigns,
	currency_symbol,
	column,
	data_values,
	// show_stack_ui = false,
	custom_data = {},
	custom_text_types = {},
}) => {
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const master_discount_rule_config = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const buyer = useSelector((state: any) => state?.buyer);
	const discount_applied = !isEmpty(master_discount_rule_config)
		? valid_discount_for_product(master_discount_rule_config || master_discount_rule, discount_campaigns, product, buyer)
		: {};
	const key = data_values?.is_variant ? column?.variant_key : column?.product_key;
	const price = get(product, 'pricing.price');
	const base_price = get(product, 'pricing.base_price');
	const variants_count = filter(product?.variants_meta?.variant_data_map, (e: any) => e?.is_active !== false)?.length;
	const currency = currency_symbol ?? get(product, 'pricing.currency', '$');
	const base_price_condition =
		!isEmpty(custom_data) && custom_data?.base_price_condition !== undefined
			? custom_data?.base_price_condition
			: utils.base_price_conditions(column, data_values, price, base_price);

	const view_value =
		!isEmpty(custom_data) && custom_data?.custom_value !== undefined
			? get_formatted_price_with_currency(currency, custom_data?.custom_value)
			: utils.get_column_display_value(column, product, price, data_values);

	const pricing_check = get(product, 'pricing.variant_price_range.min_value') !== get(product, 'pricing.variant_price_range.max_value');
	const discounted_value = isEmpty(discount_applied) ? view_value : discount_applied?.discounted_value;
	const is_product_type = variants_count > 1 && !data_values?.is_variant && pricing_check;

	return (
		<Grid sx={styles} className={classes.text_overflow} key={key}>
			{is_product_type || !includes(key, 'price') ? ( // removing this gives styling
				<>{view_value}</>
			) : (
				<>
					<CustomText type={custom_text_types?.base_price_type || 'Caption'}>
						{isEmpty(discount_applied)
							? view_value
							: discounted_value >= 0
							? get_formatted_price_with_currency(currency, discounted_value)
							: get_formatted_price_with_currency(currency, 0)}
					</CustomText>
					{(base_price_condition || !isEmpty(discount_applied)) && (
						<CustomText
							type={custom_text_types?.discount_applied_type || 'CaptionBold'}
							style={{
								textDecoration: 'line-through',
								color: colors.secondary_text,
							}}>
							{get_formatted_price_with_currency(currency, !isEmpty(discount_applied) ? price : base_price)}
						</CustomText>
					)}
					{!isEmpty(discount_applied) && (
						<CustomText
							type={custom_text_types?.discount_value_type || 'Caption'}
							style={{
								...theme?.product?.discount_campaign,
							}}>
							{discount_applied?.configuration?.type === 'percentage'
								? `${discount_applied?.configuration?.value}% off`
								: ` ${get_formatted_price_with_currency(
										currency,
										discount_applied?.configuration?.value > price ? price : discount_applied?.configuration?.value,
								  )} off`}
						</CustomText>
					)}
				</>
			)}
		</Grid>
	);
};

export default PriceView;
