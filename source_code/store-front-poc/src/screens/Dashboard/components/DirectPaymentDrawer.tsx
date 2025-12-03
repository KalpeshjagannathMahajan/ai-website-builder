import { Divider } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import DirectPaymentDrawerSkeleton from './DirectPaymentDrawerSkeleton';
import PosPaymentImage from 'src/assets/images/PosPayment.svg';
import { fields } from './mock';
import TerminalModal from './TerminalModal';
import useDashboard from '../useDashboard';
import { useTheme } from '@mui/material/styles';

interface Props {
	is_visible: boolean;
	close: any;
	currency: string;
}

const DirectPaymentComp = ({ is_visible, close, currency }: Props) => {
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [payment_config, set_payment_config] = useState<any>(null);
	const theme: any = useTheme();
	const { complete, setIsPolling, is_terminal_modal_visible, set_is_terminal_modal_visible, transaction_data } = useDashboard();

	const methods = useForm({
		defaultValues: {},
	});

	const handle_get_payment_config = () => {
		set_is_loading(true);
		api_requests.buyer
			.get_payment_config({})
			.then((res: any) => {
				if (res?.status === 200) {
					set_payment_config(res?.collect_payment_methods?.terminal?.attributes);
					set_is_loading(false);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		handle_get_payment_config();
	}, []);

	const { control, getValues, setValue }: any = methods;

	const handle_submit = () => {
		set_is_button_loading(true);
		const payload = {
			...getValues(),
			collect_payment_method: 'terminal',
			attributes: {
				terminal_id: getValues().terminal_id,
			},
		};
		api_requests.buyer
			.collect_direct_payment(payload)
			.then((res: any) => {
				if (res?.transaction_status === 'pending') setIsPolling({ data: res, state: true });
				complete(res);
			})
			.catch((err) => {
				console.log(err);
				complete({
					transaction_status: 'failed',
					transaction_amount: '',
					transaction_header: 'Payment failed',
				});
			})
			.finally(() => {
				set_is_button_loading(false);
			});
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Payment.DirectPayment')}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Grid
					display={'flex'}
					justifyContent={'space-between'}
					alignItems={'center'}
					width={'50%'}
					height={36}
					px={0.8}
					py={0.6}
					sx={{ background: theme?.payments?.direct_payment?.footer?.background, borderRadius: '8px' }}>
					<CustomText type='H3'>{t('Common.CollectPaymentDrawer.Charge')}</CustomText>
					<CustomText type='H3' color={theme?.payments?.direct_payment?.footer?.text}>
						$ {getValues()?.custom_amount_to_pay || 0}
					</CustomText>
				</Grid>
				<Button
					disabled={!getValues()?.terminal_id || !getValues()?.custom_amount_to_pay.trim()}
					loading={is_button_loading}
					onClick={handle_submit}
					sx={{ padding: '5px 24px' }}>
					{t('Common.CollectPaymentDrawer.Charge')}
				</Button>
			</Grid>
		);
	};

	const handle_top = () => {
		return (
			<Grid display='flex' direction='column' gap={2.4} mt={1}>
				<FormProvider {...methods}>
					{fields?.map((field: any) => {
						return (
							<FormBuilder
								placeholder={field?.name}
								label={field?.name}
								name={field?.id}
								validations={{
									required: field?.required,
									amount: field?.type === 'amount',
								}}
								defaultValue={field?.value}
								type={field?.type}
								options={field?.options}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
								disableFuture={field?.type === 'date'}
							/>
						);
					})}
				</FormProvider>
			</Grid>
		);
	};
	const handle_bottom = () => {
		return (
			<Grid display='flex' direction='column' gap={2.4}>
				<CustomText type='Title'>{t('Common.CollectPaymentDrawer.ChooseTerminal')}</CustomText>
				<Grid display='flex' alignItems='center' gap={0.8} px={1} py={0.6} borderRadius={0.8} sx={theme?.payments?.direct_payment?.content}>
					<Icon iconName='IconInfoCircle'></Icon>
					<CustomText type='Body'>{t('Common.CollectPaymentDrawer.TerminalOn')}</CustomText>
				</Grid>
				<FormProvider {...methods}>
					<FormBuilder
						placeholder={payment_config?.name}
						label={payment_config?.name}
						name={payment_config?.id}
						validations={{
							required: payment_config?.required,
						}}
						defaultValue={payment_config?.value || payment_config?.options?.[0]?.value}
						type={payment_config?.type}
						options={payment_config?.options}
						control={control}
						register={methods?.register}
						getValues={getValues}
						setValue={setValue}
						disableFuture={payment_config?.type === 'date'}
					/>
				</FormProvider>
				<Image style={{ marginTop: '3rem' }} src={PosPaymentImage} width='100%' height={'auto'} />
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				{handle_top()}
				<hr></hr>
				{handle_bottom()}
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return (
		<>
			<TerminalModal
				is_visible={is_terminal_modal_visible}
				transaction_data={transaction_data}
				close={() => {
					set_is_terminal_modal_visible(false);
					close();
				}}
				retry={() => set_is_terminal_modal_visible(false)}
				currency={currency}
			/>
			<Drawer
				width={480}
				open={is_visible}
				onClose={close}
				content={is_loading ? <DirectPaymentDrawerSkeleton /> : handle_render_drawer()}
			/>
		</>
	);
};

const DirectPaymentDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <DirectPaymentComp {...props} />;
};

export default DirectPaymentDrawer;
