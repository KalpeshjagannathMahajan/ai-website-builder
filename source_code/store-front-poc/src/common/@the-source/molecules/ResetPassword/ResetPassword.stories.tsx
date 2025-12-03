import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ResetPassword from './ResetPassword';

const validatePassword = (password: string) => password.length >= 8;

export default {
	title: 'SalesRep/ResetPasswords',
	component: ResetPassword,
} as Meta<typeof ResetPassword>;

const ResetPasswordComponent: React.FC = () => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorConfirm, setPasswordErrorConfirm] = useState(false);

	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const onSubmit = () => {
		setPasswordError(!validatePassword(password));
		setPasswordErrorConfirm(!validatePassword(confirmPassword));
	};

	return (
		<ResetPassword
			password={password}
			confirmPassword={confirmPassword}
			passwordError={passwordError}
			logoUrl='https://uploads-ssl.webflow.com/63e4eec68738ce8318cbab16/63fcd32306971477fb638c84_New%20logo-%20Satoshi%20font.svg'
			passwordErrorConfirm={passwordErrorConfirm}
			onConfirmPasswordChange={onConfirmPasswordChange}
			onSubmit={onSubmit}
			supportEmailClick={() => {}}
			supportEmail='support@sourcewiz.co'
			illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
			onPasswordChange={onPasswordChange}
		/>
	);
};

export const ResetPasswordScreen: StoryObj = {
	render: () => <ResetPasswordComponent />,
};
