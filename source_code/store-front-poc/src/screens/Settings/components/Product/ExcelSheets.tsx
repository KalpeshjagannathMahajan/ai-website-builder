import _ from 'lodash';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { EXCEL_ENTITIES, excel_config } from './mock';
import General from './General';
import React, { useContext, useEffect, useState } from 'react';
import utils from 'src/utils/utils';
import settings from 'src/utils/api_requests/setting';
import AddEditExcelDrawer from '../Common/Drawer/AddEditExcelDrawer';
import SettingsContext from '../../context';
import { background_colors } from 'src/utils/light.theme';
import { t } from 'i18next';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
};
export const ExcelSheets = ({ title = 'Tear Sheet', show_all = true }) => {
	const { configure, get_keys_configuration } = useContext(SettingsContext);
	const initial_state = { state: false, is_edit: false, data: null, type: '', length: 0 };
	const [template_drawer, set_template_drawer] = useState<any>(initial_state);
	const [tearsheet_data, set_tearsheet_data] = useState<any>(null);
	const [refetch_data, set_refetch_data] = useState<any>({ state: true, key: '', id: '', type: '' });
	const excel_format_subscribed = configure?.tenant_settings?.enable_excel_sheet_format || false;

	const handle_fetch_and_set_data = (fetchId: string, key: string) => {
		settings
			.get_excel_templates(fetchId)
			.then((res: any) => {
				if (res?.status === 200) {
					set_tearsheet_data((prev: any) => ({ ...prev, [key]: res?.data }));
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	const handle_refetch_data = () => {
		const { type, id, key } = refetch_data || {};
		if (type === 'table') {
			handle_fetch_and_set_data(id, key);
		}
	};

	const handle_fetch_data = () => {
		_.forEach(EXCEL_ENTITIES, (entity: any) => {
			const { type, id, key } = entity;
			if (type === 'table') {
				handle_fetch_and_set_data(id, key);
			}
		});
	};

	const handle_close = () => set_template_drawer(initial_state);

	const handle_render_type = (entity: any, index: number) => {
		const handle_edit = (params: any, key: string) => {
			if (key === 'preview') {
				window.open(params?.node?.data?.img_sample_file, '_blank');
				return;
			}
			set_template_drawer({
				state: true,
				is_edit: true,
				data: params?.node?.data,
				type: entity.id,
				length: _.size(tearsheet_data?.[entity?.key]) ?? 0,
			});
		};
		const should_disable_button = () => !excel_format_subscribed;
		const columnDef = [
			...excel_config,
			{ ...utils.create_action_config(actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
		];

		switch (entity?.type) {
			case 'table':
				const height = tearsheet_data?.[entity?.key]?.length * 50;
				return (
					<Grid display='flex' direction='column' gap={2}>
						<Grid display='flex' direction={'column'} gap={1} py={1}>
							<CustomText type='H3'>{entity?.label}</CustomText>
							<CustomText>{entity?.subtitle}</CustomText>
						</Grid>
						<AgGridTableContainer
							columnDefs={columnDef}
							hideManageColumn
							rowData={tearsheet_data?.[entity?.key]}
							containerStyle={{ height: `${height + 100}px`, maxHeight: '700px' }}
							showStatusBar={false}
						/>
						{excel_format_subscribed && _.size(tearsheet_data?.[entity?.key]) < 1 && (
							<Button
								variant='text'
								sx={{ alignSelf: 'flex-start' }}
								onClick={() =>
									set_template_drawer({
										state: true,
										is_edit: false,
										data: null,
										type: entity?.id,
										length: _.size(tearsheet_data?.[entity?.key]) ?? 0,
									})
								}>
								{t('Settings.AddExcel')}
							</Button>
						)}
						{index < EXCEL_ENTITIES?.length - 1 && <div style={dividerStyle}></div>}
					</Grid>
				);
			default:
				return <General data={tearsheet_data?.general} set_refetch={set_refetch_data} />;
		}
	};

	useEffect(() => {
		get_keys_configuration('tenant_settings');
		handle_fetch_data();
	}, []);

	useEffect(() => {
		handle_refetch_data();
	}, [refetch_data?.state]);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{title}</CustomText>
			</Grid>
			<Grid my={2} display={'flex'} direction={'column'} gap={2} sx={{ background: background_colors.secondary, p: 1, borderRadius: 1 }}>
				<CustomText>
					{excel_format_subscribed ? (
						<>
							Excel format sheet functionality is now <strong>enabled</strong> and ready for use.
						</>
					) : (
						<>
							Excel format sheet functionality is currently <strong>disabled</strong>. To activate Excel format sheet settings, please
							enable them in your subscription preferences.
						</>
					)}
				</CustomText>
			</Grid>
			<Grid display='flex' flexDirection='column' gap={2} py={1}>
				{_.map(EXCEL_ENTITIES, (entity: any, index: number) => {
					if (show_all) {
						return <React.Fragment key={entity?.type}>{handle_render_type(entity, index)}</React.Fragment>;
					}
				})}
			</Grid>
			{template_drawer?.state && (
				<AddEditExcelDrawer
					is_visible={true}
					close={handle_close}
					type={template_drawer.type}
					is_edit={template_drawer.is_edit}
					data={template_drawer.data}
					set_refetch={set_refetch_data}
					all_attributes={[]}
					length={template_drawer?.length}
				/>
			)}
		</Grid>
	);
};

export default ExcelSheets;
