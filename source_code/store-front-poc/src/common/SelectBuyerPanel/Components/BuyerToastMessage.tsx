import React from 'react';
import { Toaster } from 'src/common/@the-source/atoms';

type ToggleToast = {
	show: boolean;
	message: string;
	title: string;
	status: 'error' | 'warning' | 'success';
};

interface BuyerToastMessageProps {
	toggle_toast: ToggleToast;
	set_toggle_toast: any;
}

const BuyerToastMessage = ({ toggle_toast, set_toggle_toast }: BuyerToastMessageProps) => {
	return (
		<React.Fragment>
			{toggle_toast?.show && (
				<Toaster
					open={toggle_toast?.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					autoHideDuration={3000}
					state={toggle_toast?.status}
					title={toggle_toast.title}
					onClose={() => set_toggle_toast({ show: false, message: '', title: '', status: '' })}
					subtitle={toggle_toast.message}
					showActions={false}
					iconSize='large'
				/>
			)}
		</React.Fragment>
	);
};

export default BuyerToastMessage;
