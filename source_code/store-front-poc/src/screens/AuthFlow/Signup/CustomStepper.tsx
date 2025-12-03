import React from 'react';
import { Stepper, Step, StepLabel, styled, StepButton } from '@mui/material';
import _ from 'lodash';

const StyledStepper = styled(Stepper)(({ theme }: any) => ({
	'& .MuiStep-root': {
		'& .MuiStepConnector-root': {
			top: '24px',
			marginLeft: '9px',
			width: '60%',
		},
		'& .MuiStepLabel-root': {
			'& .MuiStepIcon-root': {
				width: 50,
				height: 50,
				borderRadius: theme?.authflow?.signup?.custom_stepper?.step_icon?.border_radius,
				border: theme?.authflow?.signup?.custom_stepper?.step_icon?.border,
				'&.Mui-active': {
					color: theme?.authflow?.signup?.custom_stepper?.active?.color,
					backgroundColor: theme?.authflow?.signup?.custom_stepper?.active?.color,
					borderColor: theme?.authflow?.signup?.custom_stepper?.active?.border_color,
					'& .MuiStepIcon-text': {
						fill: theme?.authflow?.signup?.custom_stepper?.active?.fill,
						textSize: '16px',
					},
				},
				'&.before-active': {
					color: theme?.authflow?.signup?.custom_stepper?.before_active?.color,
					backgroundColor: theme?.authflow?.signup?.custom_stepper?.before_active?.color,
					borderColor: theme?.authflow?.signup?.custom_stepper?.before_active?.border_color,
					'& .MuiStepIcon-text': {
						fill: theme?.authflow?.signup?.custom_stepper?.before_active?.fill,
						textSize: '16px',
					},
				},
				'&.after-active': {
					color: theme?.authflow?.signup?.custom_stepper?.after_active?.color,
					backgroundColor: theme?.authflow?.signup?.custom_stepper?.after_active?.color,
					borderColor: theme?.authflow?.signup?.custom_stepper?.after_active?.border_color,
					'& .MuiStepIcon-text': {
						fill: theme?.authflow?.signup?.custom_stepper?.after_active?.fill,
						textSize: '16px',
					},
				},
				'&.Mui-completed': {
					color: theme?.authflow?.signup?.custom_stepper?.completed?.color,
					borderColor: theme?.authflow?.signup?.custom_stepper?.completed?.border_color,
				},
			},
			// '& .MuiStepIcon-text': {
			// 	fill: 'red',
			// 	textSize: '16px',
			// },
		},
		'& .MuiStepLabel-label': {
			'&.Mui-active': {
				fontWeight: 'bold',
				color: 'black',
			},
			'&.Mui-completed': {
				fontWeight: 'bold',
				color: 'black',
			},
			'&.after-active': {
				fontWeight: 'bold',
				color: 'black',
			},
			'&.before-active': {
				fontWeight: 'bold',
				color: 'black',
			},
		},
	},
}));

interface custom_stepper_props {
	active_step: number;
	steps: { name: string }[];
	on_step_click?: (step_index: number) => void;
}

const CustomStepper: React.FC<custom_stepper_props> = ({ active_step, steps, on_step_click }) => {
	// const theme = useTheme();
	const handle_on_step_click = (index: number, is_active: boolean) => {
		if (!is_active && on_step_click) {
			on_step_click(index);
		}
	};
	return (
		<StyledStepper activeStep={active_step} alternativeLabel sx={{ mt: 5 }} nonLinear>
			{_.map(steps, (step, index) => {
				const is_before_active = index < active_step;
				const is_active = index === active_step;
				const is_after_active = index > active_step;

				let iconClass = '';
				if (is_before_active) iconClass = 'before-active';
				if (is_active) iconClass = 'Mui-active';
				if (is_after_active) iconClass = 'after-active';

				return (
					<Step key={step.name}>
						<StepButton
							onClick={() => {
								handle_on_step_click(index, is_active);
							}}>
							<StepLabel
								StepIconProps={{
									icon: index + 1,
									className: iconClass,
								}}>
								{step.name}
							</StepLabel>
						</StepButton>
					</Step>
				);
			})}
		</StyledStepper>
	);
};

export default CustomStepper;
