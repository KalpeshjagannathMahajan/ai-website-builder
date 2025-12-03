import { t } from 'i18next';
import _ from 'lodash';
import { PaymentMethodsValues } from 'src/@types/payment';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { Grid, Image, Tooltip, Icon, Box, Chip } from 'src/common/@the-source/atoms';
import { get_short_name } from 'src/screens/Wishlist/utils';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import { payment_gateways } from '../constants';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { PAYMENT_METHODS } from '../../constants';

interface PaymentCardProps {
	item: any;
	primary_card_id: string;
	on_edit_press?: () => void;
	style?: any;
	is_editable?: boolean;
	type?: PaymentMethodsValues;
	payment_gateway?: string;
	set_show_card_modal?: (val: boolean) => void;
	set_selected_payment_method?: (val: string) => void;
	is_drawer?: boolean;
}

const text_style = {
	fontWeight: 400,
	wordWrap: 'break-word',
};

const PaymentCard = ({
	is_editable,
	item,
	primary_card_id,
	style,
	on_edit_press,
	type,
	payment_gateway,
	set_show_card_modal = () => {},
	set_selected_payment_method = () => {},
	is_drawer = false,
}: PaymentCardProps) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const show_view_card_cta = !is_editable && payment_gateway === payment_gateways.PCI_VAULT;

	const handle_view_card = () => {
		if (set_show_card_modal && set_selected_payment_method) {
			set_show_card_modal(true);
			set_selected_payment_method(item?.payment_method_id);
		}
	};

	const handle_render_card_action = (is_card?: boolean) => {
		return (
			<Grid item>
				{is_editable && (
					<Can I={PERMISSIONS.edit_payment.slug} a={PERMISSIONS.edit_payment.permissionType}>
						<Tooltip title='Edit' placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
							<div>
								<Icon
									onClick={on_edit_press}
									className={classes.edit_icon_style}
									iconName='IconEdit'
									color={secondary?.[600]}
									sx={{ cursor: 'pointer' }}
								/>
							</div>
						</Tooltip>
					</Can>
				)}
				{is_card && show_view_card_cta && (
					<Can I={PERMISSIONS.detokenize.slug} a={PERMISSIONS.detokenize.permissionType}>
						<Icon onClick={handle_view_card} color={secondary.main} iconName='IconEye' sx={{ cursor: 'pointer' }} />
					</Can>
				)}
			</Grid>
		);
	};

	const handle_render_details_store_front = () => {
		return (
			<Grid display='flex' px='18px' py='12px' alignItems='center' gap='22px'>
				<Image src={item?.logo} width={60} height={40} />
				<Grid display='flex' direction='column'>
					<CustomText type='Title' color='rgba(0, 0,  0.1)'>
						{item.title}
					</CustomText>
					<CustomText type='Body' color='rgba(0, 0, 0, 0.6)'>
						{item?.sub_title}
					</CustomText>
				</Grid>
				{primary_card_id === item?.payment_method_id && (
					<Chip
						sx={{ alignSelf: 'flex-end', marginLeft: 'auto', borderRadius: theme?.view_buyer?.other_details?.chip?.borderRadius }}
						size='small'
						bgColor={theme?.view_buyer?.other_details?.card?.default_background}
						label={
							<CustomText type='Subtitle' color={theme?.view_buyer?.other_details?.card?.text_color}>
								{t('Payment.Default')}
							</CustomText>
						}
					/>
				)}
			</Grid>
		);
	};

	const handle_render_details_ultron = () => {
		let addressParts = [];
		if (item?.address_1) addressParts.push(item?.address_1);
		if (item?.address_2) addressParts.push(item?.address_2);
		const address_line = addressParts?.join(', ');
		const city_state_zip = [item?.city, item?.state_label || item?.state, item?.zip].filter(Boolean).join(', ');
		const country = item?.country_label || item?.country || '';

		return (
			<Grid display='flex' flexDirection='column' justifyContent='space-between' height='100%'>
				<Grid p={1.75} flex='1'>
					<Grid display='flex' justifyContent='space-between' alignItems='center'>
						<CustomText type='H3' color={secondary?.main}>
							{item.title}
						</CustomText>
						<Image src={item?.logo} width={40} height={24} style={{ marginTop: '-5px' }} />
						{handle_render_card_action(true)}
					</Grid>
					<CustomText type='Body' color={colors.secondary_text} style={text_style}>
						{item?.sub_title}
					</CustomText>
					<CustomText type='Body' color={colors.black_8} style={text_style}>
						{_.capitalize(item.card_name)}
					</CustomText>
					{item?.phone && (
						<CustomText type='Body' color={colors.black_8} style={text_style}>
							{item?.phone || ''}
						</CustomText>
					)}
					{item?.email && (
						<CustomText type='Body' color={colors.black_8} style={text_style}>
							{item?.email || ''}
						</CustomText>
					)}
					<Grid display='flex' width='100%'>
						<Grid flex={1}>
							{address_line && (
								<CustomText type='Body' color={colors.black_8} style={text_style}>
									{address_line}
								</CustomText>
							)}
							{city_state_zip && (
								<CustomText type='Body' color={colors.black_8} style={text_style}>
									{city_state_zip}
								</CustomText>
							)}
							<CustomText type='Body' color={colors.black_8} style={text_style}>
								{country && country}
							</CustomText>
						</Grid>
					</Grid>
				</Grid>

				<Box display='flex' justifyContent='flex-end' mt='auto' width='100%'>
					{primary_card_id === item?.payment_method_id && (
						<Box
							bgcolor={theme?.view_buyer?.other_details?.card?.default_background}
							sx={{
								backgroundColor: theme?.palette?.info?.[50],
								padding: '6px 12px',
								width: '100%',
								textAlign: 'right',
								borderRadius: theme?.view_buyer?.other_details?.chip?.borderRadius,
							}}>
							<CustomText type='Subtitle' color={theme?.palette?.info?.[600]}>
								{t('Payment.Default')}
							</CustomText>
						</Box>
					)}
				</Box>
			</Grid>
		);
	};

	const handle_render_ach_details = () => {
		const country = item?.country_label || item?.country || '';

		return (
			<Grid display='flex' flexDirection='column' justifyContent='space-between'>
				<Grid p={1.75}>
					<Grid mb={0.5} display='flex' justifyContent={'space-between'} alignItems='center' width='100%'>
						<Grid display='flex' justifyContent={is_editable ? 'left' : 'space-between'} width={'100%'} alignItems={'center'}>
							<CustomText type='H3' color={secondary?.main}>
								{get_short_name(item?.title, is_editable ? 20 : 15)}
							</CustomText>
							{!is_drawer && (
								<Chip
									size={'small'}
									bgColor={theme?.palette?.info[100]}
									sx={{ padding: '0px 4px', marginLeft: '1rem' }}
									icon={<Icon iconName='IconBuildingBank' color={theme?.palette?.info?.main} />}
									label={
										<CustomText color={colors.black_8} type='Caption'>
											{item?.bank_account_type}
										</CustomText>
									}
								/>
							)}
						</Grid>
						{handle_render_card_action()}
					</Grid>
					<CustomText type='Body' color={colors.black_8} style={text_style}>
						{item?.sub_title}
					</CustomText>
					<Grid mt={0.5} display='flex' width='100%'>
						<Grid flex={1}>
							<CustomText type='Body' color={colors.black_8} style={text_style}>
								{country && country}
							</CustomText>
						</Grid>
					</Grid>
				</Grid>

				<Box display='flex' justifyContent='flex-end' mt='auto' width='100%'>
					{primary_card_id === item?.payment_method_id && (
						<Box
							sx={{
								backgroundColor: theme?.palette?.info?.[50],
								padding: '6px 12px',
								borderRadius: '0 0 8px 8px',
								width: '100%',
								textAlign: 'right',
							}}>
							<CustomText type='Subtitle' color={secondary?.[600]}>
								{t('Payment.Default')}
							</CustomText>
						</Box>
					)}
				</Box>
			</Grid>
		);
	};

	const handle_render_content = () => {
		if (type === PAYMENT_METHODS.ACH) {
			return handle_render_ach_details();
		}
		return is_ultron || is_editable ? handle_render_details_ultron() : handle_render_details_store_front();
	};

	return (
		<Grid
			className={classes.view_details_card}
			{...(is_ultron && { minHeight: type === PAYMENT_METHODS.ACH ? '8rem' : '10rem' })}
			height='auto'
			style={{ ...style }}>
			{handle_render_content()}
		</Grid>
	);
};

export default PaymentCard;
