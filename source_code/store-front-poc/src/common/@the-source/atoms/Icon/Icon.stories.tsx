import { Grid } from '@mui/material';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
// import { Icon2fa, IconCheck, IconCloudDownload } from '@tabler/icons-react';

import { Icon1, Icon2, Icon3, Icon4, Icon5, Icons } from './baseTypes';
import Icon from './Icon';

export default {
	title: 'Components/Icon',
	component: Icon,
} as Meta<typeof Icon>;

export const UserIcons: StoryFn = () => (
	<>
		<Icon iconName='users' />
		<Icon iconName='addUser' />
		<Icon iconName='checkedUser' />
	</>
);

export const ColoredIcons: StoryFn = () => (
	<>
		<Icon iconName='users' color='red' />
		<Icon iconName='addUser' color='#309afc' />
		<Icon iconName='checkedUser' color='green' />
	</>
);

export const DownloadIcon: StoryFn = () => <Icon iconName='downloadCloud' />;

export const ToggleAllIcons: StoryObj = {
	render: (args) => <Icon iconName='fallback' {...args} />,
};

export const IconsSetOne: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icons.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
export const IconsSetTwo: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icon1.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
export const IconsSetThree: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icon2.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
export const IconsSetFour: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icon3.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
export const IconsSetFive: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icon4.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
export const IconsSetSix: StoryObj = {
	render: (args) => (
		<Grid container spacing={5}>
			{Icon5.map((item: any) => (
				<Grid item xs={3} container>
					<Grid item xs={24}>
						<Icon iconName={item} fontSize='large' {...args} />{' '}
					</Grid>
					<Grid item xs={24}>
						{item}
					</Grid>
				</Grid>
			))}
		</Grid>
	),
};
