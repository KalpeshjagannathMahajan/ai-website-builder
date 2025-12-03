import { Meta, StoryFn } from '@storybook/react';

import { Button } from '../../atoms';
import ImportDrawer from './ImportDrawer';

export default {
	title: 'SalesRep/ImportDrawer',
	component: ImportDrawer,
} as Meta<typeof ImportDrawer>;

export const Basic: StoryFn = () => {
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<Button onClick={() => setOpen(true)}>Open</Button>
			{open && <ImportDrawer open={open} setOpen={setOpen} />}
		</div>
	);
};
