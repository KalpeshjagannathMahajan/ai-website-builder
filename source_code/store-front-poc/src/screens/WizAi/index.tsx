import WizAi from './WizAi';
import WizAiContext from './context';
import useWizAi from './useWizAi';

const WizInsights = () => {
	const value = useWizAi();

	return (
		<WizAiContext.Provider value={value}>
			<WizAi />
		</WizAiContext.Provider>
	);
};

export default WizInsights;
