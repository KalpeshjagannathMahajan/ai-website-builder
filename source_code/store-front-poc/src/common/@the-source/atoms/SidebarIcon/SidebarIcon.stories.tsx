import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import SidebarIcon from './SidebarIcon';

export default {
	title: 'Components/SidebarIcon',
	component: SidebarIcon,
} as Meta<typeof SidebarIcon>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<SidebarIcon onClick={() => console.log('clicked')} type='rounded' name='IconSettings' {...args} />
			<SidebarIcon onClick={() => console.log('clicked')} type='square' name='IconSettings' {...args} />
			<SidebarIcon onClick={() => console.log('clicked')} type='circle' name='IconSettings' {...args} />
		</div>
	),
};

export const Disabled: StoryObj = {
	render: (args) => <SidebarIcon name='IconSettings' disabled {...args} />,
};

export const Clicked: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
			<SidebarIcon type='circle' name='IconSettings' clicked {...args} />
			<SidebarIcon type='rounded' name='IconSettings' clicked {...args} />
			<SidebarIcon type='square' name='IconSettings' clicked {...args} />
		</div>
	),
};

export const Size: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<SidebarIcon size='small' name='IconSettings' {...args} />
			<SidebarIcon size='medium' name='IconSettings' {...args} />
			<SidebarIcon size='large' name='IconSettings' {...args} />
		</div>
	),
};

export const WithText: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<SidebarIcon size='large' text='Dashboard' name='IconSettings' {...args} />
			<SidebarIcon size='large' text='Dashboard' clicked name='IconSettings' {...args} />
		</div>
	),
};

export const FullWidthWithText: StoryObj = {
	render: (args) => (
		<Grid item sx={{ width: '200px' }}>
			<SidebarIcon size='large' text='Dashboard' clicked name='IconSettings' fullWidth {...args} />
		</Grid>
	),
};
