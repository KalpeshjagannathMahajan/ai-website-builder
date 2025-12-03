import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close_toast, show_toast } from 'src/actions/message';
import { updateBreadcrumbs } from 'src/actions/topbar';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { Section } from 'src/common/Interfaces/SectionsInterface';
import OneColumnForm from 'src/common/OneColumnForms/OneColumnForms';
import RouteNames from 'src/utils/RouteNames';
import catalogs from 'src/utils/api_requests/catalog';
import types from 'src/utils/types';
import ProductAndPricing from './components/ProductAndPricing';

const styles = {
	productPricing: {
		width: '50%',
		margin: '2rem auto',
		background: '#FFF',
		padding: '2rem 2.8rem',
		borderRadius: '2rem',
		minHeight: '5rem',
	},
	message: {
		width: '50%',
		margin: '0 auto',
		borderRadius: '1.6rem',
		border: '1px solid #FFF',
		background: 'var(--info-100, #E1EDFF)',
		display: 'flex',
		padding: '2rem',
	},
};

const CreateCatalog = () => {
	// States
	const [form_field_sections, set_form_field_sections] = useState<Section[]>([]);

	// Constants
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'PriceLists',
			link: `${RouteNames.catelog_manager.path}`,
		},
		{
			id: 2,
			linkTitle: 'Create Pricelist',
			link: `${RouteNames.catalog.create.path}`,
		},
	];

	// Helpers
	const get_create_catalog_form_fields = async () => {
		try {
			const response: any = await catalogs.get_create_catalog_form();

			if (response?.status_code === 200) {
				const sections = response?.data?.sections || [];
				const sorted_sections = _.sortBy(sections, ['priority']);

				set_form_field_sections(sorted_sections);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handle_back_click = () => {
		navigate(RouteNames.catelog_manager.path);
	};

	const submit_callback = async (data: any) => {
		try {
			const response: any = await catalogs.post_create_catalog(data);

			// TODO::  to be changed to toast
			if (response?.status_code === 200) {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(response.data?.user_id));
						},
						state: types.SUCCESS_STATE,
						title: t('Catalog.CatalogCreated'),
						subtitle: `"${data.name}"`,
						showActions: false,
					}),
				);
				navigate(`${RouteNames.catalog.edit.routing_path}/${response?.data?.id}?is_create=true`);
			}
		} catch (error: any) {
			console.error(error);

			const _data = error?.response?.data;
			if (_data?.status_code === 409 || _data?.status_code === 401) {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(''));
						},
						state: types.ERROR_STATE,
						title: types.ERROR_TITLE,
						subtitle: _data?.message,
						showActions: false,
					}),
				);
			}
		}
	};

	// Hooks
	useEffect(() => {
		get_create_catalog_form_fields();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	return (
		<div style={{ paddingBottom: '1rem' }}>
			<OneColumnForm
				sections={form_field_sections}
				allow_back={true}
				back_text={t('Catalog.CreateCatalog')}
				submit_cta_text={t('Catalog.CreateCta')}
				handle_back_callback={handle_back_click}
				submit_callback={submit_callback}
				is_permission_form={false}
			/>
			{form_field_sections?.length > 0 && (
				<>
					<Grid sx={styles.message}>
						<Icon iconName='IconInfoCircle' />
						<CustomText style={{ padding: '0 1rem' }} type='Body' children={t('Catalog.AddProductToCatalogText')} />
					</Grid>
					<Grid sx={styles.productPricing}>
						<ProductAndPricing />
					</Grid>
				</>
			)}
		</div>
	);
};

export default CreateCatalog;
