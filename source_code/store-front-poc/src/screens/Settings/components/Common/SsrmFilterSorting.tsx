import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import Sorting from './Sorting';
import { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import SettingsContext from '../../context';
import EditSSRMDrawer from './Drawer/EditSSRMDrawer';
import { handle_entity, sales_section } from '../../utils/constants';
import Filters from './Filters';
import { PLP } from '../Product/PDPmock';
import DocumentCustom from '../Order/DocumentCustom';

const SsrmFilterSorting = ({ entity }: any) => {
	const [open_setting, set_open_setting] = useState<boolean>(false);
	const [row_data, set_row_data] = useState<any>([]);
	const [sorting_data, set_sorting_data] = useState<any>([]);
	const [data, set_data] = useState<any>({});
	const { super_set, configure, update_configuration } = useContext(SettingsContext);
	const entity_val: any = handle_entity(entity);
	const actions = [
		{
			name: 'Edit',
			action: 'edit',
			icon: 'IconEdit',
			key: 'edit',
		},
	];

	const handleRowDrag = ({ api }: { api: any }) => {
		if (entity === 'product') {
			const updated_data: any = [];
			api.forEachNode((node: any) => updated_data.push(node?.data));

			update_configuration('product_listing_page_config_web', {
				...configure?.product_listing_page_config_web,
				search_in_config: updated_data,
			});

			update_configuration('product_listing_page_config', {
				...configure?.product_listing_page_config,
				search_in_config: updated_data,
			});

			update_configuration('product_listing_page_config_v2', {
				...configure?.product_listing_page_config_v2,
				search_in_config: updated_data,
			});

			update_configuration('category_product_listing_page_config_web', {
				...configure?.category_product_listing_page_config_web,
				search_in_config: updated_data,
			});

			update_configuration('category_product_listing_page_config', {
				...configure?.category_product_listing_page_config,
				search_in_config: updated_data,
			});

			update_configuration('category_product_listing_page_config_v2', {
				...configure?.category_product_listing_page_config_v2,
				search_in_config: updated_data,
			});

			update_configuration('collection_product_listing_page_config_web', {
				...configure?.collection_product_listing_page_config_web,
				search_in_config: updated_data,
			});

			update_configuration('collection_product_listing_page_config', {
				...configure?.collection_product_listing_page_config,
				search_in_config: updated_data,
			});

			update_configuration('collection_product_listing_page_config_v2', {
				...configure?.collection_product_listing_page_config_v2,
				search_in_config: updated_data,
			});
		} else {
			const new_web_data: any = [];
			const new_app_data: any = [];
			api.forEachNode((node: any, index: number) => {
				if (!_.isEmpty(node?.data?.web)) new_web_data.push({ ...node?.data?.web, priority: index, visible: node?.data?.show_in_web });
				if (!_.isEmpty(node?.data?.app)) new_app_data.push({ ...node?.data?.app, priority: index, is_display: node?.data?.show_in_app });
			});
			update_configuration(entity_val?.web_ssrm, new_web_data);
			update_configuration(entity_val?.app_filter, { ...configure?.[entity_val?.app_filter], filters: new_app_data });
		}
	};

	const handle_edit = (params: any) => {
		set_open_setting(true);
		set_data(params?.node?.data);
	};

	const config = [...sales_section?.columns, utils.create_action_config(actions, handle_edit)];
	const colum_def_listing = [...PLP.config, utils.create_action_config(actions, handle_edit)];
	const create_data = () => {
		// Initial mapping and sorting of super set data
		let updated_row_data = _(super_set?.[entity_val?.super_set]?.[entity_val?.listing])
			.map((row: any) => {
				const web_field = _.findIndex(
					configure?.[entity_val?.web_ssrm],
					(column: any) => column?.key === row?.web?.key || column?.name === row?.web?.name,
				);
				const app_field = _.findIndex(
					configure?.[entity_val?.app_filter]?.filters,
					(filter: any) => filter?.entity_name === row?.app?.entity_name,
				);
				const priority =
					web_field !== -1 ? web_field : app_field !== -1 ? app_field : super_set?.[entity_val?.super_set]?.[entity_val?.listing].length;
				return {
					...row,
					show_in_web: web_field !== -1 && (configure?.[entity_val?.web_ssrm]?.[web_field]?.visible ?? true),
					show_in_app: app_field !== -1 && (configure?.[entity_val?.app_filter]?.filters?.[app_field]?.is_display ?? true),
					priority,
				};
			})
			.sortBy('priority')
			.value();

		// Adding missing rows from web_ssrm to updated_row_data
		configure?.[entity_val?.web_ssrm]?.forEach((web_row: any) => {
			const existsInUpdatedData = _.some(
				updated_row_data,
				(row: any) => row?.web?.key === web_row?.key || row?.web?.name === web_row?.name,
			);
			if (!existsInUpdatedData) {
				const app_field = _.findIndex(
					configure?.[entity_val?.app_filter]?.filters,
					(filter: any) => filter?.entity_name === web_row?.key || filter?.name === web_row?.name,
				);
				updated_row_data.push({
					app: configure?.[entity_val?.app_filter]?.filters?.[app_field] ?? {},
					web: web_row,
					name: web_row?.name,
					show_in_web: web_row?.visible ?? true,
					show_in_app: configure?.[entity_val?.app_filter]?.filters?.[app_field]?.is_display ?? true,
					priority: updated_row_data?.length,
				});
			}
		});
		// Adding missing rows from app_filter to updated_row_data
		configure?.[entity_val?.app_filter]?.filters?.forEach((app_row: any) => {
			const existsInUpdatedData = _.some(updated_row_data, (row: any) => row?.app?.entity_name === app_row?.entity_name);
			if (!existsInUpdatedData) {
				const web_field = _.findIndex(
					configure?.[entity_val?.web_ssrm],
					(column: any) => column?.key === app_row?.entity_name || column?.name === app_row?.name,
				);
				updated_row_data.push({
					app: app_row,
					name: app_row?.name,
					web: configure?.[entity_val?.web_ssrm]?.[web_field] ?? {},
					show_in_web: configure?.[entity_val?.web_ssrm]?.[web_field]?.visible ?? true,
					show_in_app: app_row?.is_display ?? true,
					priority: updated_row_data.length,
				});
			}
		});

		// updated_row_data = _.uniqBy(updated_row_data, 'name');
		updated_row_data = _.map(updated_row_data, (row: any) => {
			const new_item: any = row;
			if (_.isEmpty(row?.web)) {
				const web_field = _.findIndex(
					configure?.[entity_val?.web_ssrm],
					(column: any) => column?.key === row?.app?.entity_name || column?.name === row?.app?.name,
				);
				new_item.web = configure?.[entity_val?.web_ssrm]?.[web_field] ?? {};
				new_item.show_in_web = configure?.[entity_val?.web_ssrm]?.[web_field]?.visible ?? true;
			}
			if (_.isEmpty(row?.app)) {
				const app_field = _.findIndex(
					configure?.[entity_val?.app_filter]?.filters,
					(filter: any) => filter?.entity_name === row?.web?.key || filter?.name === row?.web?.name,
				);
				new_item.app = configure?.[entity_val?.app_filter]?.filters?.[app_field] ?? {};
				new_item.show_in_app = configure?.[entity_val?.app_filter]?.filters?.[app_field]?.is_display ?? true;
			}
			return new_item;
		});
		// Sorting the final updated row data by priority
		const final_row_data = _.sortBy(updated_row_data, 'priority');

		set_row_data(final_row_data);
	};

	//update settings
	const create_sorting_config = () => {
		const updated_row_data = _.map(super_set?.[entity_val?.super_set]?.sorting_permissions, (row: any) => {
			return row?.app;
		});
		set_sorting_data(updated_row_data);
	};
	const search_data = _.map(configure?.product_listing_page_config_web?.search_in_config, (item: any) => ({
		...item,
		is_active: item?.is_active ?? true,
	}));
	useEffect(() => {
		if (entity !== 'product') create_data();
		create_sorting_config();
	}, [configure, super_set]);

	return (
		<Grid display='flex' flexDirection='column' gap={1}>
			<Grid>
				<Grid py={1}>
					<CustomText type='H6' style={{ marginBottom: '1rem', paddingTop: '1rem' }}>
						{entity === 'buyer' ? 'Customer list paging' : entity === 'product' ? 'Search' : 'Sales list paging'} settings
					</CustomText>
					{entity === 'product' && (
						<CustomText color='rgba(0, 0, 0, 0.6)'>Set default settings and hierarchy for search results</CustomText>
					)}
				</Grid>
				{entity === 'product' ? (
					<AgGridTableContainer
						onRowDragEnd={handleRowDrag}
						columnDefs={colum_def_listing}
						hideManageColumn
						rowData={search_data}
						containerStyle={{ height: `${search_data?.length * 50 + 100}px` }}
						showStatusBar={false}
					/>
				) : (
					<AgGridTableContainer
						onRowDragEnd={handleRowDrag}
						columnDefs={config}
						hideManageColumn
						rowData={row_data}
						containerStyle={{ height: '500px' }}
						showStatusBar={false}
					/>
				)}
			</Grid>
			{entity === 'product' && <Filters entity={entity} />}
			{entity === 'document' && <DocumentCustom all_attributes={configure?.document_ssrm_settings || []} />}
			<Sorting config_data={sorting_data} entity={entity} />
			{open_setting && <EditSSRMDrawer is_visible={open_setting} entity={entity} close={() => set_open_setting(false)} data={data} />}
		</Grid>
	);
};

export default SsrmFilterSorting;
