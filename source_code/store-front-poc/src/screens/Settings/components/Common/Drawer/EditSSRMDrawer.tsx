import { Divider } from '@mui/material';
import _ from 'lodash';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import SettingsContext from 'src/screens/Settings/context';
import { handle_entity } from 'src/screens/Settings/utils/constants';

interface Props {
	is_visible: boolean;
	entity: string;
	data: any;
	close: () => void;
}

const EditSSRMDrawer = ({ is_visible, entity, data, close }: Props) => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const entity_val: any = handle_entity(entity);

	const methods = useForm({
		defaultValues: { is_active: data?.is_active },
	});
	const { getValues, watch }: any = methods;

	const handleClick = () => {
		if (entity === 'product') {
			const updated_web_data = _.map(configure?.product_listing_page_config_web?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('product_listing_page_config_web', {
				...configure?.product_listing_page_config_web,
				search_in_config: updated_web_data,
			});
			const updated_app_data = _.map(configure?.product_listing_page_config?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('product_listing_page_config', {
				...configure?.product_listing_page_config,
				search_in_config: updated_app_data,
			});
			const updated_v2_data = _.map(configure?.product_listing_page_config_v2?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('product_listing_page_config_v2', {
				...configure?.product_listing_page_config_v2,
				search_in_config: updated_v2_data,
			});

			const updated_web_data_cat = _.map(configure?.category_product_listing_page_config_web?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('category_product_listing_page_config_web', {
				...configure?.category_product_listing_page_config_web,
				search_in_config: updated_web_data_cat,
			});
			const updated_app_data_cat = _.map(configure?.category_product_listing_page_config?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('category_product_listing_page_config', {
				...configure?.category_product_listing_page_config,
				search_in_config: updated_app_data_cat,
			});
			const updated_v2_data_cat = _.map(configure?.category_product_listing_page_config_v2?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('category_product_listing_page_config_v2', {
				...configure?.category_product_listing_page_config_v2,
				search_in_config: updated_v2_data_cat,
			});

			const updated_web_data_col = _.map(configure?.collection_product_listing_page_config_web?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('collection_product_listing_page_config_web', {
				...configure?.collection_product_listing_page_config_web,
				search_in_config: updated_web_data_col,
			});
			const updated_app_data_col = _.map(configure?.collection_product_listing_page_config?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('collection_product_listing_page_config', {
				...configure?.collection_product_listing_page_config,
				search_in_config: updated_app_data_col,
			});
			const updated_v2_data_col = _.map(configure?.collection_product_listing_page_config_v2?.search_in_config, (search: any) =>
				(search?.value === data?.value
					? { ...data, ...getValues() }
					: { ...search, is_default: getValues()?.is_default ? false : search?.is_default }),
			);
			update_configuration('collection_product_listing_page_config_v2', {
				...configure?.collection_product_listing_page_config_v2,
				search_in_config: updated_v2_data_col,
			});
		} else {
			if (!_.isEmpty(data?.web)) {
				const updated_web_data = _.map(configure?.[entity_val?.web_ssrm], (column: any) => {
					if (column?.key === data?.web?.key) return { ...column, visible: getValues().show_in_web };
					return column;
				});
				const is_existed = _.find(configure?.[entity_val?.web_ssrm], { key: data?.web?.key });
				if (!is_existed) {
					const new_filter = data?.web;
					updated_web_data.push({ ...new_filter, is_display: getValues().show_in_app });
				}
				update_configuration(entity_val?.web_ssrm, updated_web_data);
			}
			if (!_.isEmpty(data?.app)) {
				const updated_app_filters = _.map(configure?.[entity_val?.app_filter]?.filters, (filter: any) => {
					if (filter?.entity_name === data?.app?.entity_name) return { ...filter, is_display: getValues().show_in_app };
					else {
						return filter;
					}
				});
				const is_existed = _.find(configure?.[entity_val?.app_filter]?.filters, { entity_name: data?.app?.entity_name });
				if (!is_existed) {
					const new_filter = data?.app;
					updated_app_filters.push({ ...new_filter, is_display: getValues().show_in_app });
				}

				update_configuration(entity_val?.app_filter, { ...configure?.[entity_val?.app_filter], filters: updated_app_filters });
			}
		}
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.name ?? data?.large_label}</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined'>Cancel</Button>
				<Button onClick={handleClick}>Save</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					{entity !== 'product' && !_.isEmpty(data?.web) && (
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField name='show_in_web' key='show_in_web' defaultValue={data?.show_in_web} label='Included in web' />
						</Grid>
					)}
					{entity !== 'product' && !_.isEmpty(data?.app) && (
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField name='show_in_app' key='show_in_app' defaultValue={data?.show_in_app} label='Include in app' />
						</Grid>
					)}
					{entity === 'product' && (
						<Grid display={'flex'} direction={'column'} gap={2}>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_active'
									key='is_active'
									defaultValue={data?.is_active}
									label='Set tag as active'
									disabled={data?.is_default}
								/>
							</Grid>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_default'
									key='is_default'
									defaultValue={data?.is_default}
									label='Set tag as default'
									disabled={data?.is_default || !watch('is_active')}
								/>
							</Grid>
						</Grid>
					)}
				</FormProvider>
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
				open={is_visible}
				onClose={close}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default EditSSRMDrawer;
