import { Divider } from '@mui/material';
// import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import settings from 'src/utils/api_requests/setting';
import { useContext, useEffect, useState } from 'react';
import CustomToast from 'src/common/CustomToast';
import { useTranslation } from 'react-i18next';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import { frequency_options } from './helper';
import _ from 'lodash';
import SettingsContext from '../../context';

interface Props {
	open: boolean;
	close: () => void;
	type: string;
	data: any;
}

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const ReminderDrawer = ({ open, close, type, data }: Props) => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [loading, set_loading] = useState<boolean>(false);
	const [template_options, set_template_options] = useState<any>([]);
	const { t } = useTranslation();

	const methods = useForm({
		defaultValues: { ...data, type },
	});

	const { control, setValue, getValues, handleSubmit }: any = methods;

	const handle_save = (params: any) => {
		set_loading(true);
		const payload = {
			...params,
			delay_interval: _.toString(getValues()?.delay_value * parseInt(getValues()?.delay_unit)),
		};
		const updated_events = _.map(configure.scheduled_event_config?.[type]?.scheduled_events, (item: any, index: number) => {
			if (index === payload?.index) {
				return payload;
			} else {
				return item;
			}
		});
		const update_data = {
			...configure.scheduled_event_config,
			[type]: {
				...configure.scheduled_event_config?.[type],
				scheduled_events: updated_events,
			},
		};

		update_configuration('scheduled_event_config', update_data);
		close();
	};

	const fetch_template_options = async () => {
		try {
			const res: any = await settings.get_template_list(`external__wizshop__${type}`);
			const new_options = _.map(res, (item: any) => {
				return {
					label: item?.name,
					value: item?.id,
				};
			})?.filter((item: any) => item?.value !== undefined);
			set_template_options(new_options);
		} catch (err: any) {
			console.error(err?.message);
			set_show_toast({ state: true, title: 'Something went wrong', sub_title: err?.message });
		}
	};

	useEffect(() => {
		fetch_template_options();
	}, []);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.event_name}</CustomText>
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
				<Button onClick={handleSubmit(handle_save)} loading={loading} disabled={_.isEmpty(getValues()?.delay_unit)}>
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
					<Grid
						sx={{
							background: '#F7F8FA',
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField
							name='is_enable'
							key='is_enable'
							defaultValue={data?.is_enable ?? true}
							value={data?.required}
							label='Email On'
						/>
					</Grid>
					<div style={dividerStyle}></div>

					<Grid>
						<CustomText type='H6' style={{ marginBottom: '10px' }}>
							{'Frequency'}
						</CustomText>
						<Grid display={'flex'} direction={'row'} gap={1} flexWrap={'nowrap'}>
							<Grid sx={{ width: '70%' }}>
								<FormBuilder
									label={'Delay Number'}
									name={'delay_value'}
									key={'delay_value'}
									validations={{ required: true }}
									type={'number'}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							</Grid>
							{/* delay_interval */}
							<Grid sx={{ width: '30%' }}>
								<FormBuilder
									name={'delay_unit'}
									key={'delay_unit'}
									options={frequency_options}
									validations={{ required: true }}
									type={'select'}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							</Grid>
						</Grid>
					</Grid>
					<div style={dividerStyle}></div>
					<Grid display={'flex'} direction={'column'} gap={1}>
						<CustomText type='H6' style={{ marginBottom: '10px' }}>
							{'Template Settings'}
						</CustomText>
						<Grid display={'flex'} direction={'column'} gap={1}>
							<CustomText type='Subtitle' style={{ marginBottom: '10px' }}>
								{'Template name'}
							</CustomText>
							<FormBuilder
								name={'meta.template_id'}
								key={'meta.template_id'}
								options={template_options}
								validations={{ required: true }}
								type={'select'}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
							/>
						</Grid>
						<Grid display={'flex'} direction={'column'} gap={1}>
							<CustomText type='Subtitle' style={{ marginBottom: '10px' }}>
								{'Subject'}
							</CustomText>
							<FormBuilder
								label={'Subject'}
								name={'meta.subject'}
								key={'meta.subject'}
								validations={{ required: true }}
								type={'text'}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
							/>
						</Grid>
					</Grid>
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

	return <Drawer width={480} open={open} onClose={close} content={handle_render_drawer()} />;
};

export default ReminderDrawer;
