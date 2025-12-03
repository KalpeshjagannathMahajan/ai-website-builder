import { makeStyles } from '@mui/styles';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { show_toast } from 'src/actions/message';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { Box, Button, Drawer, Grid } from 'src/common/@the-source/atoms';
import ManageColumnsProvider from 'src/common/@the-source/molecules/ManageColumns/context';
import api_requests from 'src/utils/api_requests';
import types from 'src/utils/types';
import { Table } from './LabelsGrid/Table';
import QRTemplate from './QRTemplate';
import TemplateModal from './TemplateModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { set_notification_feedback } from 'src/actions/notifications';
import { label_constants } from './constant';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RouteNames from 'src/utils/RouteNames';

const useStyles = makeStyles((theme: any) => ({
	drawerContent: {
		background: theme?.label?.drawer_content?.background_color,
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
	},
	header: {
		padding: '6px 16px',
	},
	scrollableContent: {
		flexGrow: 1,
		overflowY: 'auto',
		// padding: 10,
		scrollbarWidth: 'none',
		'&::-webkit-scrollbar': {
			width: '0.4em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: theme?.label?.drawer_content?.webkit_scroll_thumb_color,
		},
	},
	scrollableBody: {
		maxHeight: 'calc(100%)',
		overflowY: 'auto',
	},
	buttonsContainer: {
		padding: 16,
	},
	buttonsContainer_only: {
		padding: 16,
		textAlign: 'right',
		dispay: 'flex',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
	not_allowed: {
		background: theme?.label?.not_allowed?.background,
		display: 'flex',
		padding: '8px 10px',
		marginRight: '4rem',
		gap: '4px',
		borderRadius: '6px',
		wordBreak: 'break-all',
		whiteSpace: 'pre-wrap',
	},
	allowed: {
		background: theme?.label?.allowed?.background,
		display: 'flex',
		padding: '8px 10px',
		marginRight: '4rem',
		gap: '4px',
		borderRadius: '6px',
		wordBreak: 'break-all',
		whiteSpace: 'pre-wrap',
	},
}));

const download_start_messsage = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.SUCCESS_STATE,
	title: types.SUCCESS_TITLE,
	subtitle: i18next.t('PDF Downloaded Started'),
	showActions: false,
};

const download_error_messsage = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.ERROR_STATE,
	title: types.ERROR_TITLE,
	subtitle: i18next.t('PDF Downloaded Failed'),
	showActions: false,
};

const no_product_selected = {
	open: true,
	showCross: false,
	anchorOrigin: {
		vertical: types.VERTICAL_TOP,
		horizontal: types.HORIZONTAL_CENTER,
	},
	autoHideDuration: 3000,
	state: types.ERROR_STATE,
	title: types.ERROR_TITLE,
	subtitle: i18next.t('Please select products to generate label'),
};

const breadCrumbList = [
	{
		id: 1,
		linkTitle: 'Dashboard',
		link: RouteNames.dashboard.path,
	},
	{
		id: 2,
		linkTitle: 'Labels',
		link: '/labels',
	},
];

