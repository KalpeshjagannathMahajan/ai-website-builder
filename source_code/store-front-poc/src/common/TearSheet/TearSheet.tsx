import { Divider } from '@mui/material';
import { Box, Button, Grid, Modal, Switch, Typography } from '../@the-source/atoms';
import RadioGroup from '../@the-source/molecules/RadioGroup/RadioGroup';
import { useTranslation } from 'react-i18next';
import React from 'react';

type TearSheetProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	onChange: (value: any) => any;
	options: any;
	is_guest_buyer: boolean;
	on_switch_change: () => void;
	selected_option: string;
	show_toggle: boolean;
	checked: boolean;
	loading: boolean;
	show_catalog_selector?: boolean;
};

const TearSheet: React.FC<TearSheetProps> = ({
	open,
	onClose,
	onSubmit,
	options,
	onChange,
	on_switch_change,
	selected_option,
	show_toggle,
	checked,
	loading,
	show_catalog_selector = true,
}) => {
	const { t } = useTranslation();
	return (
		<Modal
			container_style={{
				padding: '0rem 2rem 1rem  2rem',
			}}
			open={open}
			onClose={onClose}
			title={t('CartSummary.TearSheet.DownloadTearSheet')}
			footer={
				<Grid container justifyContent={'flex-end'} gap={'2em'}>
					<Button variant='outlined' onClick={onClose} color='secondary'>
						{t('CartSummary.TearSheet.Cancel')}
					</Button>
					<Button onClick={onSubmit} loading={loading}>
						{t('CartSummary.TearSheet.Download')}
					</Button>
				</Grid>
			}
			children={
				<React.Fragment>
					<Box>
						{show_toggle && (
							<Grid container justifyContent={'space-between'} alignItems={'center'}>
								<Typography sx={{ fontSize: 14 }} variant='body1'>
									{t('CartSummary.TearSheet.ShowTearsheetPrice')}
								</Typography>
								<Switch onChange={on_switch_change} checked={checked} />
							</Grid>
						)}
						{show_catalog_selector && (
							<React.Fragment>
								<Divider />
								<Grid pt={1}>
									<Typography variant='h6'>{t('CartSummary.TearSheet.SelectPriceList')}</Typography>
									<RadioGroup
										radio_label_style={{
											fontSize: 14,
										}}
										disabled={!checked}
										options={options}
										selectedOption={selected_option}
										onChange={onChange}
									/>
								</Grid>
							</React.Fragment>
						)}
					</Box>
				</React.Fragment>
			}
		/>
	);
};

export default TearSheet;
