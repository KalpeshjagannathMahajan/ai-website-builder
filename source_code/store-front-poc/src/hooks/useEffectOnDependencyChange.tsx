import { DependencyList, EffectCallback, useEffect, useState } from 'react';

export default function useEffectOnDependencyChange(callback: EffectCallback, deps?: DependencyList) {
	const [check_first_render, set_check_first_render] = useState(false);

	useEffect(() => {
		if (!check_first_render) return set_check_first_render(true);
		return callback();
	}, deps);
}
