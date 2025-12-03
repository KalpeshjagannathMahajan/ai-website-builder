import { makeStyles } from '@mui/styles';
import React from 'react';
import clsx from 'clsx';

import theme from 'src/utils/theme';

interface Props {
	children: any;
	style?: React.CSSProperties;
	bold?: boolean;
	medium?: boolean;
	component?: string;
	className?: any;
}

const useStyles = makeStyles(() => ({
	main: {
		textTransform: 'initial',
		color: theme.colors.black,
	},
}));

const Text = ({ style, bold, medium, component, children, className, ...rest }: Props) => {
	const classes = useStyles();

	const Component = component || 'p';

	return (
		<Component className={clsx(classes.main, className)} {...rest}>
			{children}
		</Component>
	);
};

export default Text;
