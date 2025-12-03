import { Grid, Radio } from '../../../atoms';

export interface AccordionSelectProps {
	options: Array<string>;
	selectedOptions: Array<string>;
	setSelectedOptions: any;
	onApply: any;
}

export default function AccordionSelect({ options, selectedOptions, setSelectedOptions, onApply }: AccordionSelectProps) {
	return (
		<Grid sx={{ marginTop: '-1em' }}>
			{options.map((option: any) => (
				<Grid key={option} container>
					<Grid item>
						<Radio
							checked={selectedOptions?.includes(option)}
							onChange={(e: any) => {
								if (e.target.checked) {
									setSelectedOptions([option]);
									onApply(option);
									return;
								}
								setSelectedOptions([]);
							}}
						/>
					</Grid>
					<Grid display='flex' alignItems='center' justifyContent='center' item>
						{option}
					</Grid>
				</Grid>
			))}
		</Grid>
	);
}
