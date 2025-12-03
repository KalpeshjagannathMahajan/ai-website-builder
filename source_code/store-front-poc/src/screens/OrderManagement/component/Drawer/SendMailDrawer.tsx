import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Drawer, Grid, Icon, Skeleton } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import api_requests from 'src/utils/api_requests';
import { background_colors, primary, text_colors } from 'src/utils/light.theme';
import { Divider } from '@mui/material';
import EmailInput from '../Common/EmailInput';

const SendMailDrawer = ({
	email_drawer,
	set_email_drawer,
	document_id = '',
	email_data,
	set_email_data,
	handle_send_emails,
	set_send_email,
	buyer_id = '',
}: any) => {
	const [selected_emails, set_selected_emails] = useState<any>(email_data?.to_emails || []);
	const [suggested_emails, set_suggested_emails] = useState<any>([]);
	const [display_suggested, set_display_suggested] = useState<any>([]);
	const [query, set_query] = useState<any>('');
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState(false);
	const { t } = useTranslation();

	const classes = useStyles();

	const methods = useForm({ mode: 'onChange' });

	const get_suggested_emails = () => {
		set_loading(true);
		const payload = _.isEmpty(buyer_id)
			? {
					document_id,
			  }
			: { buyer_id };
		api_requests.order_management
			.get_recomended_emails_for_buyers(payload)
			.then((response: any) => {
				if (response?.status === 200) {
					const emails = _.chain(response?.data?.emails)
						.filter((value) => value !== '')
						.value();
					set_suggested_emails(emails);
					set_loading(false);
					const diff = _.difference(emails, email_data?.to_emails);
					set_display_suggested(diff);
				}
			})
			.catch((e) => console.error(e))
			.finally(() => {
				set_loading(false);
			});
	};

	const handle_click = (value: any) => {
		if (!_.isEmpty(value)) {
			if (_.isEmpty(_.filter(selected_emails, (item) => item === value))) {
				set_selected_emails((prev: any) => [...prev, value]);
			}
			set_query('');
		}
	};

	const handle_delete = (emails_array: any, value: any, set_emails_array: any) => {
		let update_email = _.filter(emails_array, (item: number) => item !== value);
		set_emails_array(update_email);
	};

	const handle_close = () => {
		set_email_drawer(false);
		set_send_email(false);
	};

	const handle_done = () => {
		let output_email_data = selected_emails;

		if (query) {
			output_email_data = [...output_email_data, query];
		}

		const update_email_data = { ...email_data, to_emails: output_email_data };

		set_email_data(update_email_data);
		set_email_drawer(false);
		handle_send_emails && handle_send_emails(update_email_data);
	};

	useEffect(() => {
		const diff = _.difference(suggested_emails, selected_emails);
		set_display_suggested(diff);
	}, [selected_emails]);

	useEffect(() => {
		if (!_.isEmpty(document_id)) get_suggested_emails();
	}, []);

	const handle_chip_emails = (emails: any, show_delete = false) => {
		return (
			_.size(emails) > 0 && (
				<Grid container gap={1.5}>
					{_.map(emails, (item: any, ind: number) => {
						return show_delete ? (
							<Chip
								key={ind}
								size='small'
								label={item}
								bgColor={primary[50]}
								textColor={text_colors.black}
								className={classes.chip_style}
								deleteIcon={
									<Icon
										sx={{
											width: '21px',
											height: '21px',
										}}
										iconName='IconX'
									/>
								}
								onDelete={() => handle_delete(emails, item, set_selected_emails)}
							/>
						) : (
							<Chip
								key={ind}
								size='small'
								label={item}
								bgColor={primary[50]}
								textColor={text_colors.black}
								className={classes.chip_style}
							/>
						);
					})}
				</Grid>
			)
		);
	};

	useEffect(() => {
		const diff = _.difference(suggested_emails, selected_emails);
		set_display_suggested(diff);
	}, [selected_emails]);

	useEffect(() => {
		if (!_.isEmpty(document_id) || !_.isEmpty(buyer_id)) get_suggested_emails();
	}, []);

	return (
		<Drawer
			style={{ zIndex: 10000 }}
			open={email_drawer}
			onClose={() => set_email_drawer(false)}
			content={
				<>
					<Grid className='drawer-header' sx={{ padding: '1rem', background: 'white' }}>
						<CustomText type='H3'>Send email to</CustomText>
						<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={() => set_email_drawer(false)} />
					</Grid>
					<Divider className='drawer-divider' />
					<Grid px={2.5} className={classes.drawerContentContainer} sx={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
						<CustomText type='H3' style={{ paddingTop: '1.5rem' }}>
							To
						</CustomText>

						<EmailInput
							methods={methods}
							query={query}
							set_query={set_query}
							set_error={set_error}
							handle_click={handle_click}
							error={error}
							selected_emails={selected_emails}
						/>
						{handle_chip_emails(selected_emails, true)}

						{!loading ? (
							_.size(display_suggested) > 0 && (
								<Grid container sx={{ background: background_colors.secondary, borderRadius: '12px', padding: '1.5rem' }}>
									<CustomText type='Subtitle'>{t('OrderManagement.SendMail.Suggested')}</CustomText>
									<Grid container gap={1.5} py={2}>
										{_.map(display_suggested, (item: any, ind: number) => (
											<Chip
												key={ind}
												size='small'
												label={item}
												bgColor='white'
												textColor='black'
												disabled={error}
												className={classes.chip_style}
												avatar={
													<Icon
														size='medium'
														sx={{
															color: `${primary.main} !important`,
														}}
														iconName='IconPlus'
													/>
												}
												onClick={() => {
													handle_click(item);
													handle_delete(display_suggested, item, set_display_suggested);
												}}
											/>
										))}
									</Grid>
								</Grid>
							)
						) : (
							<Skeleton variant='rounded' width={'100%'} height={100} />
						)}
						<hr />
						<Grid sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
							<CustomText type='H3'>Cc</CustomText>
							{handle_chip_emails(email_data?.cc_emails, false)}
						</Grid>
						<Grid sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
							<CustomText type='H3'>Bcc</CustomText>
							{handle_chip_emails(email_data?.bcc_emails, false)}
						</Grid>
					</Grid>

					<Box className={classes.drawerFooterContainer}>
						<Grid className={classes.buttonAlignmentContainer} gap={1}>
							<React.Fragment>
								<Button variant='outlined' onClick={handle_close}>
									{t('OrderManagement.SendMailDrawer.Cancel')}
								</Button>
								<Button variant='contained' disabled={error || _.isEmpty(selected_emails)} onClick={handle_done}>
									{t('OrderManagement.SendMailDrawer.Done')}
								</Button>
							</React.Fragment>
						</Grid>
					</Box>
				</>
			}
		/>
	);
};

export default SendMailDrawer;
