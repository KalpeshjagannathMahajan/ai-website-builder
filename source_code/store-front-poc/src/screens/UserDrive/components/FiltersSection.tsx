import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { sort_type_filters, time_range_list } from '../utils/constants';
import { useTheme } from '@mui/material/styles';

interface FilterSectionProps {
	created_on_filter: any;
	set_created_on_filter: any;
	file_type: any;
	set_file_type: any;
	sort_by: any;
	set_sort_by: any;
	file_type_facets: any;
}

const useStyles = makeStyles((theme: any) => ({
	box_container: {
		display: 'flex',
		paddingTop: '8px',
		width: '100%',
		backgroundColor: theme?.user_drive?.filter_section?.box_background_color,
		zIndex: '+101',
		position: 'sticky',
		top: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	container: {
		minWidth: '150px',
		display: 'flex',
		paddingTop: '6px',
		paddingBottom: '6px',
		justifyContent: 'space-between',
	},
	label_container: {
		background: theme?.user_drive?.filter_section?.label_background_color,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		gap: '4px',
		cursor: 'pointer',
	},
	red_dot: {
		height: '0.5em',
		width: '0.5em',
		borderRadius: '50%',
		display: 'inline-block',
		marginRight: '0.5em',
		marginBottom: '0.1em',
	},
}));

const CommonMenuComponent = (_item: any) => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<CustomText type='Title'>{_item.data.label}</CustomText>
		</div>
	);
};
export const FilterSection = ({
	created_on_filter,
	set_created_on_filter,
	file_type,
	set_file_type,
	sort_by,
	set_sort_by,
	file_type_facets,
}: FilterSectionProps) => {
	const classes = useStyles();
	const [file_type_filters, set_file_type_filters] = useState<any>(null);
	const [loading, set_loading] = useState<any>(false);
	const theme: any = useTheme();

	function setFacets() {
		if (file_type_facets !== null && file_type_facets !== undefined) {
			let data = Object.values(file_type_facets);
			set_loading(true);
			if (data !== file_type_filters) {
				const allFilesIndex = data?.findIndex((item: any) => item?.id === 'all_files');

				if (allFilesIndex !== -1) {
					data?.unshift(data?.splice(allFilesIndex, 1)[0]);
				}
				set_file_type_filters(data);
			}
		}
	}

	useEffect(() => {
		if (file_type_filters !== null) set_loading(false);
	}, [file_type_filters]);
	useEffect(() => {
		setFacets();
	}, [file_type_facets]);

	return (
		<Box className={classes.box_container}>
			<Grid display='flex' direction='row' gap={1}>
				<Menu
					LabelComponent={
						<div
							className={classes.label_container}
							style={{
								border: !(created_on_filter === null) && !(created_on_filter?.data?.label === 'All time') ? '1px solid #16885f' : '',
								borderRadius: '10px',
							}}>
							{!(created_on_filter === null) && !(created_on_filter?.data?.label === 'All time') && <span className={classes?.red_dot} />}
							<CustomText type='Body2' color={theme?.user_drive?.filter_section?.custom_text_color}>
								{!(created_on_filter === null) && !(created_on_filter?.data?.label === 'All')
									? created_on_filter?.data?.label
									: 'Created on'}
							</CustomText>
							<Icon iconName='IconChevronDown' color={theme?.user_drive?.filter_section?.icon_color} />
						</div>
					}
					closeOnItemClick={true}
					commonMenuOnClickHandler={(val: any) => {
						set_created_on_filter(val);
					}}
					commonMenuComponent={CommonMenuComponent}
					menu={Object.values(time_range_list)}
					selectedId={created_on_filter?.id}
				/>

				{file_type_filters !== null && file_type_filters !== undefined && !loading && (
					<Menu
						LabelComponent={
							<div
								className={classes.label_container}
								style={{
									border: !(file_type === null) && !(file_type?.data?.label === 'All Files') ? '1px solid #16885f' : '',
									borderRadius: '10px',
								}}>
								{!(file_type === null) && !(file_type?.data?.label === 'All Files') && <span className={classes.red_dot} />}
								<CustomText type='Body2' color={theme?.user_drive?.filter_section?.custom_text_color}>
									{!(file_type === null) && !(file_type?.data?.label === 'All') ? file_type?.data?.label : 'All Files'}
								</CustomText>
								<Icon iconName='IconChevronDown' color={theme?.user_drive?.filter_section?.icon_color} />
							</div>
						}
						closeOnItemClick={true}
						commonMenuOnClickHandler={(val: any) => {
							set_file_type(val);
						}}
						commonMenuComponent={CommonMenuComponent}
						menu={file_type_filters}
						selectedId={file_type?.id}
					/>
				)}
			</Grid>

			<Menu
				LabelComponent={
					<div className={classes.label_container}>
						<CustomText type='Body2' color={theme?.user_drive?.filter_section?.custom_text_color}>
							{`Sort by : ${sort_by?.data?.label}`}
						</CustomText>
						<Icon iconName='IconSortDescending' color={theme?.palette?.secondary[800]} />
					</div>
				}
				closeOnItemClick={true}
				commonMenuOnClickHandler={(val: any) => {
					set_sort_by(val);
				}}
				commonMenuComponent={CommonMenuComponent}
				menu={Object.values(sort_type_filters)}
				selectedId={sort_by?.id}
			/>
		</Box>
	);
};
