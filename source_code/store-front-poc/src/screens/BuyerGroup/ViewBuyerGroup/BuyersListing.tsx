import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Icon, PageHeader } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import buyer from 'src/utils/api_requests/buyer';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { buyerColumns } from './columns';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';

const BuyersListing = () => {
	const params = useParams();
	const navigate = useNavigate();
	// const [rowData, setRowData] = useState<any[]>([]);
	// const [existing_buyers, set_existing_buyers] = useState<number[]>([]);
	const [buyer_group_details, set_buyer_group_details] = useState<any>({});
	const [buyersFiltered, setBuyersFiltered] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const buyerGroupListingResponse: any = await api_requests.buyer.get_buyers_v1_list();
				const specificBuyerGroupResponse: any = await buyer.get_buyer_group(params?.id);

				set_buyer_group_details(specificBuyerGroupResponse?.data);

				filterData(buyerGroupListingResponse?.data || [], specificBuyerGroupResponse?.data?.customer_ids || []);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [params?.id]);

	const transformData = (data: any) => {
		return data.map((item: any) => {
			return {
				...item,
				buyerName: item?.buyer_name,
				region: item?.location,
				totalRevenue: item?.revenue_by_sales,
			};
		});
	};

	const filterData = (rowData: any[], existing_buyers: number[]) => {
		const filtered = rowData.filter((item) => existing_buyers.includes(item?.id));
		setBuyersFiltered(transformData(filtered));
	};

	const handleNavigate = () => {
		navigate(`/buyer-group/edit/${params?.id}`);
	};

	return (
		<Box>
			<PageHeader
				leftSection={
					<Grid container>
						<Grid item mr={1} mt={0.5} sx={{ cursor: 'pointer' }}>
							<Icon iconName='IconArrowLeft' onClick={() => navigate('/buyer-group/view-list')} />
						</Grid>
						<Grid item>
							<Typography variant='inherit' sx={{ fontSize: '18px', fontWeight: 700 }}>
								{buyer_group_details?.name}
							</Typography>
						</Grid>
					</Grid>
				}
				rightSection={
					<>
						<Can I={PERMISSIONS.edit_buyers.slug} a={PERMISSIONS.edit_buyers.permissionType}>
							<Button onClick={handleNavigate} variant='contained'>
								Edit
							</Button>
						</Can>
					</>
				}
			/>
			<AgGridTableContainer rowData={buyersFiltered} columnDefs={buyerColumns} containerStyle={{ height: 'calc(100vh - 170px)' }} />
		</Box>
	);
};

export default BuyersListing;
