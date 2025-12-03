import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import LoadingScreen from 'src/screens/Home/EmailSetting/LoadingScreen';
import LoaderScreen from './LoaderScreen';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import NotAllowed from 'src/NotAllowed';
import { OutsideMetabaseReporting } from 'src/screens/Reporting/OutsideMetabaseReporting';
import Subscription from 'src/screens/Settings/components/General/Subscription';
import EmailSettings from 'src/screens/Settings/components/General/EmailSetting';
import BarcodeSettings from 'src/screens/Settings/components/General/BarcodeSettings';
import ContainerSetting from 'src/screens/Settings/components/Order/ContainerSetting';
import ImportExportSettings from 'src/screens/Settings/components/General/ImportExportSettings';
import ReportSettings from 'src/screens/Settings/components/Reports/ReportSettings';
import { Profile } from 'src/screens/Account/Components/Profile';
import { Invoices } from 'src/screens/Account/Components/Invoices';
import { Orders } from 'src/screens/Account/Components/Orders';
import ExcelSheets from 'src/screens/Settings/components/Product/ExcelSheets';
import InventoryDisplay from 'src/screens/Settings/components/Inventory/InventoryDisplay';
import CustomerPermission from 'src/screens/Settings/components/Buyer/BuyerPermissions';
import SettingConfig from 'src/screens/Settings/components/Setting/SettingConfig';
import CreatePassword from 'src/screens/AuthFlow/CreatePassword/CreatePassword';
import UnderReview from 'src/screens/AuthFlow/Signup/UnderReview';
import Signup from 'src/screens/AuthFlow/Signup/Signup';
import DirectPayment from 'src/common/@the-source/molecules/DirectPayment/DirectPayment';
import ProtectedRoute from 'src/ProtectedRoute';
import AuthRoute from 'src/AuthRoute';
// import EmailTrigger from 'src/screens/Settings/components/Email/EmailTrigger';
import StartTrail from 'src/screens/AuthFlow/StartTrial/StartTrial';
import TokenExpired from 'src/screens/AuthFlow/TokenExpired';
import FreeTrial from 'src/screens/AuthFlow/FreeDemo/FreeTrial';
import ConfirmedDemo from 'src/screens/AuthFlow/FreeDemo/ConfirmedDemo';
import TagSetting from 'src/screens/Settings/components/Order/TagSetting';
import RuleEngine from 'src/screens/Settings/components/General/RuleEngine';
import ReviewProductListing from 'src/screens/Presentation/ReviewProductListing';
import CartGrouping from 'src/screens/Settings/components/Cart/CartGrouping';
import SetReminder from 'src/screens/Settings/components/Email/SetReminder';
import ShowroomModeSetting from 'src/screens/Settings/components/UserManagement/ShowroomModeSetting';
import Pricelist from 'src/screens/Settings/components/General/Pricelist';
import IncrementalSync from 'src/screens/Settings/components/Others/IncrementalSync';

// import WizAi from 'src/screens/WizAi/WizAi';

