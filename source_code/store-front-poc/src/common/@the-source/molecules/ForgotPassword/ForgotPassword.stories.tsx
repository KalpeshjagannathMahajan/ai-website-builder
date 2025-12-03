import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ForgotPassword from './ForgotPassword';

const validateEmail = (email: string) =>
	String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);

export default {
	title: 'SalesRep/ForgotPassword',
	component: ForgotPassword,
} as Meta<typeof ForgotPassword>;

const ForgotPasswordComponent: React.FC = () => {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(false);

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const onSubmit = () => {
		setEmailError(!validateEmail(email));
	};

	return (
		<ForgotPassword
			email={email}
			companyDesc='Crafting digital experiences for B2B sales & sourcing'
			logoUrl='https://uploads-ssl.webflow.com/63e4eec68738ce8318cbab16/63fcd32306971477fb638c84_New%20logo-%20Satoshi%20font.svg'
			emailError={emailError}
			backToLogin={() => {}}
			onEmailChange={onEmailChange}
			onSubmit={onSubmit}
			submitText='Send Reset Link'
			supportEmailClick={() => {}}
			supportEmail='support@sourcewiz.co'
			illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
		/>
	);
};

export const ForgotPasswordStory: StoryObj = {
	render: () => <ForgotPasswordComponent />,
};
