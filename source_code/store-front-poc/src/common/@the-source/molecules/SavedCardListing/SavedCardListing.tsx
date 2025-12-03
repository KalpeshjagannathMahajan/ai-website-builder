import React from 'react';
import CustomText from '../../CustomText';
import RadioGroup from '../RadioGroup';
import _ from 'lodash';
import { Box, Button, Chip, Grid, Icon, Image } from '../../atoms';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';
import { get_short_name } from 'src/screens/Wishlist/utils';
import { check_permission } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import ImageLinks from 'src/assets/images/ImageLinks';
import { colors } from 'src/utils/light.theme';

interface IPaymentMethod {
	payment_method_type: string;
	payment_method_id: string;
	title: string;
	sub_title: string;
	logo: string;
	card_type: string;
	is_default: boolean;
	is_selected: boolean;
	temp_selected_card: any;
}

interface ISavedCardListing {
	section_heading?: string;
	default_payment_id: string;
	section_heading_style?: any;
	void_auth?: boolean;
	from_auth?: boolean;
	saved_payment_methods?: IPaymentMethod[];
	is_ultron?: boolean;
	temp_selected_card?: any;
	update_selected_payment_method: (new_id: string) => any;
	handle_add_click?: () => any;
	handle_account_add_click?: () => any;
	style?: object;
	component_type?: 'radio' | 'select';
	useDefaultValue?: boolean;
	render_type?: string;
	is_disabled?: boolean;
	set_temp_selected_card?: any;
	is_drawer?: boolean;
	drawer?: boolean;
	methods?: any;
}

const useStyles = makeStyles((theme: any) => ({
	savedCardContainer: {
		borderRadius: '10px',
		margin: '2rem 0rem',
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
		...theme?.card_,
		...theme?.order_management?.saved_card?.container,
		[is_store_front && theme.breakpoints.down('sm')]: {
			padding: '0rem',
			background: theme?.order_management?.saved_card?.container?.small_screen_background,
		},
	},
	text_style: {
		margin: '5px 0px',
		...theme?.order_management?.saved_card?.text_style,
		[is_store_front && theme.breakpoints.down('sm')]: {
			color: theme?.order_management?.saved_card?.text_style?.small_screen_scolor,
		},
	},
	icon: {
		...theme?.order_management?.saved_card?.icon_style,
	},
	subtitle: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
	},
	button_style: {
		padding: '0px 12px',
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
	},
	add_cta_grid: {
		display: 'flex',
		gap: '1rem',
	},
	divider_style: {
		marginTop: '12px',
		marginBottom: '-12px',
	},
}));

