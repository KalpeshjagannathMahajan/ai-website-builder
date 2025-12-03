import ToggleButton, { ToggleButtonProps as MuiToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Icon from '../Icon/Icon';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import CustomText from '../../CustomText';

type ToggleButtonBaseProps = Pick<MuiToggleButtonProps, 'value'>;

export interface ToggleButtonProps extends ToggleButtonBaseProps {
	value: any;
	icons?: object[];
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	textStyle?: any;
	sx?: any;
	handleChange?: (newAlignment: string) => void;
}

const ToggleButtons = ({ value, icons, size, disabled, textStyle, sx, handleChange, ...rest }: ToggleButtonProps) => {
	const [alignment, setAlignment] = useState<string | null>(value);

	const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
		if (newAlignment === null) {
			return;
		}
		handleChange && handleChange(newAlignment);
		setAlignment(newAlignment);
	};

	useEffect(() => {
		setAlignment(value);
	}, [value]);

	return (
		<ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment}>
			{icons?.map((item: any) => (
				<ToggleButton size={size} key={item.id} disabled={disabled} value={item.value} sx={sx} {...rest}>
					{!_.isUndefined(item?.icon) && <Icon iconName={item.icon} />}
					{!_.isUndefined(item?.text) && <CustomText style={textStyle}>{item?.text}</CustomText>}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
};

ToggleButtons.defaultProps = {
	icons: [
		{
			id: 1,
			icon: 'IconLayoutGrid',
			value: 'left',
		},
	],
	size: 'small',
	disabled: false,
};

export default ToggleButtons;
