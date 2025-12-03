import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Entity } from 'src/@types/manage_data';
import { set_notification_feedback } from 'src/actions/notifications';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { Avatar, Grid, Image, Menu } from 'src/common/@the-source/atoms';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import BottomSheet from 'src/screens/CatalogManager/components/BottomDrawer';
import api_requests from 'src/utils/api_requests';

interface IProductAndPricing {
	catalog_id?: string;
	catalog_name: string;
	products_count?: number;
	allow_export?: boolean;
	is_dirty?: boolean;
}

const menu_options = [
	{ value: 'import', label: 'Import Catalog' },
	{ value: 'export', label: 'Export Catalog' },
];
const commonStyle = {
	// margin: '0rem 1rem',
	marginTop: '-0.7rem',
	backgroundColor: '#FFFFFF',
	cursor: 'pointer',
	boxShadow: 'none',
};

const ProductAndPricing = ({ catalog_id, products_count, allow_export, is_dirty, catalog_name }: IProductAndPricing) => {
	const { t } = useTranslation();
	const [open_sheet, set_open_sheet] = useState<boolean>(false);

	const dispatch = useDispatch();
	const [start_import, set_start_import] = useState<boolean>(false);

	const handle_import = () => {
		if (allow_export && !is_dirty) {
			set_start_import(true);
		}
	};

	const handle_view_products = () => {
		set_open_sheet(true);
	};

	const handle_export = async () => {
		try {
			await api_requests.manage_data.export_module(Entity.Catalog, [catalog_id as string]);
			dispatch(set_notification_feedback(true));
		} catch (error) {
			console.log(error);
		}
	};

	const handle_click = (event: string) => {
		if (event === 'Import Catalog') {
			handle_import();
		} else {
			handle_export();
		}
	};

	const handle_close_sheet = () => {
		set_open_sheet(false);
	};

	return (
		<Grid display='flex' container>
			<ImportSidePanel
				entity={Entity.Catalog}
				show_drawer={start_import}
				entity_ids={[catalog_id as string]}
				toggle_drawer={() => {
					set_start_import((prev) => !prev);
				}}
			/>
			<Grid xs={12} item display='flex'>
				<Grid xs={11} item>
					<CustomText type='H3' children={t('Catalog.ProductAndPricing')} />
					<CustomText type='Body' style={{ padding: '1rem 0' }} children={t('Catalog.ProductAndPricingSub')} />
				</Grid>
				<Grid xs={1} display='flex' justifyContent='flex-end'>
					{products_count > 0 && (
						<div
							// onClick={handle_export}
							onClick={handle_view_products}>
							<CustomText
								type='Subtitle'
								style={{ color: '#16885F', cursor: 'pointer', margin: '0.2rem 1rem 0 0' }}
								children={t('Catalog.View')}
							/>
						</div>
					)}
					<Avatar
						style={commonStyle}
						isImageAvatar={false}
						content={
							<Menu
								btnStyle={{ border: 'none' }}
								LabelComponent={
									<Image
										style={{ cursor: `${allow_export && !is_dirty ? 'pointer' : 'not-allowed'}` }}
										src={allow_export && !is_dirty ? ImageLinks.icon_import_export : ImageLinks.icon_import_export_disabled}
										width='25px'
										height='25px'
									/>
								}
								closeOnItemClick={true}
								menu={menu_options}
								onClickMenuItem={(e: any) => handle_click(e)}
							/>
						}
						size='large'
						variant='circular'
					/>
				</Grid>
			</Grid>
			<Grid xs={2.3} item sx={{ paddingTop: '2rem' }}>
				<Grid item xs={12} display='flex' justifyContent='center'>
					<CustomText children={products_count ?? 0} type='H3' />
				</Grid>
				<Grid item xs={12} display='flex' justifyContent='flex-start'>
					<CustomText children='products included' type='Body' />
				</Grid>
			</Grid>
			{catalog_id && (
				<BottomSheet open_drawer={open_sheet} on_close={handle_close_sheet} catalog_id={catalog_id} title={catalog_name} is_edit={true} />
			)}
		</Grid>
	);
};

ProductAndPricing.defaultProps = {
	catalog_id: '',
	products_count: 0,
	allow_export: false,
	is_dirty: false,
	catalog_name: '',
};

export default ProductAndPricing;
