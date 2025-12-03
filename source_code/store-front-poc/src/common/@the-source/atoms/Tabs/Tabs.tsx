import { Box, Tab, Tabs as MuiTabs, TabsProps as MuiTabsProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
type TabsBaseProps = Pick<MuiTabsProps, 'value'>;

export interface TabsProps extends TabsBaseProps {
	value?: Number;
	onChange?: any;
	label?: any;
	noOftabs?: any;
	key?: any;
	handleChange: any;
	children?: any;
	style?: any;
	tabContainerStyle?: any;
}

const tabStyle = {
	fontSize: '1.8rem',
	fontWeight: 700,
	padding: 0,
	minWidth: '6rem',
};

const Tabs = ({ value, onChange, handleChange, noOftabs, label, children, tabContainerStyle, style, ...rest }: TabsProps) => {
	const theme: any = useTheme();
	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<MuiTabs value={value} sx={{ marginBottom: '30px', ...tabContainerStyle }} {...rest}>
				{noOftabs?.length > 0 &&
					noOftabs?.map((item: any, index: any) => (
						<Tab
							style={{
								color: value === index ? theme?.tabs?.active_color : theme?.tabs?.inactive_color,
								textTransform: 'none',
								...style,
								...tabStyle,
							}}
							key={index}
							onClick={() => handleChange(index)}
							value={index}
							label={item.name}
						/>
					))}
			</MuiTabs>
			<Box>{children}</Box>
		</Box>
	);
};

Tabs.defaultProps = {
	value: 0,
	onChange: () => {},
	label: 'Tab',
	noOftabs: [],
	key: 0,
	children: {},
};

export default Tabs;
