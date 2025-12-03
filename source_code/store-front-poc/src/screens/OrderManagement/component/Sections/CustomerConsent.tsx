import { useContext, useRef, useState } from 'react';
import { Box, Button, Checkbox, Grid, Icon, Image, Skeleton } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import { useTranslation } from 'react-i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';
import { background_colors, primary, text_colors, secondary } from 'src/utils/light.theme';
import order_management from 'src/utils/api_requests/orderManagment';
import { error as error_color } from 'src/utils/common.theme';
import { allValuesEmpty } from 'src/utils/utils';
import useStyles from '../../styles';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

interface CustomerConsentProps {
	data: any;
	is_accordion?: boolean;
	container_style?: any;
}

const signature_style = {
	background: background_colors?.secondary,
	borderRadius: '8px',
	alignContent: 'center',
	justifyContent: 'center',
	width: '250px',
	border: `2px dotted ${secondary?.[400]}`,
};

const upload_signature_style = {
	background: primary?.[50],
	borderRadius: '8px',
	alignContent: 'center',
	justifyContent: 'center',
	gap: '1rem',
	width: '250px',
	cursor: 'pointer',
};

const CustomerConsent = ({ data, is_accordion = false, container_style = {} }: CustomerConsentProps) => {
	const {
		section_mode,
		handle_set_section_mode,
		update_document_loader,
		signature_file,
		customer_consent_box,
		set_customer_consent_box,
		set_signature_file,
		handle_update_document,
		document_data,
		attribute_data,
		set_success_toast,
		cart_metadata,
		customer_metadata,
	} = useContext(OrderManagementContext);

	const classes = useStyles();

	const { t } = useTranslation();
	const fileInputRef: any = useRef();
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState<any>({});

	const attributes = _.get(data, 'attributes', []);

	const handleChange = (event: any) => {
		set_loading(true);
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const file_data: any = _.head(event?.target?.files);

		const isImageFile = (file: File): boolean => {
			return file.type.startsWith('image/');
		};

		if (file_data && isImageFile(file_data)) {
			const fmData = new FormData();
			fmData.append('file', file_data);

			order_management
				.upload_signature(document_data?.id, fmData, config)
				.then((res: any) => {
					if (res?.status_code === 200) {
						set_signature_file(res?.data?.url);
						set_loading(false);
					}
				})
				.catch((err) => {
					set_signature_file('');
					set_loading(false);
					console.error(err);
				});
		} else {
			set_loading(false);
			set_success_toast({
				open: true,
				title: 'Please upload a valid image file.',
				subtitle: '',
				state: 'warning',
			});
		}
	};

	const handle_cancel = () => {
		handle_set_section_mode('customer_concent', 'view');
		set_signature_file(_.get(document_data?.attributes, 'signature'));
		set_customer_consent_box(_.get(document_data?.attributes, 'customer_consent'));
		set_error({});
	};

	const handle_submit = () => {
		// check error
		let _error: any = {};
		let is_error = false;
		attributes.forEach((item: any) => {
			if (item?.required) {
				if (item?.type === 'checkbox' && !customer_consent_box) {
					_error[item?.id] = true;
					is_error = true;
				} else if (item?.type === 'signature' && _.isEmpty(signature_file)) {
					_error[item?.id] = true;
					is_error = true;
				}
			} else {
				_error[item?.id] = false;
			}
		});

		if (is_error) {
			set_error(_error);
			return;
		}

		handle_update_document({
			customer_consent: customer_consent_box,
			signature: signature_file,
		});
	};

	const handle_check_mandatory = () => {
		return (
			attributes?.some((attr: any) => {
				return attr?.required && attr?.is_display && allValuesEmpty(attribute_data[attr?.id]);
			}) || false
		);
	};

	const handle_mandatory = () => {
		return (
			<>
				{handle_check_mandatory() && !is_accordion && (
					<CustomText type='Caption' style={{ fontSize: 13 }} color={error_color?.main}>
						{t('OrderManagement.UserDetailSection.Mandatory')}
					</CustomText>
				)}
			</>
		);
	};

	const handle_render_view_cta = () => {
		return (
			<Grid className={classes.textAlignmentContainer} py={1}>
				<Box className={classes.buttonContainer}>
					<Button variant='outlined' onClick={handle_cancel} width='100%' disabled={loading}>
						{t('OrderManagement.Buttons.Cancel')}
					</Button>
					<Button
						variant='contained'
						type='submit'
						disabled={loading}
						loading={update_document_loader}
						loaderSize='20px'
						onClick={() => handle_submit()}
						width='100%'>
						{t('OrderManagement.Buttons.Save')}
					</Button>
				</Box>
			</Grid>
		);
	};

	const handle_render_view_section = () => {
		return (
			<Grid container flexDirection='row' key={data?.name}>
				{!is_accordion && (
					<Grid item xs={is_accordion ? 3 : 4} md={is_accordion ? 3 : 4} sm={is_accordion ? 4 : 5.5}>
						<CustomText type='Subtitle' color={handle_check_mandatory() && !is_accordion ? error_color?.main : text_colors?.black}>
							{data?.name}
						</CustomText>
						{handle_mandatory()}
					</Grid>
				)}

				<Grid item xs={is_accordion ? 12 : 8} md={is_accordion ? 12 : 8} sm={is_accordion ? 12 : 6.5}>
					{_.map(attributes, (item) => {
						const type = item?.type;

						if (!item?.is_display) return;

						if (type === 'checkbox') {
							return (
								<CustomText>
									<Checkbox sx={{ padding: '0', marginRight: '10px' }} checked={customer_consent_box} disabled={true} />
									{item?.name}
								</CustomText>
							);
						}

						if (type === 'signature') {
							return _.isEmpty(signature_file) ? (
								<Grid container py={2} px={1} mt={1} sx={signature_style}>
									<CustomText type='Subtitle'>No signature added</CustomText>
								</Grid>
							) : (
								<Grid container px={2} py={1} mt={1} sx={signature_style}>
									<Image src={signature_file} width={120} height={100} />
								</Grid>
							);
						}
					})}
				</Grid>
			</Grid>
		);
	};
	const handle_add_signature_clicked = () => {
		fileInputRef.current.click();
		Mixpanel.track(Events.ADD_SIGNATURE_CLICKED, {
			tab_name: 'Home',
			page_name: 'document_review_page',
			section_name: '',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
		});
	};
	const handle_edit_signature_clicked = () => {
		fileInputRef.current.click();
		Mixpanel.track(Events.EDIT_SIGNATURE_CLICKED, {
			tab_name: 'Home',
			page_name: 'document_review_page',
			section_name: '',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
		});
	};
	const handle_render_edit_section = () => {
		return (
			<Grid container flexDirection='row' key={data?.name}>
				<Grid item xs={is_accordion ? 3 : 4} md={is_accordion ? 3 : 4} sm={is_accordion ? 4 : 5.5}>
					<CustomText type='Subtitle' color={handle_check_mandatory() && !is_accordion ? error_color?.main : text_colors?.black}>
						{data?.name}
					</CustomText>
					{handle_mandatory()}
				</Grid>

				<Grid item xs={is_accordion ? 9 : 8} md={is_accordion ? 9 : 8} sm={is_accordion ? 8 : 6.5}>
					{_.map(attributes, (item) => {
						const type = item?.type;

						if (!item?.is_display) return;

						if (type === 'checkbox') {
							return (
								<>
									<CustomText>
										<Checkbox
											sx={{ padding: '0', marginRight: '10px' }}
											checked={customer_consent_box}
											onChange={() => set_customer_consent_box((prev: any) => !prev)}
										/>
										{item?.name}
									</CustomText>
									{error[item?.id] && <CustomText color={error_color?.main}>This field is required</CustomText>}
								</>
							);
						}

						if (type === 'signature') {
							if (loading) return <Skeleton variant='rounded' width={250} height={120} sx={{ marginTop: '1rem' }} />;

							return _.isEmpty(signature_file) ? (
								<>
									<Grid container py={2} px={1} mt={1} sx={upload_signature_style} onClick={handle_add_signature_clicked}>
										<input onChange={handleChange} multiple={false} ref={fileInputRef} accept='image/*' type='file' hidden />
										<Icon iconName='IconPlus' color={primary?.main} />
										<CustomText type='Subtitle' color={primary?.main}>
											Upload signature
										</CustomText>
									</Grid>
									{error[item?.id] && <CustomText color={error_color?.main}>This field is required</CustomText>}
								</>
							) : (
								<Grid
									container
									px={2}
									py={1}
									mt={1}
									sx={{
										...signature_style,
										gap: 2,
										justifyContent: 'space-between',
									}}>
									<Image src={signature_file} width={120} height={100} />

									<Grid>
										<Icon
											iconName='IconEdit'
											color={primary?.main}
											sx={{ cursor: 'pointer', marginRight: '1rem' }}
											onClick={() => handle_edit_signature_clicked()}
										/>
										<input
											onChange={handleChange}
											multiple={false}
											ref={fileInputRef}
											accept='image/*'
											type='file'
											style={{ display: 'none' }}
										/>
										<Icon iconName='IconTrash' color={primary?.main} sx={{ cursor: 'pointer' }} onClick={() => set_signature_file('')} />
									</Grid>
								</Grid>
							);
						}
					})}
				</Grid>
			</Grid>
		);
	};

	const handle_customer_consent_section = () => {
		if (is_accordion) {
			return handle_render_view_section();
		} else {
			return (
				<Grid container bgcolor='white'>
					<Grid item md={9} sm={9} xs={9} lg={9} xl={9} gap={1.5}>
						{section_mode?.customer_concent === 'view' ? handle_render_view_section() : handle_render_edit_section()}
					</Grid>

					<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
						<Grid item md={3} sm={3} xs={3} lg={3} xl={3} textAlign='right' className={classes.textAlignmentContainer}>
							{section_mode?.customer_concent === 'view' && (
								<CustomText
									type='Subtitle'
									onClick={() => handle_set_section_mode('customer_concent', 'edit')}
									style={{
										cursor: 'pointer',
										color: primary?.main,
									}}>
									{t('OrderManagement.Buttons.Edit')}
								</CustomText>
							)}
						</Grid>
					</Can>
				</Grid>
			);
		}
	};

	return (
		<Box
			className={classes.gridContainerStyle}
			p={is_accordion ? 0 : 'auto'}
			sx={{ paddingTop: `${is_accordion ? '0 !important' : 'inherit'}` }}
			gap={1}
			style={container_style}>
			{handle_customer_consent_section()}
			{section_mode?.customer_concent === 'edit' && handle_render_view_cta()}
		</Box>
	);
};

export default CustomerConsent;
