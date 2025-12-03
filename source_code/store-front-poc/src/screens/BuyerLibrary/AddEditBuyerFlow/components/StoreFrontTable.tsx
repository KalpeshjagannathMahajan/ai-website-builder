import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { Button, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import MenuCellRenderer from './MenuCellRenderer';
import { wizshop_rows } from './utils';

interface StoreFrontProps {
	set_open_storefront_user: (open: boolean) => void;
	set_storefront_edit_user: any;
	all_wizshop_users?: any;
	handle_update_form?: any;
}

const useStyles = makeStyles(() => {
	return {
		no_data: {
			height: '30vh',
			width: '95%',
			marginLeft: 'auto',
			marginRight: 'auto',
			marginTop: '20px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			background: '#F7F8FA',
			borderRadius: '8px',
			color: '#16885F',
			cursor: 'pointer',
		},
	};
});

const StoreFrontTable = ({
	set_open_storefront_user,
	set_storefront_edit_user,
	all_wizshop_users,
	handle_update_form,
}: StoreFrontProps) => {
	const styles = useStyles();

	const row_data: any = all_wizshop_users || [];
	const transformed_row_data = _.map(row_data, (user) => ({
		...user,
		name: `${user?.first_name} ${user?.last_name}`,
	}));

	const filtered_row_data = _.filter(transformed_row_data, (user) => user?.updated_status !== 'deleted');

	const handle_open_drawer = (params: any) => {
		set_storefront_edit_user({ index: params?.node?.rowIndex, user: params?.node?.data });
		set_open_storefront_user(true);
	};

	const handle_add_user_button = () => {
		set_open_storefront_user(true);
	};
	const handle_delete = (params: any) => {
		const userId = params?.node?.data?.id;
		const updatedUsers = _.cloneDeep(all_wizshop_users || []);

		if (userId.startsWith('temp')) {
			const updatedUsersFiltered = updatedUsers?.filter((user: any) => user.id !== userId);
			handle_update_form('wizshop_users.values', updatedUsersFiltered);
		} else {
			const updatedUsersWithStatus = updatedUsers?.map((user: any) => {
				if (user.id === userId) {
					return { ...user, updated_status: 'deleted' };
				}
				return user;
			});
			handle_update_form('wizshop_users.values', updatedUsersWithStatus);
		}
	};

	const transformed_column = wizshop_rows.map((column) => {
		if (column?.field === 'menu') {
			return {
				...column,
				lockPinned: true,
				resizable: false,
				pinned: 'right',
				cellRenderer: MenuCellRenderer,
				cellRendererParams: {
					handle_open_drawer,
					handle_delete,
				},
			};
		}
		if (column?.field === 'phone') {
			return {
				...column,
				cellRenderer: (params: any) => {
					const phone_number = params?.data?.phone;
					const country = params?.data?.country_code;

					const formatted_value = phone_number ? `${country} ${phone_number}` : '--';

					return <CustomText>{formatted_value}</CustomText>;
				},
			};
		}
		return column;
	});

	const height = filtered_row_data?.length * 50;

	const add_wizshop_user = () => {
		return (
			<div className={styles.no_data} onClick={() => set_open_storefront_user(true)}>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: '40px' }}>
						<Icon color='#16885F' iconName='IconUserPlus' />
					</div>
					<CustomText type='Subtitle' style={{ fontWeight: 700, color: '#16885F' }}>
						Add website user
					</CustomText>
				</div>
			</div>
		);
	};

	return (
		<>
			{filtered_row_data?.length === 0 ? (
				add_wizshop_user()
			) : (
				<>
					<AgGridTableContainer
						columnDefs={transformed_column}
						rowData={filtered_row_data}
						containerStyle={{
							height: `${height + 87}px`,
							maxHeight: '350px',
							width: '95%',
							marginLeft: '16px',
							marginRight: 'auto',
							marginTop: '20px',
						}}
					/>
					<Button sx={{ m: '20px 16px 0 16px', padding: '10px', cursor: 'pointer' }} variant='text' onClick={handle_add_user_button}>
						+ Add user
					</Button>
				</>
			)}
		</>
	);
};

export default StoreFrontTable;
