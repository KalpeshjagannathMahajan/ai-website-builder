import { Meta, StoryFn } from '@storybook/react';
import Grid from '../Grid';
import Icon from '../Icon';
import CustomInput from './CustomInput';
import { useTheme } from '@mui/material/styles';

export default {
	title: 'Components/CustomInput',
	component: CustomInput,
} as Meta<typeof CustomInput>;

export const StandardInput: StoryFn = () => {
	const theme: any = useTheme();
	return (
		<Grid container direction='column' padding={4} spacing={3}>
			<Grid item>
				<CustomInput
					onChange={(val) => console.log(val)}
					label='Standard'
					className='testing-1234'
					startIcon={<Icon iconName='IconCurrencyRupee' color={theme?.palette?.secondary[800]} />}
					variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput
					onChange={(e) => console.log(e.target.value)}
					label='Standard'
					startIcon={<Icon iconName='IconCurrencyDollar' color={theme?.palette?.secondary[800]} />}
					endIcon='kg'
					// allowClear
					submitOnEnter
					fullWidth
					variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput onChange={(e) => console.log(e.target.value)} inputType='search' fullWidth={false} defaultValue='Red' allowClear>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput onChange={(e) => console.log(e.target.value)} label='Weight' endIcon='kg' variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput onChange={(e) => console.log(e.target.value)} label='Standard' startIcon='kg' allowClear variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput
					onChange={(val) => console.log(val)}
					startIcon={<Icon iconName='IconCurrencyRupee' color={theme?.palette?.secondary[800]} />}
					label='Standard with error'
					error
					variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item>
				<CustomInput
					onChange={(val) => console.log(val)}
					label='Disabled'
					startIcon={<Icon iconName='IconCurrencyRupee' color={theme?.palette?.secondary[800]} />}
					disabled
					variant='standard'>
					Test
				</CustomInput>
			</Grid>
			<Grid item sx={{ background: '#f7f8fa' }}>
				<CustomInput
					onChange={(val) => console.log(val)}
					label='Disabled'
					startIcon={<Icon iconName='IconCurrencyRupee' color={theme?.palette?.secondary[800]} />}
					variant='standard'>
					Test
				</CustomInput>
			</Grid>
		</Grid>
	);
};
