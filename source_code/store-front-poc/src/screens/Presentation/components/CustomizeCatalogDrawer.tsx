import { ChangeEvent, useMemo, useState } from 'react';
import _, { find, map } from 'lodash';
import dayjs from 'dayjs';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Drawer, Grid, Icon, Sort, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { CatalogTemplate, CustomizeCatalogDrawerProps } from 'src/@types/presentation';
import CatalogFactory from 'src/utils/catalog.utils';
import { primary } from 'src/utils/light.theme';
import { get_default_sort } from 'src/common/@the-source/molecules/FiltersAndChips/helper';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import { useStyles } from './themes/CustomizeCatalogDrawer.theme';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';

const catalog_drawer_config = [
	{
		name: 'Catalog name',
		id: 'name',
		type: 'text',
		required: true,
	},
	{
		name: 'Sort by',
		id: 'sort_by',
		type: 'select',
	},
];

// const TemplateCard: React.FC<TemplateCardProps> = ({ template, is_selected, on_template_select }) => {
// 	const classes = useStyles();
// 	return (
// 		<Box
// 			className={`${classes.card} ${is_selected ? classes.selected_card : classes.not_selected_card}`}
// 			display={'flex'}
// 			justifyContent={'space-between'}
// 			onClick={() => on_template_select(template)}>
// 			<CustomText type='H6'>{template?.title ?? ''}</CustomText>
// 			{!_.isEmpty(template?.preview_image) && (
// 				<Grid>
// 					<Image src={template?.preview_image} alt={template?.title} width={'88px'} height={'73px'} />
// 				</Grid>
// 			)}
// 		</Box>
// 	);
// };

