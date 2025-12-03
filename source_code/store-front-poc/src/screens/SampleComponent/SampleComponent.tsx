import { useContext } from 'react';
import ChildComponent from './components/ChildComponent';
import SampleComponentContext from './context';
import useSampleComponent from './useSampleComponent';

const SampleComponentComp = () => {
	const {} = useContext(SampleComponentContext);
	return (
		<div>
			<ChildComponent />
		</div>
	);
};

const SampleComponent = () => {
	const value = useSampleComponent();
	return (
		<SampleComponentContext.Provider value={value}>
			<SampleComponentComp />
		</SampleComponentContext.Provider>
	);
};

export default SampleComponent;
