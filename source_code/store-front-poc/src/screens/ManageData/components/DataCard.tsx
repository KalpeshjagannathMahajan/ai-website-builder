import { makeStyles } from '@mui/styles';
import { Typography, Grid, Image, Tooltip } from 'src/common/@the-source/atoms';
import { ManageDataItem } from 'src/@types/manage_data';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
	data_card_container: {
		width: '168px',
		height: '160px',
		borderRadius: '8px',
	},
	inner_box: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '12px',
		height: '100%',
	},
}));

interface Props {
	item: ManageDataItem;
	selected: boolean;
	set_selected_data_card: (value: ManageDataItem) => void;
}

const DataCard = ({ item, selected, set_selected_data_card }: Props) => {
	const theme: any = useTheme();
	const classes = useStyles();
	const { t } = useTranslation();
	const image_src = selected ? item.selected_image : item.image;
	return (
		<Grid
			item
			className={classes.data_card_container}
			onClick={() => {
				set_selected_data_card(item);
			}}
			sx={{
				opacity: item.disabled ? 0.3 : 1,
				cursor: item.disabled ? 'auto' : 'pointer',
				boxShadow: selected ? theme?.import_export?.data_card?.box_shadow : 'none',
				border: selected ? theme?.import_export?.data_card?.border1 : theme?.import_export?.data_card.border2,
			}}>
			{item.disabled ? (
				<Tooltip onClose={function noRefCheck() {}} onOpen={function noRefCheck() {}} title={t('ManageData.DataCard.Title')}>
					<div className={classes.inner_box}>
						<Image src={image_src} width={'100%'} height={'auto'} />
						<Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
							{item.label}
						</Typography>
					</div>
				</Tooltip>
			) : (
				<div className={classes.inner_box}>
					<Image src={image_src} width={'100%'} height={'auto'} />
					<Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
						{item.label}
					</Typography>
				</div>
			)}
		</Grid>
	);
};

export default DataCard;
