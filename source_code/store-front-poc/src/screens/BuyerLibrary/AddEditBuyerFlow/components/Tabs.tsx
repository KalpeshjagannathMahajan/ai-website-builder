import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import { SECTIONS } from '../../constants';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
// import { useSelector } from 'react-redux';

const TabsSection = ({ sections, handle_scroll_to_section, active_tab, errors }: any) => {
	// const permissions = useSelector((state: any) => state?.login?.permissions);
	const error_keys = _.keys(errors);

	const on_press = (key: any) => {
		handle_scroll_to_section(key);
	};

	if (_.isEmpty(sections)) {
		return null;
	}

	const handle_active_tab_color = (section: any, has_error: boolean) => {
		if (has_error) {
			return 'red';
		} else if (active_tab === section?.key) {
			return 'black';
		} else {
			return 'grey';
		}
	};

	return (
		<Grid display='flex' direction='row' sx={{ overflowX: 'scroll', '&::-webkit-scrollbar': { height: 0 } }}>
			{_.map(sections, (section: any) => {
				const has_error = _.includes(error_keys, section.key === SECTIONS.basic_details ? 'company_name' : section.key);
				if (section?.is_display !== false)
					return (
						_.size(section?.is_display_exclusion_type) !== 2 && (
							<Grid
								item
								display='flex'
								direction='column'
								gap={0.5}
								borderBottom={active_tab === section.key ? '2px solid green' : ''}
								sx={{ cursor: 'pointer', p: 2, mb: 2, flexShrink: 0 }}
								key={section.key}
								onClick={() => on_press(section.key)}>
								<Box display='flex' justifyContent='center' gap={0.5} alignItems='center'>
									<CustomText type='H1' color={handle_active_tab_color(section, has_error)}>
										{section.name}
									</CustomText>
									{has_error && <Icon iconName='IconInfoCircle' color={has_error ? 'red' : 'black'} />}
								</Box>
							</Grid>
						)
					);
			})}
		</Grid>
	);
};

export default TabsSection;
