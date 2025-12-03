import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface SettingsKeys {
	[key: string]: any;
}

interface SettingsValues {
	[key: string]: any;
}

const useTenantSettings = (settings_keys: SettingsKeys): SettingsValues => {
	const tenant_settings = useSelector((state: any) => state?.settings);
	const tenant_settings_fetched = useSelector((state: any) => state?.settings?.is_tenant_settings_fetched);
	const [settings_values, set_settings_values] = useState<SettingsValues>({});

	useEffect(() => {
		if (!settings_keys || !tenant_settings) return;
		const values = Object.keys(settings_keys).reduce((result: SettingsValues, key: string) => {
			const default_value = settings_keys?.[key];
			result[key] = _.get(tenant_settings, key, default_value);
			return result;
		}, {});
		set_settings_values(values);
	}, [tenant_settings_fetched, tenant_settings]);

	return settings_values;
};

export default useTenantSettings;
