import { useState } from 'react';
import { attempt, isEmpty, isError } from 'lodash';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/utils/theme';
import { ErrorModalProps } from 'src/@types/common_types';
import { Box, Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import { close_toast, show_toast } from 'src/actions/message';
import { set_error_modal_data } from 'src/actions/errorModal';
import { useErrorModalStyles } from './styles';
import types from 'src/utils/types';
import CustomText from '../@the-source/CustomText';

const AddCardErrorModal: React.FC<ErrorModalProps> = ({ modal_data }) => {
	const [show_response, set_show_response] = useState<boolean>(false);
	const { subtitle = '', is_modal_visible = false, reason = null } = modal_data || {};
	const classes = useErrorModalStyles();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const result = attempt(() => JSON.stringify(reason));
	const stringified_reason = !isError(result) ? result : null;

	const handle_close_modal = () => {
		const reset_state = {
			is_modal_visible: false,
			subtitle: null,
			reason: null,
		};
		dispatch(set_error_modal_data(reset_state));
	};

	const handle_copy_response = async () => {
		try {
			if (!stringified_reason) {
				throw new Error('Error copying reason');
			}
			await navigator.clipboard.writeText(stringified_reason);
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_event: React.ChangeEvent<HTMLInputElement>, click_reason: String) => {
						if (click_reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.SUCCESS_STATE,
					title: t('Common.Common.CopiedToClipboard'),
					subtitle: '',
					showActions: false,
				}),
			);
		} catch (error) {
			console.error('Error copying reason', error);
		}
	};

	const render_content = (
		<Grid container width='100%'>
			<Grid item>
				<Box display='flex' alignItems='center' gap={1.5}>
					<Icon iconName='IconAlertTriangleFilled' color={colors.red} />
					<CustomText type='Title'>
						{subtitle ?? subtitle}
						{reason && !isEmpty(reason) && !show_response && (
							<span className={classes.view_response_text} onClick={() => set_show_response(true)}>
								{t('Common.AddCardErrorModal.ViewResponse')}
							</span>
						)}
					</CustomText>
				</Box>
			</Grid>
			<Grid item>
				{show_response && stringified_reason && (
					<Box p={1}>
						<pre className={classes.reason_text}>{stringified_reason}</pre>
						<CustomText type='Subtitle' color={colors.primary_500} onClick={handle_copy_response} className={classes.copy_response_text}>
							{t('Common.AddCardErrorModal.CopyResponse')}
						</CustomText>
					</Box>
				)}
			</Grid>
		</Grid>
	);

	const render_footer = (
		<Grid container justifyContent='flex-end' spacing={2}>
			<Grid item>
				<Button onClick={handle_close_modal} variant='contained'>
					{t('Common.AddCardErrorModal.Okay')}
				</Button>
			</Grid>
		</Grid>
	);

	return (
		<Modal
			open={is_modal_visible}
			onClose={handle_close_modal}
			title={t('Common.AddCardErrorModal.Title')}
			children={render_content}
			footer={render_footer}
		/>
	);
};

export default AddCardErrorModal;
