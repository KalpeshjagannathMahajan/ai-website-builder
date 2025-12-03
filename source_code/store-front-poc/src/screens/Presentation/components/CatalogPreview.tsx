import { useMemo, useState } from 'react';
import { get, includes, isEmpty } from 'lodash';
import { Box, Slide } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import PdfViewer from 'src/screens/UserDrive/components/PdfViewer';
import { colors } from 'src/utils/theme';
import Menu from 'src/common/Menu';
import { secondary } from 'src/utils/light.theme';
import { CatalogPreviewProps } from 'src/@types/presentation';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { ACTION_KEYS, DISABLED_STATUS, FAILED_STATUS, NOT_GENERATED } from '../constants';
import { set_is_edit_fetched } from 'src/actions/catalog_mode';
import { useTranslation } from 'react-i18next';
import { useStyles } from './themes/CatalogPreview.theme';

const disabled_icon = {
	opacity: 0.5,
	cursor: 'not-allowed',
};

export const CatalogPreviewModal = ({
	is_edit_mode,
	open_modal,
	is_submit_loading,
	set_open_modal,
	file_data,
	submit_payload,
	handle_submit_catalog,
	from_listing_page = false,
	max_pages = -1,
	from_review_page = false,
	set_file_to_share,
	set_open_email_modal,
}: CatalogPreviewProps) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [show_file_details_modal, set_show_file_details_modal] = useState(false);
	const preview_title = is_edit_mode && file_data?.name ? file_data?.name : t('Presentation.Preview.PreviewTitle');
	const { handle_download, handle_copy_to_clipboard, handle_navigate_to_edit, handle_regenerate_catalog_pdf, enable_edit_mode } =
		useCatalogActions();
	const pdf_status = get(file_data, 'pdf_status');
	const pdf_link = get(file_data, 'url');
	const show_regenerate = pdf_status === FAILED_STATUS;
	const hide_copy_link = isEmpty(pdf_link) || pdf_status === NOT_GENERATED || pdf_status === FAILED_STATUS;
	const should_disable_download = includes(DISABLED_STATUS, pdf_status);
	const dispatch = useDispatch();

	const menu_options = useMemo(() => {
		if (!open_modal || !file_data) return [];
		const menu = [];
		if (!from_review_page) {
			menu.push({
				id: ACTION_KEYS.EDIT,
				data: {
					label: 'Edit',
					icon: 'IconEdit',
				},
			});
		}
		if (!hide_copy_link)
			menu.push({
				id: ACTION_KEYS.COPY_LINK,
				data: {
					label: 'Copy Link',
					icon: 'IconCopy',
				},
			});

		if (set_open_email_modal && set_file_to_share)
			menu.push({
				id: ACTION_KEYS.MAIL,
				data: {
					label: 'Mail',
					icon: 'IconMail',
				},
			});
		return menu;
	}, [open_modal, file_data, pdf_status, pdf_link]);

	let flag = false;
	const executeClick = (val = false) => {
		if (!flag) {
			flag = true;
			setTimeout(() => {
				set_show_file_details_modal(val);
				flag = false;
			}, 400);
		}
	};
	console.log(show_file_details_modal);

	const handle_generate = () => {
		if (!submit_payload || !handle_submit_catalog) return;
		handle_submit_catalog(submit_payload);
	};

	const handle_download_catalog = () => {
		const download_url = get(file_data, 'url', '');
		handle_download(download_url);
	};

	const handle_menu_item_click = (item: any) => {
		const id = get(item, 'id');
		switch (id) {
			case ACTION_KEYS.EDIT:
				if (!file_data?.id) return;
				dispatch(set_is_edit_fetched(false));
				handle_navigate_to_edit(file_data?.id);
				enable_edit_mode(file_data?.id);
				break;
			case ACTION_KEYS.COPY_LINK:
				handle_copy_to_clipboard(file_data?.url);
				break;
			case ACTION_KEYS.MAIL:
				set_file_to_share([
					{
						fileLink: item?.pdf_link,
						txt: item?.name,
					},
				]);

				set_open_email_modal(true);
				set_open_modal(false);
				break;
			default:
				break;
		}
	};

	return (
		<Slide direction='up' in={open_modal} mountOnEnter unmountOnExit>
			<Box className={classes.preview_box} onClick={() => executeClick(false)}>
				<Box borderRadius={2} className={classes.main_box}>
					<Box className={classes.preview_info}>
						<Grid container direction={'row'} gap={1} alignItems={'center'}>
							<Icon iconName='IconArrowLeft' sx={{ cursor: 'pointer' }} onClick={() => set_open_modal(false)} />
							<CustomText type='H1'>{preview_title}</CustomText>
						</Grid>
						<Icon iconName='IconX' sx={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => set_open_modal(false)} />
					</Box>
					{is_edit_mode && !from_review_page && (
						<Box className={classes.preview_icons}>
							{show_regenerate ? (
								<Icon
									iconName='IconReload'
									className={classes.icon_styles}
									color={secondary[800]}
									onClick={() => handle_regenerate_catalog_pdf(file_data?.id)}
								/>
							) : (
								<Icon
									iconName='IconDownload'
									className={classes.icon_styles}
									sx={{ ...(should_disable_download ? disabled_icon : {}) }}
									color={secondary[800]}
									onClick={should_disable_download ? undefined : handle_download_catalog}
								/>
							)}
							{/* Kept for future release */}
							{/* <Icon 
								iconName='IconMail'
								className={classes.hover_shadow_effect}
								sx={{ ...icon_styles }}
								color={hovered_icon === 'mail' ? secondary['700'] : secondary['600']}
								onMouseEnter={() => {
									set_hovered_icon('mail');
								}}
								onMouseLeave={() => {
									set_hovered_icon(null);
								}}
							/> */}
							<Menu
								hideGreenBorder={true}
								LabelComponent={<Icon iconName='IconDotsVertical' className={classes.icon_styles} color={secondary[800]} />}
								closeOnItemClick={true}
								commonMenuOnClickHandler={(val: any) => handle_menu_item_click(val)}
								commonMenuComponent={(_item: any) => {
									return (
										<Grid display={'flex'} direction={'row'} gap={1} alignItems={'center'}>
											<Icon color={colors.grey_800} sx={{ cursor: 'pointer' }} iconName={_item?.data?.icon} />
											<CustomText>{_item.data.label}</CustomText>
										</Grid>
									);
								}}
								menu={menu_options}
							/>
						</Box>
					)}
					<div className={classes.content_container} id='content-display-cont'>
						{
							<PdfViewer
								max_pages={max_pages}
								file_url={file_data.url}
								width={'100vw'}
								// right_cont={classes.right_cont}
							/>
						}
					</div>
					{!from_listing_page && (
						<Box className={classes.bottom_info}>
							<Box className={classes.product_info}>
								<CustomText type='H6'>{file_data.products}</CustomText>
								<CustomText type='Body'>{t('Presentation.CatalogPreview.Products')}</CustomText>
							</Box>
							<Button onClick={handle_generate} loading={is_submit_loading} variant='contained'>
								{t(is_edit_mode ? 'Presentation.CatalogPreview.UpdateAndGenerate' : 'Presentation.CatalogPreview.CreateAndGenerate')}
							</Button>
						</Box>
					)}
				</Box>
			</Box>
		</Slide>
	);
};
