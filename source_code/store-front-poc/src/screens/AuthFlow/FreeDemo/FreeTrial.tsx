import { Box, Button, Grid, Image } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import CustomText from 'src/common/@the-source/CustomText';
import styles from './freetrial.module.css';
import { handle_message } from '../StartTrial/Constant';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { show_toast } from 'src/actions/message';
import { text_colors } from 'src/utils/light.theme';
import { free_trial_form_config } from '../StartTrial/Constant';
import { Icon } from 'src/common/@the-source/atoms';
import UnderReviewSkeleton from '../Signup/UnderReviewSkeleton';
import { useTranslation } from 'react-i18next';
import { free_trails } from 'src/utils/api_requests/login';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';

const FreeTrial = () => {
	const [loading, set_loading] = useState<boolean>(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const methods = useForm({ defaultValues: {} });
	const { getValues, setValue, control, handleSubmit } = methods;
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading: any = useSelector((state: any) => state?.preLogin?.auth_loading);

	const onSubmit = async (data: any) => {
		set_loading(true);
		try {
			const response = await free_trails(data);
			if (response?.status === 201 || response?.data?.status_code === 201) {
				navigate(`${RouteNames.confirm_free_trial.path}`, {
					state: {
						from: 'free-trail',
					},
				});
			}
		} catch (error: any) {
			const message = handle_message('error', error?.response?.data?.message || t('AuthFlow.StartTrial.SomethingWentWrong'), '');
			dispatch<any>(show_toast(message));
		} finally {
			set_loading(false);
		}
	};

	return (
		<React.Fragment>
			{auth_loading ? (
				<UnderReviewSkeleton />
			) : (
				<Box className={styles.container}>
					<Grid className={styles.layout}>
						<Grid className={styles.innerContainer} container>
							<Grid xs={12} className={styles.companyLogo}>
								<Image imgClass={styles.logo} src={pre_login?.logo_with_name} />
							</Grid>
							<Grid xs={12} className={styles.headerContainer}>
								<Icon className={styles.iconLeft} iconName='IconArrowLeft' onClick={() => navigate(-1)} />
								<CustomText type='H1' color={text_colors?.black}>
									{t('FreeTrial.Title')}
								</CustomText>
							</Grid>
							<Grid xs={12} mt={2}>
								<CustomText type='Body' color={text_colors?.primary} className={styles.bodyText}>
									{t('FreeTrial.SubTitle')}
								</CustomText>
							</Grid>
							<Grid className={styles.formGrid} mt={{ xs: 4, lg: 8 }}>
								<FormProvider {...methods}>
									{_.map(free_trial_form_config, (form) => {
										return (
											<Grid key={form?.id} width={'100%'}>
												<FormBuilder
													name={form?.id}
													label={form?.name}
													id={form?.id}
													type={form?.type}
													validations={{
														required: form?.required,
														email: form?.type === 'email',
													}}
													placeholder={form?.placeholder}
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
							<Grid className={styles.loginBtnGrid} container>
								<Button fullWidth loading={loading} onClick={handleSubmit(onSubmit)} type='submit'>
									Sign up
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			)}
		</React.Fragment>
	);
};

export default FreeTrial;
