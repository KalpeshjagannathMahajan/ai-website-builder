import SettingsContext from './context';
import useSettings from './useSettings';
import { Box, Grid } from 'src/common/@the-source/atoms';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useRef } from 'react';

const Content = () => {
	const isDirtyRef = useRef();

	return (
		<Grid item xs={12} md={12} sx={{ alignSelf: 'stretch', background: '#FFF', borderRadius: '12px' }}>
			<Grid container sx={{ borderRadius: '8px' }}>
				<Grid xs={12} item>
					<Outlet context={isDirtyRef} />
				</Grid>
			</Grid>
		</Grid>
	);
};
const SettingComponent = () => {
	return (
		<Box pt={2.4} display='flex' gap={2.4}>
			<Sidebar />
			<Content />
		</Box>
	);
};

const Settings = () => {
	const value = useSettings();

	return (
		<SettingsContext.Provider value={value}>
			<SettingComponent />
		</SettingsContext.Provider>
	);
};

export default Settings;
