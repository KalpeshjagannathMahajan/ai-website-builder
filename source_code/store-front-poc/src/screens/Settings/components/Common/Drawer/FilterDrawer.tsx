import React, { useContext } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import SettingsContext from 'src/screens/Settings/context';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
};

const FilterDrawer = ({ drawer, close, entity, filter, all_filters }: any) => {
	const { configure, update_configuration } = useContext(SettingsContext);

	const methods = useForm({
		defaultValues: { ...filter },
	});

	const { control, getValues, setValue, handleSubmit }: any = methods;

	const handle_save = () => {
		if (entity === 'product') {
			const updated_filter = getValues();
			const all_updated_filters = _.map(all_filters, (fltr: any) => (fltr?.name === filter?.name ? updated_filter : fltr));
			update_configuration('product_listing_page_config_web', {
				...configure?.product_listing_page_config_web,
				filters: all_updated_filters,
			});
			update_configuration('collection_product_listing_page_config_web', {
				...configure?.collection_product_listing_page_config_web,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'collection'),
			});
			update_configuration('category_product_listing_page_config_web', {
				...configure?.category_product_listing_page_config_web,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'category'),
			});

			update_configuration('product_listing_page_config', {
				...configure?.product_listing_page_config,
				filters: all_updated_filters,
			});
			update_configuration('collection_product_listing_page_config', {
				...configure?.collection_product_listing_page_config,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'collection'),
			});
			update_configuration('category_product_listing_page_config', {
				...configure?.category_product_listing_page_config,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'category'),
			});

			update_configuration('product_listing_page_config_v2', {
				...configure?.product_listing_page_config_v2,
				filters: all_updated_filters,
			});
			update_configuration('collection_product_listing_page_config_v2', {
				...configure?.collection_product_listing_page_config_v2,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'collection'),
			});
			update_configuration('category_product_listing_page_config_v2', {
				...configure?.category_product_listing_page_config_v2,
				filters: _.filter(all_updated_filters, (fltr: any) => fltr?.entity_name !== 'category'),
			});
		}
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid display='flex' direction='row' justifyContent={'space-between'}>
				<CustomText type='H3'>{filter?.name}</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const attributes: any = [
		{
			name: 'Sort by',
			id: 'filter_sort',
			type: 'select',
			value: '',
			options: _.map(filter?.filter_sort_options, (fltr: string) => ({ label: fltr, value: fltr })),
		},
	];
	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					{filter?.filter_sort_options && (
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
						</Grid>
					)}
					<Grid
						sx={{
							background: '#F7F8FA',
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField name='is_display' key='is_display' label='Set filter as active' />
					</Grid>
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close}>
					Cancel
				</Button>
				<Button onClick={handleSubmit(handle_save)}>Save</Button>
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
				onClose={close}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default FilterDrawer;
