import React, { useContext, useEffect, useState } from 'react';
import AccountContext from '../context';
import useStyles from '../style';
import { Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';
import AdvanceDetails from 'src/screens/BuyerLibrary/ViewBuyer/components/AdvanceDetails';
import { ProfileShimmer } from './ProfileShimmer';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';

export const Profile = () => {
	const classes = useStyles();
	const [retail_mode, set_retail_mode] = useState<boolean>(localStorage.getItem('retail_mode') === 'true');
	const retail_mode_enabled = useSelector((state: any) => state?.settings?.retail_mode_enabled);
	const { is_loading, buyer_details, user_info, buyer_id, set_refetch } = useContext(AccountContext);
	const theme: any = useTheme();

	const handle_change_mode = () => {
		set_retail_mode(!retail_mode);
		localStorage.setItem('retail_mode', JSON.stringify(!retail_mode));
	};

	useEffect(() => {
		window.scroll({
			top: 0,
		});
	}, []);

	const contacts: any = buyer_details?.find((item: any) => item?.key === SECTIONS.contact);
	const addresses: any = buyer_details?.find((item: any) => item?.key === SECTIONS.address);
	const billing_id = addresses?.default_billing_address;
	const shipping_id = addresses?.default_shipping_address;

	const find_my_primary = () => {
		return contacts?.contacts?.find((item: any) => item?.id === contacts?.primary_contact) ?? _.head(contacts?.contacts) ?? [];
	};
	const primary_contact: any = find_my_primary();

	return (
		<React.Fragment>
			{is_loading ? (
				<ProfileShimmer />
			) : (
				<Grid>
					{retail_mode_enabled && (
						<Grid className={classes.retail_mode}>
							<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' justifyContent={'space-between'}>
								<CustomText type='H6'>Hide Price</CustomText>
								<Switch checked={retail_mode} onChange={handle_change_mode} onClick={(e) => e.stopPropagation()} />
							</Grid>
							<CustomText type='Body' color={theme?.retail_mode?.grey_6}>
								Activating retailer mode will hide product prices on your current browser. Please note, if you open the site in a different
								browser, you'll need to activate the mode again.
							</CustomText>
						</Grid>
					)}
					<Grid className={classes.view_user_info}>
						{_.map(user_info, (item: any) => (
							<Grid className={classes.user_info} key={item?.key} style={{ ...theme?.profile_style }}>
								<Icon iconName={item?.icon_name} size='20' className={classes.user_icon} />
								<CustomText className={classes.user_text} type='Title'>
									{item?.value}
								</CustomText>
								{item?.sub_value && (
									<CustomText style={{ ...theme?.sub_value_style }} type='H6'>
										{item?.sub_value}
									</CustomText>
								)}
							</Grid>
						))}
					</Grid>
					<hr className='divider-line-style' />
					<AdvanceDetails
						buyer_details={buyer_details}
						buyer_id={buyer_id}
						set_refetch={set_refetch}
						primary_contact_id={primary_contact?.id}
						billing_id={billing_id}
						shipping_id={shipping_id}
						buyer_complete_attributes={{ sections: buyer_details }}
					/>
				</Grid>
			)}
		</React.Fragment>
	);
};
