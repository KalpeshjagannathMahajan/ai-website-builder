import { Meta, StoryObj } from '@storybook/react';

import Typography from './Typography';

export default {
	title: 'Components/Typography',
	component: Typography,
} as Meta<typeof Typography>;

export const H1: StoryObj = {
	render: (args) => <Typography {...args} variant='h1' />,
};

export function H2() {
	return <Typography variant='h2'>Hello Sourcewiz</Typography>;
}

export function H3() {
	return <Typography variant='h3'>Hello Sourcewiz</Typography>;
}

export function H4() {
	return <Typography variant='h4'>Hello Sourcewiz</Typography>;
}

export function H5() {
	return <Typography variant='h5'>Hello Sourcewiz</Typography>;
}

export function H6() {
	return <Typography variant='h6'>Hello Sourcewiz</Typography>;
}
export function Subtitle1() {
	return <Typography variant='subtitle1'>Hello Sourcewiz</Typography>;
}

export function Subtitle2() {
	return <Typography variant='subtitle2'>Hello Sourcewiz</Typography>;
}

export function Caption() {
	return <Typography variant='caption'>Hello Sourcewiz</Typography>;
}

export function Body1() {
	return <Typography variant='body1'>Hello Sourcewiz</Typography>;
}

export function Body2() {
	return <Typography variant='body2'>Hello Sourcewiz</Typography>;
}

export function TypographySummary() {
	return (
		<>
			<Typography variant='h1'>heading 1</Typography>
			<Typography variant='h2'>heading 2</Typography>
			<Typography variant='h3'>heading 3</Typography>
			<Typography variant='h4'>heading 4</Typography>
			<Typography variant='h5'>heading 5</Typography>
			<Typography variant='h6'>heading 6</Typography>
			<Typography variant='subtitle1'>subtitle 1</Typography>
			<Typography variant='subtitle2'>subtitle 2</Typography>
			<Typography variant='body1'>body 1</Typography>
			<Typography variant='body2'>body 2</Typography>
			<Typography variant='caption'>caption</Typography>
		</>
	);
}
