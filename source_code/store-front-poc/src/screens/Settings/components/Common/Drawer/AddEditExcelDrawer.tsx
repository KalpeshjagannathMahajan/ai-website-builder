import { Divider } from '@mui/material';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { excel_template } from '../../Product/mock';
import settings from 'src/utils/api_requests/setting';
import { useState } from 'react';
import CustomToast from 'src/common/CustomToast';
import { useTranslation } from 'react-i18next';
import ExcelUpload from './ExcelUpload';

interface Props {
	is_visible: boolean;
	close: () => void;
	type: string;
	data: any;
	is_edit: boolean;
	set_refetch: any;
	all_attributes: any;
	length: number;
}

const AddEditExcelDrawer = ({ is_visible, close, type, data, is_edit, set_refetch }: Props) => {
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [loading, set_loading] = useState<boolean>(false);

	const { t } = useTranslation();

	const methods = useForm({
		defaultValues: { ...data, type },
	});

	const { control, getValues, setValue, handleSubmit }: any = methods;

	const handle_save = (params: any) => {
		set_loading(true);
		let payload: any = {
			entity: type,
			name: params?.name,
		};
		if (is_edit) {
			payload = { ...payload, isFileUpdated: true, id: data?.id };
		}

		const form_data: any = new FormData();
		form_data.append('request', JSON.stringify(payload));
		form_data.append('file', getValues()?.excel_file?.[0]);

		const serviceMethod = is_edit ? settings.update_excel_template : settings.add_excel_template;

		serviceMethod(form_data)
			.then(() => {
				close();
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_refetch((prev: any) => ({ state: !prev.state, key: `${type}-table`, id: type, type: 'table' }));
				set_loading(false);
			});
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Settings.AddTemplate')}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={close}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(handle_save)} loading={loading}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '' })}
				state='warning'
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					{_.map(excel_template, (attribute: any) => (
						<FormBuilder
							placeholder={attribute?.name}
							label={attribute?.name}
							name={attribute?.id}
							key={attribute?.id}
							validations={{ required: attribute?.id !== 'description' }}
							type={attribute?.type}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
						/>
					))}
					<ExcelUpload methods={methods} set_upload_loader={set_loading} file_key='templateUrl' data={data} />
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<>
				{handle_render_toast()}
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

export default AddEditExcelDrawer;
