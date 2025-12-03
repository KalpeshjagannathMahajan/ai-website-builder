import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'i18next';
import { Divider } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon, Radio } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import { set_notification_feedback } from 'src/actions/notifications';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import useDocumentTags from 'src/hooks/useDocumentTags';
import SelectDocumentTag from 'src/common/DocumentTags/SelectDocumentTag';
import { text_colors } from 'src/utils/light.theme';

interface ExportModalProps {
	open: boolean;
	set_open: any;
	total_count: number;
	total_rows: number;
	value: string;
	transform_info: any;
	payload_info: any;
	set_toast: any;
}

const { TENANT_SETTINGS_KEYS } = constants;

const export_options = [
	{ label: 'Export all', value: 'all' },
	{ label: 'Export filtered', value: 'filtered' },
];

const ExportDrawer = ({ open, set_open, total_count, total_rows, value, transform_info, payload_info, set_toast }: ExportModalProps) => {
	const [is_btn_loading, set_is_btn_loading] = useState<boolean>(false);
	const { document_tags_enabled } = useTenantSettings({ [TENANT_SETTINGS_KEYS.DOCUMENT_TAGS_ENABLED]: false });
	const { tags_data, tag_options } = useDocumentTags(document_tags_enabled);
	const dispatch = useDispatch();
	const methods = useForm({
		defaultValues: {
			export_type: total_count === total_rows ? export_options[0]?.value : export_options[1]?.value,
			assign_tag: constants.ASSIGN_TAG_OPTIONS[1]?.value,
			document_tag: null,
		},
	});
	const { setValue, watch, getValues }: any = methods;
	const show_doc_tag_options = watch('assign_tag') === 'yes';

	const handle_export = async () => {
		set_is_btn_loading(true);
		const { startRow, endRow, sortModel, filterModel } = payload_info;
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
		const payload = {
			entity: 'documents',
			startRow,
			endRow,
			sortModel,
			filterModel: {
				...filterModel,
				...(watch('export_type') === 'filtered' ? transform_info : {}),
			},
			...tags_payload,
		};
		try {
			await api_requests.manage_data.export_module_with_filter(payload);
			dispatch(set_notification_feedback(true));
			set_toast({
				show: true,
				message: t('ManageData.ExportToast.Sub'),
				title: t('ManageData.ExportToast.Title'),
				status: 'success',
			});
		} catch (error) {
			console.error(error);
		} finally {
			set_open(false);
			set_is_btn_loading(false);
		}
	};

	const handle_close = () => {
		set_open(false);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('OrderManagement.ExportDrawer.Title')}</CustomText>
				<Icon iconName='IconX' onClick={handle_close} />
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1} gap={1}>
				<FormProvider {...methods}>
					<form>
						<Grid>
							<CustomText type='H3'>{t('OrderManagement.ExportDrawer.ExportType')}</CustomText>
							<Grid pt={1.5} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								{_.map(export_options, (item) => (
									<Grid container key={item?.value} sx={{ alignItems: 'center', gap: '1.6rem' }}>
										<Controller
											name='export_type'
											control={methods.control}
											render={({ field }) => (
												<Radio
													{...field}
													checked={field.value === item?.value}
													sx={{ padding: '0' }}
													disabled={total_count === total_rows && item?.value === 'filtered'}
													onChange={() => setValue('export_type', item?.value)}
												/>
											)}
										/>
										<CustomText style={{ color: total_count === total_rows && item?.value === 'filtered' ? text_colors.disabled : '' }}>
											{item?.label}
											{` (${item?.value === 'all' ? total_count : total_rows})`}
										</CustomText>
									</Grid>
								))}
							</Grid>
						</Grid>
						<hr style={{ margin: '2rem 0rem' }} />
						<SelectDocumentTag value={value} document_tags_enabled={document_tags_enabled} tag_options={tag_options} />
					</form>
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' sx={{ justifyContent: 'flex-end' }}>
				<Button variant='outlined' onClick={handle_close}>
					{t('OrderManagement.ExportDrawer.FooterCancel')}
				</Button>
				<Button loading={is_btn_loading} onClick={handle_export}>
					{t('OrderManagement.ExportDrawer.FooterExport')}
				</Button>
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

	useEffect(() => {
		if (total_count === total_rows) setValue('export_type', export_options[0]?.value);
		else setValue('export_type', export_options[1]?.value);
	}, [total_count, total_rows]);

	return <Drawer anchor='right' width={450} open={open} onClose={() => set_open(false)} content={handle_render_content()} />;
};

export default ExportDrawer;
