import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Toaster from '../Toaster';
import Login from './Login';

const validateEmail = (email: string) =>
	String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);

export default {
	title: 'SalesRep/Logins',
	component: Login,
} as Meta<typeof Login>;

const LoginComponent: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleClose = () => setOpen(false);

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

	const onSubmit = () => {
		const emailCheck = !validateEmail(email);
		const passwordCheck = password.length < 8;
		setEmailError(emailCheck);
		setPasswordError(passwordCheck);
		if (!emailCheck && !passwordCheck) {
			setOpen(true);
		}
	};

	return (
		<>
			<Toaster
				open={open}
				showCross
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				autoHideDuration={Date.now()}
				onClose={handleClose}
				state='success'
				title='Login Success'
				subtitle='Successfully logged in'
				showActions={false}
				iconSize='large'
				primaryBtnName='Submit'
				secondryBtnName='Cancel'
			/>
			<Login
				email={email}
				companyDesc='Crafting digital experiences for B2B sales & sourcing'
				emailError={emailError}
				passwordError={passwordError}
				onEmailChange={onEmailChange}
				forgotPasswordClick={() => {}}
				bookDemoClick={() => {}}
				logoUrl='https://uploads-ssl.webflow.com/63e4eec68738ce8318cbab16/63fcd32306971477fb638c84_New%20logo-%20Satoshi%20font.svg'
				onPasswordChange={onPasswordChange}
				password={password}
				companyName='Sourcewiz'
				onSubmit={onSubmit}
			/>
		</>
	);
};

export const LoginScreen: StoryObj = {
	render: () => <LoginComponent />,
};
