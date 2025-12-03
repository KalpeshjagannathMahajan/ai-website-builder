import React, { useContext, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import MovableList from './MovableList';
import _ from 'lodash';
import SettingsContext from 'src/screens/Settings/context';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '0rem 0 1rem',
};

const SortingDrawer = ({ drawer, set_drawer, entity, sorting_options, data, type }: any) => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [options, set_options] = useState<any>(data);
	const default_option = _.find(sorting_options, (option: any) => option?.is_default !== false);

	const methods = useForm({
		defaultValues: {
			sorting_options: _.map(sorting_options, (option: any) => option?.value ?? option?.label),
			default_option: default_option?.value ?? default_option?.label ?? '',
		},
	});

	const { control, getValues, setValue, handleSubmit }: any = methods;

	const handleDrop = (list?: any) => {
		const updated_list = _.map(list, ({ label, key, is_visible, is_default, option_key }) => ({
			label,
			value: key,
			is_visible,
			is_default,
			key: option_key,
		}));
		set_options(updated_list);
	};

	const handle_save = () => {
		const updated_options = _.filter(options, (opt: any) => _.includes(getValues().sorting_options, opt.value)).map((option: any) => ({
			...option,
			is_default: option.value === getValues().default_option,
		}));
		if (entity === 'buyer') {
			const updated_data = { ...configure?.buyer_filter_config, sorting: updated_options };
			const updated_data_web = { ...configure?.buyer_filter_config_web, sorting: updated_options };
			update_configuration('buyer_filter_config', updated_data);
			update_configuration('buyer_filter_config_web', updated_data_web);
		} else if (entity === 'document') {
			const updated_data = { ...configure?.document_filter_config, sorting: updated_options };
			update_configuration('document_filter_config', updated_data);
		} else if (entity === 'product') {
			if (type === 'all') {
				const updated_data_product = { ...configure?.product_listing_page_config_web, global_sorting: updated_options };
				update_configuration('product_listing_page_config_web', updated_data_product);
				const updated_data_product_app = { ...configure?.product_listing_page_config, global_sorting: updated_options };
				update_configuration('product_listing_page_config', updated_data_product_app);
				const updated_data_product_v2 = { ...configure?.product_listing_page_config_v2, global_sorting: updated_options };
				update_configuration('product_listing_page_config_v2', updated_data_product_v2);

				const updated_data_category = { ...configure?.category_product_listing_page_config_web, global_sorting: updated_options };
				update_configuration('category_product_listing_page_config_web', updated_data_category);
				const updated_data_category_app = { ...configure?.category_product_listing_page_config, global_sorting: updated_options };
				update_configuration('category_product_listing_page_config', updated_data_category_app);
				const updated_data_category_v2 = { ...configure?.category_product_listing_page_config_v2, global_sorting: updated_options };
				update_configuration('category_product_listing_page_config_v2', updated_data_category_v2);

				const updated_data_collection = { ...configure?.collection_product_listing_page_config_web, global_sorting: updated_options };
				update_configuration('collection_product_listing_page_config_web', updated_data_collection);
				const updated_data_collection_app = { ...configure?.collection_product_listing_page_config, global_sorting: updated_options };
				update_configuration('collection_product_listing_page_config', updated_data_collection_app);
				const updated_data_collection_v2 = { ...configure?.collection_product_listing_page_config_v2, global_sorting: updated_options };
				update_configuration('collection_product_listing_page_config_v2', updated_data_collection_v2);
			} else {
				const updated_data = { ...configure?.[`${type}_web`], sorting: updated_options };
				update_configuration(`${type}_web`, updated_data);
				const updated_data_app = { ...configure?.[type], sorting: updated_options };
				update_configuration(type, updated_data_app);
				const updated_data_v2 = { ...configure?.[`${type}_v2`], sorting: updated_options };
				update_configuration(`${type}_v2`, updated_data_v2);
			}
		}
		set_drawer(false);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Sorting</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const attributes: any = [
		{
			name: 'Select sorting options',
			id: 'sorting_options',
			type: 'multi_select',
			options: data,
		},
		{
			name: 'Select default options',
			id: 'default_option',
			type: 'select',
			options: _.filter(data, (item: any) => _.includes(getValues().sorting_options, item.value)),
		},
	];
	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<Grid display={'flex'} flexDirection={'column'} gap={2} py={1}>
						{_.map(attributes, (attribute) => (
							<FormBuilder
								placeholder={attribute?.name}
								label={attribute?.name}
								name={attribute?.id}
								validations={{ required: true }}
								options={attribute?.options}
								type={attribute?.type}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
							/>
						))}
						<div style={dividerStyle}></div>
						<MovableList
							onDrop={handleDrop}
							list={_.filter(options, (opt: any) => _.includes(getValues().sorting_options, opt.value))?.map((option: any) => ({
								is_visible: option?.is_visible,
								is_default: option?.value === getValues().default_option,
								option_key: option?.key,
								node: (
									<Grid>
										<CustomText type='Body' color='rgba(103, 109, 119, 1)'>
											{option?.label} {option?.value === getValues().default_option ? 'Default' : ''}
										</CustomText>
									</Grid>
								),
								label: option?.label,
								onDelete: (key: any) => {
									// eslint-disable-next-line @typescript-eslint/no-shadow
									let curr_options = _.filter(options, (option: any) => option.value !== key);
									set_options(curr_options);
									setValue(
										'sorting_options',
										_.filter(getValues()?.sorting_options, (str: string) => str !== key),
									);
								},
								deleteable: false,
								dragable: true,
								key: option?.value,
							}))}
						/>
					</Grid>
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={() => set_drawer(false)}>
					Cancel
				</Button>
				<Button disabled={!_.includes(getValues()?.sorting_options, getValues()?.default_option)} onClick={handleSubmit(handle_save)}>
					Save
				</Button>
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
export default SortingDrawer;
