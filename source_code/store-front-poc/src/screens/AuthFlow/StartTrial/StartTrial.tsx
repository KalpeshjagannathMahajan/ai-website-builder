import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Image } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { form_config, handle_message } from './Constant';
import CustomText from 'src/common/@the-source/CustomText';
import styles from 'src/common/@the-source/molecules/Login/login.module.css';
import ImageLinks from 'src/assets/images/ImageLinks';
import { start_trial } from 'src/utils/api_requests/login';
import { useNavigate } from 'react-router-dom';
import { show_toast } from 'src/actions/message';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { text_colors } from 'src/utils/light.theme';

const Login = () => {
	const [loading, set_loading] = useState<boolean>(false);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const methods = useForm({ defaultValues: {} });
	const { getValues, setValue, control, handleSubmit } = methods;

	const onSubmit = async () => {
		set_loading(true);
		const temp: any = getValues();
		delete temp.country_code;
		const payload = {
			...temp,
			phone: temp?.phone ? `+${temp.phone}` : '',
			catalog_list: [
				{
					currency: '$',
					description: 'For designer buyers',
					is_default: false,
					name: 'Designer',
					price_adjustment_type: 'percentage',
					price_adjustment_value: 0,
					status: 'active',
				},
				{
					currency: '$',
					description: 'For wholesale buyers',
					is_default: true,
					name: 'Wholesale',
					price_adjustment_type: 'percentage',
					price_adjustment_value: 0,
					status: 'active',
				},
				{
					currency: '$',
					description: 'For dealer buyers',
					is_default: false,
					name: 'Dealer',
					price_adjustment_type: 'percentage',
					price_adjustment_value: 0,
					status: 'active',
				},
			],
		};
		try {
			const response = await start_trial(payload);
			if (response?.status === 200 && response?.data?.status_code === 200) {
				const message = handle_message(
					'success',
					t('AuthFlow.StartTrial.RequestSubmittedTitle'),
					t('AuthFlow.StartTrial.RequestSubmittedSubtitle'),
				);
				dispatch<any>(show_toast(message));
				navigate('/');
			} else {
				const message = handle_message('error', t('AuthFlow.StartTrial.SomethingWentWrong'), '');
				dispatch<any>(show_toast(message));
			}
		} catch (error: any) {
			console.error(error);
			const message = handle_message('error', error?.response?.data?.message || t('AuthFlow.StartTrial.SomethingWentWrong'), '');
			dispatch<any>(show_toast(message));
		} finally {
			set_loading(false);
		}
	};

	const bookDemoClick = () => {
		navigate('/');
	};

	return (
		<Box className={styles.container}>
			<Grid className={styles.layout}>
				<Grid className={styles.innerContainer} container>
					<Grid xs={12} className={styles.companyLogo}>
						<Image height='34px' width='auto' src={ImageLinks.LogoWithText} />
					</Grid>
					<Grid xs={12} mt={1}>
						<CustomText type='H6' color={text_colors?.primary} style={{ textAlign: 'center' }}>
							{t('AuthFlow.Login.CompanyDescription')}
						</CustomText>
					</Grid>
					<Grid display={'flex'} justifyContent={'center'} gap={2} width={'100%'} flexWrap={'wrap'} mt={4}>
						<FormProvider {...methods}>
							{_.map(form_config, (form) => {
								return (
									<Grid key={form?.id} width={form?.id === 'first_name' || form?.id === 'last_name' ? '47%' : '100%'}>
										<FormBuilder
											name={form?.id}
											label={form?.name}
											id={form?.id}
											type={form?.type}
											validations={{
												required: form?.required,
												email: form?.type === 'email',
												phone: form?.type === 'phone',
											}}
											placeholder={form?.placeholder}
											options={form?.options}
											getValues={getValues}
											setValue={setValue}
											control={control}
											register={methods.register}
										/>
									</Grid>
								);
							})}
						</FormProvider>
					</Grid>

					<br />
					<Grid className={styles.loginBtnGrid} container>
						<Button fullWidth loading={loading} onClick={handleSubmit(onSubmit)} type='submit'>
							Start trial
						</Button>
					</Grid>
					<Grid className={styles.footer}>
						<CustomText type='Body'>Already have an account?</CustomText>
						<Button variant='text' onClick={bookDemoClick}>
							Log in
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Login;
