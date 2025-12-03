import { memo } from 'react';
import { makeStyles } from '@mui/styles';
import { Icon, Typography } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
	container: {
		// width: '150px',
		display: 'flex',
		paddingTop: '6px',
		paddingBottom: '6px',
		justifyContent: 'space-between',
	},
	label_container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		gap: '4px',
		cursor: 'pointer',
	},
	redDot: {
		height: '7px',
		width: '7px',
		borderRadius: '50%',
		display: 'inline-block',
		marginRight: '0.5em',
	},
}));

interface SalesRepTempProps {
	selectedRep: any;
	handleSelectRep: any;
	repList: any;
}

const SalesRepTemp = ({ selectedRep, handleSelectRep, repList }: SalesRepTempProps) => {
	const theme: any = useTheme();
	const classes = useStyles();

	const createRepListMenu = (sales_rep_list: any) => {
		const menu = _.map(sales_rep_list, (item) => {
			const id = _.get(item, 'reference_id');
			return { ...item, id };
		});
		menu.unshift({ name: 'All Sales Rep', id: '', reference_id: '' });
		return menu;
	};
	const menu = createRepListMenu(repList);
	return (
		<Menu
			LabelComponent={
				<div
					className={classes.label_container}
					onClick={() => {}}
					style={{
						background: theme?.dashboard?.sales_rep?.label_container?.background,
						border: selectedRep.id !== '' ? theme?.dashboard?.sales_rep?.label_container?.border : 'none',
					}}>
					{selectedRep.id !== '' && (
						<span className={classes.redDot} style={{ background: theme?.dashboard?.sales_rep?.red_dot?.background }} />
					)}
					<Typography
						color={theme?.dashboard?.sales_rep?.typography?.color}
						sx={{ fontWeight: selectedRep.id !== '' ? 700 : 400, fontSize: '14px' }}>
						{selectedRep.name}
					</Typography>
					<Icon iconName='IconChevronDown' color={theme?.dashboard?.sales_rep?.icon?.color} />
				</div>
			}
			closeOnItemClick={true}
			commonMenuOnClickHandler={(data: any) => {
				handleSelectRep(data);
			}}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.container}>
						<Typography sx={{ fontWeight: 400, fontSize: '16px' }} color={theme?.palette?.colors?.black_8}>
							{_item?.name}
						</Typography>
					</div>
				);
			}}
			// menu={[{ name: 'All Sales Rep', id: '' }, ...repList.map((item: any) => ({ ...item, id: item.reference_id }))]}
			menu={menu}
			hideGreenBorder
			selectedId={selectedRep?.id}
		/>
	);
};

const SalesRep = memo(SalesRepTemp);

export default SalesRep;
