/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import StepContent from './StepContent';
import { Section, Page } from './interfaces';
import CustomStepper from './CustomStepper';
import { format_address, transformValues, format_details, validation } from './utils';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { add_image, create_new_lead, get_wizshop_buyer_sections, get_wizshop_create_buyer_form } from 'src/utils/api_requests/login';
import CustomAddress from './CustomAddress';
import _ from 'lodash';
import CustomOtherDetail from './CustomOtherDetail';
import { replaceUndefinedAndEmpty } from './extra';
import CustomUserSkeleton from './CustomUserSkeleton';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import utils from 'src/utils/utils';
import jsonLogic from 'json-logic-js';
import Loading from 'src/screens/Loading/Loading';
import { useDispatch } from 'react-redux';
import { forgot_password_email_action } from 'src/actions/login';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: any) => ({
	container: {
		width: '100%',
		maxWidth: 425,
		margin: 'auto',
		marginTop: '5rem',
		display: 'flex',
		flexDirection: 'column',
		'@media (max-width: 768px)': {
			maxWidth: 340,
		},
	},
	box_container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		cursor: 'pointer',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '19px',
		alignItems: 'center',
		cursor: 'pointer',
	},
	icon_gap: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '8px',
	},
	custom_text_sign_up: {
		fontSize: '20px',
		alignItems: 'center',
		fontWeight: '700',
		flexShrink: 0,
		'@media (min-width: 768px)': {
			fontSize: '24px',
		},
	},
	exist_submit_button: {
		display: 'flex',
		marginTop: '32px',
		marginBottom: '120px',
	},
	submit_button: {
		...theme?.signup_button_custom_style,
		...theme?.button_,
		...theme?.button_width_align,
		marginBottom: '0',
	},
	submit_button_address: {
		...theme?.signup_button_custom_style,
		...theme?.button_,
		...theme?.button_width_align,
		marginBottom: '120px',
	},
	save_and_continue: {
		...theme?.signup_button_custom_style,
		...theme?.button_,
		marginBottom: '0',
	},
	save_and_continue_last: {
		...theme?.signup_button_custom_style,
		...theme?.button_,
		marginBottom: '120px',
	},
}));

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const initial_show_address_sheet_detail = {
	is_open: false,
	index: 0,
	is_shipping_type: true,
};

