import { makeStyles } from '@mui/styles';

import { Typography, Image, Icon } from 'src/common/@the-source/atoms';
import { ImportOptions } from 'src/@types/manage_data';
import ImageLinks from 'src/assets/images/ImageLinks';

const useStyles = makeStyles(() => ({
	action_container: {
		padding: '16px',
		display: 'flex',
		gap: '16px',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '12px',
		cursor: 'pointer',
		flex: 1,
		position: 'relative',
		height: '128px',
	},
}));

type Item = {
	title: string;
	value: ImportOptions;
	image: string;
};

interface Props {
	item: Item;
	selected: boolean;
	set_selected_action: (value: Item) => void;
}

const ActionCard = ({ item, selected, set_selected_action }: Props) => {
	const classes = useStyles();

	const image_path: string = item.image;
	const image_src: any = ImageLinks[image_path];

	const border = selected ? '1.2px solid #16885F' : '1px solid rgba(0, 0, 0, 0.12)';
	const background = selected ? '#E8F3EF' : 'white';

	return (
		<div onClick={() => set_selected_action(item)} className={classes.action_container} style={{ border, background }}>
			{selected && (
				<div style={{ position: 'absolute', right: 3.5, top: 3.5 }}>
					<Icon iconName='IconCircleCheckFilled' color='#16885F' />
				</div>
			)}
			<Image src={image_src} width={85} height={46} />
			<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2'>
				{item.title}
			</Typography>
		</div>
	);
};

export default ActionCard;
