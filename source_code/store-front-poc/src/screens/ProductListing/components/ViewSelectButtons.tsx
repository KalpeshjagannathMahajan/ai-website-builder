import { t } from 'i18next';
import { Button, Icon } from 'src/common/@the-source/atoms';
import { custom_stepper_text_color, secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';

const ViewSelectButtons = ({ product, on_view, on_select, selected }: any) => {
	return (
		<>
			<Button
				id={`view_details_${product?.id}`}
				variant='outlined'
				fullWidth
				onClick={on_view}
				sx={{
					border: `1px solid ${secondary[400]}`,
					color: custom_stepper_text_color.grey,
					flex: 1,
				}}>
				{t('ProductList.Main.View')}
			</Button>

			<Button
				id={`select_${product?.id}`}
				tonal={selected}
				variant={selected ? 'contained' : 'outlined'}
				fullWidth
				onClick={on_select}
				sx={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					flex: 1,
				}}>
				{selected ? (
					<>
						<Icon iconName='check' color={colors.primary_500} sx={{ marginRight: '0.6rem', width: '20px' }} />
						Selected
					</>
				) : (
					'Select'
				)}
			</Button>
		</>
	);
};

export default ViewSelectButtons;
