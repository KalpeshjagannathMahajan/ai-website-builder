import { useContext, useState } from 'react';
import _, { isNaN, toNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import CartSummaryContext from '../context';
import { colors } from 'src/utils/theme';
import CustomText from 'src/common/@the-source/CustomText';
import cart_management from 'src/utils/api_requests/cartManagement';
import { ModifyPricePayload } from 'src/@types/edit_product_price';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { get_currency_icon } from 'src/utils/common';

const price_field = {
	name: 'final_price',
	type: 'amount',
	required: true,
	placeholder: 'Enter price',
};

const EditPriceModalComponent = () => {
	const [is_btn_loading, set_is_btn_loading] = useState<boolean>(false);
	const { edit_price_modal_data, set_edit_price_modal_data, cart } = useContext(CartSummaryContext);
	const { refetch } = cart;
	const { show_modal = false, product = {} } = edit_price_modal_data;
	const cart_id = useSelector((state: RootState) => state?.buyer?.buyer_cart?.id);
	const cart_item_id = product?.cart_item_id;
	const actual_product_price = _.get(product, `items.${cart_item_id}.initial_price`, 0);
	const currency = _.get(product, 'pricing.currency');
	const is_price_modified = _.get(product, 'is_price_modified', false);
	const modified_price = _.get(product, price_field.name, 0);
	const price_to_render = is_price_modified ? modified_price : actual_product_price;
	const { t } = useTranslation();
	const methods = useForm({
		defaultValues: { [price_field.name]: price_to_render },
	});
	const { getValues, handleSubmit, control, setValue, watch } = methods;
	const curr_rendered_price = watch(price_field.name);

	const handle_close_modal = () => {
		const reset_data = {
			show_modal: false,
			product: null,
		};
		set_edit_price_modal_data(reset_data);
	};

	const handle_update_price: SubmitHandler<FieldValues> = async (values) => {
		try {
			set_is_btn_loading(true);
			// Ensure final_price is a number
			const final_price_to_send = toNumber(values?.final_price);
			if (isNaN(final_price_to_send)) {
				console.error('Final price is not a valid number');
				set_is_btn_loading(false);
				return;
			}
			const payload: ModifyPricePayload = {
				cart_id,
				final_price: final_price_to_send,
				cart_item_id: product?.cart_item_id,
				product_id: product?.id,
				is_price_modified: final_price_to_send !== actual_product_price,
			};
			const response: any = await cart_management.modify_cart_item_price(payload);
			if (response?.status === 200) {
				refetch();
			}
		} catch (error) {
			console.error(error);
			set_is_btn_loading(false);
		} finally {
			handle_close_modal();
			set_is_btn_loading(false);
		}
	};

	const handle_reset_price = () => {
		setValue(price_field?.name, actual_product_price);
	};

	const render_content = (
		<>
			<FormProvider {...methods}>
				<FormBuilder
					name={price_field.name}
					placeholder={price_field.placeholder}
					type={price_field.type}
					size={'small'}
					control={control}
					validations={{
						required: true,
						amount: true,
					}}
					label={undefined}
					style={{
						margin: '0.5rem 0',
					}}
					start_icon={<Icon color={colors.grey_800} iconName={get_currency_icon(currency)} sx={{ height: '24px', width: '24px' }} />}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
				/>
			</FormProvider>
			{parseFloat(curr_rendered_price) !== actual_product_price && (
				<Box ml={1}>
					<CustomText
						type='Subtitle'
						color={colors.primary_500}
						style={{ cursor: 'pointer', width: 'fit-content' }}
						onClick={handle_reset_price}>
						{t('CartSummary.EditProductPrice.ResetPriceToDefault')}
					</CustomText>
				</Box>
			)}
		</>
	);

	const render_footer = (
		<Grid container justifyContent='flex-end' spacing={2}>
			<Grid item>
				<Button onClick={handle_close_modal} variant='outlined'>
					{t('CartSummary.EditProductPrice.Cancel')}
				</Button>
			</Grid>
			<Grid item>
				<Button onClick={handleSubmit(handle_update_price)} variant='contained' loading={is_btn_loading}>
					{t('CartSummary.EditProductPrice.UpdatePrice')}{' '}
				</Button>
			</Grid>
		</Grid>
	);
	return (
		<Modal
			open={show_modal}
			onClose={handle_close_modal}
			title={t('CartSummary.EditProductPrice.EditPriceTitle')}
			children={render_content}
			footer={render_footer}
		/>
	);
};

export default EditPriceModalComponent;
