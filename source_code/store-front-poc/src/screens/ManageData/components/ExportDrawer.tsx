import { Divider } from '@mui/material';
import { t } from 'i18next';
import { useContext, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import ManageDataContext from '../context';
import DateFilterComp from './DateFilterComp';
import { EXPORT_OPTIONS } from 'src/utils/api_requests/manageData';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import SelectDocumentTag from 'src/common/DocumentTags/SelectDocumentTag';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import useDocumentTags from 'src/hooks/useDocumentTags';

interface Props {
	is_visible: boolean;
	close: () => void;
}

const { TENANT_SETTINGS_KEYS } = constants;

const ExportComp = ({ is_visible, close }: Props) => {
	const { handle_export_button, selected_data_card } = useContext(ManageDataContext);
	const initial_value = selected_data_card?.value === 'documents' ? { option: 'last_month' } : { option: 'products' };
	const [payload, set_payload] = useState<EXPORT_OPTIONS>(initial_value);
	const { document_tags_enabled } = useTenantSettings({ [TENANT_SETTINGS_KEYS.DOCUMENT_TAGS_ENABLED]: false });
	const { tags_data, tag_options } = useDocumentTags(document_tags_enabled);

	const methods = useForm({
		defaultValues: {
			assign_tag: constants.ASSIGN_TAG_OPTIONS[1]?.value,
			document_tag: null,
		},
	});
	const { control, getValues, setValue, watch }: any = methods;
	const show_doc_tag_options = watch('assign_tag') === 'yes';

	const handle_export_options = () => {
		let sub_entity_options = [{ label: 'Products', value: 'products' }];
		const related_export_permission: boolean = _.find(
			selected_data_card?.sub_entities,
			(item) => item?.value === 'related_products',
		)?.can_export;
		const volume_pricing_export_permission: boolean = _.find(
			selected_data_card?.sub_entities,
			(item) => item?.value === 'volume_pricing',
		)?.can_export;

		if (related_export_permission) {
			sub_entity_options.push({ label: 'Related Products', value: 'related_products' });
		}
		if (volume_pricing_export_permission) {
			sub_entity_options.push({ label: 'Volume Pricing', value: 'volume_pricing' });
		}

		return sub_entity_options;
	};

	const sub_entity_options_export = handle_export_options();

	const handle_save = () => {
		let export_option: any = payload;

		if (selected_data_card?.value === 'documents') {
			const selected_tag = getValues('document_tag') ?? _.head(tag_options)?.value;
			const mapped_selected_tag: any = _.find(tag_options, (item: any) => item?.value === selected_tag);
			const tags_payload =
				document_tags_enabled && show_doc_tag_options
					? {
							tag_info: {
								id: tags_data?.id,
								tag: {
									label: mapped_selected_tag?.label,
									value: mapped_selected_tag?.value,
									color: mapped_selected_tag?.color,
								},
							},
					  }
					: {};
			export_option = { ...export_option, from_date: payload?.from_date || '', to_date: payload?.to_date || '', ...tags_payload };
		} else {
			export_option = { from_date: payload?.from_date || '', to_date: payload?.to_date || '', option: getValues()?.select_option };
		}
		handle_export_button(export_option);
		close();
	};

	const handle_product_comp = () => {
		return (
			<FormBuilder
				placeholder='select option'
				label='select option'
				name='select_option'
				defaultValue='products'
				validations={{}}
				type='select'
				options={sub_entity_options_export}
				control={control}
				register={methods.register}
				getValues={getValues}
				setValue={setValue}
				displayRadioButton={false}
				showSelector={true}
				show_clear={false}
			/>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Export data</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end' gap={2}>
				<Button onClick={close} variant='outlined' color='inherit'>
					Cancel
				</Button>
				<Button disabled={payload?.option === 'custom' && !payload?.from_date && !payload?.to_date} onClick={handle_save}>
					Export
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<CustomText>{t('Common.ImportDrawer.SelectExportFilter')}</CustomText>
					{selected_data_card?.value === 'documents' ? (
						<>
							<DateFilterComp payload={payload} set_payload={set_payload} />
							<SelectDocumentTag
								value={t('Common.ImportDrawer.OrdersAndQuotes')}
								document_tags_enabled={document_tags_enabled}
								tag_options={tag_options}
							/>
						</>
					) : (
						handle_product_comp()
					)}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
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

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

const ExportDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <ExportComp {...props} />;
};

export default ExportDrawer;
