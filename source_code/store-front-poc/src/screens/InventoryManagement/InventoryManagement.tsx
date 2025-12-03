import InventoryManagementContext from './context';
import useInventoryManagement from './useInventoryManagement';
import InventoryTab from './component/InventoryTab';
import { Box } from '@mui/material';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const InventoryManagementComp = () => {
	return (
		<Box>
			<InventoryTab />
		</Box>
	);
};

const InventoryManagement = () => {
	const value = useInventoryManagement();
	const dispatch = useDispatch();
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Inventory',
			link: `${RouteNames.inventory.path}`,
		},
	];

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);
	return (
		<InventoryManagementContext.Provider value={value}>
			<InventoryManagementComp />
		</InventoryManagementContext.Provider>
	);
};

export default InventoryManagement;
