import { Step, StepConnector, StepLabel, Stepper as MuiStepper, StepperProps as MuiStepperProps } from '@mui/material';
import Icon from '../Icon/Icon';
import { makeStyles } from '@mui/styles';

type StepperVariant = 'horizontal' | 'vertical';

type StepperBaseProps = Pick<
	MuiStepperProps,
	'activeStep' | 'alternativeLabel' | 'children' | 'classes' | 'connector' | 'nonLinear' | 'orientation' | 'sx'
>;
export interface StepperProps extends StepperBaseProps {
	steps: StepProps[];
	activeStep: number;
	orientation?: StepperVariant;
	iconSx?: any;
	onClick?: any;
	connectorStyle?: any;
	icon?: any;
	style?: any;
}

interface StepProps {
	label: any;
	icon?: any;
	optional?: React.ReactNode;
	completed?: boolean;
	error?: boolean;
	onClick?: () => {};
}

const useStyles = makeStyles((theme: any) => ({
	activeStep: {
		...theme?.order_management?.stepper?.active_step,
	},
}));

const Stepper = (props: StepperProps) => {
	const { steps, activeStep, orientation = 'horizontal', iconSx = {}, connectorStyle = {}, style, onClick, ...args } = props;
	const classes = useStyles();
	return (
		<MuiStepper
			activeStep={activeStep}
			orientation={orientation}
			{...args}
			connector={
				<StepConnector
					sx={
						connectorStyle || {
							'& .MuiStepConnector-line': {
								borderColor: 'rgba(0, 0, 0, 0.12)',
								borderWidth: 1,
							},
						}
					}
				/>
			}>
			{steps.map((label: any, index) => {
				const stepIconProps = label.icon ? { icon: label.icon } : { sx: iconSx };
				return (
					<Step key={label}>
						<StepLabel
							onClick={() => onClick(label?.step || index, label?.key)}
							classes={{
								active: classes.activeStep,
							}}
							style={style}
							StepIconProps={stepIconProps}
							{...label}>
							{label.label}
						</StepLabel>
					</Step>
				);
			})}
		</MuiStepper>
	);
};

Stepper.defaultProps = {
	children: 'sample',
	alternativeLabel: false,
	onClick: () => {},
	icon: <Icon iconName='IconApertureOff' />,
	orientation: 'horizontal',
	connectorStyle: {
		'& .MuiStepConnector-line': {
			borderColor: 'rgba(0, 0, 0, 0.12)',
			borderWidth: 1,
		},
	},
	iconSx: {},
};
export default Stepper;
