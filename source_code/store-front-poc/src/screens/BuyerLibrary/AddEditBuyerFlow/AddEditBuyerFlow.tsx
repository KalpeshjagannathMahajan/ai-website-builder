import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddEditBuyer from './components/AddEditBuyer/AddEditBuyer';
import AddQuickBuyer from './components/AddQuickBuyer/AddQuickBuyer';

const AddEditBuyerFlow = () => {
	const [is_detailed, set_is_detailed] = useState(false);
	const [is_filled, set_is_filled] = useState(false);
	const [quick_buyer_data, set_quick_buyer_data] = useState({});
	const params = useParams();
	const { id } = params;

	useEffect(() => {
		if (id) {
			set_is_detailed(true);
		}
	}, [id]);

	if (is_detailed) {
		return (
			<AddEditBuyer
				quick_buyer_data={quick_buyer_data}
				edit_buyer_id={id}
				is_detailed={is_detailed}
				set_is_detailed={set_is_detailed}
				is_filled={is_filled}
			/>
		);
	}

	return <AddQuickBuyer set_is_detailed={set_is_detailed} set_quick_buyer_data={set_quick_buyer_data} set_is_filled={set_is_filled} />;
};

export default AddEditBuyerFlow;
