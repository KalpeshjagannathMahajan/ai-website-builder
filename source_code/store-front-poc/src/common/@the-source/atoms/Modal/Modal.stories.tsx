import { Meta, StoryObj } from '@storybook/react';

import Grid from '../Grid';
import Modal from './Modal';

export default {
	title: 'Components/Modal',
	component: Modal,
} as Meta<typeof Modal>;

export const Type: StoryObj = {
	render: (args) => (
		<Grid sx={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Modal open {...args}>
				<Grid>Content</Grid>
			</Modal>
		</Grid>
	),
};