const SavedCardListing = ({
	section_heading,
	default_payment_id,
	saved_payment_methods,
	void_auth = false,
	from_auth = false,
	update_selected_payment_method,
	temp_selected_card,
	handle_add_click,
	handle_account_add_click,
	render_type,
	is_disabled = false,
	set_temp_selected_card,
	is_drawer,
	drawer,
}: ISavedCardListing) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const { t } = useTranslation();
	const is_payment_info_page = section_heading === 'Available cards';
	const [show_full_listing, set_show_full_listing] = React.useState(false);
	const is_ach_enabled: boolean = check_permission(permissions, [PERMISSIONS.collect_payment_ach.slug]) || false;
	const get_payment_method_options: any = () => {
		const uniqueMethods = _.uniqBy(saved_payment_methods, 'payment_method_id');

		const temp = _.orderBy(uniqueMethods, ['is_default'], ['desc']);
		return _.map(temp ?? [], (method: any) => ({
			value: void_auth ? method?.id : method?.payment_method_id,
			is_custom: true,
			type: method?.payment_method_type === 'ach' ? 'ach' : render_type,
			custom_labels: {
				title: get_short_name(void_auth ? method?.payment_id : method?.title, 26),
				bank_account_type: method?.bank_account_type,
				sub_title: get_short_name(void_auth ? method?.payment_method_detail?.title : method?.sub_title, is_small_screen ? 20 : 40),
				logo: void_auth ? method?.payment_method_detail?.logo : method?.logo,
				is_default: method?.is_default,
				is_selected: method?.payment_method_id === temp_selected_card,
				is_authorized: from_auth ? false : void_auth ? method?.transaction_mode === 'authorize' : method?.is_authorized,
				authorized_amount: void_auth ? _.get(method, 'amount', 0) : _.get(method, 'authorized_amount', 0),
			},
		}));
	};

	const get_add_card_button = () => {
		if (!handle_add_click) return null;
		return (
			<Grid
				className={classes.add_cta_grid}
				sx={{
					flexDirection: is_small_screen ? 'column' : 'row',
				}}>
				<Button startIcon={<Icon iconName='IconPlus' className={classes.icon} />} onClick={handle_add_click} variant='contained'>
					{t('Payment.AddCard')}
				</Button>
				{is_ach_enabled && (
					<Button startIcon={<Icon iconName='IconBuilding' />} onClick={handle_account_add_click} variant='outlined'>
						{t('Payment.AddNewACH')}
					</Button>
				)}
			</Grid>
		);
	};

	const render_logo = (card: any) => {
		if (card?.payment_method_type === 'ach') {
			return (
				<Image
					style={{ marginLeft: card?.type === 'ach' && !card?.is_authorized ? '1rem' : '0' }}
					src={ImageLinks?.building_bank}
					width='25'
					height='40'
				/>
			);
		} else if (card?.logo)
			return <Image style={{ marginLeft: card?.type === 'card' && !card?.is_authorized ? '1rem' : '0' }} src={card?.logo} width='40' />;
	};

	const render_chips = (custom: any) => {
		if (custom?.is_selected)
			return (
				<Chip
					sx={{ fontWeight: '400' }}
					bgColor={theme?.order_management?.payment_method_section?.chip_color}
					label='Assigned'
					textColor={colors?.white}
					size='small'
				/>
			);
		else if (custom?.is_default)
			return (
				<Chip
					sx={{ fontWeight: '400' }}
					bgColor={theme?.order_management?.payment_method_section?.chip_color}
					label='Default'
					textColor={colors?.white}
					size='small'
				/>
			);
	};

	const handle_render_cards = () => {
		let selectedCard: any = _.find(saved_payment_methods, (method: any) => method.payment_method_id === temp_selected_card);
		const options = get_payment_method_options();
		if (!selectedCard) {
			options?.forEach((option: any) => {
				if (option?.value === default_payment_id) {
					selectedCard = option?.custom_labels;
				}
			});
		}
		return (
			<Grid
				className={classes.savedCardContainer}
				sx={{
					padding: is_payment_info_page ? '2rem' : is_drawer ? '0rem' : '2rem',
					backgroundColor: is_payment_info_page || !is_drawer ? '' : 'transparent !important',
				}}>
				{is_small_screen && <Divider sx={{ marginTop: '4px', marginBottom: '12px' }} />}
				<Grid container justifyContent='space-between'>
					<Box>
						<CustomText type='H3' children={get_payment_method_options()?.length > 0 ? section_heading : 'Credit card not added'} />
						{(is_payment_info_page || is_ach_enabled) && get_payment_method_options()?.length > 0 && (
							<CustomText type='Body' className={classes.text_style}>
								{is_ach_enabled ? t('Payment.ChoosePaymentOptions') : t('Payment.SavedCards')}
							</CustomText>
						)}
					</Box>
					<Box>{!is_small_screen && get_add_card_button()}</Box>
				</Grid>

				{get_payment_method_options()?.length > 0 && (
					<Grid>
						{show_full_listing ? (
							<React.Fragment>
								<Grid container display='flex' justifyContent='space-between' mb={2} alignItems='center'>
									<CustomText
										type='Body'
										children={is_ach_enabled ? t('Payment.SelectACH') : t('Payment.SelectCard')}
										className={classes.text_style}
									/>
									<CustomText
										onClick={() => set_show_full_listing(false)}
										color={theme?.order_management?.add_edit_payment?.custom_color}
										className={classes.button_style}>
										Close
									</CustomText>
								</Grid>
								<RadioGroup
									disabled={is_disabled}
									selectedOption={default_payment_id}
									options={get_payment_method_options()}
									onChange={(e: any) => {
										update_selected_payment_method(e);
										set_show_full_listing(false);
									}}
									container_styling={{
										background: theme?.order_management?.saved_card?.background,
										padding: '1rem 1rem 1rem 0',
										borderRadius: '8px',
										marginBottom: '12px',
									}}
									from_drawer={drawer}
									set_temp_selected_card={set_temp_selected_card}
								/>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Grid
									container
									display='flex'
									justifyContent='space-between'
									sx={{ border: theme?.order_management.payment_active_card?.border, padding: '1.5rem 1rem' }}>
									<Grid display='flex' alignItems='center'>
										<Grid mr={1}>
											{selectedCard?.payment_method_type === 'card' && selectedCard?.payment_method_id === 'skip' ? (
												<Icon iconName='IconClock' />
											) : (
												render_logo(selectedCard)
											)}
										</Grid>
										<Grid display='flex' gap={1}>
											<Grid>
												<CustomText type='Title'>{selectedCard?.title || 'Not selected'}</CustomText>
												<CustomText
													color={theme?.order_management?.custom_text_color_style?.color}
													className={classes.subtitle}
													style={{ maxWidth: is_drawer ? '180px' : '' }}>
													{get_short_name(selectedCard?.sub_title || 'Please select your payment option', is_small_screen ? 20 : 40)}
												</CustomText>
											</Grid>
											<Grid>{render_chips(selectedCard)}</Grid>
										</Grid>
									</Grid>
									<CustomText
										onClick={() => set_show_full_listing(true)}
										color={theme?.order_management?.add_edit_payment?.custom_color}
										className={classes.button_style}
										style={{
											border: theme?.order_management.payment_active_card?.border,
										}}>
										Change
									</CustomText>
								</Grid>
							</React.Fragment>
						)}
					</Grid>
				)}

				{is_small_screen && (
					<React.Fragment>
						{get_add_card_button()}
						<Divider className={classes.divider_style} />
					</React.Fragment>
				)}
			</Grid>
		);
	};

	return <React.Fragment>{handle_render_cards()}</React.Fragment>;
};

export default SavedCardListing;
