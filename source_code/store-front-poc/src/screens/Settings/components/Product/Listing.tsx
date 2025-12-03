import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import { PLP_RAILS } from './PDPmock';
import _ from 'lodash';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import { useContext, useEffect, useState } from 'react';
import EditRailDrawer from '../Common/Drawer/EditRailDrawer';
import SettingsContext from '../../context';
import SsrmFilterSorting from '../Common/SsrmFilterSorting';

const ProductListingSetting = () => {
	const [rail_drawer, set_rail_drawer] = useState<any>({ state: false, data: null });
	const { get_keys_configuration, configure, update_configuration, get_super_set } = useContext(SettingsContext);

	useEffect(() => {
		get_keys_configuration('product_listing_page_config_web');
		get_keys_configuration('product_listing_page_config_v2');
		get_keys_configuration('product_listing_page_config');
		get_keys_configuration('collection_product_listing_page_config_web');
		get_keys_configuration('collection_product_listing_page_config');
		get_keys_configuration('collection_product_listing_page_config_v2');
		get_keys_configuration('category_product_listing_page_config_web');
		get_keys_configuration('category_product_listing_page_config');
		get_keys_configuration('category_product_listing_page_config_v2');
		get_super_set();
	}, []);

	const handleRowDrag = ({ api }: { api: any }) => {
		const updated_rails: any = [];
		api.forEachNode((node: any, index: number) => updated_rails.push({ ...node?.data, priority: index }));
		update_configuration('product_listing_page_config_web', {
			...configure?.product_listing_page_config_web,
			rails: [...updated_rails, _.last(configure?.product_listing_page_config_web?.rails)],
		});
		update_configuration('product_listing_page_config', {
			...configure?.product_listing_page_config,
			rails: [...updated_rails, _.last(configure?.product_listing_page_config?.rails)],
		});
		update_configuration('product_listing_page_config_v2', {
			...configure?.product_listing_page_config_v2,
			rails: [...updated_rails, _.last(configure?.product_listing_page_config_v2?.rails)],
		});
	};

	const handle_edit = (params: any) => {
		set_rail_drawer({ state: true, data: params?.node?.data });
	};

	const handle_save = (data: any) => {
		const updated_rails = _.map(configure?.product_listing_page_config_web?.rails, (rail: any) => {
			return rail?.type === data?.type ? data : rail;
		});
		update_configuration('product_listing_page_config_web', { ...configure?.product_listing_page_config_web, rails: updated_rails });
		update_configuration('product_listing_page_config', { ...configure?.product_listing_page_config, rails: updated_rails });
		update_configuration('product_listing_page_config_v2', { ...configure?.product_listing_page_config_v2, rails: updated_rails });
	};

	const should_disable_button = (data: any, key: string) => data?.sections === 'Basic details' && key === 'delete';

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Product listing page</CustomText>
			</Grid>
			<Grid display='flex' direction='column' gap={2} mt={2}>
				<CustomText color='rgba(0, 0, 0, 0.6)'>
					Customize the display settings of product cards, filters on the product listing page
				</CustomText>
				{_.map(PLP_RAILS, (section: any) => {
					const rowData = _.sortBy(_.initial(configure?.product_listing_page_config_web?.rails), ['priority'])?.map((item: any) => ({
						...item,
						is_active: item?.is_active ?? true,
					}));
					const height = rowData?.length * 50;

					const columnDef = [
						...section?.config,
						{ ...utils.create_action_config(section?.actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
					];

					return (
						<Grid display='flex' direction='column' gap={2} key={section?.title} alignItems='flex-start'>
							<Grid display='flex' direction='column' gap={1}>
								<CustomText type='H6'>{section?.title}</CustomText>
								<CustomText color='rgba(0, 0, 0, 0.6)'>{section?.subtitle}</CustomText>
							</Grid>
							<Grid width='100%'>
								<AgGridTableContainer
									onRowDragEnd={handleRowDrag}
									columnDefs={columnDef}
									hideManageColumn
									rowData={rowData}
									containerStyle={{ height: `${height + 100}px`, maxHeight: '700px', minHeight: '200px' }}
									showStatusBar={false}
								/>
							</Grid>
							{section?.key === 'customize_display_sections' && (
								<Button variant='text' color='primary' onClick={() => {}}>
									+ Add new section
								</Button>
							)}
						</Grid>
					);
				})}
			</Grid>
			<SsrmFilterSorting entity={'product'} />
			{rail_drawer?.state && (
				<EditRailDrawer
					is_visible={rail_drawer?.state}
					data={rail_drawer?.data}
					close={() => set_rail_drawer({ state: false, data: null })}
					handle_save={handle_save}
				/>
			)}
		</Grid>
	);
};

export default ProductListingSetting;
