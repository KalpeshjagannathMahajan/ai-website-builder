import size from 'lodash/size';
import { t } from 'i18next';
import { Checkbox, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

const SelectAll = ({ files, selected_files, update_selected_files, handle_clear_file_selections }: any) => {
	const isCompleteSelection = size(files) === size(selected_files);
	const isPartialSelection = size(selected_files) > 0 && size(selected_files) < size(files);

	const handleSelectAllCheckbox = () => {
		if (isPartialSelection || size(selected_files) === 0) {
			update_selected_files();
		} else {
			handle_clear_file_selections();
		}
	};

	return (
		size(files) > 0 && (
			<Grid sx={{ display: 'flex', alignItems: 'center' }}>
				<Checkbox checked={isCompleteSelection} indeterminate={isPartialSelection} onChange={handleSelectAllCheckbox} />
				<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.6)'>
					{t('Common.VariantDrawer.SelectAll')}
				</CustomText>
			</Grid>
		)
	);
};

export default SelectAll;
