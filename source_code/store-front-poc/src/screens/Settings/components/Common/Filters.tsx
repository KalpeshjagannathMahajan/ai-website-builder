import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import SettingsContext from '../../context';
import FilterDrawer from './Drawer/FilterDrawer';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { FILTER_SORTING, filter_columns } from '../../utils/constants';
import utils from 'src/utils/utils';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const Filters = ({ entity }: any) => {
	const [is_edit, set_edit] = useState<boolean>(false);
	const [data, set_data] = useState<any>(null);
	const [att_data, set_att_data] = useState<any>(null);
	const [row_data, set_row_data] = useState<any>([]);
	const { configure, super_set, update_configuration, get_attributes } = useContext(SettingsContext);

	const get_products = async () => {
		const res: any = await get_attributes('product');
		let temp: any;
		if (res) {
			temp = _.map(res, (att) => ({
				entity_id: att?.id,
				entity_name: 'attribute',
				name: att?.name,
				value: att?.name,
				label: att?.name,
				is_display: false,
				filter_sort: 'alphanumeric_ascending',
				filter_sort_options: FILTER_SORTING,
				meta: {
					type: 'multi_select',
					index_type: 'multi-select',
					is_primary: false,
					key: `transformed_attributes.${att?.id}`,
					dtype: 'text',
				},
			}));
		}
		set_att_data(temp);
	};

	useEffect(() => {
		if (entity === 'product') {
			const filters = _.map(super_set?.product_settings?.filters, (row: any) => {
				return row?.web;
			});
			let all_filters: any = _.unionBy(
				configure?.product_listing_page_config_web?.filters,
				configure?.collection_product_listing_page_config_web?.filters,
				configure?.category_product_listing_page_config_web?.filters,
				configure?.product_listing_page_config?.filters,
				configure?.collection_product_listing_page_config?.filters,
				configure?.category_product_listing_page_config?.filters,
				configure?.product_listing_page_config_v2?.filters,
				configure?.collection_product_listing_page_config_v2?.filters,
				configure?.category_product_listing_page_config_v2?.filters,
				filters,
				att_data,
				'name',
			)?.map((item, index) => {
				if (item?.meta?.type === 'range') {
					return { ...item, is_display: item?.is_display ?? true, priority: item?.priority ?? index };
				} else {
					return {
						...item,
						is_display: item?.is_display ?? true,
						priority: item?.priority ?? index,
						filter_sort: item?.filter_sort ?? 'alphanumeric_ascending',
						filter_sort_options: FILTER_SORTING,
					};
				}
			});
			set_row_data(all_filters);
		}
	}, [entity, super_set, configure]);

	useEffect(() => {
		get_products();
	}, []);

	const columnDef = [
		...filter_columns,
		utils.create_action_config(actions, (params: any) => {
			set_data(params?.node?.data);
			set_edit(true);
		}),
	];

	const handle_row_drag = ({ api }: { api: any }) => {
		const new_sorted_data: any = [];
		api.forEachNode((node: any, index: any) => {
			new_sorted_data?.push({ ...node.data, priority: index });
		});
		update_configuration('product_listing_page_config_web', {
			...configure?.product_listing_page_config_web,
			filters: new_sorted_data,
		});
		update_configuration('collection_product_listing_page_config_web', {
			...configure?.collection_product_listing_page_config_web,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'collection'),
		});
		update_configuration('category_product_listing_page_config_web', {
			...configure?.category_product_listing_page_config_web,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'category'),
		});
		update_configuration('product_listing_page_config', {
			...configure?.product_listing_page_config,
			filters: new_sorted_data,
		});
		update_configuration('collection_product_listing_page_config', {
			...configure?.collection_product_listing_page_config,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'collection'),
		});
		update_configuration('category_product_listing_page_config', {
			...configure?.category_product_listing_page_config,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'category'),
		});
		update_configuration('product_listing_page_config_v2', {
			...configure?.product_listing_page_config_v2,
			filters: new_sorted_data,
		});
		update_configuration('collection_product_listing_page_config_v2', {
			...configure?.collection_product_listing_page_config_v2,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'collection'),
		});
		update_configuration('category_product_listing_page_config_v2', {
			...configure?.category_product_listing_page_config_v2,
			filters: _.filter(new_sorted_data, (fltr: any) => fltr?.entity_name !== 'category'),
		});
	};

	return (
		<Grid py={1}>
			<Grid display='flex' direction='column' gap={'1rem'} py={1}>
				<CustomText type='H6'>Filter Permission</CustomText>
				<CustomText color='rgba(0, 0, 0, 0.6)'>Define filter type and sorting</CustomText>
			</Grid>
			<AgGridTableContainer
				columnDefs={columnDef}
				hideManageColumn
				rowData={row_data}
				containerStyle={{ height: '300px' }}
				showStatusBar={false}
				onRowDragEnd={handle_row_drag}
			/>
			{is_edit && <FilterDrawer drawer={is_edit} close={() => set_edit(false)} entity={entity} filter={data} all_filters={row_data} />}
		</Grid>
	);
};

export default Filters;
