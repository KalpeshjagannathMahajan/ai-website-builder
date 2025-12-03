import { Toaster } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';

const Toast = () => {
	const message = useSelector((state: any) => state.message);
	return message.open && <Toaster {...message} />;
};

export default Toast;
