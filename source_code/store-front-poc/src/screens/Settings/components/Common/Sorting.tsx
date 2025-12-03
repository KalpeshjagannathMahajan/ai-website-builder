import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import SortingDrawer from './Drawer/SortingDrawer';
import SettingsContext from '../../context';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { product_entity, sorting_columns } from '../../utils/constants';
import utils from 'src/utils/utils';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const Sorting = ({ config_data, entity }: any) => {
	const [is_edit, set_edit] = useState<boolean>(false);
	const [row_data, set_row_data] = useState<any>([]);
	const [default_data, set_default_data] = useState<any>(config_data ?? []);
	const [show_sort, set_show_sort] = useState<any>([]);
	const [type, set_type] = useState<string>('');
	const { configure } = useContext(SettingsContext);

	useEffect(() => {
		if (entity === 'buyer') {
			set_show_sort(configure?.buyer_filter_config?.sorting);
			set_default_data(configure?.buyer_filter_config?.sorting);
		} else if (entity === 'document') {
			set_show_sort(configure?.document_filter_config?.sorting);
			set_default_data(configure?.document_filter_config?.sorting);
		} else {
			let temp: any = [
				{
					name: 'Product',
					type: 'product_listing_page_config',
					default: _.find(configure?.product_listing_page_config_web?.sorting, (item) => item?.is_default)?.label,
					options: configure?.product_listing_page_config_web?.sorting,
				},
				{
					name: 'Collections',
					type: 'collection_product_listing_page_config',
					default: _.find(configure?.collection_product_listing_page_config_web?.sorting, (item) => item?.is_default)?.label,
					options: configure?.collection_product_listing_page_config_web?.sorting,
				},
				{
					name: 'Category',
					type: 'category_product_listing_page_config',
					default: _.find(configure?.category_product_listing_page_config_web?.sorting, (item) => item?.is_default)?.label,
					options: configure?.category_product_listing_page_config_web?.sorting,
				},
				{
					name: 'Global Search',
					type: 'all',
					default: _.find(configure?.product_listing_page_config_web?.global_sorting, (item) => item?.is_default)?.label,
					options: configure?.product_listing_page_config_web?.global_sorting,
				},
			];
			set_row_data(temp);
		}
	}, [
		entity,
		configure?.buyer_filter_config?.sorting,
		configure?.document_filter_config?.sorting,
		configure?.product_listing_page_config_web?.sorting,
		configure?.category_product_listing_page_config_web?.sorting,
		configure?.collection_product_listing_page_config_web?.sorting,
	]);

	const columnDef = [
		...sorting_columns,
		utils.create_action_config(actions, (params: any) => {
			set_show_sort(params?.node?.data?.options);
			set_type(params?.node?.data?.type);
			let default_options = _.unionBy(params?.node?.data?.options, config_data, 'label');
			set_default_data(default_options);
			set_edit(true);
		}),
	];
	return (
		<Grid py={1}>
			<CustomText type='H6' style={{ margin: '1rem 0' }}>
				Sorting Permission
			</CustomText>
			{entity !== product_entity ? (
				<Grid p={2} sx={{ borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.2)', marginTop: '1rem' }}>
					<Grid display='flex' alignItems='center' justifyContent='space-between'>
						<CustomText type='Subtitle' color='#676D77'>
							Sort by
						</CustomText>
						<Icon iconName='IconEdit' onClick={() => set_edit(true)} />
					</Grid>
					<Grid display='flex' flexDirection='column'>
						{_.map(show_sort, (option) => {
							return <CustomText color='#676D77'>{`${option?.label} ${option?.is_default ? ' - Default' : ''}`}</CustomText>;
						})}
					</Grid>
				</Grid>
			) : (
				<Grid>
					<AgGridTableContainer
						columnDefs={columnDef}
						hideManageColumn
						rowData={row_data}
						containerStyle={{ height: '260px' }}
						showStatusBar={false}
					/>
				</Grid>
			)}
			{is_edit && (
				<SortingDrawer
					drawer={is_edit}
					set_drawer={set_edit}
					sorting_options={show_sort}
					entity={entity}
					data={_.map(default_data, (opt: any) => ({ ...opt, value: opt?.value || opt?.label }))}
					type={type}
				/>
			)}
		</Grid>
	);
};

export default Sorting;
