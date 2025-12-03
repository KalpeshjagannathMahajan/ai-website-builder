import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import Toaster from './Toaster';

export default {
	title: 'Components/Toaster',
	component: Toaster,
} as Meta<typeof Toaster>;

export const ToasterStoryWithoutCross: StoryFn = () => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	// <div />
	return (
		<Toaster
			open={open}
			showCross={false}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={3000}
			onClose={handleClose}
			state='success'
			title='Title 1'
			subtitle='Subtitle 1'
			showActions={false}
			iconSize='large'
			primaryBtnName='Submit'
			secondryBtnName='Cancel'
		/>
	);
};

export const ToasterStoryWithoutAction: StoryFn = () => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	// <div />
	return (
		<Toaster
			open={open}
			showCross
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={3000}
			onClose={handleClose}
			state='success'
			title='Title 1'
			subtitle='Subtitle 1'
			showActions={false}
			iconSize='large'
			primaryBtnName='Submit'
			secondryBtnName='Cancel'
		/>
	);
};

export const ToasterStoryWithActions: StoryFn = () => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	// <div />
	return (
		<Toaster
			open={open}
			showCross
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={3000}
			onClose={handleClose}
			state='success'
			title='Title 1'
			subtitle='Subtitle 1'
			showActions
			iconSize='large'
			primaryBtnName='Submit'
			handlePrimary={handleClose}
			handleSecondry={handleClose}
			secondryBtnName='Cancel'
		/>
	);
};

export const ToasterStoryErrorState: StoryFn = () => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	// <div />
	return (
		<Toaster
			open={open}
			showCross
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={500000}
			onClose={handleClose}
			state='error'
			title='Title 1'
			subtitle='Subtitle 1'
			showActions
			iconSize='large'
			primaryBtnName='Submit'
			handlePrimary={handleClose}
			handleSecondry={handleClose}
			secondryBtnName='Cancel'
		/>
	);
};

export const ToasterStoryWarningState: StoryFn = () => {
	const [open, setOpen] = useState<boolean>(true);
	const handleClose = () => {
		setOpen(false);
	};
	// <div />
	return (
		<Toaster
			open={open}
			showCross
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			autoHideDuration={500000}
			onClose={handleClose}
			state='warning'
			title='Title 1'
			subtitle='Subtitle 1'
			showActions
			iconSize='large'
			primaryBtnName='Submit'
			handlePrimary={handleClose}
			handleSecondry={handleClose}
			secondryBtnName='Cancel'
		/>
	);
};
