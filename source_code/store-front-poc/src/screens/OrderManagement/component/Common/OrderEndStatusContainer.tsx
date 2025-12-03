import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import OrderEndStatusInfoContainer from './OrderEndStatusInfoContainer';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';
import { useContext } from 'react';
import OrderManagementContext from '../../context';
import { document } from '../../mock/document';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { convert_date_to_timezone } from 'src/utils/dateUtils';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.green_tick,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const text_style = {
	fontSize: '14px',
	marginLeft: '3rem',
	fontWeight: 400,
	color: 'rgba(0, 0, 0, 0.6)',
};

const OrderEndStatusContainer = () => {
	const { document_data, buyer_info_data, get_styles } = useContext(OrderManagementContext);
	const document_type = document_data?.type;
	const doc_status = document_data?.document_status;
	const location = useLocation();
	const { t } = useTranslation();
	const is_cancelled = document_data?.document_status === document?.DocumentStatus?.cancelled;
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const { VITE_APP_REPO } = import.meta.env;
	const is_store_front = VITE_APP_REPO === 'store_front';

	const format_date = (document_date: any) => {
		try {
			if (!document_date) {
				throw new Error('updated_at is undefined or null');
			}
			const timezone_converted = convert_date_to_timezone(document_date, 'DD MMM YYYY');
			return timezone_converted;
		} catch (error: any) {
			console.error('An error occurred:', error?.message);
			return 'NA';
		}
	};

	const date = format_date(document_data?.created_at);
	const calculate_styles = () => {
		const status_style = get_styles();
		return !_.isEmpty(status_style) ? status_style : { background: theme?.order_management?.order_end_status_container?.background };
	};
	const from_order_listing = location?.state?.from === 'order-listing';

	const handle_render_sub_text = () => {
		if (is_cancelled) {
			return (
				<CustomText type='Subtitle' style={is_store_front ? {} : text_style} className={classes.order_end_status_container_text_style}>
					{t('OrderManagement.OrderEndStatusContainer.SubText', {
						type: _.capitalize(document_data?.type),
						status: 'cancelled',
						name: buyer_info_data?.heading || 'Customer',
					})}
				</CustomText>
			);
		} else if (doc_status === document?.DocumentStatus?.confirmed) {
			return (
				<CustomText type='Subtitle' style={is_store_front ? {} : text_style} className={classes.order_end_status_container_text_style}>
					{t('OrderManagement.OrderEndStatusContainer.SubText', {
						type: _.capitalize(document_data?.type),
						status: 'confirmed',
						name: buyer_info_data?.heading || 'Customer',
					})}
				</CustomText>
			);
		}
	};

	const handle_render_content = () => {
		const email_history = document_data?.email_history;

		if (
			(document_data.document_status === document?.DocumentStatus?.confirmed ||
				document_data.document_status === document?.DocumentStatus?.pendingApproval) &&
			is_store_front
		) {
			return (
				<Grid className={classes.endStatusHeroSection}>
					<Grid item alignItems='center' justifyContent='space-between'>
						<Box display='flex' alignItems='center' flexDirection={is_small_screen ? 'column' : 'row'}>
							{doc_status !== document?.DocumentStatus?.rejected &&
								(!is_small_screen ? (
									<Icon iconName={'IconCircleCheck'} className={classes.check_icon} />
								) : (
									<Lottie options={defaultOptions} height={80} width={80} />
								))}

							<CustomText type='H6' className={classes.orderConfirmationTextStyle}>
								{document_data.document_status === document?.DocumentStatus?.confirmed
									? 'Congratulations! Your order is confirmed.'
									: is_small_screen
									? 'Order has been submitted and mail has been sent'
									: 'Our team will review your order and get back to you'}
							</CustomText>
						</Box>
					</Grid>
				</Grid>
			);
		}

		if (
			(document_data.document_status === document?.DocumentStatus?.confirmed ||
				document_data?.document_status === document?.DocumentStatus?.submitted ||
				document_data?.document_status === document?.DocumentStatus?.cancelled ||
				document_data?.document_status === document?.DocumentStatus?.accepted ||
				document_data?.document_status === document?.DocumentStatus?.rejected) &&
			from_order_listing
		) {
			return (
				<Grid className={classes.endStatusHeroSection}>
					<Grid item alignItems='center' justifyContent='space-between'>
						<Box display='flex' alignItems='center'>
							{doc_status !== document?.DocumentStatus?.rejected && (
								<Icon
									iconName={is_cancelled ? 'IconCircleXFilled' : is_store_front ? 'IconCircleCheck' : 'IconCircleCheckFilled'}
									className={is_cancelled ? classes.cancel_banner_icon : classes.submit_banner_icon}
								/>
							)}
							<CustomText type='H6'>{`${_.capitalize(document_data.type)} ${document_data.document_status} on ${date}`}</CustomText>
						</Box>
					</Grid>

					<Grid item>{handle_render_sub_text()}</Grid>
				</Grid>
			);
		} else if (
			document_data.document_status === document?.DocumentStatus?.confirmed ||
			document_data.document_status === document?.DocumentStatus?.submitted ||
			document_data.document_status === document?.DocumentStatus?.cancelled ||
			document_data.document_status === document?.DocumentStatus?.rejected
		) {
			return (
				<Box className={classes.endStatusHeroSection}>
					<Grid display='flex' alignItems='center'>
						{(document_data.document_status === document?.DocumentStatus?.confirmed ||
							document_data.document_status === document?.DocumentStatus?.submitted) && (
							<Lottie options={defaultOptions} height={80} width={80} />
						)}
						<CustomText type='H3'>{`${_.capitalize(document_type)} ${doc_status}`}</CustomText>
					</Grid>

					{!_.isUndefined(email_history) && _.size(email_history) > 0 && (
						<CustomText style={{ opacity: '0.6', padding: 1.8, fontSize: '1.4rem', textAlign: 'center' }} type='Subtitle'>
							{t('OrderManagement.OrderEndStatusContainer.EmailSent', {
								id: document_data.system_id,
								status: doc_status,
								name: buyer_info_data?.heading || 'Customer',
							})}
						</CustomText>
					)}
				</Box>
			);
		}
	};

	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={calculate_styles()} className={classes?.endStatusContainer}>
				{handle_render_content()}
				<OrderEndStatusInfoContainer />
			</Grid>
		</Grid>
	);
};

export default OrderEndStatusContainer;
