import { Divider } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { BARCODE, BARCODE_TYPE_OPTION, DEFAULT_BARCODE, DEFAULT_VALUES } from '../../General/mock';
import { useContext, useState } from 'react';
import SettingsContext from 'src/screens/Settings/context';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';

interface Props {
	is_visible: boolean;
	close: () => void;
	data: any;
	options: any;
	barcodes_list: any;
	index: number;
}

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '2rem 0',
};

const AddEditBarcodeDrawer = ({ is_visible, close, data, options }: Props) => {
	const [loading, set_loading] = useState<boolean>(false);
	const { update_configuration } = useContext(SettingsContext);
	const methods = useForm({
		defaultValues: data ? { ...data, ...data?.filter_logic, ...DEFAULT_VALUES } : { type: 'barcode', ...DEFAULT_VALUES },
	});

	const { control, getValues, setValue, handleSubmit, watch }: any = methods;

	const bar_type = watch('type');

	const handle_save = async (params: any) => {
		set_loading(true);
		if (bar_type === 'barcode') {
			await update_configuration('barcode_scanner_settings', DEFAULT_BARCODE, close);
		} else {
			let updated_data: any = _.cloneDeep(params);
			updated_data.filter_logic = {
				key: params?.key,
				key_type: params?.key_type,
			};
			delete updated_data?.key;
			delete updated_data?.key_type;

			await update_configuration('barcode_scanner_settings', [updated_data], close);
		}
		set_loading(false);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Barcode Setting</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_check_change = () => {
		const obj: any = _.cloneDeep(getValues() || {});
		if (data) obj.filter_logic.key = _.get(obj, 'key');
		delete obj?.key;
		delete obj?.key_type;
		return _.isEqual(obj, data);
	};

	const handle_barcode_type = (val: any) => {
		if (val === 'upc_a') {
			setValue('type', val);
			setValue('key', '');
		} else {
			setValue('type', val);
		}
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent={'flex-end'}>
				<Button variant='outlined' onClick={close} disabled={loading}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(handle_save)} loading={loading} disabled={handle_check_change()}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1} gap={1}>
				<FormProvider {...methods}>
					<CustomText type='H3'> Select barcode type :</CustomText>
					<RadioGroup selectedOption={bar_type} options={BARCODE_TYPE_OPTION} onChange={(val: string) => handle_barcode_type(val)} />
					{bar_type === 'upc_a' && (
						<Grid>
							<div style={dividerStyle}></div>
							{_.map(BARCODE?.FORM_FIELDS, (attribute: any) => (
								<FormBuilder
									key={attribute?.id}
									placeholder={attribute?.name}
									label={attribute?.name}
									name={attribute?.id}
									defaultValue={data?.[attribute?.id] || attribute?.value}
									validations={{ required: true }}
									type={attribute?.type}
									options={options}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							))}
						</Grid>
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

export default AddEditBarcodeDrawer;
