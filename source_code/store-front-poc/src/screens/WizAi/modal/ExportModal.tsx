import { useContext, useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import WizAiContext from '../context';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import wiz_ai from 'src/utils/api_requests/wizAi';
import { set_notification_feedback } from 'src/actions/notifications';
import { useDispatch } from 'react-redux';

const ExportInsights = ({ open, on_close }: any) => {
	const dispatch = useDispatch();
	const { view_list, view } = useContext(WizAiContext);
	const [selected_option, set_selected_option] = useState<string>(view?.is_default ? 'all' : 'specific');
	const methods = useForm({});
	const [loader, set_loader] = useState<boolean>(false);
	const view_options = _.map(view_list, (view_item) => {
		return { label: view_item?.name, value: view_item?.id };
	}).filter((item: any) => !item?.is_default);
	const { control, getValues, setValue, handleSubmit } = methods;

	const handle_view_export = async (view_id: string) => {
		set_loader(true);
		try {
			await wiz_ai.export_insight(view_id);
			set_loader(false);
			dispatch(set_notification_feedback(true));
			on_close();
		} catch (err) {
			console.error(err);
			set_loader(false);
		}
	};
	const handle_export = () => {
		//export_insight
		if (selected_option === 'all') {
			const default_view = _.find(view_list, (item) => item?.is_default);
			handle_view_export(default_view?.id);
		} else {
			handle_view_export(getValues('selected_view'));
		}
	};
	return (
		<Modal
			open={open}
			title={'Export Insights'}
			onClose={on_close}
			children={
				<Grid>
					<CustomText>Select the export data that you want to proceed with</CustomText>
					<RadioGroup
						selectedOption={selected_option}
						options={[
							{ label: 'All', value: 'all' },
							{ label: 'Specific View', value: 'specific' },
						]}
						onChange={(val: string) => set_selected_option(val)}
					/>

					{selected_option === 'specific' && (
						<Grid mt={2}>
							<FormProvider {...methods}>
								<FormBuilder
									placeholder='Select view'
									label='Select view to export'
									name='selected_view'
									validations={{ required: false }}
									options={view_options}
									type={'select'}
									defaultValue={view?.id}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							</FormProvider>
						</Grid>
					)}
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={on_close} disabled={loader}>
						Cancel
					</Button>
					<Button loading={loader} onClick={handleSubmit(handle_export)}>
						Export
					</Button>
				</Grid>
			}
		/>
	);
};

export default ExportInsights;
