import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@mui/material';

// type SwitchProps = Pick<
// MuiSwitchProps
// >;

export interface SwitchProps extends MuiSwitchProps {}

const Switch = ({ ...rest }: SwitchProps) => <MuiSwitch {...rest} />;

Switch.defaultProps = {};
export default Switch;
