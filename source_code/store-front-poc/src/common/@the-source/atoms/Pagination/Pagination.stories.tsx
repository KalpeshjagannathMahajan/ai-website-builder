import { Meta, StoryObj } from '@storybook/react';

import Pagination from './Pagination';

export default {
	title: 'Components/Pagination',
	component: Pagination,
} as Meta<typeof Pagination>;

export const PaginationsDefault: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<Pagination count={10} color='primary' {...args} />
			<Pagination color='secondary' count={5} {...args} />
			<Pagination count={8} showFirstButton={false} showLastButton={false} {...args} />
			<Pagination {...args} />
		</div>
	),
};
