import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, PageHeader, Typography } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import api_requests from 'src/utils/api_requests';
import RouteNames from 'src/utils/RouteNames';
import { columns } from './columns';
import { useDispatch, useSelector } from 'react-redux';
import { updateBreadcrumbs } from 'src/actions/topbar';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { isoDateToMMDDYYYY } from 'src/utils/common';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';

const BuyerGroupListing = () => {
	const [rowData, setRowData] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const tenant_id = useSelector((state: any) => state.login.userDetails.tenant_id);

	const [row_count, set_row_count] = useState<null | number>(null);

	function get_rows(total_rows: number) {
		set_row_count(total_rows);
	}

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Customer Groups',
			link: `${RouteNames.buyer_group.buyer_list.path}`,
		},
	];
	useEffect(() => {
		api_requests.buyer.get_buyer_group_listing().then((res: any) => {
			setRowData(res?.data);
		});
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	const columnData = columns?.map((column: any) => {
		if (column?.field === 'name') {
			return {
				...column,
				flex: 1,
				clickable: true,
				onCellClicked: (params: any) => {
					// TODO: Remove this after prod CGsparks demo
					if (tenant_id !== '4c2e81db-8f62-4803-841b-f009ee389ccd')
						navigate(`${RouteNames.buyer_group.buyer_list.routing_path}/${params?.data?.id}`);
				},
			};
		}
		return {
			...column,
		};
	});

	const transformData = (data: any) => {
		return data
			.map((item: any) => {
				try {
					const priceList = item?.price_level?.name;
					const applicableOn = `${item?.customer_ids?.length} customer(s)`;
					const createdOn = isoDateToMMDDYYYY(item?.created_at);
					return {
						...item,
						priceList,
						applicableOn,
						createdOn,
					};
				} catch (error) {
					console.error(`Error transforming data for item with created_at: ${item?.created_at}`);
					return null;
				}
			})
			.filter((item: any) => item !== null); // Remove items with conversion errors
	};

	const rowDataDefs = transformData(rowData);
	// console.log(tenant_id);
	return (
		<Box>
			<Box mt={1}>
				<PageHeader
					leftSection={<Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Customer Groups</Typography>}
					rightSection={
						<Can I={PERMISSIONS.create_buyer_group.slug} a={PERMISSIONS.create_buyer_group.permissionType}>
							{tenant_id !== '4c2e81db-8f62-4803-841b-f009ee389ccd' && (
								<Button
									onClick={() => {
										navigate('/buyer-group/create');
									}}
									variant='contained'>
									+ Create
								</Button>
							)}
						</Can>
					}
				/>
			</Box>
			<Box mt={1} sx={{ position: 'relative' }}>
				<AgGridTableContainer
					get_total_rows={get_rows}
					columnDefs={columnData}
					rowData={rowDataDefs}
					customRowName='Total Customer Groups'
					containerStyle={{ height: 'calc(100vh - 170px)' }}
				/>
				{row_count === 0 && <EmptyTableComponent top={'83px'} height={'calc(100vh - 300px)'} />}
			</Box>
		</Box>
	);
};

export default BuyerGroupListing;
