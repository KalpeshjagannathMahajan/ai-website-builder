import React, { useContext, useEffect } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import SettingsContext from 'src/screens/Settings/context';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const ViewSettingDrawer = ({ drawer, set_drawer, attribute, keys, template, data }: any) => {
	const methods = useForm({
		defaultValues: {
			is_display: attribute?.is_display,
			is_quote_display: attribute?.is_quote_display,
			is_mandatory: attribute?.is_mandatory,
			is_quote_mandatory: attribute?.is_quote_mandatory,
		},
	});
	const { getValues, setValue, watch }: any = methods;
	const { update_configuration, transform_document } = useContext(SettingsContext);
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'> {attribute?.name}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const handle_save = () => {
		if (keys === 'document') {
			let temp = data?.map((item: any) => {
				if (item?.key === attribute?.key) {
					const update_attr = item?.attributes.map((ie: any) => {
						return {
							...ie,
							required: getValues()?.is_mandatory,
							is_quote_mandatory: getValues()?.is_quote_mandatory,
							is_display: getValues()?.is_display,
							is_quote_display: getValues()?.is_quote_display,
						};
					});
					return {
						...item,
						attributes: update_attr,
						is_display: getValues()?.is_display,
						is_mandatory: getValues()?.is_mandatory,
						is_quote_display: getValues()?.is_quote_display,
						is_quote_mandatory: getValues()?.is_quote_mandatory,
					};
				}
				return item;
			});
			transform_document(temp);
		} else {
			const temp = data?.map((item: any) => {
				if (item.key === attribute.key) {
					return {
						...item,
						visible: getValues()?.visible,
						isFilterable: getValues()?.isFilterable,
					};
				}
				return item;
			});
			update_configuration(keys, temp);
		}
		set_drawer(false);
	};

	const is_display = watch('is_display');
	const is_quote_display = watch('is_quote_display');
	const is_mandatory = watch('is_mandatory');
	const is_quote_mandatory = watch('is_quote_mandatory');

	useEffect(() => {
		if (!is_display) {
			setValue('is_mandatory', false);
		}
		if (!is_quote_display) {
			setValue('is_quote_mandatory', false);
		}
	}, [is_display, is_quote_display, setValue, is_mandatory, is_quote_mandatory]);

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				{keys === 'document' ? (
					<>
						{_.map(template, (section: any, index: number) => (
							<Grid display={'flex'} flexDirection={'column'} gap={'1rem'} key={index}>
								<CustomText type='H6'> {section?.label}</CustomText>
								<FormProvider {...methods}>
									{_.map(section?.props, (item) => {
										const value_key: any = item?.key;
										const value: any = attribute?.[value_key];
										if (attribute?.key === 'send_emails_to' && (value_key === 'is_mandatory' || value_key === 'is_quote_mandatory'))
											return null;
										return (
											<Grid display='flex' alignItems='center' key={value_key} sx={{ bgcolor: '#F7F8FA', borderRadius: '8px' }}>
												<ToggleSwitchEditField
													name={item?.key}
													key={item?.key}
													defaultValue={value}
													label={item?.name}
													// disabled={attribute?.key === 'buyer_details'}
												/>
											</Grid>
										);
									})}
								</FormProvider>
								{index < template?.length - 1 && <div style={dividerStyle}></div>}
							</Grid>
						))}
					</>
				) : (
					<FormProvider {...methods}>
						{_.map(template, (item) => {
							const value_key = item?.key;
							const value = attribute?.[value_key];
							return (
								<Grid display='flex' alignItems='center' sx={{ bgcolor: '#F7F8FA', borderRadius: '8px' }}>
									<ToggleSwitchEditField name={item?.key} key={item?.key} defaultValue={value} label={item?.name} disabled={false} />
								</Grid>
							);
						})}
					</FormProvider>
				)}
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={() => set_drawer(false)}>
					Cancel
				</Button>
				<Button onClick={() => handle_save()}>Save</Button>
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

	return (
		<>
			<Drawer
				anchor='right'
				width={480}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default ViewSettingDrawer;
