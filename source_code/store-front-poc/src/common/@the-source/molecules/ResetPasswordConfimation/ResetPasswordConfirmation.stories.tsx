import { Meta, StoryObj } from '@storybook/react';

import ResetPasswordConfimation from './ResetPasswordConfimation';
import { t } from 'i18next';

export default {
	title: 'SalesRep/ResetPasswordConfimation',
	component: ResetPasswordConfimation,
} as Meta<typeof ResetPasswordConfimation>;

export const ResetPasswordConfimationStory: StoryObj = {
	render: () => (
		<ResetPasswordConfimation
			logoUrl='https://uploads-ssl.webflow.com/63e4eec68738ce8318cbab16/63fcd32306971477fb638c84_New%20logo-%20Satoshi%20font.svg'
			confirmationText={t('AuthFlow.ResetPassword.PasswordResetSuccessful')}
			onSubmit={() => {}}
			illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
			submitBtnText={t('AuthFlow.ResetPassword.LoginWithNew')}
			supportEmailClick={() => {}}
			supportEmail={t('AuthFlow.ResetPassword.SupportEmail')}
		/>
	),
};
