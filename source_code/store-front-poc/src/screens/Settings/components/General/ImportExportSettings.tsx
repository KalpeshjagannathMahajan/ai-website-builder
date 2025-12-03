import { useContext, useEffect, useState } from 'react';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, Button, Switch } from 'src/common/@the-source/atoms';
import SettingsContext from '../../context';
import _, { capitalize } from 'lodash';
import { background_colors, secondary, text_colors } from 'src/utils/light.theme';
import { Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IMPORT_EXPORT_CONFIG } from '../../utils/defaultSettings/ImportExportDefault';

const ImportExportSettings = () => {
	const theme: any = useTheme();
	const { configure, get_keys_configuration, update_configuration } = useContext(SettingsContext);
	const [is_edit, set_is_edit] = useState<Boolean>(false);
	const [data, set_data] = useState<any>([]);
	const import_subscribed = !_.includes(configure?.tenant_settings?.excluded_permission_modules, 'Import / Export');

	const initial_state = () => {
		let temp: any[] = [];
		_.mapKeys(configure?.import_export_config, (item, keys) => {
			temp?.push({
				name: capitalize(keys),
				import: item?.import?.[keys],
				export: item?.export?.[keys],
				disabled: item?.disabled,
			});
		});
		return temp;
	};

	const handle_update_switch = (entity: any, type: string) => {
		const updated_data = _.map(data, (section: any) => {
			if (section?.name === entity?.name) {
				return {
					...section,
					[type]: !entity?.[type],
				};
			} else {
				return section;
			}
		});
		set_data(updated_data);
	};

	const handle_save = () => {
		let updated_config: any = {};
		_.map(data, (items) => {
			const key = _.toLower(items?.name);
			const item = configure?.import_export_config?.[key];
			updated_config[key] = {
				...item,
				disabled: items?.disabled,
				import: {
					...item?.import,
					[key]: items?.import,
				},
				export: {
					...item?.export,
					[key]: items?.export,
				},
			};
		});
		update_configuration('import_export_config', updated_config);
		set_is_edit(false);
	};

	const handle_generate_defult = () => {
		update_configuration('import_export_config', IMPORT_EXPORT_CONFIG);
	};

	const handle_cancel = () => {
		set_is_edit(false);
		const _temp = initial_state();
		set_data(_temp);
	};
	const handle_set_edit = () => {
		if (import_subscribed) {
			set_is_edit(true);
			const _temp = initial_state();
			set_data(_temp);
		} else {
			return null;
		}
	};

	useEffect(() => {
		const _temp = initial_state();
		set_data(_temp);
	}, [configure]);

	useEffect(() => {
		get_keys_configuration('tenant_settings');
		get_keys_configuration('import_export_config');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Import Export Settings</CustomText>
			</Grid>
			{_.isEmpty(configure?.import_export_config) && (
				<Grid mt={2}>
					<Alert
						severity={'warning'}
						icon={
							<Icon className={classes.icon_style} sx={{ color: theme?.settings?.import_export?.color }} iconName='IconAlertTriangle' />
						}
						className={classes.alert_style}
						sx={{
							border: `1px solid ${theme?.settings?.import_export?.color || 'transparent'}`,
						}}>
						<CustomText type='Body' color={theme?.settings?.import_export?.text}>
							Oops! It looks like the Import Export Setting is missing. Click{' '}
							<span onClick={handle_generate_defult} style={theme?.settings?.import_export?.span}>
								here
							</span>{' '}
							to generate the default configuration.
						</CustomText>
					</Alert>
				</Grid>
			)}

			<Grid my={2} display={'flex'} direction={'column'} gap={2} sx={{ background: background_colors.secondary, p: 1, borderRadius: 1 }}>
				<CustomText>
					{import_subscribed ? (
						<>
							Import/Export functionality is now <span style={{ fontWeight: 'bold' }}>enabled</span> and ready for use.
						</>
					) : (
						<>
							Import/Export functionality is currently <span style={{ fontWeight: 'bold' }}>disabled</span>. To activate Import/Export
							settings, please enable them in your subscription preferences.
						</>
					)}
				</CustomText>
			</Grid>
			<Grid p={2} sx={{ borderRadius: '1rem', border: `1px solid ${text_colors?.tertiary}`, marginTop: '1rem' }}>
				<Grid display='flex' alignItems='center'>
					<Grid xs={3}>
						<CustomText type='Subtitle' color={secondary[700]}>
							Import Type
						</CustomText>
					</Grid>
					<Grid xs={3}>
						<CustomText type='Subtitle' color={secondary[700]}>
							Import
						</CustomText>
					</Grid>
					<Grid xs={3}>
						<CustomText type='Subtitle' color={secondary[700]}>
							Export
						</CustomText>
					</Grid>
					<Grid xs={3}>
						<CustomText type='Subtitle' color={secondary[700]}>
							Disbaled
						</CustomText>
					</Grid>
					{!is_edit && (
						<Grid display={'flex'} justifyContent={'flex-end'}>
							<Icon iconName='IconEdit' color={import_subscribed ? '' : text_colors?.primary} onClick={handle_set_edit} />
						</Grid>
					)}
				</Grid>
				{is_edit ? (
					<>
						<Grid display='flex' flexDirection='column' gap={1} mt={1}>
							{_.map(data, (items) => {
								return (
									<Grid display='flex' alignItems='center' key={items?.name}>
										<Grid xs={3}>
											<CustomText>{items?.name}</CustomText>
										</Grid>
										<Grid xs={3}>
											<Switch checked={items?.import} onChange={() => handle_update_switch(items, 'import')} />
										</Grid>
										<Grid xs={3}>
											<Switch checked={items?.export} onChange={() => handle_update_switch(items, 'export')} />
										</Grid>
										<Grid xs={3}>
											<Switch checked={items?.disabled} onChange={() => handle_update_switch(items, 'disabled')} />
										</Grid>
									</Grid>
								);
							})}
						</Grid>
						<Grid display='flex' justifyContent='flex-end' gap={2}>
							<Button variant='outlined' onClick={handle_cancel}>
								Cancel
							</Button>
							<Button onClick={handle_save}>Save</Button>
						</Grid>
					</>
				) : (
					<>
						<Grid display='flex' flexDirection='column' justifyContent={'space'} gap={1} mt={1}>
							{_.map(data, (items) => {
								return (
									<Grid display='flex' alignItems='center' key={items?.name}>
										<Grid xs={3}>
											<CustomText>{items?.name}</CustomText>
										</Grid>
										<Grid xs={3}>
											<CustomText>{items?.import ? 'Active' : 'Inactive'}</CustomText>
										</Grid>
										<Grid xs={3}>
											<CustomText>{items?.export ? 'Active' : 'Inactive'}</CustomText>
										</Grid>
										<Grid xs={3}>
											<CustomText>{items?.disabled ? 'Disabled' : 'Not Disbaled'}</CustomText>
										</Grid>
									</Grid>
								);
							})}
						</Grid>
					</>
				)}
			</Grid>
		</Grid>
	);
};

export default ImportExportSettings;
