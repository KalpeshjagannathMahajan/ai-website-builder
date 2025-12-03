import { Grid, Image } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import { transform_image_url } from 'src/utils/ImageConstants';
import { background_colors, border_colors, text_colors } from 'src/utils/light.theme';
import TooltipTitle from './TooltipTitle';
import TooltipDesc from './TooltipDesc';

const common_style = {
	display: 'flex',
	alignItems: 'flex-start',
	borderRadius: '12px',
	height: 160,
	cursor: 'pointer',
	padding: '8px',
};

const fallback_url = 'https://directus-g-p.sourcerer.tech/assets/264a17d3-9b7c-4b81-9bb2-3020c6d93e2a';

const useStyles = makeStyles((theme: any) => ({
	imageContainer: {
		position: 'relative',
	},
	container: {
		...common_style,
		border: `1px solid ${text_colors.secondary}`,
		...theme?.card_,
	},
	selectedContainer: {
		...common_style,
		border: `1px solid ${border_colors.primary}`,
		boxShadow: `0px 4px 14px 0px ${text_colors.light_grey}`,
		...theme?.card_,
	},
	textContainer: {
		paddingLeft: '8px',
	},
}));

const PreviewTemplate = ({ data, selected, onClick }: any) => {
	const classes = useStyles();

	return (
		<Grid className={selected ? classes.selectedContainer : classes.container} onClick={onClick}>
			<Grid flex={1} gap={0.5} display='flex' direction='column' className={classes.textContainer}>
				<TooltipTitle title={data?.title} />
				<TooltipDesc desc={data?.description} />
			</Grid>
			<Grid
				container
				alignItems='center'
				justifyContent='center'
				bgcolor={background_colors.alice_blue}
				height='144px'
				width='200px'
				borderRadius='8px'>
				<Image src={transform_image_url(data?.preview_image || fallback_url, 'TEAR_SHEET')} width={85} height={100} />
			</Grid>
		</Grid>
	);
};

export default PreviewTemplate;
