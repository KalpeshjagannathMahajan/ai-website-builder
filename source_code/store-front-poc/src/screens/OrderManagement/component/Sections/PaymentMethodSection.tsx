import React, { useContext } from 'react';
import OrderManagementContext from '../../context';
import _, { isEmpty } from 'lodash';
import { Chip, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { DRAWER_TYPES, SPECIAL_DOCUMENT_ATTRIBUTE } from '../../constants';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import { Divider } from '@mui/material';

import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { text_colors } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';

interface IPaymentMethodSection {
	data: any;
	is_accordion?: boolean;
	style?: any;
}

const PaymentMethodSection = ({ data, is_accordion = false, style = {} }: IPaymentMethodSection) => {
	const {
		attribute_data,
		handle_drawer_state,
		handle_drawer_type,
		document_data,
		show_edit_cta,
		is_editable_quote,
		is_editable_order,
		set_selected_payment_opt,
	} = useContext(OrderManagementContext);
	const { document_status } = document_data;
	const title = _.get(data, 'name');
	const payment_method_details = attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.payment_method_v2] || {};
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const params = useParams();
	const { doc_status } = params;
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const handle_edit = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_edit_payment);

		const _type = payment_method_details?.payment_method_type === 'ach' ? 'ach' : 'card';
		if (!isEmpty(payment_method_details)) {
			set_selected_payment_opt({ mode: 'edit', type: _type });
		} else {
			set_selected_payment_opt({ mode: 'add', type: null });
		}
	};
	const render_action_button = () => {
		return (
			<Can I={PERMISSIONS.edit_orders.slug && PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
				{(show_edit_cta || is_editable_quote || is_editable_order) && (
					<Grid item md={4} sm={3} xs={2} className={classes.textAlignmentContainer} ml={'auto'}>
						<CustomText
							style={{
								cursor: 'pointer',
								textDecorationLine: theme?.order_management?.style?.text_decoration_line,
							}}
							children={!_.isEmpty(payment_method_details) ? 'Edit' : 'Add'}
							type='Subtitle'
							color={theme?.button?.color}
							onClick={handle_edit}
						/>
					</Grid>
				)}
			</Can>
		);
	};

	const is_draft = document_status === 'draft' || !doc_status;
	const get_container_styles = () => {
		return {
			padding: is_ultron && !doc_status ? '3rem' : '1rem',
			marginBottom: is_ultron && !doc_status ? '3rem' : '',
			background: theme?.order_management?.order_end_status_info_container?.payment_background_color,
		};
	};

	const handle_render_chip = () => {
		if (payment_method_details?.payment_method_type === 'ach') {
			return (
				<Chip
					size='small'
					bgColor={theme?.palette?.info[100]}
					sx={{ padding: '0px 8px', marginLeft: '10px' }}
					icon={<Icon iconName='IconBuildingBank' color={theme?.palette?.info?.main} />}
					label={
						<CustomText color={colors.black_8} type='Caption'>
							{payment_method_details?.bank_account_type}
						</CustomText>
					}
				/>
			);
		}
	};

	const handle_render_logo = () => {
		if (payment_method_details?.payment_method_type === 'card') {
			return <Image style={{ marginLeft: '1rem' }} src={payment_method_details?.logo} width='40' />;
		}
	};

	return (
		<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
			<Grid container sx={style} padding={0} direction={'row'} justifyContent={'space-between'}>
				{!is_accordion && (
					<Grid item md={3} sm={4} xs={8}>
						<CustomText type={is_ultron ? 'Subtitle' : 'H6'} children={title} />
					</Grid>
				)}

				{is_draft && (
					<React.Fragment>
						{_.isEmpty(payment_method_details) ? (
							<Grid item md={9} sm={8} xs={6.5}>
								<CustomText type='Title' children='-' />
							</Grid>
						) : (
							<Grid item md={9} sm={8} xs={6.5}>
								<Grid display='flex'>
									<CustomText type='Title' children={payment_method_details.title} />
									{handle_render_chip()}
									{handle_render_logo()}
								</Grid>
								<CustomText color={text_colors.primary} children={payment_method_details.sub_title} />
							</Grid>
						)}
					</React.Fragment>
				)}

				{is_small_screen && document_status !== 'cancelled' && (
					<Grid item md={3} sm={4} xs={4} mt={-3}>
						{render_action_button()}
					</Grid>
				)}
				{!is_small_screen && document_status !== 'cancelled' && render_action_button()}
			</Grid>
			{!is_draft && (
				<Grid container alignItems={'center'} style={get_container_styles()}>
					<Grid item md={3} sm={4} xs={12}>
						<CustomText type='Subtitle'>
							{_.isEmpty(payment_method_details)
								? ''
								: payment_method_details?.payment_method_type === 'ach'
								? 'Assigned Account'
								: 'Assigned Card'}
						</CustomText>
					</Grid>
					{_.isEmpty(payment_method_details) ? (
						<Grid item md={5} sm={5} xs={5.5}>
							<CustomText type='Title' children='' />
						</Grid>
					) : (
						<Grid item md={5} sm={5} xs={5.5}>
							<Grid display='flex'>
								<CustomText type='Title' children={payment_method_details.title} />
								{handle_render_chip()}
								{handle_render_logo()}
							</Grid>
							<CustomText color={text_colors.primary} children={payment_method_details?.sub_title} />
						</Grid>
					)}
				</Grid>
			)}
			{!is_ultron && !doc_status && (
				<Grid container justifyContent={'center'}>
					<hr
						style={{
							borderBottom: theme?.order_management?.order_manage_container?.hr_border_top,
							borderTop: '0',
							borderRadius: '0',
							width: '100%',
							marginTop: '32px',
							marginBottom: '32px',
						}}></hr>
				</Grid>
			)}

			{is_accordion && <Divider sx={{ my: 1 }} />}
		</Can>
	);
};

export default PaymentMethodSection;