const MainLayout = lazy(() => import('src/MainLayout'));
const AddEditBuyerFlow = lazy(() => import('src/screens/BuyerLibrary/AddEditBuyerFlow/AddEditBuyerFlow'));
const OrderManagement = lazy(() => import('src/screens/OrderManagement/OrderManagement'));
const CheckoutManagement = lazy(() => import('src/screens/Checkout/Checkout'));
const CategoryHome = lazy(() => import('src/screens/ProductListing/components/Category'));
const CollectionHome = lazy(() => import('src/screens/ProductListing/components/Collection'));
const ProductListing = lazy(() => import('src/screens/ProductListing/ProductListing'));
const UserManagement = lazy(() => import('src/screens/UserManagement/UserManagement'));
const CartSummary = lazy(() => import('src/screens/CartSummary/CartSummary'));
const ProductDetails = lazy(() => import('src/screens/ProductDetailsPage/ProductDetails'));
const ViewBuyer = lazy(() => import('src/screens/BuyerLibrary/ViewBuyer/ViewBuyer'));
const BuyerListing = lazy(() => import('src/screens/BuyerLibrary/BuyerList'));
const CreateForm = lazy(() => import('src/screens/BuyerGroup/CreateBuyerGroup/CreateForm'));
const ProductListingPageByType = lazy(() => import('src/screens/ProductListing/components/ProductListingPageByType'));
const ViewAllRecommended = lazy(() => import('src/screens/ProductListing/components/ViewAllRecommended'));
const BuyerDashboard = lazy(() => import('src/screens/BuyerDashboard/BuyerDashboard'));
const BuyerGroupListing = lazy(() => import('src/screens/BuyerGroup/ViewBuyerGroup/BuyerGroupListing'));
const AllListing = lazy(() => import('src/screens/OrderManagement/OrderListing/OrderListingLayout'));
const Reporting = lazy(() => import('src/screens/Reporting/Reporting'));
const BuyersListing = lazy(() => import('src/screens/BuyerGroup/ViewBuyerGroup/BuyersListing'));
const ViewAllCustom = lazy(() => import('src/screens/ProductListing/components/ViewAllCustom'));
const LabelManagement = lazy(() => import('src/screens/LabelManagement/LabelManagement'));
const Dashboard = lazy(() => import('src/screens/Dashboard/Dashboard'));
const ResetPasswordConfirmation = lazy(() => import('src/screens/AuthFlow/ResetPasswordConfirmation/ResetPasswordConfirmation'));
const UserDrive = lazy(() => import('src/screens/UserDrive/UserDrive'));
const ManageData = lazy(() => import('src/screens/ManageData/ManageData'));
const OrderEndStatusPage = lazy(() => import('src/screens/OrderManagement/component/Common/OrderEndStatusPage'));
const MetabaseReporting = lazy(() => import('src/screens/Reporting/MetabaseReporting'));
const CreateCatalog = lazy(() => import('src/screens/CreateCatalog/CreateCatalog'));
const EditCatalog = lazy(() => import('src/screens/EditCatalog/EditCatalog'));
const Wishlist = lazy(() => import('src/screens/Wishlist/Wishlist'));
const WishlistDetails = lazy(() => import('src/screens/Wishlist/WishlistDetails'));
const CatalogManager = lazy(() => import('src/screens/CatalogManager/CatalogManager'));
const InventoryManagement = lazy(() => import('src/screens/InventoryManagement/InventoryManagement'));
const ForgotPassword = lazy(() => import('src/screens/AuthFlow/ForgotPassword/ForgotPassword'));
const Login = lazy(() => import('src/screens/AuthFlow/Login/Login'));
const ResetPassword = lazy(() => import('src/screens/AuthFlow/ResetPassword/ResetPassword'));
const ShortUrl = lazy(() => import('src/screens/AuthFlow/ShortUrl/ShortUrl'));
const ShortUrlLogout = lazy(() => import('src/screens/AuthFlow/ShortUrl/Logout'));
const WizOrderLogin = lazy(() => import('src/screens/AuthFlow/WizOrderLogin/wizorderLogin'));
const AddEditCardComponent = lazy(() => import('src/common/@the-source/molecules/AddEditCard/AddEditCardComponent'));
const Account = lazy(() => import('src/screens/Account/Account'));
const AddEditAchComponent = lazy(() => import('src/common/@the-source/molecules/AddEditAch/AddEditAchComponent'));
const Settings = lazy(() => import('src/screens/Settings/Settings'));
const Buyer = lazy(() => import('src/screens/Settings/components/Buyer/Buyer'));
const GeneralMain = lazy(() => import('src/screens/Settings/components/General/General'));
const CartSummarySettings = lazy(() => import('src/screens/Settings/components/Order/CartSummary'));
const Sales = lazy(() => import('src/screens/Settings/components/Order/Sales'));
const BuyerOthers = lazy(() => import('src/screens/Settings/components/Buyer/Others'));
const Inventory = lazy(() => import('src/screens/Settings/components/Inventory/Inventory'));
const Labels = lazy(() => import('src/screens/Settings/components/Product/Label'));
const TearSheet = lazy(() => import('src/screens/Settings/components/Product/TearSheet'));
const Listing = lazy(() => import('src/screens/Settings/components/Product/Listing'));
const ProductDetailsSetting = lazy(() => import('src/screens/Settings/components/Product/ProductDetail'));
const Document = lazy(() => import('src/screens/Settings/components/Order/Document'));
const DocumentPermission = lazy(() => import('src/screens/Settings/components/Order/DocumentPermission'));
const WizShopList = lazy(() => import('src/screens/BuyerLibrary/BuyerList/WizShopList'));
const NotFound404 = lazy(() => import('src/common/NotFound404'));
const EmailConfig = lazy(() => import('src/screens/Settings/components/Email/EmailConfig'));
const EmailTrigger = lazy(() => import('src/screens/Settings/components/Email/EmailTrigger'));
const PaymentForm = lazy(() => import('src/screens/Payment/component/PaymentForm'));
const ViewCardDetailsComponent = lazy(() => import('src/common/@the-source/molecules/ViewCard/ViewCard'));
const PaymentLayoutComp = lazy(() => import('src/screens/Payment/PaymentLayout'));

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

