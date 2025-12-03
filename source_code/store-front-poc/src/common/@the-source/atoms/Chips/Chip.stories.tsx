// import DoneIcon from '@mui/icons-material/Done';
import { Meta, StoryFn } from '@storybook/react';
import { IconX } from '@tabler/icons-react';

import Chip from './Chip';

export default {
	title: 'Components/Chips',
	component: Chip,
} as Meta<typeof Chip>;

export const Filled: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-evenly',
			width: '40%',
		}}>
		<Chip variant='filled' size='small' label='Filled Chip' />
		<Chip variant='filled' label='Filled Chip' />
	</div>
);

export const Outlined: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-evenly',
			width: '40%',
		}}>
		<Chip variant='outlined' size='small' label='Outlined Chip' />
		<Chip variant='outlined' label='Outlined Chip' />
	</div>
);

export const AllVariants: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-evenly',
			width: '100%',
		}}>
		<Chip variant='filled' size='small' label='Filled Chip' />
		<Chip variant='filled' label='Filled Chip' />
		<Chip variant='outlined' size='small' label='Outlined Chip' />
		<Chip variant='outlined' label='Outlined Chip' />
		<Chip size='small' variant='outlined' onDelete={() => {}} label='Outlined Chip with delete' />
		<Chip variant='outlined' onDelete={() => {}} label='Outlined Chip with delete' />
		<Chip size='small' label='Chip with delete' onDelete={() => {}} />
		<Chip label='Chip with custom delete' onDelete={() => {}} deleteIcon={<IconX />} />
	</div>
);
