import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import CatalogTable from './components/CatalogTable';
import CatalogManagementContext from './context';
import useCatalogManager from './useCatalogManager';

const CatalogManager = () => {
	const dispatch = useDispatch();
	const value = useCatalogManager();
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Catalogs',
			link: RouteNames.catelog_manager.path,
		},
	];

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	return (
		<CatalogManagementContext.Provider value={value}>
			<CatalogTable />
		</CatalogManagementContext.Provider>
	);
};
export default CatalogManager;
