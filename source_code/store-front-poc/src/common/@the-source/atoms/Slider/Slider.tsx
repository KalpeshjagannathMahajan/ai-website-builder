import { Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material';

// type SliderBaseProps = Pick<
// MuiSliderProps
// >;

export interface SliderProps extends MuiSliderProps {}

const Slider = ({ children, ...rest }: SliderProps) => <MuiSlider {...rest} />;

Slider.defaultProps = {};
export default Slider;
