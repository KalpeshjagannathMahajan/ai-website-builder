import { Fragment, useContext, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Grid, Icon, Menu } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import OrderManagementContext from '../../context';
import { fulfilment_status_constants, payment_status_constants, document } from '../../mock/document';
import { useParams } from 'react-router-dom';
import { get_last_synced_msg } from 'src/utils/dateUtils';
import { DOC_CONFIRM_ROUTES, DOC_SYNC_CONFIG_KEYS, DOC_SYNC_TYPES, SYNCABLE_DOC_STATUSES } from '../../constants';
import api_requests from 'src/utils/api_requests';
import { check_doc_sync_enabled, get_payload_by_sync_type } from '../../helper/helper';
import { colors } from 'src/utils/theme';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import types from 'src/utils/types';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import { Divider } from '@mui/material';
import { background_colors, custom_stepper_text_color, text_colors } from 'src/utils/light.theme';
import { PERMISSIONS } from 'src/casl/permissions';
import { check_permission } from 'src/utils/utils';
import { get_currency_icon } from 'src/utils/common';

export interface DocSyncConfig {
	key: string;
	label: string;
	type: string;
}

const loader_style = {
	width: '15px',
	height: '15px',
};

const main_container_style = {
	display: 'flex',
	justifyContent: 'space-between',
	padding: '0rem 1.2rem 1rem',
	alignItems: 'center',
};

const parent_container_style = {
	padding: '1.5rem 1rem 0.5rem',
	margin: '0rem 0rem 1rem',
	background: colors.white,
	borderRadius: '0.8rem',
};

const { TENANT_SETTINGS_KEYS } = constants;

