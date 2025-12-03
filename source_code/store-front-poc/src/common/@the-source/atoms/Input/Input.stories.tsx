import { Meta, StoryFn } from '@storybook/react';
// import { Icon2fa, IconCheck, IconCloudDownload } from '@tabler/icons-react';

import Input from './Input';

export default {
	title: 'Components/Input',
	component: Input,
} as Meta<typeof Input>;

export const StandardInput: StoryFn = () => (
	<>
		<Input label='Standard' variant='standard'>
			Test
		</Input>
		<Input label='Standard with error' error variant='standard'>
			Test
		</Input>
		<Input label='Disabled' disabled variant='standard'>
			Test
		</Input>
		<Input label='Standard with error message' error helperText='Invalid Input' variant='standard'>
			Test
		</Input>
	</>
);

export const FilledInput: StoryFn = () => (
	<>
		<Input label='Filled' variant='filled' value='Test'>
			Filled
		</Input>
		<Input label='Filled with error' error variant='filled' value='Test'>
			Filled
		</Input>
		<Input label='Filled Disabled' disabled variant='filled' value='Test'>
			Filled
		</Input>
		<Input label='Filled with error message' error helperText='Invalid Input' variant='filled' value='Test'>
			Filled
		</Input>
	</>
);

export const BasicInput: StoryFn = () => (
	<>
		<Input label='Outlined' variant='outlined'>
			Test2
		</Input>
		<Input label='Outlined' variant='outlined' disabled>
			Test2
		</Input>
		<Input label='Outlined' error variant='outlined'>
			Test2
		</Input>
		<Input label='Outlined' error helperText='Invalid Input' variant='outlined'>
			Test2
		</Input>
	</>
);