const RouteNames = {
	user_login: {
		path: '/user-login',
	},
	cart: {
		path: '/cart-summary',
	},
	dashboard: {
		path: is_store_front ? '/' : '/dashboard',
	},
	home: {
		path: '/',
	},
	signup: {
		path: '/signup/:action',
		routing_path: '/signup',
	},
	forgot_password: {
		path: '/forgot-password',
	},
	token_expired: {
		path: '/token-expired',
	},
	start_trial: {
		path: '/start-trial',
	},
	reset_password: {
		path: '/reset-password/:id/:token',
	},
	create_password: {
		path: '/create-password/:id/:token',
	},
	under_review: {
		path: '/under-review',
	},
	free_trial: {
		path: '/free-trial',
	},
	confirm_free_trial: {
		path: '/confirmed-demo',
	},
	reset_password_success: {
		path: '/reset-password-success',
	},
	short_url: {
		path: '/short_url/:token',
	},
	wizorder_login: {
		path: '/login/:token/:refresh_token/:is_tenant_selection_required',
	},
	naylas: {
		path: '/naylas_config',
	},
	account: {
		path: '/account',
		profile: {
			path: '/account/profile',
		},
		orders: {
			path: '/account/orders',
		},
		invoices: {
			path: '/account/invoices',
		},
		wishlist: {
			path: '/account/wishlist',
		},
	},
	settings: {
		path: '/settings',
		general: {
			path: 'general',
			company_info: {
				path: '/settings/general/company-info',
			},
			subscription: {
				path: '/settings/general/subscription',
			},
			email_setting: {
				path: '/settings/general/email-setting',
			},
			barcode_setting: {
				path: '/settings/general/barcode-setting',
			},
			import_setting: {
				path: '/settings/general/import-export',
			},
			json_rule: {
				path: '/settings/general/json-rule',
			},
			pricelist: {
				path: '/settings/general/pricelist',
			},
		},
		inventory: {
			path: 'inventory',
			inventory: {
				path: 'inventory',
			},
			inventory_display: {
				path: 'inventory-display',
			},
		},
		reporting: {
			path: 'reporting',
			reports: {
				path: 'reports',
			},
		},
		user_management: {
			path: 'user-management',
			showroom_mode: { path: 'showroom-mode' },
		},
		buyer: {
			path: 'buyer',
			form: {
				path: 'form',
			},
			permission: {
				path: 'permission',
			},
			other: {
				path: 'other',
			},
		},
		template: {
			path: 'template',
			tear_sheet_pdf: {
				path: 'tear_sheet_pdf',
			},
			tear_sheet_excel: {
				path: 'tear_sheet_excel',
			},
			label: {
				path: 'label',
			},
		},
		product: {
			path: 'product',
			product_details: {
				path: 'product_details',
			},
			listing: {
				path: 'listing',
			},
		},
		order_management: {
			path: 'order-management',
			document: {
				path: 'document',
			},
			document_permission: {
				path: 'permission',
			},
			charges: {
				path: 'charges',
			},
			sales: {
				path: 'sales',
			},
			tags: {
				path: 'tags',
			},
		},
		cart_summary: {
			path: 'cart-summary',
			cart_conatiner: {
				path: 'cart-container',
			},
			cart_grouping: {
				path: 'cart-grouping',
			},
		},
		user_setting: {
			path: 'user-setting',
			setting_config: {
				path: 'settings-config',
			},
		},
		email_setting: {
			path: 'email-setting',
			set_reminders: {
				path: 'set-reminders',
			},
			email_config: {
				path: 'email-config',
			},
			external_email: {
				path: 'external-email',
			},
			internal_email: {
				path: 'internal-email',
			},
		},
		others: {
			path: 'others',
			incremental_sync: {
				path: 'incremental-sync',
			},
		},
	},
	product: {
		path: 'product',
		all_products: {
			path: is_store_front ? '/all-products' : '/',
			category: {
				path: '/all-products/category',
			},
			recommendation: {
				path: '/all-products/recommendation',
			},
			previously_ordered: {
				path: '/all-products/previously_ordered',
			},
			abandoned_cart: {
				path: '/all-products/abandoned_cart',
			},
			category_listing: {
				path: '/all-products/category/products/:category_name/:category_id',
				routing_path: '/all-products/category/products/',
			},
			collection_listing: {
				path: '/all-products/collection/products/:collection_name/:collection_id',
				routing_path: '/all-products/collection/products/',
			},
			collection: {
				path: '/all-products/collection',
			},
			custom: {
				path: '/all-products/custom/:custom_collection',
				routing_path: '/all-products/custom/',
			},
			search: {
				path: '/all-products/search',
			},
			review: {
				path: '/all-products/review',
				edit: {
					path: '/all-products/review/edit/:catalog_id',
					routing_path: '/all-products/review/edit/',
				},
			},
		},
		product_detail: {
			path: '/product-details/:id',
			routing_path: '/product-details/',
			related_product: {
				path: '/product-details/:id/related-products',
			},
		},
		review: {
			path: '/review/:document_type/:document_id',
			routing_path: '/review/',
		},
		checkout: {
			path: '/checkout/:document_type/:document_id',
			routing_path: '/checkout/',
		},
		submitted_page: {
			path: '/review/:document_type/:document_id/:doc_status',
			routing_path: '/review/',
		},
	},
	labels: {
		path: '/labels',
	},
	create_account: {
		path: '/create-account',
	},
	user_management: {
		path: '/user-management/',
		users: {
			path: '/user-management/users',
		},
		add_user: {
			path: '/user-management/add-user',
		},
		edit_user: {
			path: '/user-management/edit-user/:id',
			routing_path: '/user-management/edit-user/',
		},
		roles: {
			path: '/user-management/roles',
		},
		add_role: {
			path: '/user-management/add-role',
		},
		edit_role: {
			path: '/user-management/edit-role/:id',
			routing_path: '/user-management/edit-role/',
		},
	},
	catelog_manager: {
		path: '/catalog-manager',
	},
	inventory: {
		path: '/inventory',
	},
	agrid: {
		path: '/aggrid',
	},
	wiz_insights: {
		path: '/wiz_insights',
	},
	buyer_library: {
		path: '/buyer',
		buyer_list: {
			path: '/buyer/buyer_list',
		},
		leads: {
			path: '/buyer/leads',
		},
		wizshop_users: {
			path: '/buyer/wizshop_users',
		},
		wiz_shop_list: {
			path: '/buyer-library/wizshop-list',
		},
		create_buyer: {
			path: '/buyer-library/create-buyer',
		},
		view_buyer: {
			path: '/buyer-library/view-buyer/:id',
			routing_path: '/buyer-library/view-buyer/',
		},
		edit_buyer: {
			path: '/buyer-library/edit-buyer/:id',
			routing_path: '/buyer-library/edit-buyer',
		},
	},
	payment: {
		path: '/payment',
		transactions: {
			path: '/payment/transactions',
		},
		recurring_payments: {
			path: '/payment/recurring-payments',
		},
		collect_payment: {
			path: '/payment/form/collect',
		},
		direct_payment: {
			path: '/payment/form/direct',
		},
		refund_payment: {
			path: '/payment/form/refund',
		},
		subscription_payment: {
			path: '/payment/form/subscription',
		},
		edit_payment_details: {
			path: '/payment/form/:source/:type/:id',
			routing_path: '/payment/form/collect/',
		},
		credits: {
			path: '/payment/form/credit',
		},
		authorize: {
			path: '/payment/form/authorize',
		},
	},
	buyer_group: {
		path: '/buyer-group/',
		create_group: {
			path: '/buyer-group/create',
		},
		edit_group: {
			path: '/buyer-group/edit/:id',
			routing_path: '/buyer-group/edit',
		},
		view_group: {
			path: '/buyer-group/view-list',
		},
		buyer_list: {
			path: '/buyer-group/buyer-list/:id',
			routing_path: '/buyer-group/buyer-list',
		},
	},
	buyer_dashboard: {
		path: 'buyer/dashboard/:buyer_id',
		routing_path: 'buyer/dashboard',
	},
	error_not_found: {
		path: '/404',
	},
	order_management: {
		path: 'order',
		// all_list: {
		// 	path: '/order-listing/all',
		// },
		order_list: {
			path: '/order-listing/order',
		},
		quote_list: {
			path: '/order-listing/quote',
		},
		draft_list: {
			path: '/order-listing/draft',
		},
		invoices: {
			path: '/order-listing/invoices',
		},
		payments: {
			path: '/order-listing/payments',
		},
		catalogs: {
			path: '/order-listing/catalogs',
		},
		abandoned_carts: {
			path: '/order-listing/abandoned-carts',
		},
	},
	manage_data: {
		path: '/manage-data',
	},
	reports: {
		main: {
			path: '/reports',
		},
		metabase: {
			path: '/metabase-reports',
		},
		sales_report: {
			path: '/metabase-reports/sales',
		},
		buyers_report: {
			path: '/metabase-reports/buyers',
		},
		product_report: {
			path: '/metabase-reports/product',
		},
		teams_report: {
			path: '/metabase-reports/teams',
		},
	},
	catalog: {
		create: {
			path: '/catalog/create',
		},
		edit: {
			path: '/catalog/edit/:id',
			routing_path: '/catalog/edit',
		},
	},
	wishlist: {
		path: '/wishlist',
		details: {
			path: '/wishlist/:id',
		},
	},
	user_drive: {
		path: '/user-drive',
		search: {
			path: '/user-drive/search',
		},
	},
	add_edit_ach: {
		path: '/add-edit-ach',
	},
	add_edit_card: {
		path: '/add-edit-card',
	},
	direct_payment: {
		path: '/direct-payment',
	},
	view_card_details: {
		path: '/view-card-details',
	},
};

