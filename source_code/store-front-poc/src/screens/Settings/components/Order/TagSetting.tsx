import utils from 'src/utils/utils';
import SettingsContext from '../../context';
import classes from '../../Settings.module.css';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Chip, Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import Loading from 'src/screens/Loading/Loading';
import { background_colors, primary, text_colors } from 'src/utils/light.theme';
import AddDocumentTag from '../Common/Drawer/AddDocumentTag';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ORDER_TAG } from '../General/mock';
import { t } from 'i18next';
import settings from 'src/utils/api_requests/setting';
import { useTheme } from '@mui/material';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const loading_container = {
	background: primary.contrastText,
	opacity: 0.4,
	width: '70%',
	position: 'fixed',
	top: '8rem',
	right: '8rem',
	height: '100vh',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const TagSetting = () => {
	const { is_loading, get_keys_configuration, configure, update_configuration } = useContext(SettingsContext);
	const document_tags_enabled = useSelector((state) => _.get(state, 'settings.document_tags_enabled', false));
	const [drawer, set_drawer] = useState<any>({ state: false, data: null, index: 0 });
	const [options, set_options] = useState<any>([]);
	const tag_config = _.head(configure?.order_settings?.tags);
	const theme: any = useTheme();

	const handle_edit = (params: any, key: string) => {
		if (key === 'edit') {
			set_drawer({ state: true, data: params?.node?.data, index: params?.rowIndex });
		}
	};

	const columnDef = [
		{
			suppressMenu: true,
			field: 'label',
			headerName: 'Name',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
			minWidth: 150,
			cellRenderer: (params: any) => {
				return (
					<Grid container alignItems={'center'} gap={1}>
						<span>{params.value}</span>
						{params?.data.is_default && (
							<Chip
								label='Default'
								sx={{ padding: '0', fontWeight: 700 }}
								bgColor={theme?.palette?.warning[50]}
								textColor={theme?.palette?.warning[600]}
							/>
						)}
					</Grid>
				);
			},
		},
		{
			suppressMenu: true,
			field: 'color',
			headerName: 'Color',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
			cellRenderer: (params: any) => {
				return (
					<Grid container alignItems={'center'} gap={0.5}>
						<Grid sx={{ padding: '0.8rem', background: params?.value, borderRadius: '2px' }}></Grid>
						{_.toUpper(params.value?.slice(1))}
					</Grid>
				);
			},
		},
		{
			suppressMenu: true,
			field: 'is_active',
			headerName: 'Active',
			flex: 1,
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agToggleCellEditor',
			editable: false,
			disable: true,
		},
		{ ...utils.create_action_config(actions, handle_edit) },
	];

	const handle_add_key = async () => {
		if (tag_config?.id) return;

		let template: any = {
			entity: 'document',
			id: '', // if id empty it will create new else it will update existing attribute by id
			alias: 'order tag',
			name: 'Order Tag',
			data_type: 'tag',
			is_mandatory: true,
			is_filterable: true,
			is_searchable: true,
			is_internal: true,
			configuration: { options: [] }, // Optional field - Dict or list
		};

		let tags;

		try {
			const res: any = await settings.update_attribute(template);
			tags = [
				{
					value: '',
					is_display: res?.data?.is_mandatory,
					required: false,
					is_quote_display: true,
					is_quote_mandatory: false,
					type: 'tag',
					name: 'Order Tag',
					priority: 1,
					options: [],
					id: res?.data?.id,
				},
			];
		} catch (e) {
			console.error(e);
		}

		await update_configuration('order_settings', { ...configure?.order_settings, tags }, close());
		await update_configuration('quote_settings', { ...configure?.quote_settings, tags }, close());
	};

	const height = (options?.length ?? 2) * 50;

	useEffect(() => {
		const _tag_data: any = tag_config;
		set_options(_tag_data?.options);
	}, [configure?.order_settings]);

	useEffect(() => {
		get_keys_configuration('order_settings');
		get_keys_configuration('quote_settings');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{ORDER_TAG}</CustomText>
			</Grid>
			<Grid sx={{ background: background_colors.secondary, p: 1, borderRadius: 1, my: 2, fontSize: '14px' }}>
				{document_tags_enabled ? (
					<CustomText>
						Order tag is now <b>enabled</b> and ready for use.
						{!tag_config?.id && (
							<>
								{' '}
								Please{' '}
								<a href='#' onClick={handle_add_key} style={{ color: text_colors.black, cursor: 'pointer' }}>
									click here
								</a>{' '}
								to activate the feature.
							</>
						)}
					</CustomText>
				) : (
					<CustomText>
						Order tag is currently <b>disabled</b>. To activate order tag settings, please enable them in your subscription preferences.
					</CustomText>
				)}
			</Grid>

			{document_tags_enabled && (
				<Grid>
					<CustomText type='Body'>{t('OrderTag.ParaText')}</CustomText>
					<Grid my={2}>
						<AgGridTableContainer
							columnDefs={columnDef}
							has_serials={false}
							hideManageColumn
							rowData={options ?? []}
							containerStyle={{ height: `${height + 50}px`, maxHeight: '500px', minHeight: '200px' }}
							showStatusBar={false}
						/>
					</Grid>
					<Button variant='text' onClick={() => set_drawer({ state: true, data: null, index: options?.length })} disabled={!tag_config?.id}>
						{t('OrderTag.AddTag')}
					</Button>
				</Grid>
			)}
			{drawer?.state && (
				<AddDocumentTag
					is_visible={true}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null })}
					tag_list={options || []}
					index={drawer?.index}
				/>
			)}
			{is_loading && (
				<Grid sx={loading_container}>
					<Loading />
				</Grid>
			)}
		</Grid>
	);
};

export default TagSetting;
