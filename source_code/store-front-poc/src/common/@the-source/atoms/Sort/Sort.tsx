import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '../Grid';
import Icon from '../Icon/Icon';
import Menu from 'src/common/Menu';
import { MenuProps } from '@mui/material';
import { Mixpanel } from 'src/mixpanel';
import _ from 'lodash';
import { get_customer_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';

type SelectBaseProps = Pick<MuiSelectProps, 'onChange' | 'IconComponent' | 'value' | 'defaultValue' | 'size' | 'autoWidth'>;

export interface SortProps extends SelectBaseProps {
	options: SortOptionProps[];
	onChange: (value: any) => any;
	style?: any;
	defaultSort: any;
	name?: any;
	fullWidth?: boolean;
	showIcon?: boolean;
	parent?: boolean;
	onlyOnChange?: (value: any) => any;
}

export interface SortOptionProps {
	label: string;
	key: any;
	is_default?: boolean;
}

const Sort = ({
	options,
	size,
	defaultSort,
	name,
	fullWidth,
	onChange,
	onlyOnChange = () => {},
	autoWidth,
	style,
	showIcon = false,
	parent = false,
	...rest
}: SortProps) => {
	const sortBox = {
		width: fullWidth ? '100%' : 'auto',
		height: size === 'small' ? '3.15em' : '3.5em',
		fontSize: '1.4rem',
		minWidth: '220px',
	};
	const [option, setOption] = useState(defaultSort);
	const [selectedValues, setSelectedValues] = useState<string | undefined>('');
	const [value, setValue] = useState<boolean>(false);
	const theme: any = useTheme();

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const get_page_name = (path: string) => {
		switch (true) {
			case _.includes(path, 'collection/products'):
				return 'collection_product_listing_page';
			case _.includes(path, 'category/products'):
				return 'category_product_listing_page';
			case _.includes(path, 'recommend'):
				return 'products_reco_listing_page';
			case _.includes(path, 'all-products/search'):
				return 'product_search_page';
			case _.includes(path, 'product-details'):
				return 'product_details_page';
			default:
				return 'all_products_page';
		}
	};
	const page_name = get_page_name(window.location.pathname);
	const handleSelectChange = (event: any) => {
		setOption(event?.target?.value as string);
		const _values = event?.target?.value?.split('*');
		const head = _.head(_values);
		const first = _.nth(_values, 1);
		onChange(options?.find((o) => o?.key?.field === head && o?.key?.order === first)?.key);
		onlyOnChange(options?.find((o) => o?.key?.field === head && o?.key?.order === first)?.key);
		const selectedValueName = options?.find((o) => o?.key?.field === head && o?.key?.order === first);
		setSelectedValues(selectedValueName?.label);
		Mixpanel.track(Events.SORT_OPTION_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name:
				page_name === 'all_products_page'
					? 'explore_all'
					: page_name === 'product_details_page'
					? 'variants_listing_side_&_bottom_sheet'
					: '',
			subtab_name: '',
			customer_metadata,
			option_clicked: selectedValueName?.label || '',
		});
	};
	const sortIcon = (props: any) => (
		<Icon
			id={'sorting-icon'}
			{...props}
			iconName='IconSortDescending'
			color={theme?.palette?.secondary?.[800]}
			sx={{ width: '20px', height: '20px', cursor: 'pointer' }}
		/>
	);

	useEffect(() => {
		setOption(defaultSort as string);
		const _values = defaultSort?.split('*');
		onChange(options?.find((o) => o?.key?.field === _values[0] && o?.key?.order === _values[1])?.key);
		const selectedValueName = options?.find((o) => o?.key?.field === _values[0] && o?.key?.order === _values[1]);
		setSelectedValues(selectedValueName?.label);
	}, [defaultSort]);

	const handleClick = (data: any) => {
		onChange(options.find((o) => o?.key?.field === data?.key?.field && o?.key?.order === data?.key?.order)?.key);
	};

	if (parent) {
		return (
			<Grid>
				<Menu
					setValue={setValue}
					position={'right'}
					LabelComponent={
						<Grid
							border={value ? theme?.product?.filter?.sort?.border_active : theme?.product?.filter?.sort?.border}
							p={0.9}
							borderRadius={0.8}
							display={'flex'}
							alignItems={'center'}
							justifyContent={'center'}
							sx={{
								cursor: 'pointer',
								...theme?.product?.filter?.sort?.menu,
							}}>
							<Icon iconName='IconSortDescending' color={theme?.palette?.secondary?.[800]} sx={{ width: '24px', height: '24px' }} />
						</Grid>
					}
					closeOnItemClick={true}
					commonMenuOnClickHandler={(data: any) => {
						handleClick(data);
					}}
					commonMenuComponent={(_item: any) => {
						return <div>{_item?.label}</div>;
					}}
					menu={options?.map((o: any) => ({ ...o, id: `${o?.key.field}*${o?.key.order}` }))}
					selectedId={defaultSort}
				/>
			</Grid>
		);
	}

	return (
		<Select
			value={option}
			onChange={handleSelectChange}
			defaultValue={defaultSort}
			autoWidth={autoWidth}
			size={size}
			startAdornment={showIcon && <Icon iconName='IconSortDescending' color={theme?.palette?.secondary?.[800]} />}
			IconComponent={!showIcon ? sortIcon : undefined}
			name={name}
			renderValue={() => <Grid>{!showIcon && `Sort By: ${selectedValues}`}</Grid>}
			sx={{
				...sortBox,
				...theme?.product?.filter?.sort?.container,
				'& .MuiOutlinedInput-notchedOutline': {
					border: theme?.product?.filter?.sort?.border,
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					border: theme?.product?.filter?.sort?.border,
				},
			}}
			style={style}
			MenuProps={
				{
					PaperProps: {
						style: {
							maxHeight: 350,
							width: 240,
							borderRadius: theme?.dropdown_border_radius?.borderRadius,
						},
						sx: {
							'& ul': {
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
							},
						},
					},
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left',
					},
					getContentAnchorEl: null,
				} as Partial<MenuProps>
			}
			{...rest}>
			{options?.map(
				(item: any): JSX.Element => (
					<MenuItem
						key={`${item?.key.field}*${item?.key.order}`}
						value={`${item?.key.field}*${item?.key.order}`}
						sx={{ background: 'none' }}>
						{item?.label}
					</MenuItem>
				),
			)}
		</Select>
	);
};

Sort.defaultProps = {
	disabled: false,
	displayEmpty: false,
	name: 'sort',
	fullWidth: false,
	size: 'medium',
	autoWidth: false,
};
export default Sort;
