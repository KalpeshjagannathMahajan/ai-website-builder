import { IconButton } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Grid from '../Grid/Grid';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';
import Snackbar from './Snackbar';

export default {
	title: 'Components/Snackbar',
	component: Snackbar,
} as Meta<typeof Snackbar>;

const SnackbarComponent: React.FC = (args) => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Snackbar
			open={open}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={3000}
			onClose={handleClose}
			sx={{ background: 'black' }}
			action={
				<IconButton
					sx={{
						position: 'absolute',
						top: '0px',
						right: '0px',
					}}>
					<Icon onClick={handleClose} color='white' iconName='IconX' />
				</IconButton>
			}
			message={
				<Grid sx={{ padding: '3.2rem' }}>
					<Typography color='white' variant='h2'>
						Hello Sourcewiz
					</Typography>
					<Typography color='white' variant='h4'>
						Hello Sourcewiz
					</Typography>
					<Typography color='white' variant='h2'>
						Hello Sourcewiz
					</Typography>
				</Grid>
			}
			{...args}
		/>
	);
};

export const SnackbarStory: StoryObj = {
	render: () => <SnackbarComponent />,
};
