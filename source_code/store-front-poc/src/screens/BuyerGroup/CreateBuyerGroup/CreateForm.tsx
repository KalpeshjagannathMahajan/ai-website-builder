import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Box, Button, Grid, Image, PageHeader } from 'src/common/@the-source/atoms';
import SelectEditField from 'src/common/@the-source/atoms/FieldsNew/SelectEditField';
import TextEditField from 'src/common/@the-source/atoms/FieldsNew/TextEditField';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import CreateBuyerDrawer from './CreateBuyerDrawer';

import { columns } from './columns';
import buyer from 'src/utils/api_requests/buyer';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import types from 'src/utils/types';
import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import { show_toast } from 'src/actions/message';
import RouteNames from 'src/utils/RouteNames';
import { PageTitle } from 'src/common/PageHeaderComponents';
import { updateBreadcrumbs } from 'src/actions/topbar';

const useStyles = makeStyles({
	container: { borderRadius: '10px', marginTop: 3 },
	container_background: { width: '100%', background: '#fff', borderRadius: '10px' },
	container_height: {
		height: '55vh',
	},
});

const CreateForm = () => {
	const [is_drawer_open, set_is_drawer_open] = useState<Boolean>(false);
	const [selectedBuyers, setSelectedBuyers] = useState([]);
	const [price_list_options, set_price_list_options] = useState<any[]>([]);
	const [buyer_list, set_buyer_list] = useState([]);
	const [exists_buyers, set_existing_buyers] = useState([]);
	const [group_info, set_group_info] = useState<any>({});
	const [checkedRows, setCheckedRows] = useState([]);
	const [preSelectedRows, setPreSelectedRows] = useState([]);
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const methods = useForm();
	const { handleSubmit, setValue } = methods;

	const styles = useStyles();

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
		{
			id: 3,
			linkTitle: 'Create Group',
			link: `${RouteNames.buyer_group.create_group.path}`,
		},
	];

	const transformData = (data: any) => {
		return data.map((item: any) => {
			return {
				...item,
				company_name: item?.buyer_name,
				region: item?.location,
			};
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const priceListResponse: any = await buyer.get_Price_list();
				set_price_list_options(priceListResponse.data);

				const buyerListResponse: any = await buyer.get_buyers_v1_list();
				set_buyer_list(buyerListResponse.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	useEffect(() => {
		if (params?.id) {
			buyer.get_buyer_group(params?.id).then((res: any) => {
				set_group_info(res?.data);
				setValue('name', res?.data?.name);
				setValue('price_list_id', res?.data?.price_level?.id);
				set_existing_buyers(res?.data?.customer_ids);
				setPreSelectedRows(res?.data?.customer_ids);
			});
		}
	}, [params?.id]);

	useEffect(() => {
		const buyersFiltered = buyer_list?.filter((item: any) => exists_buyers?.includes(item?.id));
		setSelectedBuyers(transformData(buyersFiltered));
	}, [buyer_list, exists_buyers]);

	const message = {
		open: true,
		showCross: false,
		anchorOrigin: {
			vertical: types.VERTICAL_TOP,
			horizontal: types.HORIZONTAL_CENTER,
		},
		autoHideDuration: 3000,
		state: types.SUCCESS_STATE,
		title: types.SUCCESS_TITLE,
		subtitle: i18next.t('Customer Group Created Succcessfully'),
		showActions: false,
	};

	const onSubmit = (data: any) => {
		const payload = {
			...data,
			customer_ids: selectedBuyers?.map((row: any) => row.id),
		};

		if (params?.id) {
			const putPayload = {
				...payload,
				id: params?.id,
			};
			buyer.post_buyer_group(putPayload).then((res: any) => {
				if (res?.status_code === 200) {
					dispatch(show_toast(message));
					navigate(RouteNames.buyer_group.view_group.path);
				}
			});
		} else {
			buyer
				.post_buyer_group(payload)
				.then((res: any) => {
					if (res?.status_code === 200) {
						dispatch(show_toast(message));
						navigate(RouteNames.buyer_group.view_group.path);
					}
				})
				.catch((err) => console.error(err));
		}
	};
	const onSelectionChanged = (event: any) => {
		const selectedRows = event.api.getSelectedRows();
		setCheckedRows(selectedRows?.map((row: any) => row.id));
		setSelectedBuyers(selectedRows);
	};

	const handleCancel = () => {
		navigate(RouteNames.buyer_group.view_group.path);
	};

	const handleAddBuyers = () => {
		set_is_drawer_open(true);
		set_existing_buyers(selectedBuyers);
	};

	return (
		<Grid>
			<FormProvider {...methods}>
				<PageHeader
					leftSection={<PageTitle title={params?.id ? 'Edit Customer Group' : 'Create Customer Group'} />}
					rightSection={
						<>
							<Grid item ml={1}>
								<Button onClick={handleCancel} variant='outlined'>
									Cancel
								</Button>
							</Grid>
							<Grid item ml={1}>
								<Button onClick={handleSubmit(onSubmit)} variant='contained'>
									Save
								</Button>
							</Grid>
						</>
					}
				/>
				<Box display='flex' justifyContent='center'>
					<Grid item xs={12} sm={6}>
						<Box p={3} className={styles.container}>
							<Box p={3} className={styles.container_background}>
								<Box>
									<TextEditField
										validations={{
											required: true,
										}}
										name='name'
										fullWidth
										label='Name'
										placeholder='Name'
									/>
								</Box>
								<Box mt={2}>
									<SelectEditField
										name='price_list_id'
										fullWidth
										validations={{
											required: true,
										}}
										label='Price list'
										placeholder='Price list'
										defaultValue={group_info?.price_level_id || ''}
										options={price_list_options}
									/>
								</Box>
							</Box>
							<Box p={3} mt={3} className={`${styles.container_background} ${styles.container_height}`}>
								<Grid container justifyContent='space-between'>
									<Grid item ml={2} mt={1}>
										<Typography variant='h6'>Select customers</Typography>
									</Grid>
									{selectedBuyers?.length > 0 && (
										<Grid sx={{ cursor: 'pointer' }} item mt={1} onClick={handleAddBuyers}>
											<Typography color='#16885F' fontSize='14px' fontWeight={700}>
												+ Add Customers
											</Typography>
										</Grid>
									)}
								</Grid>

								{selectedBuyers?.length === 0 && (
									<Box ml={2} mt={1}>
										<Typography variant='subtitle2'>Customers added to this group will get assigned to the selected price list</Typography>
									</Box>
								)}

								{selectedBuyers?.length > 0 ? (
									<Box mt={3} display='flex' justifyContent='center' height='43vh'>
										<AgGridTableContainer containerStyle={{ width: '500px' }} columnDefs={columns} rowData={selectedBuyers} />
									</Box>
								) : (
									<Box>
										<Box mt={3} display='flex' justifyContent='center'>
											<Image src={ImageLinks.empty_buyer_list} width='160px' height='160px' />
										</Box>
										<Box mt={3} display='flex' justifyContent='center'>
											<Button onClick={handleAddBuyers} variant='outlined'>
												+ Add customer
											</Button>
										</Box>
									</Box>
								)}
							</Box>
						</Box>
					</Grid>
				</Box>
				<CreateBuyerDrawer
					open={is_drawer_open}
					exists_buyers={exists_buyers}
					setIsOpen={set_is_drawer_open}
					onSelectionChanged={onSelectionChanged}
					setSelectedBuyers={setSelectedBuyers}
					checkedRows={checkedRows}
					setCheckedRows={setCheckedRows}
					preSelectedRows={preSelectedRows}
				/>
			</FormProvider>
		</Grid>
	);
};

export default CreateForm;
