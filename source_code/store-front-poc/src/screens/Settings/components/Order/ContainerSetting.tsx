import _ from 'lodash';
import utils from 'src/utils/utils';
import SettingsContext from '../../context';
import classes from '../../Settings.module.css';
import { useContext, useEffect, useState } from 'react';
import { CONTAINER } from '../../utils/constants';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import AddEditContainer from '../Common/Drawer/AddEditContainer';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import Loading from 'src/screens/Loading/Loading';
import { background_colors } from 'src/utils/light.theme';

export interface Container {
	container_key: string;
	container_name: string;
	container_volume: number;
	is_default_container: boolean;
}

export interface ContainerData {
	containers: Container[];
	tenant_container_default_unit: string;
	tenant_container_enabled: boolean;
}

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
	{
		name: 'Delete',
		action: 'delete',
		icon: 'IconTrash',
		key: 'delete',
	},
];

const ContainerSetting = () => {
	const methods = useForm({});
	const { getValues, watch } = methods;
	const { configure, get_keys_configuration, update_configuration, is_loading, set_is_loading } = useContext(SettingsContext);
	const [drawer, set_drawer] = useState<any>({ state: false, data: null, index: 0 });

	const handle_edit = (params: any, key: string) => {
		if (key === 'edit') {
			set_drawer({ state: true, data: params?.node?.data, index: params?.rowIndex });
		} else {
			let updated_containers: Container[] = _.cloneDeep(configure?.cart_container_config?.containers);
			_.pullAt(updated_containers, params?.rowIndex);
			update_configuration('cart_container_config', { ...configure?.cart_container_config, containers: updated_containers });
		}
	};

	const should_disable_button = (data: Container, key: string) => key === 'delete' && data?.is_default_container;

	const columnDef = [
		...CONTAINER?.CONTAINER_CONFIG,
		{ ...utils.create_action_config(actions, handle_edit), cellRendererParams: { should_disable_button } },
	];

	const height = configure?.cart_container_config?.containers?.length ?? 2 * 50;

	useEffect(() => {
		get_keys_configuration('cart_container_config');
	}, []);
	useEffect(() => {
		if (
			!_.isEmpty(configure?.cart_container_config) &&
			configure?.cart_container_config?.tenant_container_default_unit !== getValues()?.tenant_container_default_unit
		) {
			set_is_loading(true);
			update_configuration('cart_container_config', {
				...configure?.cart_container_config,
				tenant_container_default_unit: getValues()?.tenant_container_default_unit,
			});
		}
	}, [watch('tenant_container_default_unit')]);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Container Settings</CustomText>
			</Grid>
			<Grid my={2} display={'flex'} direction={'column'} gap={2} sx={{ background: background_colors.secondary, p: 1, borderRadius: 1 }}>
				<CustomText>
					{configure?.cart_container_config?.tenant_container_enabled ? (
						<>
							Container functionality is now <span style={{ fontWeight: 'bold' }}>enabled</span> and ready for use.
						</>
					) : (
						<>
							Container functionality is currently <span style={{ fontWeight: 'bold' }}>disabled</span>. To activate container settings,
							please enable them in your subscription preferences.
						</>
					)}
				</CustomText>
			</Grid>

			{configure?.cart_container_config?.tenant_container_enabled && (
				<>
					<Grid width={'20rem'}>
						<CustomText type='Subtitle' style={{ marginBottom: '1rem' }}>
							Default Container unit
						</CustomText>
						<FormProvider {...methods}>
							<FormBuilder
								type={'single_select'}
								name={'tenant_container_default_unit'}
								options={CONTAINER?.DEFAULT_UNIT_OPTION}
								label={'Container Units'}
								validations={{ required: true }}
								disabled={!configure?.cart_container_config?.tenant_container_enabled}
								defaultValue={configure?.cart_container_config?.tenant_container_default_unit}
							/>
						</FormProvider>
					</Grid>
					<Grid>
						<Grid my={2}>
							<AgGridTableContainer
								columnDefs={columnDef}
								has_serials={false}
								hideManageColumn
								rowData={configure?.cart_container_config?.containers ?? []}
								containerStyle={{ height: `${height + 50}px`, maxHeight: '500px', minHeight: '200px' }}
								showStatusBar={false}
							/>
						</Grid>
						<Button
							variant='text'
							onClick={() => set_drawer({ state: true, data: null, index: configure?.cart_container_config?.containers?.length })}>
							+ Add new container type
						</Button>
					</Grid>
				</>
			)}
			{drawer?.state && (
				<AddEditContainer
					is_visible={true}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null })}
					container_list={configure?.cart_container_config?.containers}
					index={drawer?.index}
				/>
			)}
			{is_loading && (
				<Grid
					sx={{
						background: 'white',
						opacity: 0.4,
						width: '70%',
						position: 'fixed',
						top: '8rem',
						right: '8rem',
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Loading />
				</Grid>
			)}
		</Grid>
	);
};

export default ContainerSetting;
