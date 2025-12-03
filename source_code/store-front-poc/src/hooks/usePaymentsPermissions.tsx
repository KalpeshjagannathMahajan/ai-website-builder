import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import { RootState } from 'src/store';
import { check_permission } from 'src/utils/utils';

const usePaymentsPermissions = () => {
	const user_permissions = useSelector((state: RootState) => state?.login?.permissions || []);
	const has_direct_payment_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.direct_payment.slug]),
		[user_permissions],
	);
	const has_collect_payment_for_customer_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.customer_pay.slug]),
		[user_permissions],
	);
	const has_any_refund_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.refund_source.slug, PERMISSIONS.refund_credits.slug]),
		[user_permissions],
	);
	const has_card_authorization_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.create_authorization.slug, PERMISSIONS.create_authorization.slug]),
		[user_permissions],
	);
	const has_void_authorization_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.void_authorization.slug, PERMISSIONS.void_authorization.slug]),
		[user_permissions],
	);

	const has_collect_payment_against_order = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.collect_payment_for_order.slug, PERMISSIONS.collect_payment_for_order.slug]),
		[user_permissions],
	);

	const has_recurring_payment_permission = useMemo(
		() => check_permission(user_permissions, [PERMISSIONS.recurring_payment.slug]),
		[user_permissions],
	);

	const has_both_collect_payment_permission = has_direct_payment_permission && has_collect_payment_for_customer_permission;
	const has_any_collect_payment_permission = has_direct_payment_permission || has_collect_payment_for_customer_permission;
	const has_payments_access = has_any_collect_payment_permission || has_any_refund_permission || has_card_authorization_permission;
	return {
		has_payments_access,
		has_any_refund_permission,
		has_any_collect_payment_permission,
		has_both_collect_payment_permission,
		has_card_authorization_permission,
		has_void_authorization_permission,
		has_collect_payment_against_order,
		has_collect_payment_for_customer_permission,
		has_recurring_payment_permission,
	};
};

export default usePaymentsPermissions;
