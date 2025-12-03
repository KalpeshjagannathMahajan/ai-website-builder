/* eslint-disable */
import { Divider, Tabs, Tab, FormControlLabel, Checkbox, IconButton, Collapse, FormGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import _ from 'lodash';

interface EmailProps {
	open: boolean;
	set_open: (value: boolean) => void;
	data: any;
	set_data: (value: any) => void;
}

const EmailRecipientDrawer = ({ open, set_open, data, set_data }: EmailProps) => {
	const [selected_tab, set_selected_tab] = useState(0);
	const [original_data, set_original_data] = useState(data);
	const [email_templates, set_email_templates] = useState([]);
	const [selected_emails, set_selected_emails] = useState({
		to_emails: data?.to_emails || [],
		cc_emails: data?.cc_emails || [],
		bcc_emails: data?.bcc_emails || [],
	});
	const [expanded, set_expanded] = useState<{ [key: string]: boolean }>({});
	const [email, set_email] = useState('');
	const [is_email_valid, set_is_email_valid] = useState(true);
	const [custom_emails, set_custom_emails] = useState<any>({
		to_custom_emails: [],
		cc_custom_emails: [],
		bcc_custom_emails: [],
	});

	const [is_custom_included, set_is_custom_included] = useState<boolean>(false);

	const get_tab_key = (tab_index: number) => {
		switch (tab_index) {
			case 0:
				return 'to_emails';
			case 1:
				return 'cc_emails';
			case 2:
				return 'bcc_emails';
			default:
				return 'to_emails';
		}
	};

	const get_custom_emails_key = (tab_index: number) => {
		switch (tab_index) {
			case 0:
				return 'to_custom_emails';
			case 1:
				return 'cc_custom_emails';
			case 2:
				return 'bcc_custom_emails';
			default:
				return 'to_custom_emails';
		}
	};

	useEffect(() => {
		set_original_data(data);
		set_selected_emails({
			to_emails: data?.to_emails || [],
			cc_emails: data?.cc_emails || [],
			bcc_emails: data?.bcc_emails || [],
		});
	}, [data]);

	useEffect(() => {
		switch (selected_tab) {
			case 0:
				set_email_templates(data?.possible_to_email_templates);
				break;
			case 1:
				set_email_templates(data?.possible_cc_email_templates);
				break;
			case 2:
				set_email_templates(data?.possible_bcc_email_templates);
				break;
			default:
				set_email_templates([]);
		}
		// set_expanded({});
		update_custom_emails();
	}, [selected_tab, data, selected_emails]);

	useEffect(() => {
		if (custom_emails.length > 0) {
			if (is_custom_included) {
				set_selected_emails((prev_state) => ({
					...prev_state,
					[get_tab_key(selected_tab)]: [...prev_state[get_tab_key(selected_tab)], ...custom_emails],
				}));
			} else {
				set_selected_emails((prev_state) => ({
					...prev_state,
					[get_tab_key(selected_tab)]: prev_state[get_tab_key(selected_tab)].filter((item: string) => !custom_emails.includes(item)),
				}));
			}
		}
	}, [is_custom_included, custom_emails, selected_tab]);

	const update_custom_emails = () => {
		const update_emails = (selected: any, possible: any) => {
			const extract_values: any = (template: any) => {
				let emails = [];
				if (template.value && Array.isArray(template.value)) {
					for (const value of template.value) {
						if (!value?.value) {
							emails.push(value?.id);
						}
						if (typeof value === 'string') {
							emails.push(value);
						} else if (typeof value === 'object') {
							emails.push(...extract_values(value));
						}
					}
				}
				if (template.values && Array.isArray(template.values)) {
					for (const value of template.values) {
						if (typeof value === 'string') {
							emails.push(value);
						} else if (typeof value === 'object') {
							emails.push(...extract_values(value));
						}
					}
				}
				return emails;
			};

			const possible_emails = possible.reduce((acc: any, template: any) => {
				// Add id to possible emails if value and values are null
				if (!template?.value || !template?.values) {
					acc.push(template.id);
				}
				if (template.value && Array.isArray(template.value)) {
					acc.push(...extract_values(template));
				}

				if (template.values && Array.isArray(template.values)) {
					acc.push(...extract_values(template));
				}
				return acc;
			}, []);

			return selected.filter((email: any) => !possible_emails.includes(email));
		};

		switch (selected_tab) {
			case 0:
				set_custom_emails((prev: any) => ({
					...prev,
					to_custom_emails: update_emails(selected_emails.to_emails, data?.possible_to_email_templates || []),
				}));
				break;
			case 1:
				set_custom_emails((prev: any) => ({
					...prev,
					cc_custom_emails: update_emails(selected_emails.cc_emails, data?.possible_cc_email_templates || []),
				}));
				break;
			case 2:
				set_custom_emails((prev: any) => ({
					...prev,
					bcc_custom_emails: update_emails(selected_emails.bcc_emails, data?.possible_bcc_email_templates || []),
				}));
				break;
			default:
				break;
		}
	};

	const handle_tab_change = (_event: React.SyntheticEvent, new_value: number) => {
		set_selected_tab(new_value);
	};

	const validate_email = (email: string) => {
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return email_regex.test(email);
	};

	const handle_email_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		set_email(e.target.value);
	};

	const handle_key_press = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			validate_and_add_email();
		}
	};

	const handle_blur = () => {
		validate_and_add_email();
	};

	const validate_and_add_email = () => {
		if (email && !validate_email(email)) {
			set_is_email_valid(false);
		} else if (email) {
			set_is_email_valid(true);
			set_selected_emails((prev_state) => {
				const updated_emails = [...prev_state[get_tab_key(selected_tab)], email];
				return {
					...prev_state,
					[get_tab_key(selected_tab)]: updated_emails,
				};
			});
			set_email(''); // Clear the input after adding
		}
	};

	const handle_expand_click = (id: string) => {
		set_expanded((prev_state) => ({
			...prev_state,
			[id]: !prev_state[id],
		}));
	};

	const get_section_name = () => {
		switch (selected_tab) {
			case 0:
				return 'To';
			case 1:
				return 'Cc';
			case 2:
				return 'Bcc';
			default:
				return 'To';
		}
	};

	const handle_checkbox_change = (value: string, select_all?: boolean) => {
		set_selected_emails((prev_state) => {
			const tab_key = get_tab_key(selected_tab);
			let updated_emails;

			if (select_all === false) {
				updated_emails = prev_state[tab_key].filter((item: any) => item !== value);
			} else if (select_all === true || !prev_state[tab_key].includes(value)) {
				updated_emails = [...prev_state[tab_key], value];
			} else {
				updated_emails = prev_state[tab_key].filter((item: any) => item !== value);
			}

			return {
				...prev_state,
				[tab_key]: updated_emails,
			};
		});
	};

	const handle_nested_checkbox_change = (values: any[], select_all: boolean) => {
		values.forEach((v: any) => {
			if (typeof v === 'string') {
				handle_checkbox_change(v, select_all);
			} else if (Array.isArray(v.values)) {
				handle_nested_checkbox_change(v.values, select_all);
			} else if (!v.values) {
				handle_checkbox_change(v.id, select_all);
			}
		});
	};

	const handle_delete_email = (email: string) => {
		set_selected_emails((prev_state: any) => {
			const updated_to_emails = prev_state?.to_emails.filter((item: any) => item !== email);
			const updated_cc_emails = prev_state?.cc_emails.filter((item: any) => item !== email);
			const updated_bcc_emails = prev_state?.bcc_emails.filter((item: any) => item !== email);
			return {
				to_emails: updated_to_emails,
				cc_emails: updated_cc_emails,
				bcc_emails: updated_bcc_emails,
			};
		});
		set_custom_emails((prev_state: any) => {
			const updated_custom_emails = prev_state[get_custom_emails_key(selected_tab)].filter((item: any) => item !== email);
			return {
				...prev_state,
				[get_custom_emails_key(selected_tab)]: updated_custom_emails,
			};
		});
	};

	const are_all_children_selected = (values: any[]): boolean => {
		if (!values) {
			return false;
		}
		return values.every((value) => {
			if (typeof value === 'string') {
				return selected_emails[get_tab_key(selected_tab)]?.includes(value);
			}
			if (typeof value === 'object' && value.id && !value.values) {
				return selected_emails[get_tab_key(selected_tab)]?.includes(value.id);
			}
			if (Array.isArray(value?.value)) {
				return are_all_children_selected(value?.value);
			}
			if (Array.isArray(value?.values)) {
				return are_all_children_selected(value.values);
			}
			return false;
		});
	};
	const are_some_children_selected = (values: any[]): boolean => {
		if (!values) {
			return false;
		}
		return (
			values.some((value) => {
				if (typeof value === 'string') {
					return selected_emails[get_tab_key(selected_tab)]?.includes(value);
				}
				if (Array.isArray(value.values)) {
					return are_some_children_selected(value.values);
				}
				return false;
			}) && !are_all_children_selected(values)
		);
	};

	const render_values = (_id: string, values: any, component_type?: string) => {
		if (!values) {
			return null;
		}

		if (component_type === 'values__id') {
			return values?.map((value: any) => (
				<div key={value.id}>
					<Grid container display='flex' alignItems='center'>
						<Grid item>
							<FormControlLabel
								control={
									<Checkbox
										checked={selected_emails[get_tab_key(selected_tab)].includes(value?.id)}
										onChange={() => handle_checkbox_change(value?.id)}
									/>
								}
								label={<CustomText type='Body2'>{value?.label}</CustomText>}
								onClick={(event) => event.stopPropagation()}
								onFocus={(event) => event.stopPropagation()}
							/>
						</Grid>
					</Grid>
				</div>
			));
		}

		if (Array.isArray(values)) {
			return values.map((value: any) =>
				typeof value === 'string' ? (
					<div key={value}>
						<FormControlLabel
							control={
								<Checkbox
									checked={selected_emails[get_tab_key(selected_tab)]?.includes(value)}
									onChange={() => handle_checkbox_change(value)}
								/>
							}
							label={<CustomText type='Body'>{value}</CustomText>}
							style={{ paddingLeft: '2rem' }}
						/>
					</div>
				) : (
					<div key={value.id}>
						<Grid container display='flex' alignItems='center' sx={{ cursor: 'pointer' }} onClick={() => handle_expand_click(value?.id)}>
							<Grid item>
								<FormControlLabel
									control={
										<Checkbox
											checked={are_all_children_selected(value.values)}
											indeterminate={are_some_children_selected(value.values)}
											onChange={(event: any) => {
												event.stopPropagation();

												if (are_all_children_selected(value.values)) {
													value.values.forEach((v: any) => {
														if (typeof v === 'string') {
															handle_checkbox_change(v, false);
														}
													});
												} else {
													value.values.forEach((v: any) => {
														if (typeof v === 'string') {
															handle_checkbox_change(v, true);
														}
													});
												}
											}}
										/>
									}
									label={<CustomText type='Body2'>{value?.label}</CustomText>}
									onClick={(event) => event.stopPropagation()}
									onFocus={(event) => event.stopPropagation()}
								/>
							</Grid>
							<Grid item ml='auto'>
								<IconButton>{expanded[value?.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
							</Grid>
						</Grid>
						<Collapse in={expanded[value.id]} timeout='auto' unmountOnExit style={{ paddingLeft: 24 }}>
							{render_values(value.id, value.values)}
						</Collapse>
					</div>
				),
			);
		}
		return null;
	};

	const is_custom_existed = !_.isEmpty(_.get(custom_emails, get_custom_emails_key(selected_tab), []));

	const is_selected = (id: string) => {
		const arr = selected_emails[get_tab_key(selected_tab)];
		return _.indexOf(arr, id) > -1;
	};

	const render_menu = () => {
		return (
			<Grid p={2} ml={1}>
				<FormGroup>
					{email_templates?.map((template: any) => (
						<div key={template.id}>
							<Grid
								container
								display='flex'
								alignItems='center'
								sx={{ cursor: 'pointer' }}
								onClick={() => handle_expand_click(template.id)}>
								<Grid item>
									<FormControlLabel
										control={
											<Checkbox
												checked={
													template?.value && template?.value?.length > 0
														? are_all_children_selected(template?.value)
														: is_selected(template?.id)
												}
												indeterminate={are_some_children_selected(template?.value)}
												onChange={(event: any) => {
													event.stopPropagation();

													if (!template.value || !template.value.length) {
														handle_checkbox_change(template?.id);
													} else if (are_all_children_selected(template?.value)) {
														handle_nested_checkbox_change(template?.value, false);
													} else {
														handle_nested_checkbox_change(template?.value, true);
													}
												}}
											/>
										}
										label={<CustomText type='Body2'>{template?.label}</CustomText>}
										onClick={(event) => event.stopPropagation()}
										onFocus={(event) => event.stopPropagation()}
									/>
								</Grid>
								{template?.value && template?.value?.length > 0 && (
									<Grid item ml='auto'>
										<IconButton>{expanded[template.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
									</Grid>
								)}
							</Grid>
							<Collapse in={expanded[template.id]} timeout='auto' unmountOnExit style={{ paddingLeft: '20px' }}>
								{render_values(template?.id, template?.value, template?.component_type)}
							</Collapse>

							<Divider sx={{ my: 1 }} />
						</div>
					))}
					<div>
						<Grid container>
							<FormControlLabel
								control={
									<Checkbox
										checked={is_custom_included || is_custom_existed}
										onChange={() => set_is_custom_included(!is_custom_included)}
									/>
								}
								label={<CustomText type='Body2'>Enter email to add them to recipient list </CustomText>}
							/>
						</Grid>
						<TextField
							placeholder='Add Email'
							type='text'
							value={email}
							variant='outlined'
							sx={{ width: '100%', mt: 2 }}
							onChange={handle_email_change}
							onKeyPress={handle_key_press}
							onBlur={handle_blur}
							error={!is_email_valid}
							helperText={!is_email_valid ? <p>Invalid email address</p> : ''}
						/>
						<Box display='flex' flexWrap='wrap' gap='10px' mt={2}>
							{custom_emails[get_custom_emails_key(selected_tab)].map((email: string) => (
								<Chip
									key={email}
									label={email}
									onDelete={() => handle_delete_email(email)}
									deleteIcon={<Icon iconName='IconX' />}
									textColor='#000'
									bgColor='#F7F8FA'
								/>
							))}
						</Box>
					</div>
				</FormGroup>
			</Grid>
		);
	};

	const handle_save = () => {
		const updated_data = {
			...data,
			to_emails: selected_emails.to_emails,
			cc_emails: selected_emails.cc_emails,
			bcc_emails: selected_emails.bcc_emails,
		};

		set_data(updated_data);
		set_open(false);
	};

	const handle_cancel = () => {
		set_data(original_data);
		set_open(false);
	};

	const content = (
		<Grid sx={{ background: '#fff', height: '100vh' }}>
			{/* Header */}
			<Grid container p={2}>
				<Grid item>
					<CustomText type='H6'>{data?.event_name} - recipients</CustomText>
				</Grid>
				<Grid item ml='auto'>
					<Icon onClick={handle_cancel} iconName='IconX' sx={{ cursor: 'pointer' }} />
				</Grid>
			</Grid>
			<Divider />
			<Box sx={{ height: '85vh', overflowY: 'auto' }}>
				<Grid p={2}>
					<Tabs value={selected_tab} onChange={handle_tab_change}>
						<Tab label={`To (${selected_emails.to_emails.length})`} />
						<Tab label={`Cc (${selected_emails.cc_emails.length})`} />
						<Tab label={`Bcc (${selected_emails.bcc_emails.length})`} />
					</Tabs>
				</Grid>
				<Divider sx={{ mt: '-20px' }} />
				<Grid p={2} m={2} sx={{ background: '#F7F8FA', borderRadius: '12px' }}>
					<CustomText type='Body'>
						Choose the user types that you want to add in the <strong> "{get_section_name()}" </strong> section of the recipient list
						against {data?.event_name}
					</CustomText>
				</Grid>
				<Grid>{render_menu()}</Grid>
			</Box>
			<Box sx={{ width: '450px', position: 'fixed', bottom: 10, ml: '2rem' }}>
				<Divider className='drawer-divider' />
				<Grid container justifyContent='flex-end' gap={1}>
					<Grid item mt={1}>
						<Button onClick={handle_cancel} variant='outlined'>
							Cancel
						</Button>
					</Grid>
					<Grid item mt={1}>
						<Button onClick={handle_save} variant='contained'>
							Save
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Grid>
	);

	return <Drawer width={480} onClose={handle_cancel} open={open} content={content} />;
};

export default EmailRecipientDrawer;
