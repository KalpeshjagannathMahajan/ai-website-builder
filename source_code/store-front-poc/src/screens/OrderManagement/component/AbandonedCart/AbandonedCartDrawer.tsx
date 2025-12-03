/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import { Avatar, Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import cart_management from 'src/utils/api_requests/cartManagement';
import BuyerToastMessage from 'src/common/SelectBuyerPanel/Components/BuyerToastMessage';
import { warning } from 'src/utils/light.theme';
import React from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import {
	calculateDaysDifference,
	customer_info_data,
	get_cart_data,
	get_duration,
	get_sales_rep_cart,
	handle_update_data,
} from '../../helper/helper';
import constants from 'src/utils/constants';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import UpdateCommentModal from './UpdateCommentModal';

import AbandonedCartProductCard from './AbandonedCartProductCard';
import { useSelector } from 'react-redux';
import { get_formatted_price_with_currency } from 'src/utils/common';
import order_listing from 'src/utils/api_requests/orderListing';
import StatusChip from 'src/common/@the-source/atoms/Chips/StatusChip';
import Events from 'src/utils/events_constants';
import utils, { get_customer_metadata } from 'src/utils/utils';
import { set_buyer } from 'src/actions/buyer';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { Mixpanel } from 'src/mixpanel';
import CartReviewModal from './CartReviewModal';
import { t } from 'i18next';
import TearSheetDrawer from 'src/common/TearSheet/TearSheetDrawer';
import { colors } from 'src/utils/theme';
import useStyles from './style';
import CartSkeleton from './CartSkeleton';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1.5rem 0',
};