export default function CustomizeCatalogDrawer({
	is_drawer_visible,
	handle_close_drawer,
	catalog_templates,
	handle_submit_catalog,
	is_submit_loading,
	handle_catalog_preview,
	is_preview_loading,
	default_price_list,
	is_edit_mode,
	edit_catalog_data,
	current_sorting,
}: CustomizeCatalogDrawerProps) {
	const { sorts = [] } = useSelector((state: any) => state?.settings?.product_listing_config);
	const { catalog_products = [] } = useSelector((state: any) => state?.catalog_mode);
	const { catalog_data } = useSelector((state: any) => state?.catalog);
	const [count] = useState(catalog_products?.length);
	const price_list = useMemo(() => {
		return find(catalog_data, (item) => item.value === default_price_list?.value);
	}, [catalog_data]);
	const default_template = useMemo(() => {
		return find(catalog_templates, (item: CatalogTemplate) => item?.is_default);
	}, [catalog_templates]);

	const methods = useForm({
		defaultValues:
			is_edit_mode && edit_catalog_data
				? CatalogFactory.MODE.get_default_catalog_values(edit_catalog_data, catalog_templates, catalog_products)
				: {
						name: `Catalog - ${dayjs().format('DD MMM’YY') || ''}`,
						sort_by: '',
						template_id: default_template?.id,
						catalog_id: default_price_list?.value,
						show_price: false,
						product_ids: catalog_products,
				  },
	});
	const styles = useStyles();
	const {
		getValues,
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = methods;
	const selected_template_id = watch('template_id');
	const show_price_value = watch('show_price');
	const handle_sort_select = (key: any) => {
		setValue('sort_by', key);
	};

	const handle_toggle_price = (event: ChangeEvent<HTMLInputElement>) => {
		const toggle_val: boolean = event?.target?.checked;
		setValue('show_price', toggle_val);
	};

	const render_fields = () => {
		return _.map(catalog_drawer_config, (field: any) => {
			return (
				<Grid className={styles.field} container direction={'column'} gap={2}>
					<CustomText color={colors.grey_800} type='H6'>
						{field.name}
						{field.required && <span className={styles.required}>*</span>}
					</CustomText>
					{field?.type === 'select' ? (
						<Box width={'70%'}>
							<Sort
								onChange={handle_sort_select}
								options={sorts}
								defaultSort={get_default_sort(sorts, current_sorting ?? '')}
								size='small'
								fullWidth={true}
							/>
						</Box>
					) : (
						<FormBuilder
							key={field?.id}
							name={field?.id}
							label={field?.name}
							validations={{
								required: field?.required,
							}}
							id={field?.id}
							type={field?.type}
							sx={{
								width: '70%',
							}}
							getValues={getValues}
							setValue={setValue}
							control={control}
						/>
					)}
				</Grid>
			);
		});
	};

	const render_price_field = () => {
		return (
			<Box className={styles.field}>
				<CustomText color={colors.grey_800} type='H6'>
					{t('Presentation.CustomizeCatalogDrawer.Pricing')}
				</CustomText>
				<Box
					sx={{
						backgroundColor: colors.grey_600,
						display: 'flex',
						flexDirection: 'column',
						gap: '12px',
						padding: '16px',
						borderRadius: '8px',
						width: '420px',
					}}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<CustomText color={colors.grey_800} type='Body2'>
							{t('Presentation.CustomizeCatalogDrawer.ShowPricing')}
						</CustomText>
						<Switch checked={show_price_value} onChange={handle_toggle_price} />
					</Box>
					{price_list?.label && show_price_value && (
						<Box
							display={'flex'}
							alignItems={'center'}
							borderRadius={1}
							bgcolor={colors.white}
							py={1.2}
							px={1.2}
							gap={0.75}
							border={`1px solid ${colors.dark_midnight_blue}`}>
							<Icon color={colors.grey_800} iconName='IconCurrencyDollar' sx={{ height: '18px', width: '18px' }} />
							<CustomText type='Body2' color={primary[900]}>
								{price_list?.label}
							</CustomText>
						</Box>
					)}
				</Box>
			</Box>
		);
	};

	const handle_select_template = (selected_template: string) => {
		setValue('template_id', selected_template, { shouldValidate: true });
	};

	const render_header = (
		<Grid className='drawer-header'>
			<CustomText type='H2'>{t('Presentation.CustomizeCatalogDrawer.CustomizeCatalog')}</CustomText>
			<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={handle_close_drawer} />
		</Grid>
	);
	const render_footer = (
		<Grid className='drawer-footer'>
			<Grid container display={'flex'} justifyContent={'space-between'}>
				<Grid item display={'flex'} gap={1} alignItems={'center'}>
					<CustomText type='H6'>{count}</CustomText>
					<CustomText type='Body'>{t('Presentation.CustomizeCatalogDrawer.Products')}</CustomText>
				</Grid>
				<Grid item display={'flex'} gap={1.5}>
					<Button
						loading={is_preview_loading}
						onClick={handleSubmit(handle_catalog_preview)}
						variant='outlined'
						className={styles.cancel_btn}>
						{t('Presentation.CustomizeCatalogDrawer.Preview')}
					</Button>
					<Button type='submit' loading={is_submit_loading} variant='contained' onClick={handleSubmit(handle_submit_catalog)}>
						{t(is_edit_mode ? 'Presentation.CatalogPreview.UpdateAndGenerate' : 'Presentation.CatalogPreview.CreateAndGenerate')}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);

	const render_body = (
		<Grid className='drawer-body' pl={0.5}>
			<FormProvider {...methods}>
				{render_fields()}
				{render_price_field()}
				<Box pt={0.5}>
					<CustomText color={colors.grey_800} type='H6'>
						{t('Presentation.CustomizeCatalogDrawer.ChooseTemplate')} <span className={styles.required}>*</span>
					</CustomText>
					<Grid container width={0} height={0} visibility='hidden'>
						<FormBuilder
							name='template_id'
							id='template_id'
							label='Template'
							validations={{ required: true }}
							control={control}
							setValue={setValue}
							getValues={getValues}
							type='text'
						/>
					</Grid>
					{errors?.template_id && errors?.template_id?.message && (
						<CustomText style={{ marginTop: 1 }} type='Body' color={colors.red}>
							{errors?.template_id?.message}
						</CustomText>
					)}
					<Box mt={2}>
						<RadioGroup
							selectedOption={selected_template_id || ''}
							options={map(catalog_templates, (item: CatalogTemplate) => ({ label: item?.title, value: item?.id }))}
							onChange={handle_select_template}
							radio_icon_style={{ paddingLeft: 0 }}
						/>
					</Box>
				</Box>
			</FormProvider>
		</Grid>
	);
	const render_drawer_content = (
		<Grid className='drawer-container'>
			{render_header}
			<Divider className='drawer-divider' />
			{render_body}
			<Divider className='drawer-divider' />
			{render_footer}
		</Grid>
	);

	return <Drawer open={is_drawer_visible} width={640} onClose={handle_close_drawer} content={render_drawer_content} />;
}
