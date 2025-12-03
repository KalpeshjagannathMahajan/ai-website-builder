import ImageLinks from 'src/assets/images/ImageLinks';
import Image from '../Image';
import { makeStyles } from '@mui/styles';
import { colors } from 'src/utils/theme';

interface CustomCheckboxProps {
	selected?: boolean;
	partial?: boolean;
}

const useStyles = makeStyles(() => ({
	review_icon_style: {
		backgroundColor: colors.white,
		borderRadius: '2.1px',
	},
}));

export default function CustomCheckbox({ selected = false, partial = false }: CustomCheckboxProps) {
	const classes = useStyles();

	return (
		<>
			{!selected && !partial && (
				<Image width={'16px'} height={'16px'} imgClass={classes.review_icon_style} src={ImageLinks.checkbox_unchecked} alt='Unchecked' />
			)}
			{selected && !partial && (
				<Image width={'16px'} height={'16px'} imgClass={classes.review_icon_style} src={ImageLinks.checkbox_checked} alt='Checked' />
			)}
			{partial && (
				<Image
					width={'16px'}
					height={'16px'}
					imgClass={classes.review_icon_style}
					src={ImageLinks.checkbox_intermediate}
					alt='Intermediate'
				/>
			)}
		</>
	);
}
