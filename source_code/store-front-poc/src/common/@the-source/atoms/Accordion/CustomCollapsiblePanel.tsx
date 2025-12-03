import React from 'react';
import './CustomCollapsiblePanel.css';
import Grid from '../Grid';
import Box from '../Box';

interface Props {
	is_expanded: boolean;
	content: React.ReactNode;
	children: React.ReactNode;
}

const CustomCollapsiblePanel: React.FC<Props> = ({ is_expanded = false, content, children }) => {
	return (
		<Grid className='collapsible_section'>
			<Box className='toggle_section'>{content}</Box>
			<Box style={is_expanded ? { height: 'fit-content' } : { height: '0px' }} id='parent_section' className='content_parent_section'>
				<Box className='content_section'>{children}</Box>
			</Box>
		</Grid>
	);
};

export default CustomCollapsiblePanel;
