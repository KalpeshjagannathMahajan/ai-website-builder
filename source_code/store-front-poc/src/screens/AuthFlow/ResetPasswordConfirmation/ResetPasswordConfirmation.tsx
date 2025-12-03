import { default as ResetPasswordConfimationUI } from 'src/common/@the-source/molecules/ResetPasswordConfimation';
import { useState } from 'react';
import { Navigate } from 'react-router-dom/dist';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTranslation } from 'react-i18next';

const ResetPasswordConfirmation = () => {
	const { t } = useTranslation();
	const [redirect, setRedirect] = useState(false);

	if (redirect) {
		return <Navigate to='/user-login' />;
	}

	return (
		<ResetPasswordConfimationUI
			logoUrl={ImageLinks.LogoWithText}
			confirmationText='Your password has been reset successfully'
			onSubmit={() => setRedirect(true)}
			supportEmail={t('AuthFlow.ResetPassword.SupportEmail')}
			supportEmailClick={() => {}}
			illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
			submitBtnText='Login with new password'
		/>
	);
};

export default ResetPasswordConfirmation;
