import { makeStyles } from '@mui/styles';
import { CustomInput, Grid, Sort } from '../../atoms';
import { get_default_sort } from '../FiltersAndChips/helper';
import { useTheme } from '@mui/material/styles';

interface VariantSearchAndSortProps {
	set_search_string: any;
	set_sort: any;
	sort: any;
	sort_data: any;
	search_string: string;
}

const useStyle = makeStyles(() => ({
	container: {
		position: 'sticky',
		top: 0,
		zIndex: 1,
	},
}));

function VariantSearchAndSort({ set_sort, sort, sort_data, set_search_string, search_string }: VariantSearchAndSortProps) {
	const styles = useStyle();
	const theme: any = useTheme();
	return (
		<Grid
			gap={1}
			className={styles.container}
			sx={{
				...theme?.product?.variant_drawer?.container,
				...theme?.product?.variant_drawer?.searchAndSort,
				padding: '8px',
			}}>
			<Grid container spacing={1}>
				<Grid item xs={7.5}>
					<CustomInput
						size='small'
						fullWidth
						variant='filled'
						placeholder='Search variants'
						onChange={(e) => {
							set_search_string(e.target.value);
						}}
						inputType='search'
						defaultValue={search_string}
					/>
				</Grid>
				<Grid item xs={4.5}>
					<Sort
						onChange={(e) => {
							set_sort(e);
						}}
						options={sort_data}
						defaultSort={get_default_sort(sort_data, sort)}
						size='small'
						fullWidth={true}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default VariantSearchAndSort;
