import { useContext, useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import SettingsContext from '../../context';
import DisplayInventorySettings from './Components/DisplayInventorySettings';
import EditInventorySettings from './Components/EditInventorySettings';

const Inventory = () => {
	const { get_keys_configuration, configure, update_configuration } = useContext(SettingsContext);
	const [isEditMode, setIsEditMode] = useState(false);
	const inventorySettings = configure?.inventory_settings ?? {};

	useEffect(() => {
		get_keys_configuration('inventory_settings');
	}, []);

	const handleSave = (newSettings: any) => {
		update_configuration('inventory_settings', newSettings);
		setIsEditMode(false);
	};

	const handle_cancel_save = () => {
		setIsEditMode(false);
	};

	if (!inventorySettings) {
		return <div>Loading...</div>;
	}

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Inventory</CustomText>
				<Grid>
					{!isEditMode && (
						<Button variant='contained' color='primary' onClick={() => setIsEditMode(true)}>
							Edit
						</Button>
					)}
				</Grid>
			</Grid>
			{isEditMode ? (
				<EditInventorySettings
					inventoryTrackingEnabled={inventorySettings?.inventory_tracking_enabled}
					shouldBlock={inventorySettings?.should_block}
					onSave={handleSave}
					onCancel={handle_cancel_save}
				/>
			) : (
				<DisplayInventorySettings
					inventoryTrackingEnabled={inventorySettings?.inventory_tracking_enabled}
					shouldBlock={inventorySettings?.should_block}
				/>
			)}
		</Grid>
	);
};

export default Inventory;
