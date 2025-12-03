import { Box, Grid, useMediaQuery } from '@mui/material';
import styles from '../customproduct.module.css';
import { Icon, Skeleton, Tooltip, Typography } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';

interface CustomProductHeaderProps {
	custom_val: any;
	set_show_modal: (show_modal: boolean) => void;
	set_show_customise: any;
	is_loading: boolean;
	sku_id: string;
	show_more: boolean;
	data: any;
	is_edit?: boolean;
}

const CustomProductHeader = ({
	custom_val,
	data,
	set_show_modal,
	set_show_customise,
	is_loading,
	sku_id,
	show_more,
	is_edit,
}: CustomProductHeaderProps) => {
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	return (
		<Grid
			container
			sx={{
				...theme?.product?.custom_product_drawer?.header,
			}}
			justifyContent='space-between'
			direction='row'
			className={styles.custom_product_drawer_header}>
			<Box className={styles.header_container}>
				<Typography variant='h5' sx={{ display: 'flex' }}>
					<Icon
						iconName='IconArrowLeft'
						sx={{
							...theme?.product?.custom_product_drawer?.header_icon,
						}}
						className={`${styles.icon_style} ${styles.header_icon}`}
						onClick={() => {
							set_show_customise(false);
						}}
					/>
				</Typography>
				<CustomText type='H2'>{t('CustomProduct.CustomText.CustomizeProduct')}</CustomText>
				{!is_small_screen &&
					(is_loading ? (
						<Skeleton variant='rectangular' width={173} height={24} sx={{ borderRadius: '8px' }} />
					) : (
						<Box
							display='flex'
							className={styles?.header_tooltip}
							sx={{
								...theme?.product?.custom_product_drawer?.header_tooltip,
							}}>
							<Tooltip title={sku_id}>
								<span style={{ cursor: 'pointer', wordBreak: 'break-all' }}>
									SKU: {show_more ? `${sku_id}` : `${sku_id?.substring(0, 70)}...`}
								</span>
							</Tooltip>
						</Box>
					))}
			</Box>
			<Icon
				iconName='IconX'
				onClick={() => {
					if (is_edit) set_show_customise(false);
					else if (data?.length > 0 && !is_loading) set_show_modal(true);
					else set_show_customise(false);

					if (_.isEmpty(custom_val)) {
						set_show_modal(false);
						set_show_customise(false);
					}
				}}
				className={styles.icon_style}
				sx={{ cursor: 'pointer' }}
			/>
		</Grid>
	);
};

export default CustomProductHeader;