const authRoutes: RouteObject[] = [
	{
		path: is_store_front ? RouteNames.user_login.path : RouteNames.home.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute path={RouteNames.user_login.path}>
					<Login />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.signup.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<Signup />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.forgot_password.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<ForgotPassword />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.token_expired.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<TokenExpired />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.start_trial.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<StartTrail />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.reset_password.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<ResetPassword />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.short_url.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<ShortUrl />
			</Suspense>
		),
	},
	{
		path: RouteNames.wizorder_login.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<WizOrderLogin />
			</Suspense>
		),
	},
	{
		path: RouteNames.create_password.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<CreatePassword />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.under_review.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<UnderReview />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.free_trial.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute path={RouteNames.free_trial.path}>
					<FreeTrial />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.confirm_free_trial.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute path={RouteNames.confirm_free_trial.path}>
					<ConfirmedDemo />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.reset_password_success.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<ResetPasswordConfirmation />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.reports.main.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<Reporting />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: '*',
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute allow_all>
					<Login />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.reports.sales_report.path,
		element: (
			<AuthRoute>
				<OutsideMetabaseReporting tab_name='Sales' />
			</AuthRoute>
		),
	},
	{
		path: RouteNames.reports.buyers_report.path,
		element: (
			<AuthRoute>
				<OutsideMetabaseReporting tab_name='Buyers' />
			</AuthRoute>
		),
	},
	{
		path: RouteNames.reports.product_report.path,
		element: (
			<AuthRoute>
				<OutsideMetabaseReporting tab_name='Product' />
			</AuthRoute>
		),
	},
	{
		path: RouteNames.reports.teams_report.path,

		element: (
			<AuthRoute>
				<OutsideMetabaseReporting tab_name='Team' />
			</AuthRoute>
		),
	},
	{
		path: RouteNames.add_edit_ach.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AddEditAchComponent />
			</Suspense>
		),
	},

	{
		path: RouteNames.add_edit_card.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<AddEditCardComponent />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.direct_payment.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<AuthRoute>
					<DirectPayment />
				</AuthRoute>
			</Suspense>
		),
	},
	{
		path: RouteNames.view_card_details.path,
		element: (
			<Suspense>
				<ViewCardDetailsComponent />
			</Suspense>
		),
	},
];