const AbandonedCartDrawer = ({ is_visible, close, data, set_refetch = false, set_is_abandoned_changed_to_view }: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [comment_data, set_comment_data] = useState<string>(data?.comment);

	const [cart_data, set_cart_data] = useState<any>([]);
	const [loading, set_loading] = useState<boolean>(false);
	const [is_abandoned_loading, set_is_abandoned_loading] = useState<boolean>(false);
	const [comment_modal, set_comment_modal] = useState<any>({ show: false, is_edit: false });
	const [is_review_modal, set_is_review_modal] = useState<boolean>(false);
	const currency = useSelector((state: any) => state?.settings?.currency);
	const [toggle_toast, set_toggle_toast] = useState<any>({
		show: false,
		message: '',
		title: '',
		status: 'success',
	});
	const [selected_template, set_selected_template] = useState<string>('');
	const [show_tear_sheet, set_show_tear_sheet] = useState<boolean>(false);
	const [show_price_on_tear_sheet, set_show_price_on_tear_sheet] = useState<boolean>(false);
	const [multiple_template, set_multiple_template] = useState<any>([]);
	const [tear_sheet_loading, set_tear_sheet_loading] = useState<boolean>(false);
	const [is_sales_rep_cart, set_is_sales_rep_cart] = useState<boolean>(false);
	const [sales_rep_id, set_sales_rep_id] = useState<boolean>(false);
	const [handle_abandoned_cart_drawer_view, set_handle_abandoned_cart_drawer_view] = useState<any>(data?.status);

	useEffect(() => {
		const fetchData = async () => {
			set_loading(true);
			try {
				await get_sales_rep_cart(data, set_is_sales_rep_cart, set_sales_rep_id);
			} catch (error) {
				console.error('Error fetching sales rep cart:', error);
			} finally {
				set_loading(false);
			}
		};

		fetchData();
	}, [data]);

	const handle_get_cart_details_data = async (cart_data_id: any) => {
		try {
			set_is_abandoned_loading(true);
			await get_cart_data(cart_data_id, data?.website_user_id, set_cart_data);
			set_is_abandoned_loading(false);
		} catch (error: any) {
			set_toggle_toast({ show: true, message: error?.message ?? '', title: t('AuthFlow.StartTrial.SomethingWentWrong'), status: 'error' });
		}
	};

	const handle_mark_as_viewed = async () => {
		const payload = {
			abandoned_cart_id: data?.id,
			update_key: 'status',
			update_value: 'viewed',
		};
		await handle_update_data(
			payload,
			set_comment_data,
			set_comment_modal,
			set_loading,
			set_is_abandoned_changed_to_view,
			data?.updated_at_milliseconds,
			set_handle_abandoned_cart_drawer_view,
		);
		set_refetch((prev: boolean) => !prev);

		set_toggle_toast({ show: true, message: 'this cart marked as viewed', title: 'Marked as Viewed', status: 'success' });
	};
	const handleAddComment = (value: string) => {
		const payload = {
			abandoned_cart_id: data?.id,
			update_key: 'comment',
			update_value: value,
		};

		handle_update_data(
			payload,
			set_comment_data,
			set_comment_modal,
			set_loading,
			set_is_abandoned_changed_to_view,
			data?.updated_at_milliseconds,
			set_handle_abandoned_cart_drawer_view,
			'comment',
		);
		if (data) {
			data.comment = value;
		}
		set_comment_modal({ show: false, is_edit: false });
	};

	useEffect(() => {
		handle_get_cart_details_data(data?.cart_id);
	}, [data?.cart_id]);

	const ExportDownload = ({ onClick }: any) => {
		return (
			<div onClick={onClick}>
				<div style={{ paddingRight: 8, display: 'flex', alignItems: 'center' }}>
					<Icon iconName='IconDownload' color={colors.primary_500} />
					<CustomText color={colors.primary_500} style={{ fontWeight: 700, fontSize: '16px', margin: 0.5 }}>
						{t('MultipleTearsheet.PDF')}
					</CustomText>
				</div>
			</div>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<Grid className={classes.header_title}>
					<CustomText type='H3'> Abandoned cart products</CustomText>
					<StatusChip
						statusColor={utils.get_chip_color_by_status(handle_abandoned_cart_drawer_view)}
						textStyle={{ fontSize: '1.4rem' }}
						sx={{ padding: '2px 10px', lineHeight: 'normal' }}
						label={handle_abandoned_cart_drawer_view}
					/>
				</Grid>

				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_proceed_to_checkout = async (payload: any) => {
		set_loading(true);
		try {
			if (_.isEmpty(data?.document_id)) {
				const response: any = await order_listing.add_abandoned_cart(payload);
				if (response?.status === 200) {
					dispatch<any>(
						set_buyer({ buyer_id: payload?.buyer_id, is_guest_buyer: false, callback: () => navigate(RouteNames?.cart?.path) }),
					);
				}
			} else {
				navigate(`${RouteNames.product.review.routing_path}order/${data?.document_id}`);
			}

			Mixpanel.track(Events.ABANDONED_CART_CHECKOUT_CLICKED, {
				tab_name: 'abandoned cart',
				page_name: 'abandoned_cart_page',
				section_name: 'Sales',
				subtab_name: '',
				customer_metadata: get_customer_metadata({ is_loggedin: true }),
				document_id: data?.document_id || '',
				wizshop_cart_id: data?.cart_id || '',
				wizorder_cart_id: sales_rep_id || '',
			});
			close();
		} catch (err) {
			console.error(err);
		} finally {
			set_loading(false);
			close();
		}
	};

	const handle_checkout = async () => {
		const payload = {
			wizshop_user_id: data?.website_user_id,
			wizshop_cart_id: data?.cart_id,
			buyer_id: cart_data?.buyer_id,
		};
		await handle_proceed_to_checkout(payload);
	};

	const check_salse_rep_cart_status = () => {
		if (is_sales_rep_cart && data?.document_id === null) {
			set_is_review_modal(true);
		} else {
			handle_checkout();
		}
	};
	const handle_render_footer = () => {
		let total_units = 0;
		_.map(cart_data?.items, (item: any) => {
			_.map(item, (cart_item: any) => {
				total_units += cart_item?.quantity;
			});
		});
		return (
			<Grid className='drawer-footer'>
				<Grid>
					<CustomText type='Subtitle'>{`Cart Total: ${get_formatted_price_with_currency(currency, cart_data?.cart_total)}`}</CustomText>
					<CustomText type='Body' color='rgba(0, 0, 0, 0.60)' style={{ display: 'flex', alignItems: 'center' }}>
						{`${_.size(cart_data?.items || data?.total_skus)} SKUs`}{' '}
						<Icon iconName='IconCircleFilled' sx={{ height: '8px', width: '8px', marginX: '4px' }} color='rgba(0, 0, 0, 0.60)' />
						{`${total_units || data?.total_units} units`}
					</CustomText>
				</Grid>
				<Grid display='flex' gap={1}>
					{handle_abandoned_cart_drawer_view === 'open' && (
						<Button variant='outlined' onClick={handle_mark_as_viewed}>
							Mark as viewed
						</Button>
					)}

					<Button loading={loading} onClick={() => check_salse_rep_cart_status()}>
						Proceed to checkout
					</Button>
				</Grid>
			</Grid>
		);
	};

	const InfoSection = ({ info_data }: any) => (
		<Grid container spacing={1} alignItems='center'>
			<Grid item>
				<Grid className={classes.userIconBack}>
					<Icon iconName={info_data?.icon} />
				</Grid>
			</Grid>
			<Grid item>
				{_.map(info_data?.information, (item: any) => {
					return (
						<React.Fragment key={item?.value}>
							<Grid>
								<CustomText type='Body' style={item?.style}>
									{data?.[item?.value]}
								</CustomText>
							</Grid>
						</React.Fragment>
					);
				})}
			</Grid>
		</Grid>
	);
	const handle_customer_information = () => {
		return (
			<React.Fragment>
				{_.map(customer_info_data, (item: any) => {
					return (
						<Grid key={item?.id} gap={2}>
							<InfoSection info_data={item} />
						</Grid>
					);
				})}
			</React.Fragment>
		);
	};

	const get_multiple_tearsheet_templates = () => {
		cart_management
			.get_multiple_tearsheets()
			.then((res: any) => {
				if (res?.status === 200) {
					set_multiple_template(res?.data);
					set_selected_template(_.find(res?.data, { is_default: true })?.id || '');
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	const handle_export = () => {
		try {
			set_tear_sheet_loading(true);
			set_toggle_toast({ show: true, message: 'Downloading in Progress...', title: 'Downloading', status: 'success' });
			cart_management
				.get_cart_tear_sheet(cart_data?.tenant_id, cart_data?.id, [''], show_price_on_tear_sheet, selected_template, data?.website_user_id)
				.then((response: any) => {
					if (response?.data) {
						set_toggle_toast({ show: true, message: '', title: 'Downloaded', status: 'success' });
					} else {
						console.error('Invalid response format for PDF download.');
						set_toggle_toast({ show: true, message: 'Wrong response from Server', title: 'Try Again', status: 'warning' });
					}
				})
				.catch((error: any) => {
					console.error('Error downloading PDF:', error);
					set_toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
				});
			set_tear_sheet_loading(false);
			set_show_tear_sheet(false);
		} catch (error: any) {
			set_toggle_toast({ show: true, message: error?.message ? error?.message : '', title: 'Something Went Wrong', status: 'error' });
			set_tear_sheet_loading(false);
		}
	};

	const handle_export_click = () => {
		if (_.isEmpty(cart_data?.items)) {
			set_toggle_toast({ show: true, message: '', title: t('CartSummary.Main.EmptyCart'), status: 'warning' });
		} else {
			set_show_tear_sheet(true);
		}
	};

	useEffect(() => {
		get_multiple_tearsheet_templates();
	}, []);

	const handle_render_drawer_content = () => {
		const initials = data?.customer_name
			?.split(' ')
			?.map((word: string) => word.charAt(0))
			?.join('');

		const first_two_letters: any = _.take(initials, 2);
		const duration = get_duration(data?.created_at_milliseconds);
		const last_time_text =
			calculateDaysDifference(data?.created_at_milliseconds) >= 1
				? `${duration.days} days ago`
				: duration?.hours === 0
				? 'a few moments ago'
				: `${duration?.hours} hours ago`;

		return (
			<Grid className='drawer-body'>
				<Grid>
					<Grid display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
						<Grid container alignItems='center'>
							<Avatar
								variant={'circular'}
								backgroundColor={warning[200]}
								color={warning[600]}
								content={
									<CustomText style={{ ...data?.avatarTextStyle, textTransform: 'uppercase' }} type='Body'>
										{first_two_letters}
									</CustomText>
								}
								src={data?.imageUrl}
								style={data?.avatarStyle}
								isImageAvatar={false}
							/>
							<CustomText type='H3' style={{ marginLeft: '6px' }}>
								{data?.customer_name}
							</CustomText>
						</Grid>
						<Grid sx={{ cursor: 'pointer' }}>
							<ExportDownload onClick={() => handle_export_click()} />
						</Grid>
					</Grid>
					<Grid display={'flex'} flexDirection={'row'} gap={1} ml={'4px'} my={'.8rem'}>
						<CustomText type='Body' color='rgba(0, 0, 0, 0.6)'>
							{`${data?.website_user_name} abandoned cart `}

							<strong>{last_time_text}</strong>

							{` (${convert_date_to_timezone(data?.created_at_milliseconds, constants.DATE_FORMAT)})`}
						</CustomText>
					</Grid>
					<Grid display={'flex'} flexDirection={'row'} gap={4}>
						{handle_customer_information()}
					</Grid>
					<div style={dividerStyle}></div>
					{_.isEmpty(comment_data) ? (
						<Grid display={'flex'} flexDirection={'row'} gap={5} py={'.6rem'}>
							<Button variant='outlined' onClick={() => set_comment_modal({ show: true, is_edit: false })}>
								<Icon color={colors.primary_500} sx={{ cursor: 'pointer', marginRight: '10px' }} iconName='IconMessage' />
								Comment
							</Button>
						</Grid>
					) : (
						<Grid display={'flex'} flexDirection={'column'} gap={1} padding={'12px'} className={classes.comment_section}>
							<Grid display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
								<Grid display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
									<Icon iconName='IconMessage' />
									<CustomText type='Subtitle'>Comment</CustomText>
								</Grid>
								<Grid>
									<Icon iconName='IconEdit' sx={{ cursor: 'pointer' }} onClick={() => set_comment_modal({ show: true, is_edit: true })} />
								</Grid>
							</Grid>

							<CustomText type='Body' style={{ whiteSpace: 'pre-line' }}>
								{comment_data}
							</CustomText>
						</Grid>
					)}
					<Divider sx={{ marginY: '1rem' }} />
					<Grid my={1}>
						{is_abandoned_loading ? (
							<CartSkeleton />
						) : (
							_.map(cart_data?.items, (product: any, product_key: string) => {
								const product_info = cart_data?.products?.[product_key];
								return (
									<Grid container key={product_key} flexDirection={'column'} gap={1}>
										{_.map(product, (cart_item: any, cart_item_key: any) => {
											return (
												<Grid item key={cart_item_key} mb={1}>
													<AbandonedCartProductCard product={product_info} rec_card_template={undefined} cart_info={cart_item} />
												</Grid>
											);
										})}
									</Grid>
								);
							})
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<>
				<BuyerToastMessage toggle_toast={toggle_toast} set_toggle_toast={set_toggle_toast} />
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};

	return (
		<>
			<Drawer width={550} open={is_visible} onClose={close} content={handle_render_drawer()} />
			{comment_modal && (
				<UpdateCommentModal
					comment_modal={comment_modal}
					set_comment_modal={set_comment_modal}
					comment={comment_data}
					handleAddComment={handleAddComment}
				/>
			)}
			{is_review_modal && (
				<CartReviewModal open_modal={is_review_modal} close_modal={set_is_review_modal} handle_add_to_proceed={handle_checkout} />
			)}
			{show_tear_sheet ? (
				<TearSheetDrawer
					open={show_tear_sheet}
					onClose={() => set_show_tear_sheet(false)}
					onSubmit={() => handle_export()}
					checked={show_price_on_tear_sheet}
					on_switch_change={() => set_show_price_on_tear_sheet(!show_price_on_tear_sheet)}
					show_toggle
					show_catalog_selector
					data={multiple_template}
					selected_template={selected_template}
					set_selected_template={set_selected_template}
					show_preview_btn={false}
					loading={tear_sheet_loading}
				/>
			) : null}
		</>
	);
};

export default AbandonedCartDrawer;
