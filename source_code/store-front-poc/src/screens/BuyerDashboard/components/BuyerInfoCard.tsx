import { memo } from 'react';
import { makeStyles } from '@mui/styles';
import { Icon, Grid } from 'src/common/@the-source/atoms';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import utils from 'src/utils/utils';
import { Buyer } from './BuyerInterface';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Card from 'src/common/@the-source/atoms/Card';

const useStyles = makeStyles((theme: any) => ({
	buyer_info_card_container: {
		display: 'flex',
		padding: '12px 24px',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: '12px',
		background: theme?.buyer_dashboard?.buyer_info_card?.background,
	},
	left_section: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		maxWidth: '60%',
	},
	right_section: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
	},
	icon_box: {
		width: '28px',
		height: '28px',
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	contact_info_box: {
		display: 'flex',
		gap: '8px',
		alignItems: 'center',
	},
	icon_container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '28px',
		height: '28px',
		borderRadius: '50%',
		background: theme?.buyer_dashboard?.buyer_info_card?.secondary,
	},
}));

interface BuyerInfoCardProps {
	buyer_card_info: Buyer;
	contact_shown: boolean;
}

const BuyerInfoCardTemp = ({ buyer_card_info, contact_shown = true }: BuyerInfoCardProps) => {
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const classes = useStyles();
	const theme: any = useTheme();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const handle_navigate_to_buyer_details = () => {
		navigate(`${RouteNames.buyer_library.view_buyer.routing_path}${buyer_card_info.id}`, {
			state: {
				from: 'buyer_dashboard',
				credits: buyer_card_info?.wallet_balance,
			},
		});
	};
	const payment_styles =
		_.find(permissions, { slug: 'view_payment_method' })?.toggle || _.find(permissions, { slug: 'wallet_view' })?.toggle
			? { borderLeft: theme?.buyer_dashboard?.buyer_info_card?.border, marginLeft: 2, paddingLeft: 2, height: '55px' }
			: {};
	return (
		<Grid className={classes.buyer_info_card_container}>
			<Grid className={classes.left_section}>
				<Grid display='flex' alignItems='center' gap={0.8}>
					<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary} style={{ maxWidth: 320, flexWrap: 'wrap' }}>
						{buyer_card_info?.name}
					</CustomText>
					<CustomText
						type='Subtitle'
						onClick={handle_navigate_to_buyer_details}
						color={theme?.buyer_dashboard?.buyer_info_card?.primary}
						style={{ cursor: 'pointer' }}>
						{t('BuyerDashboard.BuyerCard.ViewDetails')}
					</CustomText>
					<Icon
						iconName='IconExternalLink'
						color={theme?.buyer_dashboard?.buyer_info_card?.primary}
						size={'18px'}
						onClick={handle_navigate_to_buyer_details}
					/>
				</Grid>
				{buyer_card_info?.sales_rep ? (
					<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
						{t('BuyerDashboard.BuyerCard.SalesRep', { SalesRep: buyer_card_info?.sales_rep })}
					</CustomText>
				) : (
					<Grid display='flex' alignItems='center'>
						<Icon iconName='IconUser' color={theme?.buyer_dashboard?.buyer_info_card?.text} size='16px' />
						<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.text}>
							{t('OrderManagement.CartCheckoutCard.NoSalesRep')}:
						</CustomText>
					</Grid>
				)}
			</Grid>
			<Grid display='flex' direction='column' flex={1} gap={1.2} alignSelf='flex-start' sx={payment_styles}>
				<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
					{_.isEmpty(buyer_card_info?.payment_method) ? (
						<Grid display={'flex'} gap={0.5}>
							<CustomText style={{ marginTop: '3px' }} type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
								{t('OrderManagement.CartCheckoutCard.PaymentMethod')}:
							</CustomText>
							<Card data={buyer_card_info?.payment_method} />
						</Grid>
					) : (
						<Grid display='flex' direction='column'>
							<Grid display='flex' alignItems='center' gap={'5px'}>
								<Icon iconName='IconCreditCard' color={theme?.buyer_dashboard?.buyer_info_card?.text} size='16px' />
								<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.text}>
									{t('OrderManagement.CartCheckoutCard.PaymentNotAssigned')}
								</CustomText>
							</Grid>
						</Grid>
					)}
				</Can>
				{/* <Can I={PERMISSIONS.wallet_view.slug} a={PERMISSIONS.wallet_view.permissionType}>
					<Grid display='flex' alignItems='center' gap={0.5}>
						<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
							{t('OrderManagement.CartCheckoutCard.AvailableCredits')}
						</CustomText>
						<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.text}>
							$ {buyer_card_info?.wallet_balance}
						</CustomText>
						<Icon iconName='IconWallet' />
					</Grid>
				</Can> */}
			</Grid>
			{contact_shown && (
				<Grid display='flex' direction='column'>
					{String(buyer_card_info?.contact_person_name).trim() === '' ? (
						<Grid className={classes.contact_info_box}>
							<Grid display='flex' justifyContent='center' alignItems='center' width={28} height={28} borderRadius={'50%'}>
								<Icon iconName='IconPhone' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary} />
							</Grid>
							<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
								{t('OrderManagement.CartCheckoutCard.PrimaryContactNotAdded')}
							</CustomText>
						</Grid>
					) : (
						<Grid>
							<CustomText type='Title' style={{ marginBottom: '6px' }}>
								{buyer_card_info?.contact_person_name}
							</CustomText>
							<Grid display='flex' gap={1.6}>
								{buyer_card_info?.primary_contact?.email ? (
									<Grid className={classes.contact_info_box}>
										<Grid className={classes.icon_container}>
											<Icon iconName='IconMail' color={theme?.buyer_dashboard?.buyer_info_card?.primary} />
										</Grid>
										<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.text2}>
											{buyer_card_info?.primary_contact?.email}
										</CustomText>
									</Grid>
								) : (
									<Grid className={classes.contact_info_box}>
										<Grid className={classes.icon_container}>
											<Icon iconName='IconMail' color={theme?.buyer_dashboard?.buyer_info_card?.primary} />
										</Grid>
										<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
											{t('OrderManagement.CartCheckoutCard.EmailNotAdded')}
										</CustomText>
									</Grid>
								)}

								{buyer_card_info?.primary_contact?.phone ? (
									<Grid className={classes.contact_info_box}>
										<Grid className={classes.icon_container}>
											<Icon iconName='IconPhone' color={theme?.buyer_dashboard?.buyer_info_card?.primary} />
										</Grid>
										<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.text2}>
											{utils.format_phone_number(buyer_card_info?.primary_contact?.phone, buyer_card_info?.primary_contact?.country_code)}
										</CustomText>
									</Grid>
								) : (
									<Grid className={classes.contact_info_box}>
										<Grid className={classes.icon_container}>
											<Icon iconName='IconPhone' color={theme?.buyer_dashboard?.buyer_info_card?.primary} />
										</Grid>
										<CustomText type='Body' color={theme?.buyer_dashboard?.buyer_info_card?.tertiary}>
											{t('OrderManagement.CartCheckoutCard.PhoneNotAdded')}
										</CustomText>
									</Grid>
								)}
							</Grid>
						</Grid>
					)}
				</Grid>
			)}
		</Grid>
	);
};

const BuyerInfoCard = memo(BuyerInfoCardTemp);

export default BuyerInfoCard;
