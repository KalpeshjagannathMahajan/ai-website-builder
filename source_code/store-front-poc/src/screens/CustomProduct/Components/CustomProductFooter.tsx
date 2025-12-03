import { Divider, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import CustomCounter from 'src/common/@the-source/molecules/CustomCounter';
import styles from '../customproduct.module.css';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface CustomProductFooterProps {
	total_value: number;
	handle_quantity_change: any;
	handle_done: any;
	is_btn_loading?: boolean;
	quantity?: number;
	custom_val?: any;
	currency: string;
}

const CustomProductFooter = ({
	total_value,
	handle_quantity_change,
	handle_done,
	is_btn_loading,
	quantity,
	custom_val,
	currency,
}: CustomProductFooterProps) => {
	const theme: any = useTheme();
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	return (
		<Grid
			className={styles.custom_product_drawer_footer}
			sx={{
				...theme?.product?.custom_product_drawer?.footer,
				justifyContent: is_retail_mode ? 'flex-end' : 'space-between',
			}}>
			{!is_retail_mode && (
				<Box
					className={styles.footer_left}
					sx={{
						...theme?.product?.custom_product_drawer?.footer_left,
					}}>
					<CustomText type='Subtitle'>Total Value : {get_formatted_price_with_currency(currency, total_value)}</CustomText>
				</Box>
			)}

			<Box className={styles.footer_binding_container}>
				<CustomCounter min={1} max={Infinity} is_mandatory={true} onChange={handle_quantity_change} defaultValue={quantity ?? quantity} />

				{!is_small_screen && (
					<Grid sx={{ margin: '0 20px 0 10px' }}>
						<Divider orientation='vertical' className={styles.footer_divider} />
					</Grid>
				)}

				<Button sx={{ width: '120px' }} onClick={handle_done} disabled={_.isEmpty(custom_val)} loading={is_btn_loading}>
					<CustomText type='H3' style={{ color: theme?.product?.custom_product_drawer?.footer_text?.color }}>
						{t('CustomProduct.CustomText.Done')}
					</CustomText>
				</Button>
			</Box>
		</Grid>
	);
};

export default CustomProductFooter;
