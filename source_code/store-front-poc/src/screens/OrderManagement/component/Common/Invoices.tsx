import CustomText from 'src/common/@the-source/CustomText';
import { Checkbox, Grid } from 'src/common/@the-source/atoms';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface InvoicesProps {
	data: any;
	set_invoice_ids: any;
	set_input_value: any;
	currency: string;
}

const Invoices = ({ data, set_invoice_ids, set_input_value, currency }: InvoicesProps) => {
	const [checkedItems, setCheckedItems] = useState(data?.length === 1 ? [true] : data?.map(() => false));
	const theme: any = useTheme();

	const calculateTotal = () => {
		let total = 0;
		const selectedInvoiceIds: any = [];
		data?.forEach((item: any, index: number) => {
			if (checkedItems[index]) {
				try {
					const amount = parseFloat(item.amount);
					if (!isNaN(amount)) {
						total += amount;
						selectedInvoiceIds.push(item.id);
					} else {
						throw new Error(`Invalid amount: ${item.amount}`);
					}
				} catch (error) {
					console.error(`Error processing item at index ${index}:`, error);
				}
			}
		});
		set_invoice_ids(selectedInvoiceIds);
		return total;
	};

	useEffect(() => {
		set_input_value(calculateTotal());
	}, [checkedItems, data, set_input_value]);

	const handleCheckboxChange = (index: number) => {
		const updatedCheckedItems = [...checkedItems];
		updatedCheckedItems[index] = !updatedCheckedItems[index];
		setCheckedItems(updatedCheckedItems);
	};

	return (
		<Grid display='flex' direction='column' gap={1}>
			{data?.map((item: any, index: number) => {
				return (
					<Grid
						display='flex'
						p={1.2}
						width={'100%'}
						sx={{ background: theme?.order_management?.invoices?.grid_background }}
						justifyContent={'space-between'}
						alignItems={'center'}
						key={`invoice_${index}`}>
						<Checkbox name='invoice' checked={checkedItems[index]} onChange={() => handleCheckboxChange(index)} />
						<Grid display='flex' justifyContent={'space-between'} flex={1}>
							<CustomText>{item.display_id}</CustomText>
							<CustomText>{get_formatted_price_with_currency(currency, item.amount)}</CustomText>
						</Grid>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default Invoices;
