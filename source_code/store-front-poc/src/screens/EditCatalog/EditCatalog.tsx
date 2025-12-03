import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { close_toast, show_toast } from 'src/actions/message';
import { updateBreadcrumbs } from 'src/actions/topbar';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import { Section } from 'src/common/Interfaces/SectionsInterface';
import OneColumnForm from 'src/common/OneColumnForms/OneColumnForms';
import RouteNames from 'src/utils/RouteNames';
import catalogs from 'src/utils/api_requests/catalog';
import types from 'src/utils/types';
import ProductAndPricing from '../CreateCatalog/components/ProductAndPricing';
import StatusChip from 'src/common/@the-source/atoms/Chips/StatusChip';
import utils from 'src/utils/utils';
import ConfirmationModal from 'src/common/@the-source/molecules/ConfirmationModal/ConfirmationModal';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';

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

const EditCatalog = () => {
	// States
	const [form_field_sections, set_form_field_sections] = useState<Section[]>([]);
	const [catalog_name, set_catalog_name] = useState<string>('');
	const [catalog_id, set_catalog_id] = useState<string>('');
	const [catalog_status, set_catalog_status] = useState<string>('');
	const [is_dirty, set_is_form_dirty] = useState<boolean>(false);
	const [show_delete_confirm, set_show_delete_confirm] = useState<boolean>(false);
	const [deleting, set_deleting] = useState<boolean>(false);
	const [product_count, set_product_count] = useState<number>(0);
	const [params] = useSearchParams();
	const [btn_loading, set_btn_loading] = useState<boolean>(false);

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
			linkTitle: 'Catalogs',
			link: `${RouteNames.catelog_manager.path}`,
		},
		{
			id: 2,
			linkTitle: 'Edit catalog', // [TODO] [Suyash] Change this to catalogue name
			link: `${RouteNames.catalog.create.path}`,
		},
	];

	// Helpers
	const initialise_states = (section: any) => {
		const name = _.filter(section.attributes, (attr: any) => attr.key === 'name')?.[0].value;
		const status = _.filter(section.attributes, (attr: any) => attr.key === 'status')?.[0].value;

		set_catalog_name(name);
		set_catalog_status(status);
	};

	const get_create_catalog_form_fields = async () => {
		try {
			const path_name: string[] = window.location.pathname.split('/');
			const id: string = path_name.pop() || '';
			set_catalog_id(id);

			const response: any = await catalogs.get_edit_catalog_form(id);

			if (response?.status_code === 200) {
				const sections = response?.data?.sections || [];
				const sorted_sections = _.sortBy(sections, ['priority']);
				set_form_field_sections(sorted_sections);
				set_product_count(response?.data.product_count);
				initialise_states(sections[0]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handle_back_click = () => {
		navigate(RouteNames.catelog_manager.path);
	};

	const handle_delete = () => {
		set_show_delete_confirm(true);
	};

	const delete_catalog = async () => {
		try {
			const response: any = await catalogs.delete_catalog(catalog_id);

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
						title: t('Catalog.CatalogDeleted'),
						subtitle: `"${catalog_name}"`,
						showActions: false,
					}),
				);
				handle_back_click();
			}
		} catch (error: any) {
			const _data = error?.response?.data;
			if (_data?.status_code === 409 || _data?.status_code === 401 || _data?.status_code === 403) {
				set_show_delete_confirm(false);
				set_deleting(false);
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

	const handle_delete_confirm = () => {
		set_deleting(true);
		delete_catalog();
	};

	const submit_callback = async (data: any) => {
		set_btn_loading(true);
		try {
			const response: any = await catalogs.patch_edit_catalog(data, catalog_id);
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
						title: t('Catalog.CatalogUpdated'),
						subtitle: `"${data.name}"`,
						showActions: false,
					}),
				);
				handle_back_click();
			}
		} catch (error: any) {
			console.error(error);

			const _data = error?.response?.data;
			if (_data?.status_code === 409 || _data?.status_code === 401 || _data?.status_code === 403) {
				set_btn_loading(false);
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
		// [TODO] [Suyash] Get catalog details first by ID from params
		get_create_catalog_form_fields();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	return (
		<div style={{ paddingBottom: '1rem' }}>
			<OneColumnForm
				sections={form_field_sections}
				allow_back={true}
				back_text={catalog_name}
				submit_cta_text={t('Catalog.SaveCta')}
				handle_back_callback={handle_back_click}
				submit_callback={submit_callback}
				is_permission_form={false}
				disable_cta_if_not_dirty={true && !JSON.parse(params.get('is_create') || 'false')}
				btn_loading_master={btn_loading}
				additional_header_left={
					<StatusChip
						statusColor={utils.get_chip_color_by_status(catalog_status)}
						textStyle={{ fontSize: '1.4rem' }}
						sx={{ padding: '2px 10px', marginLeft: '1rem', lineHeight: 'normal' }}
						label={catalog_status}
					/>
				}
				set_is_form_dirty={set_is_form_dirty}
			/>
			{form_field_sections?.length > 0 && (
				<>
					{is_dirty && (
						<Grid sx={styles.message}>
							<Icon iconName='IconInfoCircle' />
							<CustomText style={{ padding: '0 1rem' }} type='Body' children={t('Catalog.AddProductToExisitingCatalog')} />
						</Grid>
					)}
					<Grid sx={styles.productPricing}>
						<ProductAndPricing catalog_id={catalog_id} allow_export={true} is_dirty={is_dirty} products_count={product_count} />
					</Grid>
					<Can I={PERMISSIONS.delete_catalog.slug} a={PERMISSIONS.delete_catalog.permissionType}>
						<Grid sx={styles.productPricing} display='flex' container>
							<Grid item xs={7} display='flex' flexDirection='column'>
								<CustomText type='H3' children={t('Catalog.DeleteHeading')} />
								<CustomText type='Body' children={t('Catalog.DeleteSubHeading')} />
							</Grid>
							<Grid xs={5} display='flex' justifyContent='flex-end'>
								<Button
									variant='outlined'
									sx={{
										color: '#D74C10',
										borderRadius: '8px',
										border: '1px solid #EFB79F',
									}}
									onClick={handle_delete}>
									{t('Catalog.DeleteCta')}
								</Button>
							</Grid>
						</Grid>
					</Can>
				</>
			)}

			<ConfirmationModal
				title={`Delete catalog "${catalog_name}"`}
				show={show_delete_confirm}
				primary_button={
					<Button loading={deleting} onClick={handle_delete_confirm}>
						Delete
					</Button>
				}
				secondary_button={
					<Button variant='outlined' color='secondary' onClick={() => set_show_delete_confirm(false)}>
						Cancel
					</Button>
				}
				content='This will permanently delete catalog.'
				set_show={set_show_delete_confirm}
			/>
		</div>
	);
};

export default EditCatalog;