const LabelManagement = () => {
	const [label_data, set_label_data] = useState<any>([]);
	const [is_drawer_open, set_drawer_open] = useState(false);
	const [selected_label, set_selected_label] = useState<string>('');
	const [selected_label_limit, set_selected_label_limit] = useState({ limit: 0, show_limit: false });
	const [show_modal, set_show_modal] = useState(false);
	const [modal_data, set_modal_data] = useState({});
	const [selected_row, set_selected_row] = useState<string[]>([]);
	const [btn_loading, set_btn_loading] = useState(false);
	const classes = useStyles();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const catalog_id = useSelector((state: any) => state.buyer.catalog.value) || '';
	const tenant_id = useSelector((state: any) => state?.login?.userDetails?.tenant_id);
	const theme: any = useTheme();

	useEffect(() => {
		api_requests.labels
			.get_temeplates()
			.then((res: any) => {
				let data = res?.data?.url;
				let updated_data = _.map(data, (ele) => ({
					...ele,
					limit: label_constants?.[ele?.id] !== undefined ? label_constants?.[ele?.id] : label_constants?.DEFAULT_LIMIT,
				}));
				let result;
				if (_.includes(['f99a9533-4fc0-4b2d-868c-4c3857a2a084', '82629c09-697e-42b0-9cf5-932b26d71bbc'], tenant_id)) {
					result = updated_data.filter((item) =>
						_.includes(['b3812db8-0287-402c-8387-82eb5042b92f', '487b76ec-7efb-4710-ba69-4cd746747925'], item.id),
					);
				} else {
					result = updated_data;
				}

				set_label_data(result);
			})
			.catch((err) => {
				console.error(err);
			});

		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	useEffect(() => {
		const defaultItem: any = label_data?.find((item: any) => item.is_default);
		set_selected_label(defaultItem?.id);
	}, [label_data]);

	const handleTempleteChange = (id: any) => {
		let limit_data = _.find(label_data, (item) => item?.id === id);
		if (selected_row?.length > limit_data?.limit) {
			set_selected_label_limit({ limit: limit_data?.limit, show_limit: true });
		} else {
			set_selected_label_limit({ limit: limit_data?.limit, show_limit: false });
		}
		set_selected_label(id);
	};

	const handlePreview = (data: any) => {
		set_show_modal(true);
		set_modal_data(data);
	};

	const handle_close = () => {
		set_drawer_open(false);
		set_selected_label('');
		set_selected_label_limit({ show_limit: false });
	};

	const downloadPdf = async () => {
		set_btn_loading(true);

		if (!selected_row.length) {
			set_btn_loading(false);
			handle_close();
			dispatch(show_toast(no_product_selected));
			return;
		}

		let payload = {
			product_ids: selected_row,
			template_id: selected_label,
			catalog_ids: catalog_id === '' ? [] : [catalog_id],
		};

		dispatch(show_toast(download_start_messsage));
		api_requests.labels
			.post_Pdf(payload)
			.then((res: any) => {
				if (res?.status === 200) {
					dispatch(set_notification_feedback(true));
					set_btn_loading(false);
					handle_close();
				}
			})
			.catch((err) => {
				console.error('Error:', err);
				set_btn_loading(false);
				dispatch(show_toast(download_error_messsage));
			});
	};

	const drawerContent = () => {
		return (
			<Box className={classes.drawerContent}>
				<Box className={classes.header}>
					<CustomText type='H2'>{t('LabelManagement.Main.ChangeTemplate')}</CustomText>
				</Box>
				<Box pl={2}>
					<CustomText type='Body'>{t('LabelManagement.Main.ShowingTemplates', { count: label_data?.length })}</CustomText>
				</Box>
				{/* Body (Scrollable) */}
				<Box pl={2} mt={1} className={classes.scrollableContent}>
					<div className={classes.scrollableBody}>
						{label_data?.map((item: any, index: number) => (
							<Box
								mt={index === 0 ? 0 : 1.2}
								key={item.id}
								onClick={() => handleTempleteChange(item.id)}
								sx={{
									border: selected_label === item.id ? theme?.label?.drawer_content?.border1 : theme?.label?.drawer_content?.border2,
									borderRadius: '10px',
									cursor: 'pointer',
									maxWidth: '425px',
								}}>
								<QRTemplate
									data={item}
									onClickPreview={(data: any) => {
										handlePreview(data);
									}}
								/>
							</Box>
						))}
					</div>
				</Box>
				{/* Footer */}

				<Divider />
				<Box
					className={selected_row?.length === 0 ? classes.buttonsContainer_only : classes.buttonsContainer}
					sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					{selected_row?.length > 0 && !selected_label_limit?.show_limit && (
						<Grid className={classes.allowed}>
							<CustomText type='Body' color={theme?.label?.label_management?.color}>
								{`${selected_row?.length} products selected`}
							</CustomText>
						</Grid>
					)}

					{selected_label_limit?.show_limit && (
						<Grid className={classes.not_allowed}>
							<CustomText type='Body' color={theme?.label?.label_management?.color}>
								{`Select less than ${selected_label_limit?.limit} products`}
							</CustomText>
						</Grid>
					)}
					<Grid display='flex' gap={2}>
						<Button onClick={handle_close} variant='outlined'>
							{t('LabelManagement.Main.Cancel')}
						</Button>

						<Button
							loading={btn_loading}
							disabled={!selected_label || selected_label_limit?.show_limit}
							onClick={downloadPdf}
							variant='contained'>
							{t('LabelManagement.Main.Confirm')}
						</Button>
					</Grid>
				</Box>
			</Box>
		);
	};

	return (
		<ManageColumnsProvider>
			<Box>
				<Table selected_row={selected_row} set_selected_row={set_selected_row} set_drawer_open={set_drawer_open} />
			</Box>
			{is_drawer_open && (
				<Drawer onClose={handle_close} width={460} content={drawerContent()} anchor='right' open={is_drawer_open}></Drawer>
			)}
			{show_modal && <TemplateModal show_modal={show_modal} data={modal_data} set_show_modal={set_show_modal} />}
		</ManageColumnsProvider>
	);
};

export default LabelManagement;
