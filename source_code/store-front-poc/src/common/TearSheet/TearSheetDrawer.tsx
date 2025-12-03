import { Box, Button, Grid, Drawer, Switch, Icon } from '../@the-source/atoms';
import { t } from 'i18next';
import React from 'react';
import CustomText from '../@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import PreviewTemplate from './PreviewTemplate';
import _ from 'lodash';
import { background_colors, text_colors } from 'src/utils/light.theme';
import Chips from '../@the-source/atoms/Chips';
import usePricelist from 'src/hooks/usePricelist';

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		background: `${background_colors.primary}`,
		height: '100vh',
	},
	header: {
		position: 'sticky',
		top: 0,
		zIndex: 1100,
		background: `${background_colors.primary}`,
		borderBottom: `1px solid ${text_colors.secondary}`,
		borderColor: 'divider',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '10px 20px',
		...theme?.product_details?.tearsheet_drawer?.header,
	},
	content: {
		flex: 1,
		overflow: 'auto',
		margin: '10px 20px 0',
		...theme?.product_details?.tearsheet_drawer?.content,
	},
	content_header: {
		background: `${background_colors.secondary}`,
		borderRadius: '12px',
		padding: '4px 8px 12px 8px',
		...theme?.card_,
	},
}));

type TearSheetProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	// options: any; [HOTFIX 31/10/2024] will remove later if required
	on_switch_change: () => void;
	// selected_option: string; [HOTFIX 31/10/2024] will remove later if required
	show_toggle: boolean;
	checked: boolean;
	loading: boolean;
	show_catalog_selector?: boolean;
	data: any;
	selected_template: string;
	set_selected_template: (id: string) => void;
	show_preview_handler?: () => void;
	show_preview_btn?: boolean;
};

const TearSheetDrawer: React.FC<TearSheetProps> = ({
	open,
	onClose,
	onSubmit,
	// options, [HOTFIX 31/10/2024] will remove later if required
	on_switch_change,
	// selected_option, [HOTFIX 31/10/2024] will remove later if required
	show_toggle,
	checked,
	loading,
	show_catalog_selector = true,
	data,
	selected_template,
	set_selected_template,
	show_preview_handler,
	show_preview_btn = true,
}) => {
	const classes = useStyles();

	const selected_catalog = usePricelist();

	const content = (
		<Box className={classes.container}>
			<Box className={classes.header}>
				<CustomText type='H6'>{t('MultipleTearsheet.Title')}</CustomText>
				<Icon sx={{ cursor: 'pointer' }} iconName='IconX' onClick={onClose} />
			</Box>

			<Box className={classes.content}>
				<Box className={classes.content_header}>
					{show_toggle && (
						<Box ml={1}>
							<Grid container alignItems={'center'}>
								<CustomText type='Subtitle'>{t('CartSummary.TearSheet.ShowPrice')}</CustomText>
								<Switch sx={{ ml: 2 }} onChange={on_switch_change} checked={checked} />
							</Grid>
						</Box>
					)}
					{show_catalog_selector && (
						<Grid ml={0.5}>
							<Grid ml={0.5}>
								<CustomText type='Body'>{t('MultipleTearsheet.ToggleSubText')}</CustomText>
							</Grid>
							<Grid pt={2}>
								<Chips
									label={selected_catalog?.label}
									sx={{ fontWeight: 700 }}
									bgColor={background_colors.primary}
									textColor={checked ? text_colors.green : text_colors.grey}
								/>
							</Grid>
						</Grid>
					)}
				</Box>
				<Box mt={2}>
					<Box>
						<CustomText type='Subtitle'>{t('MultipleTearsheet.ChooseTemplate')}</CustomText>
						<CustomText style={{ marginTop: '4px', color: text_colors.primary }} type='Body'>
							{t('MultipleTearsheet.TemplateSubText')}
						</CustomText>
					</Box>
				</Box>
				<Box mt={2} display='flex' flexDirection='column' gap={1}>
					{_.map(data, (item: any) => (
						<PreviewTemplate
							key={item?.id}
							data={item}
							selected={item?.id === selected_template}
							onClick={() => set_selected_template(item?.id)}
						/>
					))}
				</Box>
			</Box>
			{/* Footer */}
			<Box p={2} sx={{ borderTop: `1px solid ${text_colors.tertiary}`, borderColor: 'divider' }}>
				<Grid container justifyContent='flex-end' gap={1}>
					{show_preview_btn && (
						<Button variant='outlined' onClick={show_preview_handler} color='secondary' disabled={loading || !selected_template}>
							{t('CartSummary.TearSheet.Preview')}
						</Button>
					)}

					<Button variant='contained' onClick={onSubmit} disabled={loading || !selected_template}>
						{loading ? t('CartSummary.TearSheet.Downloading') : t('MultipleTearsheet.Download')}
					</Button>
				</Grid>
			</Box>
		</Box>
	);

	return <Drawer width={480} anchor='right' open={open} onClose={onClose} content={content} />;
};

export default TearSheetDrawer;
