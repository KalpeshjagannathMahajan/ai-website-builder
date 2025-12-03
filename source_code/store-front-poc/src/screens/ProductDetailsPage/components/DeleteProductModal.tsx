import { useContext, useState } from 'react';
import { Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import ProductDetailsContext from '../context';
import { Alert } from '@mui/material';
import { secondary, text_colors } from 'src/utils/light.theme';
import { warning } from 'src/utils/common.theme';
import _ from 'lodash';
import api_requests from 'src/utils/api_requests';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { t } from 'i18next';
import utils from 'src/utils/utils';

function DeleteProductModal() {
	const { show_delete_product_modal, set_show_delete_product_modal, product_details, selected_skus, toggle_toast, set_drawer } =
		useContext(ProductDetailsContext);
	const navigate = useNavigate();
	const { variants_meta } = product_details;
	const { variant_data_map = [] } = variants_meta;
	const [button_loading, set_button_loading] = useState(false);
	const active_variants = utils.get_active_variants(variant_data_map)?.length;

	const close = () => {
		set_show_delete_product_modal(false);
		if (active_variants > 1) set_drawer(true);
	};

	const get_string = () => {
		return _.size(selected_skus) > 1 ? 'SKUs' : 'SKU';
	};

	const subtitle_msg =
		active_variants > 1
			? t('Common.DeleteProductModal.DeleteSelectedSKU', {
					count: _.size(selected_skus),
					sku: get_string(),
			  })
			: t('Common.DeleteProductModal.DeleteProduct');

	const handle_delete_action = () => {
		set_button_loading(true);
		const payload = {
			parent_product_id: product_details?.parent_id,
			current_variant_id: product_details?.id,
			variant_ids: selected_skus,
		};

		api_requests.product_details
			.delete_product(payload)
			.then((res: any) => {
				if (res?.status === 200) {
					const { is_parent_deleted, selected_variant_id } = res?.data;

					set_show_delete_product_modal(false);

					toggle_toast({
						show: true,
						message: '',
						title: t('Common.DeleteProductModal.ToastMsg', {
							sku: get_string(),
						}),
						status: 'success',
						time: 1000,
						callback: () => {
							if (is_parent_deleted) {
								navigate(`${RouteNames.product.all_products.path}?search=`);
							} else {
								navigate(`${RouteNames.product.product_detail.routing_path}${selected_variant_id}`, { replace: true });
								window.location.reload();
							}
						},
					});
				}
			})
			.catch((err) => console.error(err))
			.finally(() => set_button_loading(false));
	};

	return (
		<Modal
			width={500}
			open={show_delete_product_modal}
			onClose={close}
			title={t('Common.DeleteProductModal.ConfirmSelected')}
			children={
				<Grid>
					<CustomText>{subtitle_msg}</CustomText>
					<Alert sx={{ my: 1, py: 0, background: warning[50] }} severity='warning' icon={<Icon iconName='IconAlertTriangle' />}>
						{t('Common.DeleteProductModal.AlertMsg', {
							sku: get_string(),
						})}
					</Alert>
				</Grid>
			}
			footer={
				<Grid container justifyContent='flex-end' spacing={2}>
					<Grid item>
						<Button onClick={close} variant='text' sx={{ border: `1px solid ${secondary[400]}`, color: text_colors.black }}>
							Cancel
						</Button>
					</Grid>
					<Grid item>
						<Button color='error' onClick={handle_delete_action} loading={button_loading}>
							{t('Common.DeleteProductModal.YesDelete')}
						</Button>
					</Grid>
				</Grid>
			}
		/>
	);
}

export default DeleteProductModal;
