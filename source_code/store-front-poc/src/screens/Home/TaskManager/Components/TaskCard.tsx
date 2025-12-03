/* eslint-disable  @typescript-eslint/no-shadow */
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import truncate from 'lodash/truncate';
import includes from 'lodash/includes';

import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { Icon, Button, Grid, LinearProgressBar } from 'src/common/@the-source/atoms';
import NotificationsApi from 'src/utils/api_requests/notifications';
import { TaskStatus, TaskType, ImportDrawerData, Notification } from 'src/@types/manage_data';
import IconExcel from 'src/assets/images/IconExcel.png';
import IconPdf from 'src/assets/images/icons/iconPdf.svg';
import { taskDismissed } from 'src/actions/notifications';
import moment from 'moment';
import CustomText from 'src/common/@the-source/CustomText';
import utils from 'src/utils/constants';
import useTenantSettings from 'src/hooks/useTenantSettings';

const { BUYER_CUSTOMER_MAP } = utils;
const { BUYERS, CUSTOMERS } = BUYER_CUSTOMER_MAP;

const useStyles = makeStyles(() => ({
	heading_container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '40px',
	},
	buttons_container: {
		display: 'flex',
		gap: '10px',
		alignItems: 'center',
		width: '70%',
	},
	bold: {
		fontWeight: 'bold',
	},
	file_download: {
		background: '#EEF1F7',
		display: 'flex',
		padding: '10px',
		borderRadius: '50px',
		gap: '10px',
	},
}));

interface TaskCardProps {
	isHovered: boolean;
	clicked: boolean;
	handleClicked: () => void;
	setNotificationDrawer: (value: boolean) => void;
	setImportDrawer: (value: boolean) => void;
	setImportDrawerData: (value: ImportDrawerData) => void;
	content: Notification;
}

const get_progress = (content: Notification): number => {
	try {
		return Math.floor(((content.total_count - content.remaining_count) / content.total_count) * 100);
	} catch (error) {
		return 0;
	}
};

const get_progress_import = (content: Notification): number => {
	try {
		const date_now_utc = moment.utc();
		const date_created_utc = moment.utc(moment.utc(content.created_at).toDate()).local();
		const duration = parseInt(content.task_duration) || 1;
		const percent = Math.floor(((date_now_utc - date_created_utc) / duration) * 100);
		return percent > 80 ? 80 : percent;
	} catch (error) {
		return 0;
	}
};

