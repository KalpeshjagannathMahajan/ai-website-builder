import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import TextArea from './TextArea';

export default {
	title: 'Components/TextArea',
	component: TextArea,
} as Meta<typeof TextArea>;

const TextAreaComponent: React.FC = (args) => {
	const [textValue, setTextValue] = useState('');
	return (
		<TextArea
			label='Add information'
			value={textValue}
			handleChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
				setTextValue(e.target.value);
			}}
			rows={4}
			name='hello'
			sx={{ width: '100%' }}
			placeholder='Write here...'
			required
			{...args}
		/>
	);
};

export const Basic: StoryObj = {
	render: () => <TextAreaComponent />,
};
