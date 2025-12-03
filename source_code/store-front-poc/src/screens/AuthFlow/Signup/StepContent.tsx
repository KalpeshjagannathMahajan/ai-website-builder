import React from 'react';
import { Box, Grid } from '@mui/material';
import RenderAttributes from './RenderAttributes';
import { Section } from './interfaces';

const StepContent: React.FC<{
	section: Section;
	getValues: any;
	setValue: any;
	sectionName: string;
	watch: any;
	isEmailValid?: any;
}> = ({ section, getValues, setValue, sectionName, watch, isEmailValid }) => {
	return (
		<Box sx={{ mt: 2 }}>
			<Grid container spacing={2}>
				{section.attributes && (
					<RenderAttributes attributes={section.attributes} getValues={getValues} setValue={setValue} sectionName={sectionName} />
				)}
				{section.contacts &&
					section.contacts.map((contact: any) => (
						<RenderAttributes
							isEmailValid={isEmailValid}
							key={'contacts'}
							attributes={contact.attributes}
							getValues={getValues}
							setValue={setValue}
							sectionName={sectionName}
							watch={watch}
						/>
					))}
			</Grid>
		</Box>
	);
};

export default StepContent;