export default function TaskCard({
	isHovered,
	clicked,
	handleClicked,
	setNotificationDrawer,
	setImportDrawer,
	content,
	setImportDrawerData,
}: TaskCardProps) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [cancel_loader, set_cancel_loading] = useState(false);
	const [retry_loader, set_retry_loading] = useState(false);
	const [dismiss_loader, set_dismiss_loading] = useState(false);
	const { integration_type } = useTenantSettings({ integration_type: 'quickbooks' });
	const handleRetry = async () => {
		try {
			set_retry_loading(true);
			await NotificationsApi.notification_action('retry', content.id);
		} catch (error) {
			console.log(error);
		} finally {
			set_retry_loading(false);
		}
	};

	const handleDismiss = async () => {
		try {
			set_dismiss_loading(true);
			await NotificationsApi.notification_action('dismiss', content.id);
			handleClicked();
			setTimeout(() => {
				dispatch(taskDismissed(content.id));
			}, 1000);
		} catch (error) {
			console.log(error);
		} finally {
			set_dismiss_loading(false);
		}
	};

	const handleContinue = () => {
		setImportDrawerData({ entity: content?.entity, taskId: content?.id, sub_entity: content?.meta?.custom_fields?.sub_entity });
		setImportDrawer(true);
		setNotificationDrawer(false);
	};

	const eta_display = () => {
		if (!content.task_duration || content.task_duration === null || content.task_duration === undefined || content.task_duration === '') {
			return;
		}
		const date_now_utc = moment.utc();

		let date_created_utc = null;
		let time_remaining_ms = 0;
		let duration = moment.duration(0);

		try {
			date_created_utc = moment.utc(moment.utc(content.created_at).toDate()).local();
			time_remaining_ms = (parseInt(content.task_duration) || 0) - (date_now_utc - date_created_utc);
			duration = moment.duration(time_remaining_ms, 'milliseconds');
		} catch (error) {
			return;
		}

		return (
			<Grid display='flex' width='100%'>
				<Icon iconName='IconClockHour4' sx={{ color: 'rgba(181, 187, 195, 1)' }} />
				&nbsp;
				{duration.hours() > 0 && (
					<CustomText color='rgba(0, 0, 0, 0.60)' type='Body'>
						{duration.hours()} hours&nbsp;
					</CustomText>
				)}
				{duration.minutes() > 0 && (
					<CustomText type='Body' color='rgba(0, 0, 0, 0.60)'>
						{duration.minutes()} minutes&nbsp;
					</CustomText>
				)}
				<CustomText type='Body' color='rgba(0, 0, 0, 0.60)'>
					{duration.seconds() > 5 ? duration.seconds() : '5'} seconds&nbsp;
				</CustomText>
				<CustomText color='rgba(0, 0, 0, 0.60)' type='Body'>
					remaining
				</CustomText>
			</Grid>
		);
	};

	const handleCancel = async () => {
		try {
			set_cancel_loading(true);
			await NotificationsApi.notification_action('cancel', content.id);
		} catch (error) {
			console.log(error);
		} finally {
			set_cancel_loading(false);
		}
	};

	const handleCross = () => {
		if (isHovered && !clicked) {
			return <Icon color='grey' iconName='IconX' onClick={handleDismiss} sx={{ cursor: 'pointer' }} />;
		}
	};

	const fileName = content.template_name;

	const get_file_type_by_task_type = (task_type: TaskType) => {
		switch (task_type) {
			case TaskType.pdf_download:
				return 'Pdf';
			case TaskType.excel_download:
				return 'Excel';
			default:
				return '';
		}
	};

	const getFileName = (content: any) => {
		switch (content?.entity) {
			case 'products':
				if (content?.task_name === 'pdp' || content?.meta?.pdf_type === 'pdp_tear_sheet') return `Product - ${content?.meta?.sku_id}`;
				return `${content?.meta?.num_of_products} products`;
			case 'cart':
				return `${content?.meta?.num_of_products} products`;
			case 'documents':
				return content?.meta?.system_id;
			case 'payment':
			case 'invoice':
				return content?.meta?.display_id;
			case 'presentation':
				return content?.meta?.presentation_name;
			case 'assets':
				return content?.meta?.original_filename;
			default:
				break;
		}
	};

	const getTemplateName = (content: any) => {
		switch (content?.entity) {
			case 'products':
				if (content?.task_name === 'pdp' || content?.meta?.pdf_type === 'pdp_tear_sheet') return 'Tear Sheet';
				return 'Labels';
			case 'cart':
				return content?.meta?.original_filename;
			case 'documents':
				const file_type = get_file_type_by_task_type(content?.type) || '';
				const doc_type = content?.meta?.pdf_type === 'order_summary' ? 'Order ' : 'Quote ';
				return file_type ? (
					<span>
						<b>{file_type}</b> for <b>{doc_type}</b>
					</span>
				) : (
					<b>{doc_type}</b>
				);

			case 'payment':
				return 'Payment Receipt';
			case 'invoice':
				return 'Payment Invoice';
			case 'presentation':
				return 'Catalog';
			case 'assets':
				return capitalize(content.sub_entity);
			default:
				break;
		}
	};

	const singularize = (word: string): string => {
		const endings = {
			ves: 'fe',
			ies: 'y',
			i: 'us',
			zes: 'ze',
			ses: 's',
			es: 'e',
			s: '',
		};
		for (const [ending, replacement] of Object.entries(endings)) {
			if (word?.endsWith(ending)) {
				return word.slice(0, -ending.length) + replacement;
			}
		}
		return word;
	};

	const pluralize = (word: string) => {
		switch (word) {
			case 'inventory':
				return word;
			default:
				return word?.endsWith('s') || word?.endsWith('es') || word?.endsWith('ies') ? word : `${word}s`;
		}
	};

	const render_body_import_export = () => {
		let entity: string = content?.entity === BUYERS ? CUSTOMERS : content?.entity;
		let sub_entity: string = content?.sub_entity ? content?.sub_entity : content?.meta?.custom_fields?.sub_entity;
		const type = content?.type;

		if (sub_entity === 'basic_information') {
			sub_entity = CUSTOMERS;
		}

		if (entity === 'documents') {
			return <span className={classes.bold}> Order & Quotes</span>;
		}

		if (content.total_count > 1 && sub_entity !== 'volume_pricing') {
			if (sub_entity) {
				entity = singularize(entity);
				sub_entity = pluralize(sub_entity);
			} else {
				entity = pluralize(entity);
			}
		} else {
			entity = singularize(entity);
			sub_entity = singularize(sub_entity);
		}

		sub_entity = sub_entity?.replace(/_/g, ' ');

		if (type === 'export') return <span className={classes.bold}> {sub_entity ? startCase(sub_entity) : startCase(entity)}</span>;

		return <span className={classes.bold}>{get_import_complete_text()}</span>;
	};

	const get_import_in_progess_text = () => {
		let entity: string = content?.entity === BUYERS ? CUSTOMERS : content?.entity;
		let sub_entity: string = content?.sub_entity ? content?.sub_entity : content?.meta?.custom_fields?.sub_entity;
		const count = content?.total_count;

		const cap_sub_entity = startCase(sub_entity?.replace(/_/g, ' '));
		const cap_entity = startCase(entity);

		let message;

		if (sub_entity === 'products') {
			message = `Importing <strong>${count}</strong> <strong>${cap_sub_entity}</strong>`;
		} else if (sub_entity === 'related_products' || sub_entity === 'volume_pricing') {
			message = `Importing <strong>${cap_sub_entity}</strong> for <strong>${count}</strong> <strong>${cap_entity}</strong>`;
		} else if (entity === 'categories' || entity === 'collections') {
			message = `Importing data for <strong>${count}</strong> <strong>${cap_entity}</strong>`;
		} else if (entity === 'inventory') {
			message = `Importing <strong>${cap_entity}</strong> for <strong>${count}</strong> products`;
		} else if (entity === 'customers') {
			message = `Importing <strong>${
				sub_entity === 'basic_information' || sub_entity === 'customers' ? 'data' : `${cap_sub_entity} details`
			}</strong> for <strong>${count}</strong> ${
				sub_entity === 'basic_information' || sub_entity === 'customers' ? 'Customers' : 'customers'
			}`;
		} else if (sub_entity === 'order_quote') {
			message = `Importing data for <strong>${count}</strong> Order & Quotes`;
		} else if (sub_entity === 'order_quote_items') {
			message = `Importing data for <strong>${count}</strong> Order & Quote Items`;
		} else if (sub_entity === 'variant_modifiers') {
			message = `Importing <strong>Modifiers mapping</strong> for <strong>${count}</strong> products`;
		} else if (entity === 'modifiers') {
			message = `Importing data for <strong>${count}</strong> <strong>${cap_entity}</strong>`;
		}
		return <span dangerouslySetInnerHTML={{ __html: message }} />;
	};

	const get_import_complete_text = () => {
		let entity: string = content?.entity === BUYERS ? CUSTOMERS : content?.entity;
		let sub_entity: string = content?.sub_entity ? content?.sub_entity : content?.meta?.custom_fields?.sub_entity;
		const count = content?.total_count;

		const cap_sub_entity = startCase(sub_entity?.replace(/_/g, ' '));
		const cap_entity = startCase(entity);

		let message;

		if (sub_entity === 'products') {
			message = `<strong>${count}</strong> <strong>${cap_sub_entity}</strong> `;
		} else if (sub_entity === 'related_products' || sub_entity === 'volume_pricing') {
			message = `<strong>${cap_sub_entity}</strong> for <strong>${count}</strong> <strong>${cap_entity}</strong> `;
		} else if (entity === 'categories' || entity === 'collections') {
			message = `Data for <strong>${count}</strong> <strong>${cap_entity}</strong> `;
		} else if (entity === 'inventory') {
			message = `<strong>${cap_entity}</strong> for <strong>${count}</strong> products `;
		} else if (entity === 'customers') {
			message = `<strong>${
				sub_entity === 'basic_information' || sub_entity === 'customers' ? 'Data' : `${cap_sub_entity} details`
			}</strong> for <strong>${count}</strong> ${
				sub_entity === 'basic_information' || sub_entity === 'customers' ? 'Customers' : 'customers'
			}`;
		} else if (sub_entity === 'order_quote') {
			message = `Details of <strong>${count}</strong> Order & Quotes `;
		} else if (sub_entity === 'order_quote_items') {
			message = `Details of <strong>${count}</strong> Order & Quote Items `;
		} else if (sub_entity === 'variant_modifiers') {
			message = `<strong>Modifiers mapping</strong> for <strong>${count}</strong> products `;
		} else if (entity === 'modifiers') {
			message = `Data for <strong>${count}</strong> <strong>${cap_entity}</strong> `;
		}

		return <span dangerouslySetInnerHTML={{ __html: message }} />;
	};

	const get_integration_sync_text = () => {
		const subEntityText =
			content?.sub_entity === 'integration_push' ? (
				<>
					<strong>Push</strong> data from <strong>WizCommerce</strong> to <strong>{integration_type}</strong>
				</>
			) : (
				<>
					<strong>Pull</strong> data from <strong>{integration_type}</strong> to <strong>WizCommerce</strong>
				</>
			);

		const messages: { [key in TaskStatus]: string } = {
			[TaskStatus.Started]: 'has started',
			[TaskStatus.InProgress]: 'is in progress',
			[TaskStatus.Completed]: 'completed successfully',
			[TaskStatus.Failed]: 'failed',
			[TaskStatus.Cancelled]: 'cancelled',
			[TaskStatus.Review]: 'in review',
		};

		return (
			<CustomText style={{ color: '#808080' }}>
				{subEntityText} {messages[content.task_status]}
			</CustomText>
		);
	};

	switch (content.type) {
		case TaskType.import:
			switch (content.task_status) {
				case TaskStatus.Review:
					return (
						<>
							<Grid className={classes.heading_container}>
								<Grid>
									<span className={classes.bold}>{capitalize(content.task_status)}</span>
									<span> of </span>
									{render_body_import_export()}
									<span> is pending</span>
								</Grid>
							</Grid>
							<Grid className={classes.buttons_container}>
								<Button onClick={handleContinue} variant='outlined'>
									Continue
								</Button>
								<Button
									loaderSize={'16px'}
									loading={cancel_loader}
									onClick={handleCancel}
									variant='outlined'
									sx={{ color: 'grey' }}
									color={'secondary'}>
									Discard
								</Button>
							</Grid>
						</>
					);
				case TaskStatus.InProgress:
					return (
						<>
							<Grid className={classes.heading_container}>
								<Grid>
									<CustomText style={{ color: '#4F555E' }}>{get_import_in_progess_text()}</CustomText>
								</Grid>
							</Grid>
							<Grid className={classes.buttons_container}>
								<LinearProgressBar value={get_progress_import(content)} variant='determinate' />
								{/*								<Icon color='grey' iconName='IconXboxX' sx={{ cursor: 'pointer' }} onClick={handleCancel} />
								 */}{' '}
							</Grid>
							{eta_display()}

							<Grid container alignItems={'center'} gap={0.5} my={0.5}>
								<Icon color='grey' iconName='IconMail' />
								<CustomText type='Caption' color='grey'>
									Import status will be mailed to you shortly
								</CustomText>
							</Grid>
						</>
					);
				case TaskStatus.Completed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid>
									<CustomText style={{ color: '#4F555E' }}>{get_import_complete_text()} successfully imported</CustomText>
								</Grid>
								{handleCross()}
							</Grid>
							<Grid container alignItems={'center'} gap={0.5} mb={0.5}>
								<Icon color='grey' iconName='IconMail' />
								<CustomText type='Caption' color='grey'>
									Imported file has been mailed to you
								</CustomText>
							</Grid>
						</>
					);
				case TaskStatus.Failed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid>
									<CustomText>{get_import_complete_text()} failed to import</CustomText>
								</Grid>
								{handleCross()}
							</Grid>
							<Grid container alignItems={'center'} gap={0.5} mb={0.5}>
								<Icon color='grey' iconName='IconMail' />
								<CustomText type='Caption' color='grey'>
									Import file has been mailed to you
								</CustomText>
							</Grid>
							<Grid className={classes.buttons_container}>
								<Button loaderSize={'16px'} loading={retry_loader} onClick={handleRetry} variant='outlined'>
									Retry
								</Button>
								<Button
									loaderSize={'16px'}
									loading={dismiss_loader}
									onClick={handleDismiss}
									variant='outlined'
									sx={{ color: 'grey' }}
									color={'secondary'}>
									Dismiss
								</Button>
							</Grid>
						</>
					);
				case TaskStatus.Cancelled:
					return (
						<Grid container className={classes.heading_container}>
							<Grid>
								{render_body_import_export()}
								<span> {content.task_status}</span>
							</Grid>
							{handleCross()}
						</Grid>
					);
				default:
					return null;
			}
			return null;
		case TaskType.export:
			switch (content.task_status) {
				case TaskStatus.InProgress:
					return (
						<>
							<Grid className={classes.heading_container}>
								<Grid>
									<CustomText style={{ color: '#4F555E' }}>
										<b>Export</b> of {render_body_import_export()} in progress
									</CustomText>
								</Grid>
							</Grid>
							{content.remaining_count <= 0 ? (
								<Grid className={classes.buttons_container}>
									<Grid className={classes.file_download}>
										<CircularProgressBar size={20} />
										<span style={{ color: 'black' }}>{fileName}</span>
									</Grid>
								</Grid>
							) : (
								<Grid className={classes.buttons_container}>
									<LinearProgressBar value={get_progress(content)} variant='determinate' />
									{/* <Icon color='grey' iconName='IconXboxX' sx={{ cursor: 'pointer' }} onClick={handleCancel} /> */}
								</Grid>
							)}
							{eta_display()}
							{content?.entity !== 'insights' && (
								<Grid container alignItems={'center'} gap={0.5} my={0.5}>
									<Icon color='grey' iconName='IconMail' />
									<CustomText type='Caption' color='grey'>
										Exported file will be mailed to you shortly
									</CustomText>
								</Grid>
							)}
						</>
					);
				case TaskStatus.Failed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid>
									<CustomText style={{ color: '#4F555E' }}>
										<b>{render_body_import_export()}</b> file export has failed
									</CustomText>
								</Grid>
								{handleCross()}
							</Grid>
							{content?.entity !== 'insights' && (
								<Grid container alignItems={'center'} gap={0.5} my={0.5}>
									<Icon color='grey' iconName='IconMail' />
									<CustomText type='Caption' color='grey'>
										Exported file will be mailed to you shortly
									</CustomText>
								</Grid>
							)}
							<Grid className={classes.buttons_container}>
								<Button loaderSize={'16px'} loading={retry_loader} onClick={handleRetry} variant='outlined'>
									Retry
								</Button>
								<Button
									loaderSize={'16px'}
									loading={dismiss_loader}
									onClick={handleDismiss}
									variant='outlined'
									sx={{ color: 'grey' }}
									color={'secondary'}>
									Dismiss
								</Button>
							</Grid>
						</>
					);
				case TaskStatus.Cancelled:
					return (
						<Grid container className={classes.heading_container}>
							<Grid>
								<span className={classes.bold}>Download</span>
								<span> of </span>
								{render_body_import_export()}
								<span> {content.task_status}</span>
							</Grid>
							{handleCross()}
						</Grid>
					);
				case TaskStatus.Completed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid>
									<CustomText style={{ color: '#4F555E' }}>{render_body_import_export()} file was exported successfully</CustomText>
								</Grid>
								{handleCross()}
							</Grid>
							<Grid className={classes.buttons_container}>
								<a style={{ textDecoration: 'none' }} href={content.download_link}>
									<Grid className={classes.file_download}>
										<img src={IconExcel} alt='' />
										<span style={{ color: 'black' }}>{fileName}</span>
										<Icon color='grey' iconName='IconDownload' sx={{ cursor: 'pointer' }} />
									</Grid>
								</a>
							</Grid>
							{content?.entity !== 'insights' && (
								<Grid container alignItems={'center'} gap={0.5} my={0.5}>
									<Icon color='grey' iconName='IconMail' />
									<CustomText type='Caption' color='grey'>
										Exported file has been mailed to you.{' '}
									</CustomText>
								</Grid>
							)}
						</>
					);
				default:
					return null;
			}
			return null;
		case TaskType.excel_download:
		case TaskType.pdf_download:
			switch (content.task_status) {
				case TaskStatus.InProgress:
					return (
						<>
							<Grid className={classes.heading_container}>
								<Grid>
									<span className={classes.bold}>Download</span>
									<span> of </span>
									<span className={content?.entity === 'documents' ? '' : classes.bold}>{getTemplateName(content)}</span>
									{content?.entity !== 'documents' && <span> for </span>}
									<span className={classes.bold}>{getFileName(content)}</span>
									<span> in progress</span>
								</Grid>
							</Grid>
							<Grid className={classes.buttons_container}>
								<Grid className={classes.file_download}>
									<CircularProgressBar size={20} />
									<span style={{ color: 'black' }}>{truncate(fileName, { length: 25 })}</span>
								</Grid>
							</Grid>
							{eta_display()}
						</>
					);
				case TaskStatus.Failed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid xs={11}>
									<span> Download of </span>
									<span className={content?.entity === 'documents' ? '' : classes.bold}>{getTemplateName(content)}</span>
									{content?.entity !== 'documents' && <span> for </span>} <span className={classes.bold}>{getFileName(content)}</span>
									<span> failed</span>
								</Grid>
								<Grid xs={1}>{handleCross()}</Grid>
							</Grid>
							<Grid mt={0.4} className={classes.buttons_container}>
								<Button loaderSize={'16px'} loading={retry_loader} onClick={handleRetry} variant='outlined'>
									Retry
								</Button>
								<Button
									loaderSize={'16px'}
									loading={dismiss_loader}
									onClick={handleDismiss}
									variant='outlined'
									sx={{ color: 'grey' }}
									color={'secondary'}>
									Dismiss
								</Button>
							</Grid>
						</>
					);
				case TaskStatus.Cancelled:
					return (
						<Grid container className={classes.heading_container}>
							<Grid xs={11}>
								<span> Download of </span>
								<span className={content?.entity === 'documents' ? '' : classes.bold}>{getTemplateName(content)}</span>
								{content?.entity !== 'documents' && <span> for </span>} <span className={classes.bold}>{getFileName(content)}</span>
								<span> cancelled </span>
							</Grid>
							<Grid xs={1}>{handleCross()}</Grid>
						</Grid>
					);
				case TaskStatus.Completed:
					return (
						<>
							<Grid container className={classes.heading_container}>
								<Grid xs={11}>
									<span className={content?.entity === 'documents' ? '' : classes.bold}>{getTemplateName(content)}</span>
									{content?.entity !== 'documents' && <span> for </span>} <span className={classes.bold}>{getFileName(content)}</span>
									<span> is ready</span>
								</Grid>
								<Grid xs={1}>{handleCross()}</Grid>
							</Grid>
							<Grid mt={0.4} className={classes.buttons_container}>
								<a style={{ textDecoration: 'none' }} href={content.download_link} target='_blank'>
									<Grid className={classes.file_download}>
										<img src={content.type === TaskType.pdf_download ? IconPdf : IconExcel} alt='' />
										<span style={{ color: 'black' }}>{truncate(fileName, { length: 25 })}</span>
										<Icon color='grey' iconName='IconDownload' sx={{ cursor: 'pointer' }} />
									</Grid>
								</a>
							</Grid>
						</>
					);
				default:
					return null;
			}
		case TaskType.integration_sync:
			const is_completed = includes([TaskStatus.Failed, TaskStatus.Cancelled, TaskStatus.Completed], content?.task_status);
			const is_in_progress = includes([TaskStatus.InProgress, TaskStatus.Started], content?.task_status);
			return (
				<>
					<Grid className={classes.heading_container}>
						<Grid>{get_integration_sync_text()}</Grid>
						{is_completed && <Grid xs={1}>{handleCross()}</Grid>}
					</Grid>
					{is_in_progress && (
						<Grid className={classes.buttons_container}>
							<LinearProgressBar value={get_progress_import(content)} variant='determinate' />
						</Grid>
					)}
				</>
			);
		default:
			return null;
	}
}
