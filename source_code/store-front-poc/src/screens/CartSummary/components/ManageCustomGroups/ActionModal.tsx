import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionModalProps, Group } from 'src/@types/manage_custom_groups';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Input, Modal } from 'src/common/@the-source/atoms';
import constants from 'src/utils/constants';
import { colors } from 'src/utils/theme';

const { ADD, EDIT, DELETE } = constants.CART_GROUPING_KEYS.ACTION_MODAL_MODES;

const ActionModal: React.FC<ActionModalProps> = ({
	groups,
	mode,
	current_group,
	is_action_modal,
	set_groups,
	set_is_action_modal,
	handle_delete_group,
}) => {
	const [input_value, set_input_value] = useState<string | null>(current_group?.base_name || null);
	const { t } = useTranslation();

	const handle_close_modal = () => {
		set_is_action_modal(false);
		set_input_value(null);
	};

	const get_action_btn_text = () => {
		switch (mode) {
			case ADD:
			case EDIT:
				return t('CartSummary.ManageCustomGroups.Save');
			case DELETE:
				return t('CartSummary.ManageCustomGroups.Delete');
			default:
				return t('CartSummary.ManageCustomGroups.Save');
		}
	};

	const check_duplicate_group_name = useMemo(() => {
		return _.some(
			groups,
			(group) => group?.base_name?.toLowerCase() === input_value?.trim()?.toLowerCase() && group?.id !== current_group?.id,
		);
	}, [input_value]);

	const handle_action = () => {
		const sanitized_input_value = input_value?.trim() || '';
		switch (mode) {
			case ADD:
				if (!sanitized_input_value || check_duplicate_group_name) return;
				const new_group: Group = {
					id: `group-${Date.now()}`,
					base_name: sanitized_input_value,
					products: [],
				};
				set_groups((prev: Group[]) => [...prev, new_group]);
				handle_close_modal();
				break;
			case EDIT:
				if (!sanitized_input_value || check_duplicate_group_name || !current_group) return;
				const edited_group = {
					...current_group,
					base_name: sanitized_input_value,
				};
				const current_group_index: number = _.findIndex(groups, { id: current_group?.id });
				if (current_group_index !== -1) {
					const new_groups: Group[] = [...groups];
					new_groups[current_group_index] = edited_group;
					set_groups(new_groups);
				}
				handle_close_modal();
				break;
			case DELETE:
				if (!current_group) return;
				handle_delete_group(current_group?.id);
				handle_close_modal();
				break;
			default:
				break;
		}
	};

	const get_helper_text = useMemo(() => {
		return check_duplicate_group_name ? (
			<CustomText type='Caption' color={colors.red}>
				{t('CartSummary.ManageCustomGroups.DuplicateGroupNameWarning')}
			</CustomText>
		) : (
			''
		);
	}, [input_value, check_duplicate_group_name]);

	const add_or_edit_content = (
		<Input
			value={input_value}
			onChange={(e) => set_input_value(e?.target?.value)}
			children={undefined}
			label={t('CartSummary.ManageCustomGroups.GroupName')}
			variant='outlined'
			sx={{ width: '100%' }}
			size='small'
			error={check_duplicate_group_name}
			helperText={get_helper_text}
			required
			autoFocus
		/>
	);

	const delete_content = <CustomText type='Body2'>{t('CartSummary.ManageCustomGroups.DeleteGroupConfirmation')}</CustomText>;

	const content_map = {
		[ADD]: add_or_edit_content,
		[EDIT]: add_or_edit_content,
		[DELETE]: delete_content,
	};

	const title_map = {
		[EDIT]: t('CartSummary.ManageCustomGroups.EditGroup'),
		[DELETE]: t('CartSummary.ManageCustomGroups.DeleteGroup'),
		[ADD]: t('CartSummary.ManageCustomGroups.AddGroup'),
	};

	const render_content = (
		<Grid id='custom-group-action-content' item pt={2} pb={2}>
			{content_map[mode] || content_map[ADD]}
		</Grid>
	);

	const render_footer = (
		<Grid id='custom-group-action-modal-footer' container justifyContent='flex-end' spacing={2}>
			<Grid item>
				<Button onClick={handle_close_modal} variant='outlined'>
					{t('CartSummary.ManageCustomGroups.Cancel')}
				</Button>
			</Grid>
			<Grid item>
				<Button
					disabled={mode !== DELETE && !input_value}
					onClick={handle_action}
					variant='contained'
					color={mode === DELETE ? 'error' : 'primary'}>
					{get_action_btn_text()}
				</Button>
			</Grid>
		</Grid>
	);

	return (
		<Modal
			open={is_action_modal}
			onClose={handle_close_modal}
			title={title_map[mode] || title_map[ADD]}
			width={500}
			children={render_content}
			footer={render_footer}
		/>
	);
};

export default ActionModal;
