import React, { useState } from 'react';
import { Grid, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';

interface InventorySettingsProps {
	inventoryTrackingEnabled: boolean;
	shouldBlock: boolean;
	onSave: (settings: { inventory_tracking_enabled: boolean; should_block: boolean }) => void;
	onCancel: () => void;
}

const EditInventorySettings: React.FC<InventorySettingsProps> = ({ inventoryTrackingEnabled, shouldBlock, onSave, onCancel }) => {
	const [inventorySettings, setInventorySettings] = useState({
		inventory_tracking_enabled: inventoryTrackingEnabled,
		should_block: shouldBlock,
		show_inventory_status: true,
	});

	const handleInventoryTrackingChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
		setInventorySettings((prevSettings) => ({
			...prevSettings,
			inventory_tracking_enabled: value === 'yes',
		}));
	};

	const handleBlockInventoryChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
		setInventorySettings((prevSettings) => ({
			...prevSettings,
			should_block: value === 'yes',
		}));
	};

	const handleSave = () => {
		onSave(inventorySettings);
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<Grid container direction='column' spacing={2} mt={3}>
			<Grid item>
				<CustomText type='Subtitle'>Track inventory</CustomText>
				<RadioGroup row value={inventorySettings?.inventory_tracking_enabled ? 'yes' : 'no'} onChange={handleInventoryTrackingChange}>
					<FormControlLabel value='yes' control={<Radio />} label='Yes' />
					<FormControlLabel value='no' control={<Radio />} label='No' />
				</RadioGroup>
			</Grid>
			{inventorySettings?.inventory_tracking_enabled && (
				<Grid item>
					<CustomText type='Subtitle'>Block inventory on confirmed order?</CustomText>
					<RadioGroup row value={inventorySettings?.should_block ? 'yes' : 'no'} onChange={handleBlockInventoryChange}>
						<FormControlLabel value='yes' control={<Radio />} label='Yes' />
						<FormControlLabel value='no' control={<Radio />} label='No' />
					</RadioGroup>
				</Grid>
			)}
			<Grid item container justifyContent='flex-end' gap={1}>
				<Button variant='outlined' color='secondary' onClick={handleCancel}>
					Cancel
				</Button>
				<Button variant='contained' color='primary' onClick={handleSave}>
					Save
				</Button>
			</Grid>
		</Grid>
	);
};

export default EditInventorySettings;
