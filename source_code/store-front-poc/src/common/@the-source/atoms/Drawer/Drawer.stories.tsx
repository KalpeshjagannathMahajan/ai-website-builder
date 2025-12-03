import { Box, Typography } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Drawer from './Drawer';

export default {
	title: 'Components/Drawer',
	component: Drawer,
} as Meta<typeof Drawer>;

const DrawerStory: React.FC = (args) => {
	const [isDrawer, setIsDrawer] = useState(false);

	const renderDrawerData = () => (
		<Box
			padding={2}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
			<Typography>Drawer</Typography>
			<Icon iconName='IconTrash' sx={{ cursor: 'pointer' }} onClick={() => setIsDrawer(false)} />
		</Box>
	);
	return (
		<Box>
			<Button tonal onClick={() => setIsDrawer(!isDrawer)}>
				open/close
			</Button>
			<Drawer anchor='right' open={isDrawer} content={renderDrawerData()} onClose={() => setIsDrawer(false)} {...args} />
		</Box>
	);
};

export const Basic: StoryObj = {
	render: () => <DrawerStory />,
};