const Signup: React.FC = () => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { action } = useParams();
	const [step, set_step] = useState(0);
	const [sections, setSections] = useState<Section[]>([]);
	const [json_logic, set_json_logic] = useState({});
	const [pages, setPages] = useState<Page[]>([]);
	const [form_value_data, set_form_value_data] = useState<Record<string, any>>({});
	const [is_submitting, set_is_submitting] = useState(false);
	const navigate = useNavigate();
	const methods = useForm({ defaultValues: {} });
	const [is_loading, set_is_loading] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const wizshop_settings = JSON.parse(localStorage.getItem('wizshop_settings') || '{}');
	const duplicate_email_allowed: boolean = wizshop_settings?.duplicate_email_allowed ?? false;

	const {
		handleSubmit,
		trigger,
		getValues,
		setValue,
		reset,
		watch,
		control,
		setError,
		clearErrors,
		formState: { errors },
	} = methods;

	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [attachment_errors, set_attachment_errors] = useState<any>({});
	const [uploaded_files, set_uploaded_files] = useState<any>([]);
	const [upload_loader, set_upload_loader] = useState(false);
	const all_attachments = watch<any>('other_details.attachments') || [];
	const all_address = watch<any>('addresses') || [];

	const [show_address_sheet_detail, set_show_address_sheet_detail] = useState(initial_show_address_sheet_detail);
	const attachments_arr = useFieldArray<any>({
		control,
		name: 'other_details.attachments',
	});
	const handle_update_form = (key: any, value: any) => {
		setValue(key, value);
	};
	const delete_attachment = (index: number) => {
		attachments_arr.remove(index);
		const _all_attachments = _.cloneDeep(all_attachments);

		if (_all_attachments?.[index]?.id?.includes('temp_')) {
			return;
		}
		_all_attachments[index].status = 'archived';

		handle_update_form('other_details.attachments', _all_attachments);
	};
	const handle_added_files = async (files: any) => {
		if (!files) {
			return;
		}

		let prev_value = getValues('other_details.attachments') || [];

		const updated_progress_data = [...prev_value];
		const uploaded_file_payload = [...prev_value];

		try {
			for (const file of files) {
				if (!file) {
					continue;
				}
				set_upload_loader(true);
				const url = URL.createObjectURL(file);
				const form_data: any = new FormData();
				form_data.append('file', file);

				const file_progress_data = {
					id: `temp_${crypto?.randomUUID()}`,
					status: 'published',
					raw_data: {
						image_url: url,
						date: file?.lastModifiedDate,
						file_name: file?.name,
						loading: 0,
					},
				};

				updated_progress_data.push(file_progress_data);

				const config = {
					headers: { 'content-type': 'multipart/form-data', accept: 'application/json' },
					onUploadProgress: ({ loaded, total }: any) => {
						let percent = Math.round((loaded / total) * 100);
						file_progress_data.raw_data.loading = percent > 90 ? 90 : percent;
						set_uploaded_files([...updated_progress_data]);
					},
				};

				try {
					const response: any = await add_image(form_data, config);

					if (response?.status === 200) {
						const obj: any = {
							id: `temp_${crypto?.randomUUID()}`,
							status: 'published',
							file_id: response?.data?.id,
							raw_data: {
								image_url: url,
								date: file?.lastModifiedDate,
								file_name: file?.name,
							},
						};
						file_progress_data.raw_data.loading = 100;
						uploaded_file_payload.push(obj);
					}
				} catch (error) {
					console.error('Error uploading file:', error);
				}
			}
		} catch (error) {
			console.error(error);
			set_show_toast({ state: true, title: 'Upload failed', sub_title: 'Please try again' });
		} finally {
			set_upload_loader(false);

			const attachment_config: any = _.find(sections, { key: 'other_details' })?.attachments_config;
			const error = utils.get_attachment_validation(uploaded_file_payload, attachment_config);
			set_attachment_errors(error);
			setValue('other_details.attachments', uploaded_file_payload);
		}
	};

	const fetch_sections_data = useCallback(async () => {
		try {
			const response = await get_wizshop_create_buyer_form();
			const data = response?.data?.data || {};
			setSections(data?.sections);
			set_json_logic(data?.auto_fill_json_logic);
		} catch (error) {
			console.error('Error fetching sections data:', error);
		}
	}, []);

	const fetch_pages_data = useCallback(async () => {
		try {
			const response = await get_wizshop_buyer_sections();
			const data = response?.data?.data || {};
			setPages(data?.pages);
		} catch (error) {
			console.error('Error fetching pages data:', error);
		}
	}, []);

	const check_address_required = () => {
		const address_section = _.find(sections, { key: 'addresses' });
		return address_section?.required;
	};
	useEffect(() => {
		fetch_sections_data();
		fetch_pages_data();
	}, [fetch_sections_data, fetch_pages_data]);

	useEffect(() => {
		reset(form_value_data);
	}, [step, form_value_data, reset]);

	const scroll_to_top = () => {
		window.scroll({
			top: 0,
		});
	};

	const get_error_message = (error: any, email: string = '') => {
		if (duplicate_email_allowed) {
			return <CustomText color={theme?.warning}>{t('AuthFlow.Validation.Warning')}</CustomText>;
		} else {
			switch (error) {
				case 'published_user':
					return (
						<CustomText color={theme?.error}>
							{t('AuthFlow.Validation.PublishUser')}
							<Link
								to='/forgot-password'
								style={{ padding: '0px 5px', textDecoration: 'underline', color: theme?.button?.color }}
								onClick={() => dispatch(forgot_password_email_action(email))}>
								{t('AuthFlow.Validation.Here')}
							</Link>
							{t('AuthFlow.Validation.SignIn')}
						</CustomText>
					);
				case 'inactive_user':
					return (
						<CustomText color={theme?.error}>
							{t('AuthFlow.Validation.InactiveUser')}
							<Link
								to='/contact-us/'
								style={{ padding: '0px 5px', textDecoration: 'underline', color: theme?.button?.color }}
								onClick={() => navigate('/contact-us/')}>
								{t('AuthFlow.Validation.Here')}
							</Link>{' '}
							{t('AuthFlow.Validation.Support')}
						</CustomText>
					);
				case 'invited_user':
					return (
						<CustomText color={theme?.error}>
							{t('AuthFlow.Validation.InvitedUser')}
							<Link
								to='/forgot-password'
								style={{ padding: '0px 5px', textDecoration: 'underline', color: theme?.button?.color }}
								onClick={() => dispatch(forgot_password_email_action(email))}>
								{t('AuthFlow.Validation.Here')}
							</Link>
						</CustomText>
					);
				case 'draft_user':
				case 'already_exists':
				case 'open_lead':
					return <CustomText color={theme?.error}>{t('AuthFlow.Validation.OpenLead')}</CustomText>;
				default:
					return null;
			}
		}
	};

	const isEmailValid = async (email: string = '') => {
		try {
			if (_.isEmpty(email)) {
				return true;
			}
			const response: any = await validation.check_duplicate_lead({ email });
			const res = response.data.response;
			if (res?.is_duplicate) {
				setError('contacts.email', {
					type: 'manual',
					message: get_error_message(res?.status, email),
				});
				return false;
			} else {
				clearErrors('contacts.email');
				return true;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handle_next = async () => {
		const isValid = await trigger();

		if (isValid) {
			const emailIsValid = await isEmailValid(getValues('contacts.email'));
			if (!emailIsValid && !duplicate_email_allowed) {
				return;
			}
			const values: any = _.clone(getValues());
			replaceUndefinedAndEmpty(values);

			set_form_value_data((prevData) => ({
				...prevData,
				...values,
			}));

			if (!_.isEmpty(json_logic)) {
				_.forEach(json_logic, (logic, key) => {
					const data = getValues();
					const value = jsonLogic.apply(logic, data);
					setValue(key, value);
				});
			}

			set_step((prevStep) => prevStep + 1);
		}
	};

	useEffect(() => {
		scroll_to_top();
	}, [pages, step]);

	const send_payload = async (form_data: any) => {
		try {
			await create_new_lead(form_data);
			navigate('/under-review');
		} catch (err) {
			console.error(err);
		}
	};
	const handle_default_preferences = (preferences: any) => {
		const default_preferences: any = {};
		_.forEach(preferences?.attributes, (field: any) => {
			if (field?.value) {
				default_preferences[field?.id] = field?.value;
			}
		});
		return default_preferences;
	};
	const handle_existing = () => {
		if (!_.isEmpty(json_logic)) {
			_.forEach(json_logic, (logic, key) => {
				const data = getValues();
				const value = jsonLogic.apply(logic, data);
				setValue(key, value);
			});
		}

		handleSubmit(onSubmit)();
	};

	const onSubmit = async (data: any) => {
		const emailIsValid = await isEmailValid(getValues('contacts.email'));
		if (!emailIsValid && !duplicate_email_allowed) {
			return;
		}

		set_is_loading(true);
		if (action === 'existing') {
			replaceUndefinedAndEmpty(data);
			const existingSections = sections.map((section) => section?.key);
			const pagesSection: any = pages?.[step]?.sections || [];
			const transformedData = transformValues(data, pagesSection, existingSections);
			const contact_info_update = format_address(transformedData?.contacts);
			const payload_exist = { ...transformedData, contacts: contact_info_update, customer_type: 'existing_customer' };
			send_payload(payload_exist);
			set_is_loading(false);
			return;
		}

		if (action === 'new') {
			if (pages?.[step]?.sections?.includes('other_details')) {
				// utils function
				const attachment_config: any = _.find(sections, { key: 'other_details' })?.attachments_config;
				const _error = utils.get_attachment_validation(all_attachments, attachment_config);
				set_attachment_errors(_error);
				if (!_.isEmpty(_error)) {
					set_is_loading(false);
					return;
				}
			}
			handle_next();

			const form_values: any = _.clone(getValues());
			const { basic_details, billing_address, contacts, country_code, shipping_address, other_details } = form_values;
			const billing = `temp_${crypto.randomUUID()}`;
			const shipping = `temp_${crypto.randomUUID()}`;
			const contacts_id = `temp_${crypto.randomUUID()}`;
			let addresses: any = {};
			const address_page: any[] = _.find(pages, { name: 'Address' })?.sections || [];
			if (billing_address && _.includes(address_page, 'billing_address')) {
				addresses = {
					default_billing_address: billing,

					values: [{ ...billing_address, country_code, id: billing, type: 'billing' }],
				};
			}
			if (shipping_address && _.includes(address_page, 'shipping_address')) {
				addresses = {
					...addresses,
					default_shipping_address: shipping,
					values: [...addresses?.values, { ...shipping_address, country_code, id: shipping, type: 'shipping' }],
				};
			}
			const contacts_values: any = {
				primary_contact: contacts_id,
				values: [{ ...contacts, id: contacts_id }],
			};
			const preferences = _.find(sections, { key: 'preferences' });

			const format_address_data = format_address(addresses);
			const format_contacts_data = format_address(contacts_values);
			const format_other_details = format_details(other_details);
			let payload: any = {
				basic_details,
				contacts: format_contacts_data,
				other_details: format_other_details,
				customer_type: 'new_customer',
			};
			if (preferences) {
				const default_preferences = handle_default_preferences(preferences);
				payload = { ...payload, preferences: default_preferences };
			}
			if (!_.isEmpty(addresses)) {
				payload = { ...payload, addresses: format_address_data };
			}
			send_payload(payload);
			return;
		}

		set_is_submitting(true);

		setTimeout(() => {
			set_is_submitting(false);
		}, 1000);
	};

	if (_.isEmpty(sections) || _.isEmpty(pages)) {
		return <CustomUserSkeleton data={action} />;
	}

	const renderPageContent = () => {
		const page_head: any = _.head(pages);
		return (
			<Box mt={4}>
				{_.map(page_head?.sections, (sectionKey: any) => {
					const section = _.find(sections, { key: sectionKey });
					return section ? (
						<StepContent
							isEmailValid={isEmailValid}
							key={section?.key}
							section={section}
							getValues={getValues}
							setValue={setValue}
							sectionName={sectionKey}
							watch={watch}
						/>
					) : null;
				})}
			</Box>
		);
	};

	const handle_navigate = () => {
		navigate('/');
	};

	const handle_stepper_click = (index: number) => {
		if (index < step) {
			set_step(index);
		} else {
			handle_next();
		}
	};

	const renderSection = (sectionKey: any, sections: any) => {
		let section = _.find(sections, { key: sectionKey });

		if (sectionKey === 'billing_address' || sectionKey === 'shipping_address') {
			section = _.find(sections, { key: 'addresses' });
			return (
				<CustomAddress
					show_address_sheet_detail={show_address_sheet_detail}
					all_address={all_address?.values}
					buyer_fields={section}
					type={sectionKey}
					getValues={getValues}
					setValue={setValue}
					methods={methods}
					watch={watch}
					reset={reset}
					control={control}
				/>
			);
		}

		if (sectionKey === 'other_details') {
			section = _.find(sections, { key: 'other_details' });

			return (
				<CustomOtherDetail
					set_show_toast={set_show_toast}
					all_attachments={all_attachments}
					delete_attachment={delete_attachment}
					handle_added_files={handle_added_files}
					item={section}
					uploaded_files={uploaded_files}
					is_loading={upload_loader}
					getValues={getValues}
					attachment_errors={attachment_errors}
				/>
			);
		}

		if (section) {
			return (
				<StepContent
					isEmailValid={isEmailValid}
					key={section.key}
					section={section}
					getValues={getValues}
					setValue={setValue}
					sectionName={sectionKey}
					watch={watch}
				/>
			);
		}
	};
	if (is_loading) {
		return <Loading />;
	}
	return (
		<Box xs={10} sm={6} md={4} ld={3} className={classes.container}>
			<Grid container mt={is_ultron ? 0.5 : 0} className={classes.box_container}>
				<Box display='flex' className={classes.icon_gap}>
					<Icon
						className={classes.header}
						sx={{ height: '28px', width: '28px', ...theme?.backwords_icon_style }}
						iconName='IconArrowNarrowLeft'
						onClick={handle_navigate}
					/>
					<CustomText className={classes.custom_text_sign_up}>
						Sign up as {action === 'new' ? 'a' : 'an'} {action} customer
					</CustomText>
				</Box>
			</Grid>
			<FormProvider {...methods}>
				{action === 'new' ? (
					<>
						<CustomStepper active_step={step} steps={pages} on_step_click={handle_stepper_click} />
						{_.map(
							pages,
							(page, index) =>
								step === index && (
									<Box key={page?.name} sx={{ mt: 4 }}>
										{_.map(page?.sections, (sectionKey) => renderSection(sectionKey, sections))}
									</Box>
								),
						)}
						<Box className={classes.buttonContainer} mt={4}>
							{step < pages?.length - 1 && !is_submitting && (
								<Button
									variant='contained'
									className={
										pages?.[step]?.name !== 'Address' || check_address_required()
											? classes?.save_and_continue_last
											: classes.save_and_continue
									}
									disabled={!!_.get(errors, 'contacts.email') && !duplicate_email_allowed}
									onClick={handle_next}
									fullWidth>
									Save and continue
								</Button>
							)}
							{pages?.[step]?.name === 'Address' && _.find(sections, (sec) => sec.key === 'addresses')?.required === false && (
								<CustomText
									type='H3'
									color='primary'
									style={{ marginBottom: '120px' }}
									onClick={() => {
										set_step((prevStep) => prevStep + 1);
										setValue('addresses', []);
									}}>
									Skip for now
								</CustomText>
							)}
							{step === pages?.length - 1 && !is_submitting && (
								<Button
									variant='contained'
									className={pages?.[step]?.name !== 'Address' ? classes.submit_button_address : classes.submit_button}
									disabled={!_.isEmpty(errors) || upload_loader}
									fullWidth
									onClick={handleSubmit(onSubmit)}>
									Submit {is_ultron ? '' : 'request'}
								</Button>
							)}
						</Box>
					</>
				) : (
					<>
						{renderPageContent()}
						<Box className={classes.exist_submit_button}>
							<Button
								variant='contained'
								disabled={!!_.get(errors, 'contacts.email') && !duplicate_email_allowed}
								color='primary'
								fullWidth
								onClick={handle_existing}>
								Submit
							</Button>
						</Box>
					</>
				)}
			</FormProvider>
		</Box>
	);
};

export default Signup;
