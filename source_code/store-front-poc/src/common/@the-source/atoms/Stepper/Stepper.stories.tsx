import { Meta, StoryObj } from '@storybook/react';

import Grid from '../Grid';
import Icon from '../Icon';
import Typography from '../Typography';
import Stepper from './Stepper';

const Horizontal: React.FC = () => (
	<Grid container>
		<Grid item xs={6}>
			<Stepper
				iconSx={{ fontSize: '24px' }}
				steps={[
					{
						label: <Typography variant='h6'> label 1 </Typography>,
						error: true,
					},
					{
						label: <Typography variant='h6'> label 2 </Typography>,
					},
					{
						label: <Typography variant='h6'> label 3 </Typography>,
					},
				]}
				activeStep={1}
			/>
		</Grid>
	</Grid>
);

const Vertical: React.FC = () => (
	<Stepper
		iconSx={{ fontSize: '24px' }}
		steps={[
			{
				label: <Typography variant='h6'> label 1 </Typography>,
				icon: <Icon sx={{ fontSize: '26px' }} iconName='IconAlertCircle' />,
			},
			{
				label: <Typography variant='h6'> label 2 </Typography>,
			},
			{
				label: <Typography variant='h6'> label 3 </Typography>,
			},
		]}
		activeStep={1}
		orientation='vertical'
	/>
);

const WithIcon: React.FC = () => (
	<Stepper
		iconSx={{ fontSize: '24px' }}
		steps={[
			{
				label: <Typography variant='h6'> label 1 </Typography>,
				icon: <Icon sx={{ fontSize: '26px' }} iconName='IconClockRecord' />,
			},
			{
				label: <Typography variant='h6'> label 2 </Typography>,
				icon: <Icon sx={{ fontSize: '26px' }} iconName='IconAlertCircleFilled' />,
			},
			{
				label: <Typography variant='h6'> label 3 </Typography>,
				icon: <Icon sx={{ fontSize: '26px' }} iconName='IconApertureOff' />,
			},
		]}
		activeStep={1}
	/>
);

const WithSubtitleStepper: React.FC = () => (
	<Stepper
		iconSx={{ fontSize: '24px' }}
		steps={[
			{
				label: <Typography variant='h6'> label 1 </Typography>,
				optional: (
					<Typography variant='body2' color='grey'>
						Subtitle
					</Typography>
				),
			},
			{
				label: <Typography variant='h6'> label 2 </Typography>,
				optional: (
					<Typography variant='body2' color='grey'>
						Subtitle
					</Typography>
				),
			},
			{
				label: <Typography variant='h6'> label 3 </Typography>,
				optional: (
					<Typography variant='body2' color='grey'>
						Subtitle
					</Typography>
				),
				icon: <Icon sx={{ fontSize: '26px' }} iconName='addUser' />,
				error: true,
			},
		]}
		activeStep={1}
	/>
);
export const HorizontalStepper: StoryObj = {
	render: (args) => <Horizontal {...args} />,
};
export const VerticalStepper: StoryObj = {
	render: (args) => <Vertical {...args} />,
};

export const IconStepper: StoryObj = {
	render: (args) => <WithIcon {...args} />,
};
export const WithSubtitle: StoryObj = {
	render: (args) => <WithSubtitleStepper {...args} />,
};
export default {
	title: 'Components/Stepper',
	component: Stepper,
} as Meta<typeof Stepper>;
