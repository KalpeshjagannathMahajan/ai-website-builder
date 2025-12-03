import _ from 'lodash';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { ENTITIES, MULTIPLE_TEMPLATE_ENTITY, general_settings, label_config, multiple_template_config } from './mock';
import General from './General';
import React, { useEffect, useState } from 'react';
import utils from 'src/utils/utils';
import AddEditTemplateDrawer from '../Common/Drawer/AddEditTemplateDrawer';
import settings from 'src/utils/api_requests/setting';
import EditorModal from './EditorModal';
const { VITE_APP_INTERNAL_TOOL } = import.meta.env;

const actions = [
	{
		name: 'Preview',
		action: 'preview',
		icon: 'IconExternalLink',
		key: 'preview',
	},
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];
const multple_pdf_actions = [
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
export const TearSheet = ({ title = 'Tear Sheet', show_all = true }) => {
	const initial_state = { state: false, is_edit: false, data: null, type: '', length: 0 };
	const [template_drawer, set_template_drawer] = useState<any>(initial_state);
	const [tearsheet_data, set_tearsheet_data] = useState<any>(null);
	const [refetch_data, set_refetch_data] = useState<any>({ state: true, key: '', id: '', type: '' });
	const [attributes, set_attributes] = useState<any[]>([]);
	const [open_editor, set_open_editor] = useState<boolean>(false);
	const show_editor = VITE_APP_INTERNAL_TOOL === 'true';

	const handle_refetch_data = () => {
		const type = refetch_data?.type;
		switch (type) {
			case 'general':
				settings
					.get_general_settings()
					.then((res: any) => {
						if (res.status === 200) {
							set_tearsheet_data((prev: any) => ({ ...prev, [refetch_data?.key]: res?.data }));
						}
					})
					.catch((err: any) => {
						console.error(err);
						set_tearsheet_data((prev: any) => ({ ...prev, [refetch_data?.key]: general_settings }));
					});
				break;
			case 'table':
				settings
					.get_templates(refetch_data?.id)
					.then((res: any) => {
						if (res?.status === 200) {
							set_tearsheet_data((prev: any) => ({ ...prev, [refetch_data.key]: res?.data }));
						}
					})
					.catch((err: any) => {
						console.error(err);
					});
				break;
		}
	};

	const handle_fetch_data = () => {
		_.forEach(ENTITIES, (entity: any) => {
			const type = entity.type;
			switch (type) {
				case 'general':
					settings
						.get_general_settings()
						.then((res: any) => {
							if (res?.status === 200) {
								set_tearsheet_data((prev: any) => ({ ...prev, [entity.key]: res?.data }));
							}
						})
						.catch((err: any) => {
							console.error(err);
							set_tearsheet_data((prev: any) => ({ ...prev, [entity.key]: general_settings }));
						});
					break;
				case 'table':
					settings
						.get_templates(entity.id)
						.then((res: any) => {
							if (res.status === 200) {
								set_tearsheet_data((prev: any) => ({ ...prev, [entity.key]: res?.data }));
							}
						})
						.catch((err: any) => {
							console.error(err);
						});
					break;
			}
		});
	};

	const get_products = () => {
		settings
			.get_all_attributes('product')
			.then((res: any) => {
				set_attributes(_.map(res?.data, (attribute: any) => ({ value: attribute?.id, label: attribute?.name })));
			})
			.catch((err: Error) => {
				console.error(err);
			});
	};

	const handle_close = () => set_template_drawer(initial_state);

	const transform_data = (data: any) => {
		return _.map(data, (item: any) => ({
			...item,
			transformed_attributes: _.filter(attributes, (attribute: any) => _.includes(item?.attributes, attribute?.value)),
		}));
	};

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
				length: tearsheet_data?.[entity?.key]?.length ?? 0,
			});
		};
		const should_disable_button = (data: any, key: string) => !data?.img_sample_file && key === 'preview';
		const columnDef = [
			...label_config,
			{ ...utils.create_action_config(actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
		];
		const multiple_template_cols = [
			...multiple_template_config,
			{ ...utils.create_action_config(multple_pdf_actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
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
							columnDefs={_.includes(MULTIPLE_TEMPLATE_ENTITY, entity?.id) ? multiple_template_cols : columnDef}
							hideManageColumn
							rowData={transform_data(tearsheet_data?.[entity?.key])}
							containerStyle={{ height: `${height + 100}px`, maxHeight: '700px' }}
							showStatusBar={false}
						/>
						<Button
							variant='text'
							sx={{ alignSelf: 'flex-start' }}
							onClick={() =>
								set_template_drawer({
									state: true,
									is_edit: false,
									data: null,
									type: entity?.id,
									length: tearsheet_data?.[entity?.key]?.length ?? 0,
								})
							}>
							+ Add template
						</Button>
						{index < ENTITIES.length - 1 && <div style={dividerStyle}></div>}
					</Grid>
				);
			default:
				return <General data={tearsheet_data?.general} set_refetch={set_refetch_data} />;
		}
	};

	useEffect(() => {
		get_products();
		handle_fetch_data();
	}, []);

	useEffect(() => {
		handle_refetch_data();
	}, [refetch_data?.state]);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{title}</CustomText>
				{show_editor && <Button onClick={() => set_open_editor(true)}>JSON Editor</Button>}
			</Grid>
			<Grid display='flex' flexDirection='column' gap={2} py={1}>
				{_.map(ENTITIES, (entity: any, index: number) => {
					if (show_all) {
						return <React.Fragment key={entity?.type}>{handle_render_type(entity, index)}</React.Fragment>;
					} else if (entity?.type === 'general') {
						return <React.Fragment key={entity?.type}>{handle_render_type(entity, index)}</React.Fragment>;
					}
				})}
			</Grid>
			{template_drawer?.state && (
				<AddEditTemplateDrawer
					is_visible={true}
					close={handle_close}
					type={template_drawer.type}
					is_edit={template_drawer.is_edit}
					data={template_drawer.data}
					set_refetch={set_refetch_data}
					all_attributes={attributes}
					length={template_drawer?.length}
				/>
			)}
			{open_editor && <EditorModal open={open_editor} close={() => set_open_editor(false)} />}
		</Grid>
	);
};

export default TearSheet;
