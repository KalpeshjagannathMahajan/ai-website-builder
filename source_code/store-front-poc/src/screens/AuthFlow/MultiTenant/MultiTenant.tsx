import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login_success, show_login_toast, user_switch } from 'src/actions/login';
import { close_toast, show_toast } from 'src/actions/message';
import { delete_persisted_data, save_persisted_data } from 'src/actions/persistedUserData';
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Button, Checkbox, Grid, Icon, Image, Tooltip } from 'src/common/@the-source/atoms';
import { PERSIST_REDUX_PATHS } from 'src/reducers/persistedUserData';
import store from 'src/store';
import { switch_tenant } from 'src/utils/api_requests/login';
import { background_colors, primary, text_colors } from 'src/utils/light.theme';
import types from 'src/utils/types';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'center',
		background: `linear-gradient(170.8deg, ${primary?.[50]} 6.97%, ${background_colors?.radiant_color} 123.36%)`,
	},
	layout: {
		display: 'flex',
		maxWidth: '640px',
		alignItems: 'center',
		margin: '4.8rem',
		justifyContent: 'space-between',
		background: background_colors?.primary,
		borderRadius: '1.6rem',
		width: '100%',
		padding: '4rem 2rem',
		gap: '1rem',
	},
	title_container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tenant_container: {
		width: '100%',
		height: '400px',
		overflowY: 'scroll',
		padding: '1rem',
		gap: '3rem 5rem',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tenant_item: {
		width: '130px',
		height: '170px',
		// display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '1rem',
		borderRadius: '1rem',
		position: 'relative',
		cursor: 'pointer',
	},
	tenantImage: {
		borderRadius: '1rem',
		padding: '5px',
	},
	tenant_text: {
		maxWidth: '100%',
		textAlign: 'center',
	},
	checkboxContainer: {
		background: background_colors?.secondary,
		alignItems: 'center',
	},
	loginButton: {
		width: '100%',
	},
	icon_style: {
		position: 'absolute',
		top: '5px',
		right: '-10px',
		width: '30px',
		height: '30px',
	},
}));

const MultiTenant = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const status = useSelector((state: any) => state?.login?.status);
	const user_details = useSelector((state: any) => state?.login?.userDetails);
	const temp_token = _.get(store.getState(), 'persistedUserData.temp_token', '');
	const [checked, set_checked] = useState(false);
	const [selected_tenant, set_selected_tenant] = useState('');
	const { tenant_id = '', all_tenants = [] } = user_details;

	const handle_on_submit = async () => {
		try {
			const payload = {
				tenant_id: selected_tenant,
				set_default: checked,
			};

			const response = await switch_tenant(temp_token, payload);

			if (response.status === 200) {
				dispatch(user_switch());
				setTimeout(() => localStorage.setItem('switch-user', `switch${Math.random()}`), 10);
				dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_access_token, response?.token));
				dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_refresh_token, response?.refresh_token));
				dispatch(delete_persisted_data(PERSIST_REDUX_PATHS.temp_token));
				dispatch(login_success());
				show_login_toast(dispatch, user_details?.email);
			}
		} catch (e) {
			console.error(e);
			const handle_close_toast = (_event: React.SyntheticEvent<Element, Event>, reason: string) => {
				if (reason === types.REASON_CLICK) {
					return;
				}
				dispatch(close_toast(user_details?.email));
			};
			return dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_close_toast(event, reason),
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: 'Please try again',
					showActions: false,
				}),
			);
		}
	};

	const handle_tenant = (item: any) => {
		set_selected_tenant(item?.tenant_id);
		set_checked(item?.is_default || false);
	};

	useEffect(() => {
		set_selected_tenant(tenant_id);
		const match = _.find(all_tenants, (item) => item?.tenant_id === tenant_id);
		set_checked(match?.is_default || false);
	}, [tenant_id]);

	return (
		<Box className={classes.container} id='multi_tenant_container'>
			<Grid container className={classes.layout}>
				<Grid container className={classes.title_container}>
					<CustomText type='H1' style={{ fontSize: '24px' }}>
						{t('AuthFlow.MultiTenant.ChooseCompany')}
					</CustomText>
				</Grid>
				<Grid container className={classes.tenant_container}>
					{_.map(all_tenants, (item, index) => {
						const is_selected = selected_tenant === item?.tenant_id;
						return (
							<Grid item key={index} className={classes.tenant_item} onClick={() => handle_tenant(item)}>
								<Image
									src={item?.logo_url}
									width='100%'
									height='120px'
									style={{
										border: is_selected ? `2.5px solid ${primary.main}` : `1.5px solid ${text_colors?.tertiary}`,
									}}
									imgClass={classes.tenantImage}
								/>
								<Tooltip title={item?.company_name}>
									<div className={classes.tenant_text}>
										<CustomText type='H2' className={classes.tenant_text}>
											{item?.company_name}
										</CustomText>
									</div>
								</Tooltip>

								{is_selected && <Icon color={primary.main} iconName='IconCircleCheckFilled' className={classes.icon_style} />}
							</Grid>
						);
					})}
				</Grid>
				<Grid container className={classes.checkboxContainer}>
					<Checkbox
						checked={checked}
						onChange={(e) => {
							set_checked(e.target.checked);
						}}
					/>
					<CustomText type='Body'>{t('AuthFlow.MultiTenant.SetDefault')}</CustomText>
				</Grid>
				<Grid container>
					<Button className={classes.loginButton} fullWidth onClick={handle_on_submit}>
						{!status?.loggedIn ? t('AuthFlow.Login.Login') : t('AuthFlow.Login.Continue')}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default MultiTenant;
