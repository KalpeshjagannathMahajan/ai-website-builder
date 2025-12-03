import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Button } from 'src/common/@the-source/atoms';
import classes from '../../Settings.module.css';
import SettingsContext from '../../context';
import _ from 'lodash';
import api_requests from 'src/utils/api_requests';
import { TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { payment_gateways } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/constants';
import constants from 'src/utils/constants';
import EditorModal from '../Product/EditorModal';
import { json_cart_calc_rule_config } from 'src/utils/CartRule';

const payload = {
	flow: 'add',
	payment_method_type: 'card',
};

const { SAGEBROOK_TEMP_KEYS }: any = constants;

const RuleEngine = () => {
	const { FINIX, WORLDPAY, CYBERSOURCE } = payment_gateways;
	const { configure, get_keys_configuration, update_configuration, get_attributes } = useContext(SettingsContext);
	const tenant_id = useSelector((state: RootState) => _.get(state?.login?.userDetails, 'tenant_id'));

	//states
	const [rule_config, set_rule_config]: any = useState<any>(configure?.json_rule_payment_address);
	const [cart_rule_config, set_cart_rule_config]: any = useState<any>(configure?.json_rule_cart_calculations);
	const [payment_gateway, set_payment_gateway] = useState('');
	const [open_editor, set_open_editor] = useState<boolean>(false);
	const [address_field, set_address_field] = useState<any>([]);
	const [address_att, set_address_att] = useState<any>([]);

	// get data and configs
	const get_payment_address = async () => {
		api_requests.buyer
			.get_add_card_form(payload)
			.then((res: any) => {
				if (res?.status === 200) {
					set_payment_gateway(res?.payment_gateway);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const get_address_attributes = async () => {
		try {
			const res: any = await get_attributes('address');

			if (res) {
				const temp: any = _.map(res, (att: any) => {
					if (!_.some(address_att, { id: att?.id })) {
						return { id: att?.id, name: att?.name, value: att?.configuration?.default_value, type: att?.data_type };
					}
				});
				const new_val = [...address_att, ...temp].filter((item: any) => item);
				set_address_att(new_val);
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handle_get_address = () => {
		const address: any = _.find(configure?.details_buyer_form?.sections, { key: 'addresses' });
		const adresses: any = _.head(address?.addresses)?.attributes ?? [];

		const attribute_list = _.map(adresses, (item: any) => {
			if (!_.some(address_field, { id: item?.id })) {
				return { id: item?.id, name: item?.name, value: item?.value, type: item?.type };
			}
		});
		const new_val = [...address_field, ...attribute_list].filter((item: any) => item);
		set_address_field(new_val);
	};

	//helpers
	const get_phone_key = () => {
		if (payment_gateway === CYBERSOURCE && SAGEBROOK_TEMP_KEYS?.[tenant_id]) {
			return {
				if: [
					{
						regex_match: [{ var: SAGEBROOK_TEMP_KEYS?.[tenant_id] }, '^(?:\\d{3}-\\d{3}-\\d{4}|\\d{3}-[A-Z]{7}|\\d{6,32})$'],
					},
					{ var: SAGEBROOK_TEMP_KEYS?.[tenant_id] },
					'',
				],
			};
		} else {
			return { cat: [{ var: 'country_code' }, '', { var: 'phone' }] };
		}
	};

	// Update the genrate_rule_config to use json-logic-js for conditions
	const genrate_payment_address_rule_config = () => {
		const phone_key = get_phone_key();
		if (!payment_gateway) return;
		let config = { ...rule_config };
		switch (payment_gateway) {
			case FINIX:
				config = {
					address_1: {
						if: [
							{ and: [{ var: 'address_line_1' }, { var: 'street_address' }] },
							{ cat: [{ var: 'address_line_1' }, ', ', { var: 'street_address' }] },
							{ if: [{ var: 'street_address' }, { var: 'street_address' }, { var: 'address_line_1' }] },
						],
					},
					address_2: { var: 'address_line_2' },
					city: { var: 'city' },
					state: {
						customStateHandling: [{ var: 'state' }, { var: 'state_options' }],
					},
					country: {
						iso_3_code: [{ var: 'country' }, { var: 'iso_code' }],
					},
					zip: { var: 'pincode' },
				};
				break;
			case CYBERSOURCE:
				config = {
					first_name: { var: 'first_name' },
					last_name: { var: 'last_name' },
					email: { var: 'email' },
					address_1: {
						if: [
							{ and: [{ var: 'address_line_1' }, { var: 'street_address' }] },
							{ cat: [{ var: 'address_line_1' }, ', ', { var: 'street_address' }] },
							{ if: [{ var: 'street_address' }, { var: 'street_address' }, { var: 'address_line_1' }] },
						],
					},
					address_2: { var: 'address_line_2' },
					city: { var: 'city' },
					state: {
						customStateHandling: [{ var: 'state' }, { var: 'state_options' }],
					},
					country: {
						iso_3_code: [{ var: 'country' }, { var: 'iso_code' }],
					},
					zip: { var: 'pincode' },
					phone: phone_key,
				};
				break;
			case WORLDPAY:
				config = {
					first_name: { var: 'first_name' },
					last_name: { var: 'last_name' },
					address_1: {
						if: [
							{ and: [{ var: 'address_line_1' }, { var: 'street_address' }] },
							{ cat: [{ var: 'address_line_1' }, ', ', { var: 'street_address' }] },
							{ if: [{ var: 'street_address' }, { var: 'street_address' }, { var: 'address_line_1' }] },
						],
					},
					address_2: { var: 'address_line_2' },
					city: { var: 'city' },
					state: {
						customStateHandling: [{ var: 'state' }, { var: 'state_options' }],
					},
					country: {
						iso_3_code: [{ var: 'country' }, { var: 'iso_code' }],
					},
					zip: { var: 'pincode' },
				};
				break;
			default:
				config = {
					first_name: { var: 'first_name' },
					last_name: { var: 'last_name' },
					email: { var: 'email' },
					address_1: {
						if: [
							{ and: [{ var: 'address_line_1' }, { var: 'street_address' }] },
							{ cat: [{ var: 'address_line_1' }, ', ', { var: 'street_address' }] },
							{ if: [{ var: 'street_address' }, { var: 'street_address' }, { var: 'address_line_1' }] },
						],
					},
					address_2: { var: 'address_line_2' },
					city: { var: 'city' },
					state: {
						customStateHandling: [{ var: 'state' }, { var: 'state_options' }],
					},
					country: {
						iso_3_code: [{ var: 'country' }, { var: 'iso_code' }],
					},
					zip: { var: 'pincode' },
					phone: phone_key,
				};
				break;
		}
		set_rule_config(config);
		update_configuration('json_rule_payment_address', config);
	};

	const genrate_cart_caclulations_rule_config = () => {
		set_cart_rule_config(json_cart_calc_rule_config);
		update_configuration('json_rule_cart_calculations', json_cart_calc_rule_config);
	};
	// useEffeccts
	useEffect(() => {
		if (configure?.details_buyer_form) {
			handle_get_address();
		}
		if (configure?.json_rule_payment_address) {
			set_rule_config(configure?.json_rule_payment_address);
		}
		if (configure?.json_rule_cart_calculations) {
			set_cart_rule_config(configure?.json_rule_cart_calculations);
		}
	}, [configure]);

	useEffect(() => {
		get_payment_address();
		get_address_attributes();
		get_keys_configuration('details_buyer_form');
		get_keys_configuration('json_rule_payment_address');
		get_keys_configuration('json_rule_cart_calculations');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>JSON Rule Engine</CustomText>
			</Grid>
			<Grid my={2}>
				<Grid>
					<CustomText type='H3'> Payment Address Rules</CustomText>
					<Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
						<CustomText>Configuration is missing or change in gateway click on generate to create a new config</CustomText>
						<Grid display={'flex'} gap={1} alignItems={'center'}>
							<Button onClick={() => set_open_editor(true)}>Edit Config</Button>
							<Button onClick={genrate_payment_address_rule_config}>Generate</Button>
						</Grid>
					</Grid>
					<Grid display={'flex'} justifyContent={'space-between'} direction={'row'}>
						<TextField
							maxRows={6}
							multiline={true}
							sx={{ width: '100%' }}
							disabled={true}
							value={JSON.stringify(configure?.json_rule_payment_address || rule_config, null, 2)}
							name={'JSON Rule Config'}
						/>
					</Grid>
				</Grid>
				<Grid>
					<CustomText type='H3'> Cart Calculations Rules</CustomText>
					<Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
						<CustomText>Configuration is missing or change in gateway click on generate to create a new config</CustomText>
						<Grid display={'flex'} gap={1} alignItems={'center'}>
							<Button onClick={() => set_open_editor(true)}>Edit Config</Button>
							<Button onClick={genrate_cart_caclulations_rule_config}>Generate</Button>
						</Grid>
					</Grid>
					<Grid display={'flex'} justifyContent={'space-between'} direction={'row'}>
						<TextField
							maxRows={6}
							multiline={true}
							sx={{ width: '100%' }}
							disabled={true}
							value={JSON.stringify(configure?.json_rule_cart_calculations || cart_rule_config, null, 2)}
							name={'JSON Rule Config'}
						/>
					</Grid>
				</Grid>
			</Grid>
			{open_editor && <EditorModal open={open_editor} close={() => set_open_editor(false)} key={'json_rule_payment_address'} />}
		</Grid>
	);
};

export default RuleEngine;
