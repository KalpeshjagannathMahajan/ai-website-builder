import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Grid, Icon, Image, Menu } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import utils from 'src/utils/utils';
import {
	get_formatted_price_with_currency,
	isoToDateDay,
	//  get_currency_icon
} from 'src/utils/common';
// import CustomStatusChip from './CustomStatusChip';
import CustomText from 'src/common/@the-source/CustomText';
import { DRAWER_TYPES } from '../../constants';
import { document } from '../../mock/document';
import { useDispatch, useSelector } from 'react-redux';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { t } from 'i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import api_requests from 'src/utils/api_requests';
import { set_notification_feedback } from 'src/actions/notifications';
import CustomCollapsiblePanel from 'src/common/@the-source/atoms/Accordion/CustomCollapsiblePanel';
import ShareReceiptModal from '../Drawer/ShareReceiptModal';
import CustomStepper from './CustomStep';
import useStyles from '../../styles';
import { useTheme } from '@emotion/react';
import { text_colors } from 'src/utils/light.theme';
import { Divider } from '@mui/material';
import useDownloadInvoice from '../../../../hooks/useDownloadInvoice';
import usePaymentsPermissions from 'src/hooks/usePaymentsPermissions';
import VoidAuthModal from 'src/common/Authorization/VoidAuthModal';
import AchCellRenderer from 'src/screens/Payment/component/AchCellRenderer';
import payment_constants from 'src/screens/Payment/constants';

const cart_header_style = {
	opacity: 0.6,
};

