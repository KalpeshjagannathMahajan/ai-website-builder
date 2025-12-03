import _ from 'lodash';
import { useMemo } from 'react';
import { CHARGE_NAMES, CHARGE_TYPE } from 'src/screens/OrderManagement/constants';

const useSortedCharges = (charges: any) => {
	const sorted_charges = useMemo(() => {
		const _sorted_charges = [..._.filter(charges, { charge_type: CHARGE_TYPE.discount })];

		const type_tax_charges = _.map(_.filter(charges, { charge_type: CHARGE_TYPE.tax }), (tax) => {
			tax.priority = _.find(CHARGE_NAMES, { name: tax.name })?.priority ?? 2;
			return tax;
		});

		const sorted_tax_charges = _.orderBy(type_tax_charges, 'priority', 'asc');
		_sorted_charges.push(...sorted_tax_charges);

		return _sorted_charges;
	}, [charges]);

	return sorted_charges;
};

export default useSortedCharges;