function TagHeader({ use_custom_grid = false }) {
	const params = useParams();
	const {
		document_data,
		handle_shipment_form,
		set_success_toast,
		set_refetch,
		set_sync_loading,
		sync_loading,
		document_tag_form,
		set_document_tag_modal,
		handle_update_document,
		attribute_data,
		handle_manual_payment_form,
		is_status_form_loading,
		currency,
	} = useContext(OrderManagementContext);
	const { id } = document_data;
	const { fulfillment_status = '' } = document_data;
	const payment_status = _.get(document_data, 'payment_status', '');
	const document_status = _.get(document_data, 'document_status', '');
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const payments_on_pending_approval = useSelector((state: any) => state?.settings?.payments_on_pending_approval);
	const enable_fulfillment_status_change = useSelector((state) => _.get(state, 'settings.enable_fulfillment_status_change', false));
	const enable_payment_status_change = useSelector((state) => _.get(state, 'settings.enable_payment_status_change', false));
	const document_tags_enabled = useSelector((state) => _.get(state, 'settings.document_tags_enabled', false));
	const payment_status_chip_label = payment_status ? payment_status_constants[payment_status]?.label || payment_status : '';
	const shipment_status_chip_label = fulfillment_status ? fulfilment_status_constants[fulfillment_status]?.label || fulfillment_status : '';
	const tag_json = _.get(attribute_data, document_tag_form?.id, '');
	const tenant_settings = useSelector((state: any) => state?.settings);
	const user_details = useSelector((state: any) => state.login?.userDetails);
	const { is_integration_account, is_payments_enabled, manual_payment_status_change } = useTenantSettings({
		[TENANT_SETTINGS_KEYS.INTEGRATION_ACCOUNT_SETTING_KEY]: false,
		[TENANT_SETTINGS_KEYS.PAYMENTS_ENABLED]: false,
		[TENANT_SETTINGS_KEYS.MANUAL_PAYMENT_STATUS_CHANGE]: true,
	});

	const { doc_status = '', document_type } = params;
	const is_doc_sync_enabled = check_doc_sync_enabled(tenant_settings, DOC_SYNC_CONFIG_KEYS);
	const should_render_sync_btn =
		is_integration_account &&
		is_doc_sync_enabled &&
		document_data?.type === document.DocumentTypeEnum.ORDER &&
		SYNCABLE_DOC_STATUSES.includes(document_data?.document_status) &&
		DOC_CONFIRM_ROUTES.includes(doc_status);
	const sync_component = document_data?.last_sync_status || document_data?.last_sync_at || should_render_sync_btn;
	const shippment_permisson = check_permission(permissions, [PERMISSIONS.edit_fulfilment_status.slug]);
	const tag_permission = check_permission(permissions, [PERMISSIONS.edit_order_tag.slug]);

	const show_components: any = {
		shippment_chip:
			enable_fulfillment_status_change &&
			document_status === document.DocumentStatus?.confirmed &&
			(shippment_permisson
				? true
				: shipment_status_chip_label && shipment_status_chip_label !== fulfilment_status_constants.UNFULFILLED?.label),
		payment_chip:
			is_payments_enabled &&
			enable_payment_status_change &&
			(document_status === document.DocumentStatus?.confirmed ||
				(payments_on_pending_approval &&
					params?.doc_status === document.DocumentStatus?.pendingApproval &&
					document_status === document.DocumentStatus?.pendingApproval)),
		tags_chip: document_tags_enabled && (tag_permission ? true : tag_json),
	};
	const { t } = useTranslation();
	const chip_count = Object.values(show_components).filter((item) => Boolean(item)).length;
	const is_order = document_type === document.DocumentTypeEnum.ORDER;

	const handle_shipment_chip = () => {
		if (!show_components?.shippment_chip) return;

		if (shipment_status_chip_label && shipment_status_chip_label !== fulfilment_status_constants.UNFULFILLED?.label)
			return (
				<Chip
					bgColor={text_colors.secondary}
					sx={{ cursor: shippment_permisson ? 'pointer' : 'default' }}
					label={
						<Grid container gap={0.4} alignItems='center'>
							<Icon color={custom_stepper_text_color.grey} iconName='IconTruckDelivery' />
							<CustomText color={text_colors.black} type='Body'>
								{shipment_status_chip_label}
							</CustomText>
							{shippment_permisson && <Icon iconName='IconChevronDown' color={text_colors.black} />}
						</Grid>
					}
					onClick={shippment_permisson ? handle_shipment_form : undefined}
				/>
			);

		return (
			<Chip
				bgColor={background_colors.primary}
				sx={{ border: `1px solid ${text_colors.green}`, cursor: 'pointer' }}
				label={
					<Grid container gap={0.4} alignItems='center'>
						<Icon color={text_colors.green} iconName='IconPlus' />
						<CustomText color={text_colors.green} type='Subtitle'>
							{t('OrderManagement.DocumentTagModal.AddShipping')}
						</CustomText>
					</Grid>
				}
				onClick={handle_shipment_form}
			/>
		);
	};

	const handle_payment_chip_click = () => {
		if (manual_payment_status_change && is_order) {
			handle_manual_payment_form();
		}
	};

	const handle_payment_chip = () => {
		if (!show_components?.payment_chip) return;

		if (payment_status_chip_label)
			return (
				<Chip
					bgColor={text_colors.secondary}
					label={
						<Grid container gap={0.4} alignItems='center'>
							<Icon color={custom_stepper_text_color.grey} iconName={get_currency_icon(currency)} />
							<CustomText color={text_colors.black} type='Body'>
								{payment_status_chip_label}
							</CustomText>
							{is_order && manual_payment_status_change && (
								<Fragment>
									{is_status_form_loading ? (
										<CircularProgressBar
											style={{ width: '16px', height: '16px', marginLeft: 4, color: colors.dark_charcoal }}
											variant='indeterminate'
										/>
									) : (
										<Icon iconName='IconChevronDown' color={text_colors.black} />
									)}
								</Fragment>
							)}
						</Grid>
					}
					onClick={handle_payment_chip_click}
				/>
			);

		return (
			<Chip
				bgColor='white'
				sx={{ border: `1px solid ${text_colors.green}`, cursor: 'pointer' }}
				label={
					<Grid container gap={0.5} alignItems='center'>
						<Icon color={text_colors.green} iconName='IconPlus' />
						<CustomText color={text_colors.green} type='Subtitle'>
							{t('OrderManagement.DocumentTagModal.AddPayment')}
						</CustomText>
					</Grid>
				}
				onClick={handle_payment_chip_click}
			/>
		);
	};

	const handle_tag_chip = () => {
		if (!show_components?.tags_chip) return;

		if (tag_json)
			return (
				<Chip
					sx={{
						cursor: tag_permission ? 'pointer' : 'default',
						'&:hover': {
							backgroundColor: tag_json?.color, // Maintain the same color on hover
							opacity: 1, // Prevent any opacity changes on hover
						},
					}}
					bgColor={tag_json?.color}
					label={
						<Grid container gap={0.4} alignItems='center'>
							<Icon color={text_colors.black} iconName='IconBookmark' />
							<CustomText color={text_colors.black} type='Body'>
								{tag_json?.label}
							</CustomText>
							{tag_permission && <Icon iconName='IconChevronDown' color={text_colors.black} />}
						</Grid>
					}
					onClick={() => tag_permission && set_document_tag_modal(true)}
				/>
			);

		return (
			<Chip
				bgColor='white'
				sx={{ border: `1px solid ${text_colors.green}`, cursor: 'pointer' }}
				label={
					<Grid container gap={0.4} alignItems='center'>
						<Icon color={text_colors.green} iconName='IconPlus' />
						<CustomText color={text_colors.green} type='Subtitle'>
							{t('OrderManagement.DocumentTagModal.AddOrderTag')}
						</CustomText>
					</Grid>
				}
				onClick={() => set_document_tag_modal(true)}
			/>
		);
	};

	const handle_single_chip_design = () => {
		const chip_config = [
			{
				condition: show_components?.shippment_chip,
				label: t('OrderManagement.DocumentTagModal.FulfilmentStatus'),
				handler: handle_shipment_chip,
			},
			{
				condition: show_components?.payment_chip,
				label: t('OrderManagement.DocumentTagModal.PaymentStatus'),
				handler: handle_payment_chip,
			},
			{ condition: show_components?.tags_chip, label: t('OrderManagement.DocumentTagModal.OrderTag'), handler: handle_tag_chip },
		];

		const chip_renderer: any = _.find(chip_config, (chip: any) => chip?.condition);

		if (chip_renderer) {
			return (
				<>
					<CustomText type='H3'>{chip_renderer.label}</CustomText>
					{chip_renderer.handler()}
				</>
			);
		}

		return null;
	};

	const handle_document_sync = async (value: string, is_label: boolean = true) => {
		const sync_type = is_label
			? (_.find(DOC_SYNC_CONFIG_KEYS, (item: any) => item?.label === value) as DocSyncConfig | undefined)?.type
			: value;
		if (!sync_type) return;
		try {
			const payload = get_payload_by_sync_type(id, user_details?.tenant_id, sync_type);
			if (!payload) return;
			set_sync_loading(true);
			const response: any = await api_requests.order_management.sync_now(payload, sync_type);
			const default_msg = t('OrderManagement.OrderEndStatusInfoContainer.OrderInfoSynced');
			const is_push_success = sync_type === DOC_SYNC_TYPES.PUSH && response?.data?.is_pushed;
			const toast_states = {
				[DOC_SYNC_TYPES.PUSH]: {
					msg: response?.data?.response_message,
					state: is_push_success ? types.SUCCESS_STATE : types.ERROR_STATE,
				},
				[DOC_SYNC_TYPES.PULL]: {
					msg: default_msg,
					state: types.SUCCESS_STATE,
				},
			};
			if (response?.status === 200) {
				set_success_toast({
					open: true,
					title: toast_states[sync_type]?.msg || default_msg,
					subtitle: '',
					state: toast_states[sync_type]?.state || types.SUCCESS_STATE,
				});
				set_refetch((prev: boolean) => !prev);
			}
		} catch (error) {
			console.error(error);
			set_success_toast({
				open: true,
				title: t('OrderManagement.OrderEndStatusInfoContainer.SyncFailed'),
				subtitle: '',
				state: types.WARNING_STATE,
			});
		} finally {
			set_sync_loading(false);
		}
	};

	const is_sync_type_disable = (type: string): boolean => {
		const { is_sync, reference_id } = document_data;

		switch (type) {
			case DOC_SYNC_TYPES.PUSH:
				// Disable if document_data.is_sync is true
				return is_sync;
			case DOC_SYNC_TYPES.PULL:
				// Disable if reference_id does not exist or document_data.is_sync is false
				const has_reference_id = Boolean(reference_id);
				return !(has_reference_id && is_sync);
			default:
				// Default case: disable if the type is not recognized
				return true;
		}
	};

	const sync_menu_items = useMemo(() => {
		if (!tenant_settings) return;
		return _.chain(DOC_SYNC_CONFIG_KEYS)
			.filter(({ key }) => _.get(tenant_settings, key, false))
			.map(({ label, type }) => ({ label, disabled: is_sync_type_disable(type) }))
			.value();
	}, [tenant_settings, document_data]);

	const handle_sync_type = () => {
		const doc_sync_type = _.find(DOC_SYNC_CONFIG_KEYS, (item: any) => _.get(tenant_settings, item.key, false)) as DocSyncConfig | undefined;
		if (!doc_sync_type) return;
		handle_document_sync(doc_sync_type?.type, false);
	};

	const render_sync_text = (
		<Grid display='flex'>
			<CustomText
				type='Subtitle'
				color={colors.primary_500}
				style={{ cursor: 'pointer' }}
				onClick={sync_menu_items && sync_menu_items?.length > 1 ? undefined : handle_sync_type}>
				{sync_loading ? t('OrderManagement.OrderEndStatusInfoContainer.Syncing') : t('OrderManagement.OrderEndStatusInfoContainer.SyncNow')}
			</CustomText>
			{sync_loading && (
				<CircularProgressBar style={{ ...loader_style, marginLeft: 5, color: colors.dark_charcoal }} variant='indeterminate' />
			)}
		</Grid>
	);

	const render_sync_component = (
		<Box width={'100%'}>
			{sync_menu_items && sync_menu_items?.length > 1 ? (
				<Menu
					LabelComponent={
						<Grid display='flex' alignItems={'center'} sx={{ cursor: 'pointer' }}>
							{render_sync_text}
							{!sync_loading && <Icon iconName='IconChevronDown' color={colors.primary_500} />}
						</Grid>
					}
					btnStyle={{ border: 'none', padding: 0 }}
					menu={sync_menu_items || []}
					onClickMenuItem={(value: string) => handle_document_sync(value)}
					disabled={sync_loading}
					loading={sync_loading}
				/>
			) : (
				render_sync_text
			)}
		</Box>
	);

	const render_sync_status = (
		<Grid display='flex' justifyContent={'space-between'} alignItems={'center'} container={chip_count !== 0 ? false : true}>
			<Grid width={'100%'}>
				<Box
					display='flex'
					justifyContent={chip_count !== 0 || !document_data?.last_sync_status ? 'flex-end' : 'space-between'}
					gap={1.25}
					width={'100%'}
					alignItems={'center'}>
					{document_data?.last_sync_status && (
						<CustomText color={colors.grey_800}>
							{t('OrderManagement.OrderEndStatusInfoContainer.LastSyncStatus', {
								last_sync_status: _.capitalize(document_data?.last_sync_status),
							})}
						</CustomText>
					)}
					{should_render_sync_btn && <Grid>{render_sync_component}</Grid>}
				</Box>
				{document_data?.last_sync_at && (
					<Box mt={0.5}>
						<CustomText color={colors.grey_800}>{get_last_synced_msg(document_data?.last_sync_at)}</CustomText>
					</Box>
				)}
			</Grid>
		</Grid>
	);

	useEffect(() => {
		if (_.get(document_data?.attributes, document_tag_form?.id, '') !== '') return;

		const document_tag_options = document_tag_form?.options;
		const default_option = _.find(document_tag_options, (item) => item?.is_default);
		if (default_option)
			handle_update_document({
				[document_tag_form?.id]: default_option,
			});
	}, [id]);

	const show_divider = chip_count !== 0 || (is_integration_account && sync_component);

	const main_container = (
		<Grid sx={show_divider ? main_container_style : { padding: 0 }}>
			{chip_count === 1 && !sync_component
				? handle_single_chip_design()
				: chip_count !== 0 && (
						<Grid sx={{ display: 'flex', gap: '1rem' }}>
							{handle_payment_chip()}
							{handle_shipment_chip()}
							{handle_tag_chip()}
						</Grid>
				  )}
			{is_integration_account && sync_component && render_sync_status}
		</Grid>
	);

	if (chip_count === 0 && !sync_component) return null;

	return (
		<>
			{use_custom_grid ? (
				<Grid sx={parent_container_style}>{main_container}</Grid>
			) : (
				<>
					{main_container}
					{show_divider && <Divider sx={{ marginBottom: '0.5rem' }} />}
				</>
			)}
		</>
	);
}

export default TagHeader;