const PaymentTable = () => {
	const { table_data, document_data, handle_drawer_state, handle_drawer_type, currency, set_success_toast, set_refetch } =
		useContext(OrderManagementContext);
	const {
		// payment_status,
		document_status,
	} = document_data;
	const dispatch = useDispatch();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const payments_on_pending_approval = useSelector((state: any) => state?.settings?.payments_on_pending_approval);
	// const enable_payment_status_change = useSelector((state) => _.get(state, 'settings.enable_payment_status_change', false));
	const [open_payment_section, set_open_payment_section] = useState<any>({});
	const [open_invoice_section, set_open_invoice_section] = useState<any>({});
	const [email_modal_data, set_email_modal_data] = useState<any>({ is_open: false, track_is: '', emails: [], type: undefined });
	const classes = useStyles();
	const theme: any = useTheme();
	const [open_void_auth_modal, set_open_void_auth_modal] = useState<boolean>(false);
	const [selected_transaction, set_selected_transaction] = useState<any>(false);
	const { all_payment_refundable_total } = document_data;
	const show_refund = all_payment_refundable_total > 0;
	const { invoice_download_enabled = false } = useSelector((state: any) => state?.settings);
	const { handle_download_invoice } = useDownloadInvoice();
	const { has_any_refund_permission, has_void_authorization_permission } = usePaymentsPermissions();
	const navigate = useNavigate();

	const handle_collect_payment_click = () => {
		navigate(`/payment/form/collect/order/${document_data?.id}`, {
			state: {
				document_route: location.pathname,
			},
		});
	};

	const handle_refund_click = () => {
		navigate(`/payment/form/refund/order/${document_data?.id}`, {
			state: {
				document_route: location.pathname,
			},
		});
	};

	const handle_auth_card = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.auth_card);
	};
	const handle_void_auth = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.void_auth_card);
	};

	const handle_download_click = (ele: any) => {
		api_requests.order_management
			.download_receipt({ transaction_id: ele?.id })
			.then((res: any) => {
				if (res?.status === 200) {
					dispatch(set_notification_feedback(true));
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handle_refetch = () => {
		set_refetch((prev: any) => !prev);
	};

	const handle_render_title = (title: string) => {
		return (
			<Grid display='flex' alignItems='center' justifyContent='space-between'>
				<Grid display='flex' alignItems='center' gap={2}>
					<CustomText type='Subtitle'>{_.capitalize(title)}</CustomText>
					{/* {payment_status && enable_payment_status_change && (
						<CustomStatusChip
							bgColor='#EEF1F7'
							content={
								<Grid display='flex' alignItems='center' gap={1}>
									<Icon color={theme?.order_management?.payment_table?.icon_color} iconName={get_currency_icon(currency)} />
									<CustomText color={theme?.order_management?.payment_table?.custom_color} type='Body'>
										{payment_status_constants[payment_status]?.label || _.capitalize(payment_status)}
									</CustomText>
								</Grid>
							}
						/>
					)} */}
				</Grid>
				{(title === 'Payments' || title === 'Invoices') &&
					(document_status === document?.DocumentStatus?.confirmed ||
						(document_status === document?.DocumentStatus?.pendingApproval && payments_on_pending_approval)) && (
						<Grid display='flex' alignItems='center' gap={2}>
							<Can I={PERMISSIONS.collect_payment_for_order.slug} a={PERMISSIONS.collect_payment_for_order.permissionType}>
								<Button variant='text' onClick={handle_collect_payment_click}>
									Collect payment
								</Button>
							</Can>
							<Can
								I={PERMISSIONS.refund_credits.slug || PERMISSIONS.refund_source.slug}
								a={PERMISSIONS.refund_credits.permissionType || PERMISSIONS.refund_source.permissionType}>
								{show_refund && (
									<Menu
										LabelComponent={
											<Box className={classes.iconContainer}>
												<Icon className={classes.iconStyle} iconName='IconDotsVertical' />
											</Box>
										}
										btnStyle={{ border: 'none', padding: 0 }}
										menu={[{ label: 'Refund' }]}
										onClickMenuItem={() => handle_refund_click()}
									/>
								)}
							</Can>
						</Grid>
					)}
			</Grid>
		);
	};

	const handle_invoice_details = () => {
		const handle_toggle_invoice_section = (key: any) => {
			set_open_invoice_section((prev: any) => ({ ...prev, [key]: !open_invoice_section[key] }));
		};
		const handle_render_header = () => {
			return (
				<Grid container bgcolor={theme?.order_management?.payment_table?.bg_color} my={3} p={1} borderRadius={0.8}>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Invoice ID
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Amount
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Payment status
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Payment received
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Payment due
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Date
						</CustomText>
					</Grid>
				</Grid>
			);
		};

		const handle_click = (row_data: any) => {
			if (invoice_download_enabled) {
				handle_download_invoice(row_data?.id);
			} else if (row_data?.invoice_url) {
				window.open(row_data?.invoice_url);
			} else {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 3000,
						onClose: () => dispatch(close_toast('')),
						state: types.WARNING_STATE,
						title: t('OrderManagement.Invoices.InvalidInvoiceUrlTitle'),
						subtitle: '',
						showActions: false,
					}),
				);
			}
		};

		const handle_download_receipt = (row_data: any) => {
			if (!invoice_download_enabled) {
				window.open(row_data?.invoice_url, 'blank');
				return;
			}
			handle_download_invoice(row_data?.id);
		};

		const handle_render_cards = (ele: any) => {
			const { textColor, bgColor } = utils.get_chip_color_by_tag(String(ele?.payment_status));

			const menu_items = [];
			if (ele?.invoice_url || invoice_download_enabled)
				menu_items.push({ label: 'Download invoice', icon: 'IconDownload', onClick: () => handle_download_receipt(ele) });

			return (
				<Grid container display='flex' gap={1} alignItems='center'>
					<Grid item flex={1} display='flex' alignItems='center' gap={0.8}>
						{(ele?.payment_history?.length > 0 || ele?.summary?.length > 0) && (
							<Icon
								sx={{
									cursor: 'pointer',
								}}
								onClick={() => handle_toggle_invoice_section(ele?.id)}
								iconName={open_invoice_section[ele?.id] ? 'IconChevronDown' : 'IconChevronRight'}
							/>
						)}
						<CustomText onClick={() => handle_click(ele)} color={theme?.order_management?.payment_table?.custom_text_color}>
							{ele?.invoice_id}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={{ fontWeight: 400 }}>
							{get_formatted_price_with_currency(currency, ele?.amount)}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={{ cart_header_style, opacity: 1 }}>
							<Chip
								bgColor={bgColor}
								textColor={textColor}
								sx={{ fontSize: '1.4rem', opacity: 1, fontWeight: 400 }}
								label={ele?.payment_status}
							/>
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body'>{get_formatted_price_with_currency(currency, ele?.payment_received)}</CustomText>
					</Grid>
					<Grid display='flex' justifyContent='space-between' item flex={1}>
						<CustomText
							color={theme?.order_management?.payment_table?.grid_custom_color}
							type='Body'
							style={{ cart_header_style, opacity: 1 }}>
							${ele?.payment_due}
						</CustomText>
					</Grid>
					<Grid display='flex' justifyContent='space-between' alignItems='center' item flex={1}>
						<CustomText>{isoToDateDay(ele?.date, 'MM/DD/YYYY')}</CustomText>
						{menu_items?.length > 0 && (
							<Menu
								LabelComponent={<Icon className={classes.iconStyle} iconName='IconDotsVertical' />}
								menu={menu_items}
								onClickMenuItem={() => console.log('menu clicked')}
							/>
						)}
					</Grid>
				</Grid>
			);
		};

		const handle_invoice_card = (ele: any) => {
			return <React.Fragment key={ele?.invoice_id}>{handle_render_cards(ele)}</React.Fragment>;
		};

		return (
			<Grid display='flex' direction='column' gap={2}>
				{handle_render_header()}
				{_.map(table_data?.invoices, (ele: any) => (
					<Grid
						border={theme?.order_management?.payment_table?.border}
						sx={{ background: open_invoice_section[ele?.id] ? 'rgba(247, 248, 248, 1)' : '#fff' }}
						px={1.6}
						py={1.2}
						borderRadius={1.2}
						key={ele.id}>
						<CustomCollapsiblePanel is_expanded={open_invoice_section[ele?.id]} content={handle_invoice_card(ele)}>
							<Grid mt={1} px={3.2} display='flex' gap={1} flexWrap='wrap'>
								{_.map(ele?.summary, (item: any) => (
									<Grid display='flex' gap={1.6} width='48%'>
										<CustomText type='Subtitle' color={theme?.palette?.text_colors?.dark_grey}>
											{item?.label}
										</CustomText>
										<CustomText>{item?.value}</CustomText>
									</Grid>
								))}
							</Grid>
							<CustomStepper type='invoice' line_items={ele?.payment_history} />
						</CustomCollapsiblePanel>
					</Grid>
				))}
			</Grid>
		);
	};

	const handle_invoices_section = () => {
		return (
			<Grid style={{ padding: '0 1rem' }} my={3}>
				{handle_render_title('Invoices')}
				{handle_invoice_details()}
			</Grid>
		);
	};

	const copy_to_clipboard = async (link: string) => {
		await navigator.clipboard.writeText(link);
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					console.log(event);
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.SUCCESS_STATE,
				title: t('Common.Common.CopiedToClipboard'),
				subtitle: '',
				showActions: false,
			}),
		);
	};

	const handle_void_auth_click = (transaction: any) => {
		const mapped_txn = {
			...transaction,
			display_id: _.get(transaction, 'payment_id'),
			payment_method_info: { ..._.get(transaction, 'payment_method_detail', {}) },
		};
		set_selected_transaction(mapped_txn);
		set_open_void_auth_modal(true);
	};

	const handle_payment_details = () => {
		const handle_toggle_payment_section = (key: any) => {
			set_open_payment_section((prev: any) => ({ ...prev, [key]: !open_payment_section[key] }));
		};

		const handle_render_header = () => {
			return (
				<Grid container bgcolor={theme?.order_management?.payment_table?.bg_color} my={1} p={1} borderRadius={0.8} display='flex' gap={1}>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Transaction ID
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Type
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Transaction Status
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Amount
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Payment method
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Time and Date
						</CustomText>
					</Grid>
				</Grid>
			);
		};

		const handle_render_cards = (ele: any) => {
			const { textColor, bgColor } = utils.get_chip_color_by_tag(String(ele?.payment_status_label_v2 || ele?.payment_status));

			const menu_items = [];
			if (
				_.includes(['add_credits', 'purchase'], ele?.transaction_mode) &&
				_.includes(['success', 'partially_refunded', 'refunded'], ele?.transaction_status) &&
				is_ultron
			)
				menu_items.push({ label: 'Download receipt', icon: 'IconDownload', onClick: () => handle_download_click(ele) });
			if (ele?.gateway_transaction_id)
				menu_items.push({ label: 'Copy gateway ID', icon: 'IconCopy', onClick: () => copy_to_clipboard(ele?.gateway_transaction_id) });
			if (
				ele?.source === 'payment_link' &&
				_.includes(['add_credits', 'purchase'], ele?.transaction_mode) &&
				ele?.transaction_status === 'pending'
			)
				menu_items.push({ label: 'Copy payment link', icon: 'IconLink', onClick: () => copy_to_clipboard(ele?.payment_link) });
			if (
				_.includes(['add_credits', 'purchase'], ele?.transaction_mode) &&
				_.includes(['success', 'partially_refunded', 'refunded'], ele?.transaction_status)
			)
				menu_items.push({
					label: 'Share receipt',
					icon: 'IconShare',
					onClick: () =>
						set_email_modal_data({
							is_open: true,
							track_id: ele?.track_id,
							emails: ele?.notification_email_ids,
							type: 'share_receipt',
							transaction_id: ele?.id,
						}),
				});
			if (
				ele?.source === 'payment_link' &&
				_.includes(['add_credits', 'purchase'], ele?.transaction_mode) &&
				ele?.transaction_status === 'pending'
			)
				menu_items.push({
					label: 'Resend payment link',
					icon: 'IconSend',
					onClick: () =>
						set_email_modal_data({
							is_open: true,
							track_id: ele?.track_id,
							emails: ele?.payment_link_email_ids,
							type: 'resend_payment_link',
							transaction_id: ele?.id,
						}),
				});
			if (!_.isEmpty(ele?.id) && ele?.net_refundable > 0 && has_any_refund_permission) {
				menu_items.push({
					label: 'Refund',
					icon: 'IconArrowBackUp',
					onClick: () =>
						navigate(`/payment/form/refund/order/${document_data?.id}`, {
							state: {
								transaction_id: ele?.id,
								document_route: location.pathname,
							},
						}),
				});
			}

			if (has_void_authorization_permission && ele?.transaction_mode === 'authorize' && ele?.transaction_status === 'success') {
				menu_items.push({
					label: 'Void authorization',
					icon: 'IconCreditCardOff',
					onClick: () => handle_void_auth_click(ele),
				});
			}

			return (
				<Grid container display='flex' gap={1} alignItems='center'>
					<Grid item flex={1} display='flex' alignItems='center' gap={0.8}>
						{ele?.summary?.length > 0 && (
							<Icon
								sx={{
									cursor: 'pointer',
								}}
								onClick={() => handle_toggle_payment_section(ele?.id)}
								iconName={open_payment_section[ele?.id] ? 'IconChevronDown' : 'IconChevronRight'}
							/>
						)}
						<CustomText type='Subtitle' color={theme?.order_management?.payment_table?.grid_payment_color}>
							{ele?.payment_id}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText
							type='H6'
							color={
								ele?.transaction_mode_label === 'Collect'
									? theme?.order_management?.payment_table?.grid_transaction_valid_color
									: theme?.order_management?.payment_table?.grid_transaction_invalid_color
							}>
							{ele?.transaction_mode_label}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={{ cart_header_style, opacity: 1 }}>
							<Chip
								bgColor={bgColor}
								textColor={textColor}
								sx={{ fontSize: '1.4rem', opacity: 1, fontWeight: 400 }}
								label={ele?.payment_status_label_v2}
							/>
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={{ fontWeight: 400 }}>
							{get_formatted_price_with_currency(currency, ele?.amount)}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						{/* {(
							(ele?.payment_method !== 'ACH' && !_.isEmpty(ele?.payment_method)) ||
							(ele?.payment_method !== 'ACH' && ele?.source === 'manual')
						) && <Grid display='flex' alignItems='center' gap={1}>
								<CustomText type='Title'>{ele?.payment_method_detail?.title}</CustomText>
								<Image src={ele?.payment_method_detail?.logo} width={40} height={24} />
							</Grid>}
						{(ele?.payment_method === 'ACH' && (ele?.source === 'ach' || !_.isEmpty(ele?.payment_method_detail?.sub_title))) ? (
							<AchCellRenderer value={ele?.payment_method_detail?.sub_title} />
						) : '--'} */}
						{ele?.payment_method === 'Card' && ele?.source !== 'manual' ? (
							!_.isEmpty(ele?.payment_method_detail) ? (
								<Grid display='flex' alignItems='center' gap={1}>
									<CustomText type='Title'>{ele?.payment_method_detail?.title}</CustomText>
									<Image src={ele?.payment_method_detail?.logo} width={40} height={24} />
								</Grid>
							) : (
								'--'
							)
						) : ele?.payment_method === 'ACH' && (ele?.source === 'ach' || !_.isEmpty(ele?.payment_method_detail?.sub_title)) ? (
							<AchCellRenderer value={ele?.payment_method_detail?.sub_title} />
						) : (
							<CustomText type='Body' style={{ cart_header_style, opacity: 1 }}>
								{ele.payment_method || '--'}
							</CustomText>
						)}
					</Grid>
					<Grid display='flex' justifyContent='space-between' alignItems='center' item flex={1}>
						<CustomText>{isoToDateDay(ele?.date, 'MM/DD/YYYY hh:mm A')}</CustomText>
						{menu_items?.length > 0 && (
							<Menu
								LabelComponent={<Icon className={classes.iconStyle} iconName='IconDotsVertical' />}
								menu={menu_items}
								onClickMenuItem={() => console.log('menu clicked')}
							/>
						)}
					</Grid>
				</Grid>
			);
		};

		const handle_payment_card = (ele: any) => {
			return <React.Fragment key={ele?.invoice_id}>{handle_render_cards(ele)}</React.Fragment>;
		};

		const handle_click = (url: any) => {
			window.open(url, '_blank');
		};

		const handle_value_by_type = (value: any, type: string) => {
			switch (type) {
				case 'url':
					return (
						<CustomText
							style={{
								textDecoration: 'underline',
								cursor: 'pointer',
								fontWeight: 700,
							}}
							color='#4578C4'
							onClick={() => handle_click(value)}>
							{value}
						</CustomText>
					);
				default:
					return <CustomText>{value}</CustomText>;
			}
		};

		return (
			<Grid display='flex' direction='column' gap={2}>
				{handle_render_header()}

				{_.map(table_data?.transactions, (ele: any) => {
					const settlement_config =
						payment_constants.ssrm_constants.settlement_status[_.isEmpty(ele?.settlement_status) ? 'unknown' : ele?.settlement_status];
					const notes = (_.isString(ele?.notes) && ele?.notes?.trim()) || '';
					return (
						<Grid
							border={theme?.order_management?.payment_table?.border}
							sx={{ background: open_payment_section[ele?.id] ? 'rgba(247, 248, 248, 1)' : '#fff' }}
							px={1.6}
							py={1.2}
							borderRadius={is_ultron ? 1.2 : 0}
							key={ele.id}>
							<CustomCollapsiblePanel is_expanded={open_payment_section[ele?.id]} content={handle_payment_card(ele)}>
								<hr style={{ margin: '16px 0px' }}></hr>
								<Grid container borderRadius={1.2}>
									{!_.isEmpty(ele?.summary) && (
										<Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
											{!_.isEmpty(ele?.settlement_status) && (
												<Grid container mb={1}>
													<Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
														<CustomText type='Subtitle' color={text_colors?.dark_grey}>
															Settlement Status
														</CustomText>
													</Grid>
													<Grid item display='flex' xs={8} sm={8} md={8} lg={8} xl={8}>
														<Chip
															textColor={settlement_config?.text_color}
															label={settlement_config?.label}
															bgColor={settlement_config?.bg_color}
														/>
													</Grid>
												</Grid>
											)}
											{_.map(ele?.summary, (item: any) => {
												if (!item?.value) return;
												return (
													<Grid container mb={1} key={item?.label}>
														<Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
															<CustomText type='Subtitle' color={text_colors?.dark_grey}>
																{item?.label}
															</CustomText>
														</Grid>

														<Grid item display='flex' xs={8} sm={8} md={8} lg={8} xl={8}>
															{handle_value_by_type(item?.value, item?.type)}
														</Grid>
													</Grid>
												);
											})}
										</Grid>
									)}

									{!_.isEmpty(ele?.transaction_summary) && (
										<Grid
											item
											display='flex'
											justifyContent={{
												md: 'flex-start',
												lg: 'flex-end',
											}}
											alignItems='flex-start'
											xs={12}
											sm={12}
											md={12}
											lg={6}
											xl={6}>
											<Grid
												bgcolor={theme?.quick_add_buyer?.background}
												minWidth={330}
												borderRadius={is_ultron ? 1.5 : 0}
												border='1px solid rgba(0, 0, 0, 0.12)'
												px={1.5}>
												{_.map(ele?.transaction_summary, (item: any) => (
													<Grid display='flex' justifyContent='space-between' gap={10} my={1.5} key={item?.label}>
														<CustomText type='CaptionBold' color={text_colors?.dark_grey}>
															{item?.label}
														</CustomText>
														<CustomText type='Caption'>{get_formatted_price_with_currency(currency, item?.value)}</CustomText>
													</Grid>
												))}
											</Grid>
										</Grid>
									)}
								</Grid>
								{!_.isEmpty(notes) && <hr style={{ margin: '10px 0px' }}></hr>}

								{!_.isEmpty(notes) && (
									<Grid container gap={2}>
										<CustomText type='Subtitle' color='#676D77'>
											Notes
										</CustomText>
										<CustomText type='Body'>{notes}</CustomText>
									</Grid>
								)}
							</CustomCollapsiblePanel>
						</Grid>
					);
				})}
			</Grid>
		);
	};

	const handle_payments_section = () => {
		return (
			<Grid style={{ padding: '0 1rem' }} my={2}>
				{handle_render_title('Payments')}
				{handle_payment_details()}
			</Grid>
		);
	};

	const handle_auth_cards_details = () => {
		const handle_auth_header = () => {
			return (
				<Grid container bgcolor='#F2F6E7' my={1} p={1} borderRadius={0.8} display='flex' gap={1} px={2}>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Authorization ID
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Transaction Status
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Amount
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Payment Method
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={cart_header_style}>
							Time and Date
						</CustomText>
					</Grid>
				</Grid>
			);
		};

		const handle_render_cards = (ele: any) => {
			const show_captured = ele?.transaction_status === 'captured';
			const { textColor, bgColor } = utils.get_chip_color_by_tag(String(show_captured ? 'captured' : ele?.payment_status));

			return (
				<Grid container display='flex' gap={1} alignItems='center'>
					<Grid item flex={1} display='flex' alignItems='center' gap={0.8}>
						<CustomText type='Subtitle' color='rgba(22, 136, 95, 1)'>
							{ele?.payment_id}
						</CustomText>
					</Grid>

					<Grid item flex={1}>
						<CustomText type='Body' style={{ cart_header_style, opacity: 1 }}>
							<Chip
								bgColor={bgColor}
								textColor={textColor}
								sx={{ fontSize: '1.4rem', opacity: 1, fontWeight: 400 }}
								label={show_captured ? 'Captured' : ele?.payment_status_label_v2}
							/>
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						<CustomText type='Body' style={{ fontWeight: 400 }}>
							{get_formatted_price_with_currency(currency, ele?.amount)}
						</CustomText>
					</Grid>
					<Grid item flex={1}>
						{ele?.payment_method === 'Card' && ele?.source !== 'manual' ? (
							!_.isEmpty(ele?.payment_method_detail) ? (
								<Grid display='flex' alignItems='center' gap={1}>
									<CustomText type='Title'>{ele?.payment_method_detail?.title}</CustomText>
									<Image src={ele?.payment_method_detail?.logo} width={40} height={24} />
								</Grid>
							) : (
								'--'
							)
						) : (
							<CustomText type='Body' style={{ cart_header_style, opacity: 1 }}>
								{ele.payment_method || '--'}
							</CustomText>
						)}
					</Grid>
					<Grid display='flex' justifyContent='space-between' alignItems='center' item flex={1}>
						<CustomText>{isoToDateDay(ele?.date)}</CustomText>
					</Grid>
				</Grid>
			);
		};

		const handle_auth_payment_info = (ele: any) => {
			return <React.Fragment key={ele?.invoice_id}>{handle_render_cards(ele)}</React.Fragment>;
		};
		const sorted_transactions = _.sortBy(table_data?.authorized_transactions, 'date').reverse();
		return (
			<Grid display='flex' direction='column' gap={2}>
				{handle_auth_header()}
				{_.map(sorted_transactions, (ele: any) => (
					<Grid
						border={'1px solid rgba(0,0,0,0.16)'}
						sx={{ background: open_payment_section[ele?.id] ? 'rgba(247, 248, 248, 1)' : '#fff' }}
						px={1.6}
						py={1.2}
						borderRadius={1.2}
						key={ele.id}>
						{handle_auth_payment_info(ele)}
					</Grid>
				))}
			</Grid>
		);
	};

	const handle_auth_cards_section = () => {
		const is_draft = document_status === 'draft';
		return (
			<Grid style={{ padding: '0 1rem' }} my={2}>
				<Grid display='flex' alignItems='center' gap={2} sx={{ justifyContent: 'space-between' }}>
					<CustomText type='Subtitle'>Authorized cards</CustomText>
					{document_status !== 'cancelled' && (
						<Grid display={'flex'} direction={'row'} justifyContent={'flex-end'} gap={1}>
							<Can I={PERMISSIONS.create_authorization.slug} a={PERMISSIONS.create_authorization.permissionType}>
								{!is_draft && (
									<Grid item>
										<CustomText
											style={{ cursor: 'pointer' }}
											children={'Authorize card'}
											type='Subtitle'
											color={text_colors.green}
											onClick={handle_auth_card}
										/>
									</Grid>
								)}
							</Can>

							<Can I={PERMISSIONS.void_authorization.slug} a={PERMISSIONS.void_authorization.permissionType}>
								{!is_draft && (
									<Menu
										LabelComponent={<Icon className={classes.iconStyle} iconName='IconDotsVertical' />}
										btnStyle={{ border: 'none', padding: 0 }}
										menu={[{ label: 'Void authorization' }]}
										onClickMenuItem={handle_void_auth}
									/>
								)}
							</Can>
						</Grid>
					)}
				</Grid>

				{handle_auth_cards_details()}
				<Divider sx={{ marginTop: 5 }} />
			</Grid>
		);
	};

	return (
		<>
			<ShareReceiptModal
				is_visible={email_modal_data?.is_open}
				close={() => set_email_modal_data({ is_open: false, track_id: '', emails: [], transaction_id: '' })}
				document_id={document_data?.id}
				track_id={email_modal_data?.track_id}
				prefilled_emails={email_modal_data?.emails}
				type={email_modal_data?.type}
				transaction_id={email_modal_data?.transaction_id}
			/>
			{!_.isEmpty(table_data?.invoices) && handle_invoices_section()}
			{/* <Can
				I={
					PERMISSIONS.collect_payment_card.slug ||
					PERMISSIONS.collect_payment_link.slug ||
					PERMISSIONS.collect_payment_offline.slug ||
					PERMISSIONS.collect_payment_credits.slug
				}
				a={PERMISSIONS.collect_payment_card.permissionType}> */}
			{!_.isEmpty(table_data?.transactions) && handle_payments_section()}
			{/* </Can> */}
			{!_.isEmpty(table_data?.authorized_transactions) && handle_auth_cards_section()}
			{open_void_auth_modal && (
				<VoidAuthModal
					open_void_auth_modal={open_void_auth_modal}
					set_open_void_auth_modal={set_open_void_auth_modal}
					transaction={selected_transaction}
					set_toast={set_success_toast}
					callback={handle_refetch}
				/>
			)}
		</>
	);
};

export default PaymentTable;