const mainRoutes: RouteObject[] = [
	{
		path: RouteNames.home.path,
		element: (
			<Suspense fallback={<LoaderScreen />}>
				<MainLayout />
			</Suspense>
		),
		children: [
			{
				path: RouteNames.reset_password.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reset_password.path}>
							<ResetPassword />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.reset_password_success.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reset_password_success.path}>
							<ResetPasswordConfirmation />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.reports.sales_report.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reports.sales_report.path}>
							<MetabaseReporting />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.reports.buyers_report.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reports.buyers_report.path}>
							<MetabaseReporting />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.reports.product_report.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reports.product_report.path}>
							<MetabaseReporting />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.reports.teams_report.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reports.teams_report.path}>
							<MetabaseReporting />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.dashboard.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.dashboard.path}>
							<Can I={PERMISSIONS.view_dashboard.slug} a={PERMISSIONS.view_dashboard.permissionType} passThrough>
								{(allowed: any) => (allowed ? <Dashboard /> : <ProductListing />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.forgot_password.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.forgot_password.path}>
							<Navigate to={RouteNames.home.path} replace={true} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.wizorder_login.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<WizOrderLogin />
					</Suspense>
				),
			},
			{
				path: RouteNames.reset_password.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reset_password.path}>
							<Navigate to={RouteNames.home.path} replace={true} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.short_url.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ShortUrlLogout />
					</Suspense>
				),
			},
			{
				path: RouteNames.reset_password_success.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reset_password_success.path}>
							<Navigate to={RouteNames.home.path} replace={true} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.cart.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.cart.path}>
							<CartSummary />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.product_detail.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.product_detail.path}>
							<ProductDetails />
						</ProtectedRoute>
					</Suspense>
				), // No slug available
			},
			{
				path: RouteNames.product.product_detail.related_product.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.product_detail.related_product.path}>
							<ViewAllRecommended type={'related-products'} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.category.path,
				// element: <CategoryHome />,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.category.path}>
							<CategoryHome />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.collection.path,
				// element: <CollectionHome />,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.collection.path}>
							<CollectionHome />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.recommendation.path,
				// element: <ViewAllRecommended />,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.recommendation.path}>
							<ViewAllRecommended />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.previously_ordered.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.previously_ordered.path}>
							<ViewAllRecommended type={'previous_order'} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.abandoned_cart.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.abandoned_cart.path}>
							<ViewAllRecommended type={'abondoned_cart'} />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.review.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ReviewProductListing />
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.review.edit.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ReviewProductListing is_edit_mode={true} />
					</Suspense>
				),
			},
			{
				path: RouteNames.inventory.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						{' '}
						<ProtectedRoute path={RouteNames.inventory.path}>
							<InventoryManagement />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.users.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.users.path}>
							<Can I={PERMISSIONS.view_user.slug} a={PERMISSIONS.view_user.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				// [TODO] [Suyash] Change to catalog while merge
				path: RouteNames.catelog_manager.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.catelog_manager.path}>
							<Can I={PERMISSIONS.view_catalog.slug} a={PERMISSIONS.view_catalog.permissionType} passThrough>
								{(allowed: any) => (allowed ? <CatalogManager /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.roles.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.roles.path}>
							<Can I={PERMISSIONS.view_role.slug} a={PERMISSIONS.view_role.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.add_role.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.add_role.path}>
							<Can I={PERMISSIONS.create_role.slug} a={PERMISSIONS.create_role.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.edit_role.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.edit_role.path}>
							<Can I={PERMISSIONS.edit_role.slug} a={PERMISSIONS.edit_role.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.add_user.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.add_user.path}>
							<Can I={PERMISSIONS.create_user.slug} a={PERMISSIONS.create_user.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_management.edit_user.path,
				// element: <UserManagement />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_management.edit_user.path}>
							<Can I={PERMISSIONS.edit_user.slug} a={PERMISSIONS.edit_user.permissionType} passThrough>
								{(allowed: any) => (allowed ? <UserManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.path}>
							<ProductListing />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.search.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.search.path}>
							<ProductListing />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.review.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.review.path}>
							<Can I={PERMISSIONS.view_orders.slug} a={PERMISSIONS.view_orders.permissionType} passThrough>
								{(allowed: any) => (allowed ? <OrderManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.checkout.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.checkout.path}>
							<Can I={PERMISSIONS.view_orders.slug} a={PERMISSIONS.view_orders.permissionType} passThrough>
								{(allowed: any) => (allowed && is_store_front ? <CheckoutManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.submitted_page.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.submitted_page.path}>
							<OrderEndStatusPage />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_library.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<ProtectedRoute path={RouteNames.buyer_library.path}>
						<BuyerListing />
					</ProtectedRoute>
				),
				children: [
					{
						path: RouteNames.buyer_library.buyer_list.path,
						element: <></>,
					},
					{
						path: RouteNames.buyer_library.wizshop_users.path,
						element: <></>,
					},

					{
						path: RouteNames.buyer_library.leads.path,
						element: <></>,
					},
				],
			},
			{
				path: RouteNames.buyer_library.wiz_shop_list.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_library.wiz_shop_list.path}>
							<Can I={PERMISSIONS.view_buyers.slug} a={PERMISSIONS.view_buyers.permissionType} passThrough>
								{(allowed: any) => (allowed ? <WizShopList /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_library.create_buyer.path,
				// element: <AddEditBuyerFlow />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_library.create_buyer.path}>
							<Can I={PERMISSIONS.create_buyers.slug} a={PERMISSIONS.create_buyers.permissionType} passThrough>
								{(allowed: any) => (allowed ? <AddEditBuyerFlow /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_library.view_buyer.path,
				// element: <ViewBuyer />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_library.view_buyer.path}>
							<Can I={PERMISSIONS.view_buyers.slug} a={PERMISSIONS.view_buyers.permissionType} passThrough>
								{(allowed: any) => (allowed ? <ViewBuyer /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_library.edit_buyer.path,
				// element: <AddEditBuyerFlow />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_library.edit_buyer.path}>
							<Can I={PERMISSIONS.edit_buyers.slug} a={PERMISSIONS.edit_buyers.permissionType} passThrough>
								{(allowed: any) => (allowed ? <AddEditBuyerFlow /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_group.create_group.path,
				// element: <CreateForm />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_group.create_group.path}>
							<Can I={PERMISSIONS.create_buyer_group.slug} a={PERMISSIONS.create_buyer_group.permissionType} passThrough>
								{(allowed: any) => (allowed ? <CreateForm /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_group.edit_group.path,
				// element: <CreateForm />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_group.edit_group.path}>
							<Can I={PERMISSIONS.edit_buyer_group.slug} a={PERMISSIONS.edit_buyer_group.permissionType} passThrough>
								{(allowed: any) => (allowed ? <CreateForm /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_group.view_group.path,
				// element: <BuyerGroupListing />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_group.view_group.path}>
							<Can I={PERMISSIONS.view_buyer_group.slug} a={PERMISSIONS.view_buyer_group.permissionType} passThrough>
								{(allowed: any) => (allowed ? <BuyerGroupListing /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_group.buyer_list.path,
				// element: <BuyersListing />,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_group.buyer_list.path}>
							<Can I={PERMISSIONS.view_buyers.slug} a={PERMISSIONS.view_buyers.permissionType} passThrough>
								{(allowed: any) => (allowed ? <BuyersListing /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.category_listing.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.category_listing.path}>
							<ProductListingPageByType />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.collection_listing.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.collection_listing.path}>
							<ProductListingPageByType />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.product.all_products.custom.path,
				// element: <ViewAllCustom />,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.product.all_products.custom.path}>
							<ViewAllCustom />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.labels.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.labels.path}>
							<Can I={PERMISSIONS.create_labels.slug} a={PERMISSIONS.create_labels.permissionType} passThrough>
								{(allowed: any) => (allowed ? <LabelManagement /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.buyer_dashboard.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.buyer_dashboard.path}>
							<Can I={PERMISSIONS.view_dashboard.slug} a={PERMISSIONS.view_dashboard.permissionType} passThrough>
								{(allowed: any) => (allowed ? <BuyerDashboard /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.collect_payment.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.direct_payment.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.refund_payment.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.subscription_payment.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.edit_payment_details.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			{
				path: RouteNames.payment.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentLayoutComp persist_tabs={true} />
					</Suspense>
				),
				children: [
					{
						path: RouteNames.payment.transactions.path,
						element: <></>,
					},
					{
						path: RouteNames.payment.recurring_payments.path,
						element: <></>,
					},
				],
			},
			{
				path: RouteNames.payment.authorize.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<PaymentForm />,
					</Suspense>
				),
			},
			// {
			// 	path: RouteNames.payment.path,
			// 	element: (
			// 		<Suspense fallback={<LoaderScreen />}>
			// 			<Payment />
			// 		</Suspense>
			// 	),
			// 	children: [
			// 		{
			// 			path: RouteNames.payment.transactions.path,
			// 			element: <Transactions />,
			// 		},
			// 		{
			// 			path: RouteNames.payment.transactions.path,
			// 			element: <Subscriptions />,
			// 		},
			// 	],
			// },
			{
				path: '/order-listing',
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={'/order-listing'}>
							<Can I={PERMISSIONS.view_orders.slug} a={PERMISSIONS.view_orders.permissionType} passThrough>
								{(allowed: any) => (allowed ? <AllListing /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
				children: [
					// {
					// 	path: RouteNames.order_management.all_list.path,
					// 	element: <></>,
					// },
					{
						path: RouteNames.order_management.draft_list.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.order_list.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.quote_list.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.invoices.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.payments.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.catalogs.path,
						element: <></>,
					},
					{
						path: RouteNames.order_management.abandoned_carts.path,
						element: <></>,
					},
				],
			},
			{
				path: RouteNames.reports.main.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.reports.main.path}>
							<Can I={PERMISSIONS.view_reports.slug} a={PERMISSIONS.view_reports.permissionType} passThrough>
								{(allowed: any) => (allowed ? <Reporting /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.manage_data.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.manage_data.path}>
							<Can I={PERMISSIONS.import_export.slug} a={PERMISSIONS.import_export.permissionType} passThrough>
								{(allowed: any) => (allowed ? <ManageData /> : <NotAllowed />)}
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.catalog.create.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.catalog.create.path}>
							<Can I={PERMISSIONS.create_catalog.slug} a={PERMISSIONS.create_catalog.permissionType} passThrough>
								<CreateCatalog />
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.catalog.edit.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.catalog.edit.path}>
							<Can I={PERMISSIONS.edit_catalog.slug} a={PERMISSIONS.edit_catalog.permissionType} passThrough>
								<EditCatalog />
							</Can>
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.account.path,
				element: is_store_front ? (
					<ProtectedRoute path={RouteNames.account.path}>
						<Account />
					</ProtectedRoute>
				) : (
					<NotAllowed />
				),
			},
			{
				path: RouteNames.wishlist.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.wishlist.path}>
							<Wishlist />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.wishlist.details.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.wishlist.details.path}>
							<WishlistDetails />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.account.path,
				element: is_store_front ? (
					<ProtectedRoute path={RouteNames.account.path}>
						<Account />
					</ProtectedRoute>
				) : (
					<NotAllowed />
				),
				children: [
					{
						path: RouteNames.account.profile.path,
						element: is_store_front ? <Profile /> : <NotAllowed />,
					},
					{
						path: RouteNames.account.orders.path,
						element: is_store_front ? <Orders /> : <NotAllowed />,
					},
					{
						path: RouteNames.account.invoices.path,
						element: is_store_front ? <Invoices /> : <NotAllowed />,
					},
					{
						path: RouteNames.account.wishlist.path,
						element: is_store_front ? <Wishlist /> : <NotAllowed />,
					},
				],
			},
			{
				path: RouteNames.settings.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					// <Can I={PERMISSIONS.org_settings.slug} a={PERMISSIONS.org_settings.permissionType} passThrough>
					<ProtectedRoute path={RouteNames.settings.path}>
						<Settings />
					</ProtectedRoute>
					// </Can>
				),
				children: [
					{
						path: RouteNames.settings.general.path,
						children: [
							{ path: RouteNames.settings.general.company_info.path, element: <GeneralMain /> },
							{ path: RouteNames.settings.general.subscription.path, element: <Subscription /> },
							{ path: RouteNames.settings.general.email_setting.path, element: <EmailSettings /> },
							{ path: RouteNames.settings.general.barcode_setting.path, element: <BarcodeSettings /> },
							{ path: RouteNames.settings.general.import_setting.path, element: <ImportExportSettings /> },
							{ path: RouteNames.settings.general.json_rule.path, element: <RuleEngine /> },
							{ path: RouteNames.settings.general.pricelist.path, element: <Pricelist /> },
						],
					},
					{
						path: RouteNames.settings.inventory.path,
						children: [
							{ path: RouteNames.settings.inventory.inventory.path, element: <Inventory /> },
							{ path: RouteNames.settings.inventory.inventory_display.path, element: <InventoryDisplay /> },
						],
					},
					{
						path: RouteNames.settings.reporting.path,
						children: [{ path: RouteNames.settings.reporting.reports.path, element: <ReportSettings /> }],
					},
					{
						path: RouteNames.settings.buyer.path,
						children: [
							{ path: RouteNames.settings.buyer.form.path, element: <Buyer /> },
							{ path: RouteNames.settings.buyer.permission.path, element: <CustomerPermission /> },
							{ path: RouteNames.settings.buyer.other.path, element: <BuyerOthers /> },
						],
					},
					{
						path: RouteNames.settings.order_management.path,
						children: [
							{ path: RouteNames.settings.order_management.document.path, element: <Document /> },
							{ path: RouteNames.settings.order_management.document_permission.path, element: <DocumentPermission /> },
							{ path: RouteNames.settings.order_management.charges.path, element: <CartSummarySettings /> },
							{ path: RouteNames.settings.order_management.sales.path, element: <Sales /> },
							{ path: RouteNames.settings.order_management.tags.path, element: <TagSetting /> },
						],
					},
					{
						path: RouteNames.settings.cart_summary.path,
						children: [
							{ path: RouteNames.settings.cart_summary.cart_conatiner.path, element: <ContainerSetting /> },
							{ path: RouteNames.settings.cart_summary.cart_grouping.path, element: <CartGrouping /> },
						],
					},
					{
						path: RouteNames.settings.user_setting.path,
						children: [{ path: RouteNames.settings.user_setting.setting_config.path, element: <SettingConfig /> }],
					},
					{
						path: RouteNames.settings.template.path,
						children: [
							{ path: RouteNames.settings.template.tear_sheet_pdf.path, element: <TearSheet /> },
							{ path: RouteNames.settings.template.tear_sheet_excel.path, element: <ExcelSheets /> },
							{ path: RouteNames.settings.template.label.path, element: <Labels /> },
						],
					},
					{
						path: RouteNames.settings.product.path,
						children: [
							{ path: RouteNames.settings.product.product_details.path, element: <ProductDetailsSetting /> },
							{ path: RouteNames.settings.product.listing.path, element: <Listing /> },
						],
					},
					{
						path: RouteNames.settings.user_management.path,
						children: [{ path: RouteNames.settings.user_management.showroom_mode.path, element: <ShowroomModeSetting /> }],
					},
					{
						path: RouteNames.settings.email_setting.path,
						children: [
							{ path: RouteNames.settings.email_setting.set_reminders.path, element: <SetReminder /> },
							{ path: RouteNames.settings.email_setting.email_config.path, element: <EmailConfig /> },
							{ path: RouteNames.settings.email_setting.external_email.path, element: <EmailTrigger type='external' /> },
							{ path: RouteNames.settings.email_setting.internal_email.path, element: <EmailTrigger type='internal' /> },
						],
					},
					{
						path: RouteNames.settings.others.path,
						children: [{ path: RouteNames.settings.others.incremental_sync.path, element: <IncrementalSync /> }],
					},
				],
			},
			{
				path: RouteNames.user_drive.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_drive.path}>
							<UserDrive />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.user_drive.search.path,
				element: is_store_front ? (
					<NotAllowed />
				) : (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path={RouteNames.user_drive.search.path}>
							<UserDrive />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: RouteNames.error_not_found.path,
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<NotFound404 />
					</Suspense>
				),
			},
			{
				path: '*',
				element: (
					<Suspense fallback={<LoaderScreen />}>
						<ProtectedRoute path='*' allow_all>
							<NotAllowed />
						</ProtectedRoute>
					</Suspense>
				),
			},
		],
	},
	{
		path: RouteNames.naylas.path,
		element: <LoadingScreen />,
	},
];

export const AuthRouter = createBrowserRouter(authRoutes);

export const MainRouter = createBrowserRouter(mainRoutes);

export const StorefrontRouter = createBrowserRouter([...authRoutes, ...mainRoutes]);

export default RouteNames;
