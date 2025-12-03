import React from 'react';
import { Grid } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';

interface InventorySettingsProps {
	inventoryTrackingEnabled: boolean;
	shouldBlock: boolean;
}

const DisplayInventorySettings: React.FC<InventorySettingsProps> = ({ inventoryTrackingEnabled, shouldBlock }) => {
	return (
		<Grid container direction='column' spacing={2} mt={3}>
			<Grid item container alignItems='center' spacing={1} wrap='nowrap'>
				<Grid item>
					<CustomText type='Subtitle'>Track inventory : </CustomText>
				</Grid>
				<Grid item>
					<CustomText>{inventoryTrackingEnabled ? 'Yes' : 'No'}</CustomText>
				</Grid>
			</Grid>

			{inventoryTrackingEnabled && (
				<Grid item container alignItems='center' spacing={1} wrap='nowrap'>
					<Grid item>
						<CustomText type='Subtitle'>Block inventory on confirmed order : </CustomText>
					</Grid>
					<Grid item>
						<CustomText>{shouldBlock ? 'Yes' : 'No'}</CustomText>
					</Grid>
				</Grid>
			)}
		</Grid>
	);
};

export default DisplayInventorySettings;
