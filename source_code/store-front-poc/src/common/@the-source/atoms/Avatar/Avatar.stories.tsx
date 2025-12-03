import { Meta, StoryObj } from '@storybook/react';

import Icon from '../Icon/Icon';
import Typography from '../Typography';
import Avatar from './Avatar';

export default {
	title: 'Components/Avatar',
	component: Avatar,
} as Meta<typeof Avatar>;

export const Variant: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Avatar variant='square' size='small' isImageAvatar src='https://www.w3schools.com/howto/img_avatar.png' {...args} />
			<Avatar variant='rounded' size='medium' isImageAvatar src='https://www.w3schools.com/howto/img_avatar.png' {...args} />
			<Avatar variant='circular' size='large' isImageAvatar src='https://www.w3schools.com/howto/img_avatar2.png' {...args} />
		</div>
	),
};

export const TextAvatar: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Avatar size='small' variant='square' isImageAvatar={false} content={<Typography variant='caption'>SM</Typography>} {...args} />
			<Avatar size='medium' variant='rounded' isImageAvatar={false} content={<Typography variant='subtitle2'>SM</Typography>} {...args} />
			<Avatar size='large' variant='circular' isImageAvatar={false} content={<Typography variant='subtitle1'>SM</Typography>} {...args} />
		</div>
	),
};

export const IconAvatar: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Avatar
				variant='square'
				isImageAvatar={false}
				size='small'
				content={<Icon color='#fff' sx={{ fontSize: 16 }} iconName='checkedUser' />}
				{...args}
			/>
			<Avatar
				variant='rounded'
				isImageAvatar={false}
				size='medium'
				content={<Icon color='#fff' sx={{ fontSize: 18 }} iconName='downloadCloud' />}
				{...args}
			/>
			<Avatar
				variant='circular'
				isImageAvatar={false}
				size='large'
				content={<Icon color='#fff' sx={{ fontSize: 24 }} iconName='IconCalendar' />}
				{...args}
			/>
		</div>
	),
};
