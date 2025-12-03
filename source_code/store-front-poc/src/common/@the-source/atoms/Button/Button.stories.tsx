import { Meta, StoryObj } from '@storybook/react';

import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';
import Button from './Button';

export default {
	title: 'Components/Button',
	component: Button,
} as Meta<typeof Button>;

export const Variant: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Button variant='contained' {...args} />
			<Button variant='outlined' {...args} />
			<Button variant='text' {...args} />
			<Button tonal {...args} />
		</div>
	),
};

export const Disabled: StoryObj = {
	render: (args) => <Button disabled {...args} />,
};

export const Size: StoryObj = {};

export const Color: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Button color='primary' {...args} />
			<Button color='secondary' {...args} />
			<Button color='success' {...args} />
			<Button color='error' {...args} />
			<Button color='warning' {...args} />
			<Button color='info' {...args} />
		</div>
	),
};

export const FullWidth: StoryObj = {
	render: (args) => <Button fullWidth {...args} />,
};

export const Href: StoryObj = {
	render: (args) => <Button href='https://www.sourcewiz.co/' {...args} />,
};

export const Icons: StoryObj = {
	render: (args) => (
		<div>
			<Typography color='secondary' variant='h3'>
				Start Icon
			</Typography>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					width: '100%',
					marginTop: 32,
				}}>
				<Button size='small' startIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
				<Button size='medium' startIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
				<Button size='large' startIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
			</div>

			<Typography color='secondary' variant='h3'>
				End Icon
			</Typography>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					width: '100%',
					marginTop: 32,
				}}>
				<Button size='small' endIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
				<Button size='medium' endIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
				<Button size='large' endIcon={<Icon color='#fff' iconName='addUser' />} {...args} />
			</div>

			<Typography color='secondary' variant='h3'>
				Both
			</Typography>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					width: '100%',
					marginTop: 32,
				}}>
				<Button
					size='small'
					endIcon={<Icon color='#fff' iconName='IconPlus' />}
					startIcon={<Icon color='#fff' iconName='IconMinus' />}
					{...args}
				/>
				<Button
					size='medium'
					endIcon={<Icon color='#fff' iconName='IconPlus' />}
					startIcon={<Icon color='#fff' iconName='IconMinus' />}
					{...args}
				/>
				<Button
					size='large'
					endIcon={<Icon color='#fff' iconName='IconPlus' />}
					startIcon={<Icon color='#fff' iconName='IconMinus' />}
					{...args}
				/>
			</div>
		</div>
	),
};
