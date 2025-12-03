import { useState, useEffect } from 'react';
import _ from 'lodash';

const useIsNewTab = (): boolean => {
	const [is_new_tab, set_is_new_tab] = useState<boolean>(false);

	useEffect(() => {
		const history_length = _.get(window, 'history.length', 0);
		if (history_length === 1) {
			set_is_new_tab(true);
		}
	}, []);

	return is_new_tab;
};

export default useIsNewTab;
