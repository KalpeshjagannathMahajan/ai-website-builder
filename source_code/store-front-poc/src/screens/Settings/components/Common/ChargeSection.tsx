import React, { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, Button, Switch } from 'src/common/@the-source/atoms';
import { FORM_VALUES_KEYS, charge_sections } from '../../utils/constants';
import { useForm, FormProvider } from 'react-hook-form';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import SettingsContext from '../../context';
import _ from 'lodash';

const ChargeSection = () => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [is_edit, set_edit] = useState<boolean>(false);
	const [editChargeKey, setEditChargeKey] = useState<string>('');
	const [extra_fields_settings, set_extra_fields_settings] = useState<any>({});

	const methods = useForm({ defaultValues: configure?.document_review_page_cart_summary });

	const { setValue, getValues } = methods;
	const { VISIBLE, CALCULATED, DISBALED } = FORM_VALUES_KEYS;

	const handle_toggle = (key: string) => {
		setEditChargeKey(key);
		set_edit(true);
	};

	const handle_save = () => {
		const form_values: any = getValues();
		const currentConfig = configure?.document_review_page_cart_summary;
		const updatedConfiguration = _.merge({}, currentConfig, form_values);

		update_configuration('document_review_page_cart_summary', updatedConfiguration);

		set_edit(false);
	};

	const handle_cancel = () => {
		set_edit(false);
	};

	const handle_change = (record: string, key_to_update: string, value: boolean) => {
		let updated_value = { ...(getValues()?.[record] ?? {}) };

		updated_value[key_to_update] = value;

		//[IMP] : If key_to_update is 'is_visible' and value is false,
		// set all keys of updatedValue to false
		if (key_to_update === VISIBLE && !value) {
			updated_value = _.mapValues(updated_value, () => false);
		}
		// [IMP] : If key_to_update is 'is_calculated' and value is false,
		// set 'is_disabled' to false
		if (key_to_update === CALCULATED && !value) {
			updated_value[DISBALED] = false;
		}

		setValue(record, updated_value);
		set_extra_fields_settings((prev: any) => ({ ...prev, [record]: updated_value }));
	};

	useEffect(() => {
		if (!configure?.document_review_page_cart_summary) return;
		const default_values = charge_sections?.reduce((acc: any, section) => {
			acc[section?.key] = configure?.document_review_page_cart_summary?.[section?.key] ?? {
				is_visible: false,
			};
			return acc;
		}, {});
		set_extra_fields_settings(default_values);
		methods.reset(default_values);
	}, [configure?.document_review_page_cart_summary]);

	const render_radio_group = (key: string, valueKey: string) => (
		<RadioGroup
			selectedOption={extra_fields_settings[key]?.[valueKey] ? 'yes' : 'no'}
			options={[
				{ label: 'Yes', value: 'yes' },
				{ label: 'No', value: 'no' },
			]}
			onChange={(option: string) => handle_change(key, valueKey, option === 'yes')}
			label_style={{ display: 'flex', flexDirection: 'row' }}
		/>
	);

	const handle_auto_charges = (value: boolean) => {
		let updated_charges = {
			...configure?.document_review_page_cart_summary,
			auto_charges_calculation_enabled: !value,
		};

		if (value) {
			const chargeKeys = ['discount', 'shipping_charges', 'tax', 'additional_charge'];

			updated_charges = chargeKeys?.reduce(
				(acc, key) => ({
					...acc,
					[key]: {
						...acc[key],
						is_calculated: false,
						is_disabled: false,
					},
				}),
				updated_charges,
			);
		}
		update_configuration('document_review_page_cart_summary', updated_charges);
	};

	return (
		<FormProvider {...methods}>
			<Grid display='flex' justifyContent={'space-between'} alignItems='center' pt={1}>
				<CustomText type='Body'>Do you want charges to be calculated automatically?</CustomText>
				<Switch
					checked={configure?.document_review_page_cart_summary?.auto_charges_calculation_enabled ?? false}
					onChange={() => handle_auto_charges(configure?.document_review_page_cart_summary?.auto_charges_calculation_enabled ?? false)}
				/>
			</Grid>
			<Grid pb={1}>
				{_.map(charge_sections, (item: any) => (
					<Grid key={item?.key} p={2} sx={{ borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.2)', marginTop: '1rem' }}>
						{is_edit && editChargeKey === item?.key ? (
							<Grid display='flex' flexDirection='column' width={'100%'}>
								<CustomText type='Title'>{`Do you want ${item?.name}?`}</CustomText>
								{render_radio_group(item?.key, VISIBLE)}
								{extra_fields_settings[item?.key]?.[VISIBLE] &&
									configure?.document_review_page_cart_summary?.auto_charges_calculation_enabled && (
										<React.Fragment>
											<CustomText type='Title'>Do you want it to be calculated?</CustomText>
											{render_radio_group(item?.key, CALCULATED)}
											{extra_fields_settings[item?.key]?.[CALCULATED] && (
												<React.Fragment>
													<CustomText type='Title'>Would you like it to be a read-only field?</CustomText>
													{render_radio_group(item?.key, DISBALED)}
												</React.Fragment>
											)}
										</React.Fragment>
									)}
								<Grid display='flex' justifyContent='flex-end' gap={2}>
									<Button variant='outlined' color='inherit' onClick={handle_cancel}>
										Cancel
									</Button>
									<Button onClick={handle_save}>Save</Button>
								</Grid>
							</Grid>
						) : (
							<Grid display='flex' alignItems='center' justifyContent='space-between'>
								<CustomText type='Subtitle' color='#676D77'>
									{`${item?.name}: ${getValues()?.[item?.key]?.[VISIBLE] ? 'Visible' : 'Hidden'}`}
								</CustomText>
								<Icon iconName='IconEdit' sx={{ cursor: 'pointer' }} onClick={() => handle_toggle(item?.key)} />
							</Grid>
						)}
					</Grid>
				))}
			</Grid>
		</FormProvider>
	);
};

export default ChargeSection;
