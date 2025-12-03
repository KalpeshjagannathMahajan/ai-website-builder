import { Collapse, Divider } from '@mui/material';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';

interface Props {
	open: boolean;
	data: any;
	close: () => void;
	handle_save: any;
}

const WizAiManageCols = ({ open, data, close, handle_save }: Props) => {
	const sample_form = () => {
		return _.map(data, (section) => {
			let temp: any[] = [];
			if (section?.children) {
				temp = _.map(section?.children, (child) => {
					return { id: child?.field, label: child?.headerName, checked: !child?.hide, disabled: Boolean(child?.pinned) };
				});
			}

			return {
				id: section?.field,
				label: section?.headerName,
				checked: !section?.hide,
				children: temp || [],
			};
		});
	};

	const default_map = sample_form();
	const methods = useForm();

	const { getValues, watch, setValue } = methods;
	const [col_open, set_col_open] = useState<string[]>([]);
	const [loading, set_loading] = useState<boolean>(false);

	useEffect(() => {
		// Setup a subscription to watch changes
		const subscription = watch((value, { name, type }: any) => {
			if (type === 'change') {
				if (name?.startsWith('child_')) {
					// Split the name to get parent and child fields
					const parts = name?.split('.');
					const parentId: any = _.head(parts)?.substring(6); // Remove 'child_' prefix
					const children = _.find(data, (section: any) => section?.field === parentId)?.children;

					if (children) {
						const anyChildChecked = _.some(children, (child: any) => {
							return getValues(`child_${parentId}.${child?.field}`);
						});
						// Update parent checkbox based on any child being checked
						setValue(parentId, anyChildChecked);
					}
				} else {
					// Handle parent checkbox change to update all children
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const section = _.find(data, (section: any) => section?.field === name);
					if (section && section?.children) {
						section.children.forEach((child: any) => {
							setValue(`child_${name}.${child?.field}`, value?.[name]);
						});
					}
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, setValue, getValues, data]);

	const handleClick = () => {
		set_loading(true);

		const updated_data = _.map(data, (col: any) => {
			const parent_hide = getValues()?.[col?.field] === undefined ? col?.hide : !getValues()?.[col?.field];
			let _dta = { ...col, hide: parent_hide };

			if (col?.children) {
				_dta = {
					..._dta,
					children: _.map(col?.children, (child: any) => {
						const id = `child_${col?.field}.${child?.field}`;
						const child_hide = getValues(id) === undefined ? child?.hide : !getValues(id);
						return { ...child, hide: child_hide || parent_hide };
					}),
				};
			}
			if (col?.field === 'action') {
				return { ..._dta, hide: false };
			} else {
				return _dta;
			}
		});

		handle_save(updated_data);
		close();
	};

	const handlec_collapse_click = (id: string) => {
		if (col_open.includes(id)) {
			set_col_open(col_open.filter((_item) => _item !== id));
		} else {
			set_col_open([...col_open, id]);
		}
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Manage Columns</CustomText>
				<Icon iconName='IconX' onClick={close} sx={{ cursor: 'pointer' }} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close}>
					Cancel
				</Button>
				<Button onClick={handleClick} loading={loading}>
					Save
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid>
					<FormProvider {...methods}>
						{_.map(default_map, (option: any, index: any) => {
							const allValues = watch();
							const parent_checked = allValues[option?.id] ?? option?.checked;
							if (option?.id !== 'action')
								return (
									<React.Fragment key={`${option?.id}-${index}`}>
										<Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
											<CheckboxEditField
												name={option?.id}
												key={option?.id}
												defaultValue={parent_checked}
												checkbox_value={true}
												label={option?.label}
												disabled={option?.disabled || _.some(option?.children, (section: any) => section?.disabled)}
											/>
											{option?.children?.length > 0 &&
												(col_open.includes(option.id) ? (
													<Icon onClick={() => handlec_collapse_click(option?.id)} iconName='IconChevronUp' sx={{ cursor: 'pointer' }} />
												) : (
													<Icon onClick={() => handlec_collapse_click(option?.id)} iconName='IconChevronDown' sx={{ cursor: 'pointer' }} />
												))}
										</Grid>
										<Grid pl={3}>
											{option?.children?.length > 0 && (
												<Collapse in={col_open.includes(option?.id)} timeout='auto' unmountOnExit>
													{_.map(option?.children, (child: any, i: any) => {
														const is_checked = (allValues[`child_${option?.id}.${child?.id}`] ?? child?.checked) && allValues[option?.id];
														return (
															<React.Fragment key={`${child?.id}-${i}`}>
																<CheckboxEditField
																	name={`child_${option?.id}.${child?.id}`}
																	key={`child_${option?.id}.${child?.id}`}
																	defaultValue={is_checked}
																	checkbox_value={true}
																	label={child?.label}
																	disabled={child?.disabled}
																/>
															</React.Fragment>
														);
													})}
												</Collapse>
											)}
										</Grid>
									</React.Fragment>
								);
						})}
					</FormProvider>
				</Grid>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer anchor='right' width={380} open={open} onClose={close} content={handle_render_content()} />;
};
export default WizAiManageCols;
