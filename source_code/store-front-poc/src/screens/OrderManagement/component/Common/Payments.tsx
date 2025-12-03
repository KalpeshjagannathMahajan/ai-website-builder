import CustomText from 'src/common/@the-source/CustomText';
import { Checkbox, Grid, Image } from 'src/common/@the-source/atoms';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface PaymentsProps {
	data: any;
	set_payment_ids: any;
	set_input_value: any;
	payment_method_ids: any;
	currency: string;
}

const Payments = ({ data, set_payment_ids, set_input_value, payment_method_ids, currency }: PaymentsProps) => {
	const [checkedItems, setCheckedItems] = useState(data?.map(() => false));
	const [disabledItems, setDisabledItems] = useState(data?.map(() => false));
	const theme: any = useTheme();

	const calculateTotal = () => {
		let total = 0;
		const selectedPaymentIds: any = [];
		data?.forEach((item: any, index: number) => {
			if (checkedItems[index]) {
				total += item.amount;
				selectedPaymentIds.push(item.id);
			}
		});
		set_payment_ids(selectedPaymentIds);
		return Number(total?.toFixed(2));
	};

	useEffect(() => {
		if (!_.some(data, (payment: any) => payment?.source === 'terminal')) setCheckedItems(data?.map(() => true));
	}, [data]);

	useEffect(() => {
		set_input_value(calculateTotal());
	}, [checkedItems]);

	const handleCheckboxChange = (index: number) => {
		const updatedCheckedItems = [...checkedItems];
		updatedCheckedItems[index] = !updatedCheckedItems[index];
		setCheckedItems(updatedCheckedItems);
		if (data[index].source === 'terminal') {
			if (updatedCheckedItems[index]) setDisabledItems(data?.map((payment: any, idx: number) => idx !== index));
			else setDisabledItems(data?.map(() => false));
		} else if (updatedCheckedItems[index]) {
			setDisabledItems(data?.map((payment: any) => payment?.source === 'terminal'));
		} else if (!_.some(data, (payment: any, idx: number) => updatedCheckedItems[idx] && payment?.source !== 'terminal')) {
			setDisabledItems(data?.map(() => false));
		}
	};

	const payment_detail = (payment_method_id: string) => {
		const payment_method = payment_method_ids[payment_method_id];
		return (
			<Grid display='flex' sx={{ paddingTop: '0.5rem' }} alignItems='center'>
				<CustomText>{payment_method?.title}</CustomText>
				<Image
					style={{ marginLeft: '1rem' }}
					src={payment_method.logo}
					width={payment_method.payment_method_type === 'wallet' || payment_method.payment_method_id === 'manual' ? 24 : 40}
					height={24}
				/>
			</Grid>
		);
	};

	return (
		<Grid display='flex' direction='column' gap={1}>
			{data?.map((item: any, index: number) => (
				<Grid
					display='flex'
					p={1.2}
					width={'100%'}
					sx={{ background: theme?.payments?.refund_payment?.background, paddingBottom: '1.7rem', opacity: disabledItems[index] && 0.5 }}
					key={`invoice_${index}`}>
					<Checkbox
						name='invoice'
						checked={checkedItems[index]}
						onChange={() => handleCheckboxChange(index)}
						disabled={disabledItems[index]}
					/>
					<Grid display='flex' alignItems='center' justifyContent='space-between' flex={1}>
						<Grid xs={8} sx={{}}>
							<CustomText style={{ display: 'flex', alignItems: 'center' }}>
								{item.display_id}
								{item?.source === 'terminal' && (
									<Image style={{ marginLeft: '1rem' }} src={ImageLinks.terminal_icon} width={40} height={24} />
								)}
							</CustomText>
							{payment_detail(item.payment_method_id)}
						</Grid>
						<CustomText>{get_formatted_price_with_currency(currency, item.amount)}</CustomText>
					</Grid>
				</Grid>
			))}
		</Grid>
	);
};

export default Payments;
