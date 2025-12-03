const Reporting = () => {
	return (
		<explo-dashboard
			dash-customer-token='QRA3Jwg1Ed:699f0eb055a703336ee5c30e939b4cbcd3a67e8c33076636c051018ba2f66e08'
			updateUrlParams={true}
			isProduction={true}
			environment='production'
			refresh-minutes={10}
			variables={JSON.stringify({
				element1: 'value',
				element2: 'value2',
			})}
		/>
	);
};

export default Reporting;
