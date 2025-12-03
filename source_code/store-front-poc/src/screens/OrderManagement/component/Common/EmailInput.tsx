import { t } from 'i18next';
import { FormProvider } from 'react-hook-form';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import SearchSelect from 'src/common/@the-source/atoms/FieldsNew/SearchSelectEditField';
import { get_validators } from 'src/common/OneColumnForms/helper';
import { primary, text_colors } from 'src/utils/light.theme';

const iconStyle = {
	color: primary?.main,
	cursor: 'pointer',
};

const iconDisableStyle = {
	color: text_colors.disabled,
};

function EmailInput({ methods, query, set_query, set_error, handle_click, error, selected_emails, label }: any) {
	const check_disable = () => {
		return !query || error || selected_emails?.includes(query);
	};

	return (
		<Grid display='flex'>
			<Grid flex={1}>
				<FormProvider {...methods}>
					<SearchSelect
						label={label ? label : 'Add email'}
						value={query}
						name='email'
						type='email'
						setTextValue={set_query}
						setErrorState={set_error}
						handleChange={(value: any) => set_query(value)}
						options={[]}
						validations={{ ...get_validators('email', false, 'email'), val: true }}
						onKeyDown={handle_click}
					/>
				</FormProvider>
			</Grid>
			<Button
				sx={{ alignSelf: 'flex-start', marginTop: '12px' }}
				size='small'
				disabled={check_disable()}
				variant='text'
				onClick={() => handle_click(query)}
				startIcon={<Icon sx={check_disable() ? iconDisableStyle : iconStyle} iconName='IconPlus' />}>
				{t('OrderManagement.SendMailDrawer.AddEmail')}
			</Button>
		</Grid>
	);
}

export default EmailInput;
