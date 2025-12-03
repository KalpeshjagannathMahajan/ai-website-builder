// Necessary Imports and constants for this discount rule engine for Cart, Product and Document
import dayjs from 'dayjs';
import jsonLogic from 'json-logic-js';
import _ from 'lodash';
const current_time_now = dayjs().valueOf();

// Steps for getting Max valid discount for product/cart/document from events

// Step 1: Get all discount campaigns
// Step 2: Get value of all discount campaign which contains discount campaign data along with is_eligible and discounted_value
// Step 3: Filter the data of campaigns for filtered campaigns on base of is_eligible ==> 1,2,3...
// Step 4: Get Max value providing campaign from filtered data
// Step 5: return discount campaign data  along with discounted value

// Eligibilty criteria

// Step 1: Check the status of campaign along with time validations
// Step 2: Check eligibilty with customer rule
// Step 3: Check eligibilty with product rule (only in case of product discount)

// Discounted value calculations

// Get Selling price of product and cart total (for cart and document)
// Get discount_rule from campaign
// return final price from calculated total/price on base of discount rule

// Master Rule for Discount Engine
export const master_discount_rule: any = {
	product_campaign_eligibility: {
		filter: [
			{
				var: 'product_discount',
			},
			{
				and: [
					{
						'==': [
							{
								var: 'discount_campaign_status',
							},
							'active',
						],
					},
					{
						var: 'is_customer_eligible',
					},
					{
						var: 'is_product_eligible',
					},
					{
						'<=': [
							{
								var: 'start_time',
							},
							{
								var: 'current_time',
							},
						],
					},
					{
						'>=': [
							{
								var: 'end_time',
							},
							{
								var: 'current_time',
							},
						],
					},
					{
						in: [
							'wizshop',
							{
								var: 'channel',
							},
						],
					},
				],
			},
		],
	},
	cart_campaign_eligibility: {
		filter: [
			{
				var: 'cart_discount',
			},
			{
				and: [
					{
						'==': [
							{
								var: 'discount_campaign_status',
							},
							'active',
						],
					},
					{
						var: 'is_customer_eligible',
					},
					{
						var: 'campaign_eligible',
					},
					{
						'>': [
							{
								var: 'discount_value',
							},
							0,
						],
					},
					{
						'<=': [
							{
								var: 'start_time',
							},
							{
								var: 'current_time',
							},
						],
					},
					{
						'>=': [
							{
								var: 'end_time',
							},
							{
								var: 'current_time',
							},
						],
					},
					{
						in: [
							'wizshop',
							{
								var: 'channel',
							},
						],
					},
				],
			},
		],
	},
	product_get_discount_object: {
		is_customer_eligible: {
			if: [
				{
					'==': [
						{
							var: 'item.customer_eligibility.type',
						},
						'all',
					],
				},
				true,
				{
					if: [
						{
							'==': [
								{
									var: 'item.customer_eligibility.type',
								},
								'customer',
							],
						},
						{
							if: [
								{
									in: [
										{
											var: 'customer_data.id',
										},
										{
											var: 'item.customer_eligibility.data',
										},
									],
								},
								true,
							],
						},
						{
							if: [
								{
									'==': [
										{
											var: 'item.customer_eligibility.type',
										},
										'segment',
									],
								},
								{
									segement_handling: [
										{
											var: 'item.customer_eligibility_rule',
										},
										{
											var: 'customer_data',
										},
									],
								},
								false,
							],
						},
					],
				},
			],
		},
		is_product_eligible: {
			if: [
				{
					or: [
						{
							var: 'product_data.is_customizable',
						},
						{
							var: 'product_data.is_parent_customizable',
						},
						{
							var: 'product_data.pricing.volume_tiers',
						},
						{
							'==': [
								{
									var: 'product_data.product_state',
								},
								'ADHOC',
							],
						},
					],
				},
				false,
				{
					if: [
						{
							'==': [
								{
									var: 'item.product_eligibility.type',
								},
								'all',
							],
						},
						true,
						{
							if: [
								{
									'==': [
										{
											var: 'item.product_eligibility.type',
										},
										'product',
									],
								},
								{
									in: [
										{
											var: 'product_data.id',
										},
										{
											var: 'item.product_eligibility.data',
										},
									],
								},
								{
									if: [
										{
											'==': [
												{
													var: 'item.product_eligibility.type',
												},
												'segment',
											],
										},
										{
											segement_handling: [
												{
													var: 'item.product_eligibility_rule',
												},
												{
													var: 'product_data',
												},
											],
										},
										false,
									],
								},
							],
						},
					],
				},
			],
		},
		discount_value: {
			if: [
				{
					'==': [
						{
							var: 'item.configuration.type',
						},
						'percentage',
					],
				},
				{
					'*': [
						{
							var: 'product_data.pricing.price',
						},
						{
							'/': [
								{
									var: 'item.configuration.value',
								},
								100,
							],
						},
					],
				},
				{
					if: [
						{
							'<=': [
								{
									var: 'product_data.pricing.price',
								},
								{
									var: 'item.configuration.value',
								},
							],
						},
						{
							var: 'product_data.pricing.price',
						},
						{
							var: 'item.configuration.value',
						},
					],
				},
			],
		},
		discounted_value: {
			if: [
				{
					'==': [
						{
							var: 'item.configuration.type',
						},
						'percentage',
					],
				},
				{
					'*': [
						{
							var: 'product_data.pricing.price',
						},
						{
							'-': [
								1,
								{
									'/': [
										{
											var: 'item.configuration.value',
										},
										100,
									],
								},
							],
						},
					],
				},
				{
					if: [
						{
							var: 'item.configuration.type',
						},
						{
							if: [
								{
									'<=': [
										{
											var: 'product_data.pricing.price',
										},
										{
											var: 'item.configuration.value',
										},
									],
								},
								0,
								{
									'-': [
										{
											var: 'product_data.pricing.price',
										},
										{
											var: 'item.configuration.value',
										},
									],
								},
							],
						},
						{
							var: 'product_data.pricing.price',
						},
					],
				},
			],
		},
	},
	cart_get_discount_object: {
		is_customer_eligible: {
			if: [
				{
					'==': [
						{
							var: 'item.customer_eligibility.type',
						},
						'all',
					],
				},
				true,
				{
					if: [
						{
							'==': [
								{
									var: 'item.customer_eligibility.type',
								},
								'customer',
							],
						},
						{
							if: [
								{
									var: 'customer_data.is_guest_buyer',
								},
								true,
								{
									in: [
										{
											var: 'customer_data.id',
										},
										{
											var: 'item.customer_eligibility.data',
										},
									],
								},
							],
						},
						{
							if: [
								{
									'==': [
										{
											var: 'item.customer_eligibility.type',
										},
										'segment',
									],
								},
								{
									segement_handling: [
										{
											var: 'item.customer_eligibility_rule',
										},
										{
											var: 'customer_data',
										},
									],
								},
								false,
							],
						},
					],
				},
			],
		},
		campaign_eligible: {
			and: [
				{
					if: [
						{
							var: 'item.discount_application.minimum_cart_value',
						},
						{
							'<=': [
								{
									var: 'item.discount_application.minimum_cart_value',
								},
								{
									var: 'cart_data.cart_total',
								},
							],
						},
						true,
					],
				},
				{
					if: [
						{
							var: 'customer_data.is_guest_buyer',
						},
						true,
						{
							if: [
								{
									var: 'item.redemption_count',
								},
								{
									'<': [
										{
											var: 'item.redemption_count',
										},
										{
											var: 'item.campaign_limit',
										},
									],
								},
								true,
							],
						},
					],
				},
			],
		},
		discount_value: {
			if: [
				{
					'<=': [
						{
							var: 'cart_data.cart_total',
						},
						{
							if: [
								{
									var: 'item.discount_application.maximum_discount_value',
								},
								{
									if: [
										{
											'>=': [
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'percentage',
															],
														},
														{
															'*': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	'/': [
																		{
																			var: 'item.configuration.value',
																		},
																		100,
																	],
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'value',
																	],
																},
																{
																	if: [
																		{
																			'<=': [
																				{
																					var: 'cart_data.cart_total',
																				},
																				{
																					var: 'item.configuration.value',
																				},
																			],
																		},
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	if: [
																		{
																			'==': [
																				{
																					var: 'item.configuration.type',
																				},
																				'slab',
																			],
																		},
																		{
																			cart_segement_handling: [
																				{
																					var: 'item.cart_eligibility_rule',
																				},
																				{
																					var: 'cart_data',
																				},
																			],
																		},
																		0,
																	],
																},
															],
														},
													],
												},
												{
													var: 'item.discount_application.maximum_discount_value',
												},
											],
										},
										{
											var: 'item.discount_application.maximum_discount_value',
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'percentage',
													],
												},
												{
													'*': [
														{
															var: 'cart_data.cart_total',
														},
														{
															'/': [
																{
																	var: 'item.configuration.value',
																},
																100,
															],
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'value',
															],
														},
														{
															if: [
																{
																	'<=': [
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'slab',
																	],
																},
																{
																	cart_segement_handling: [
																		{
																			var: 'item.cart_eligibility_rule',
																		},
																		{
																			var: 'cart_data',
																		},
																	],
																},
																0,
															],
														},
													],
												},
											],
										},
									],
								},
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'percentage',
											],
										},
										{
											'*': [
												{
													var: 'cart_data.cart_total',
												},
												{
													'/': [
														{
															var: 'item.configuration.value',
														},
														100,
													],
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'value',
													],
												},
												{
													if: [
														{
															'<=': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															var: 'cart_data.cart_total',
														},
														{
															var: 'item.configuration.value',
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'slab',
															],
														},
														{
															cart_segement_handling: [
																{
																	var: 'item.cart_eligibility_rule',
																},
																{
																	var: 'cart_data',
																},
															],
														},
														0,
													],
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					var: 'cart_data.cart_total',
				},
				{
					if: [
						{
							var: 'item.discount_application.maximum_discount_value',
						},
						{
							if: [
								{
									'>=': [
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'percentage',
													],
												},
												{
													'*': [
														{
															var: 'cart_data.cart_total',
														},
														{
															'/': [
																{
																	var: 'item.configuration.value',
																},
																100,
															],
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'value',
															],
														},
														{
															if: [
																{
																	'<=': [
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'slab',
																	],
																},
																{
																	cart_segement_handling: [
																		{
																			var: 'item.cart_eligibility_rule',
																		},
																		{
																			var: 'cart_data',
																		},
																	],
																},
																0,
															],
														},
													],
												},
											],
										},
										{
											var: 'item.discount_application.maximum_discount_value',
										},
									],
								},
								{
									var: 'item.discount_application.maximum_discount_value',
								},
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'percentage',
											],
										},
										{
											'*': [
												{
													var: 'cart_data.cart_total',
												},
												{
													'/': [
														{
															var: 'item.configuration.value',
														},
														100,
													],
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'value',
													],
												},
												{
													if: [
														{
															'<=': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															var: 'cart_data.cart_total',
														},
														{
															var: 'item.configuration.value',
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'slab',
															],
														},
														{
															cart_segement_handling: [
																{
																	var: 'item.cart_eligibility_rule',
																},
																{
																	var: 'cart_data',
																},
															],
														},
														0,
													],
												},
											],
										},
									],
								},
							],
						},
						{
							if: [
								{
									'==': [
										{
											var: 'item.configuration.type',
										},
										'percentage',
									],
								},
								{
									'*': [
										{
											var: 'cart_data.cart_total',
										},
										{
											'/': [
												{
													var: 'item.configuration.value',
												},
												100,
											],
										},
									],
								},
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'value',
											],
										},
										{
											if: [
												{
													'<=': [
														{
															var: 'cart_data.cart_total',
														},
														{
															var: 'item.configuration.value',
														},
													],
												},
												{
													var: 'cart_data.cart_total',
												},
												{
													var: 'item.configuration.value',
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'slab',
													],
												},
												{
													cart_segement_handling: [
														{
															var: 'item.cart_eligibility_rule',
														},
														{
															var: 'cart_data',
														},
													],
												},
												0,
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		discounted_value: {
			'-': [
				{
					var: 'cart_data.cart_total',
				},
				{
					if: [
						{
							'<=': [
								{
									var: 'cart_data.cart_total',
								},
								{
									if: [
										{
											var: 'item.discount_application.maximum_discount_value',
										},
										{
											if: [
												{
													'>=': [
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'percentage',
																	],
																},
																{
																	'*': [
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			'/': [
																				{
																					var: 'item.configuration.value',
																				},
																				100,
																			],
																		},
																	],
																},
																{
																	if: [
																		{
																			'==': [
																				{
																					var: 'item.configuration.type',
																				},
																				'value',
																			],
																		},
																		{
																			if: [
																				{
																					'<=': [
																						{
																							var: 'cart_data.cart_total',
																						},
																						{
																							var: 'item.configuration.value',
																						},
																					],
																				},
																				{
																					var: 'cart_data.cart_total',
																				},
																				{
																					var: 'item.configuration.value',
																				},
																			],
																		},
																		{
																			if: [
																				{
																					'==': [
																						{
																							var: 'item.configuration.type',
																						},
																						'slab',
																					],
																				},
																				{
																					cart_segement_handling: [
																						{
																							var: 'item.cart_eligibility_rule',
																						},
																						{
																							var: 'cart_data',
																						},
																					],
																				},
																				0,
																			],
																		},
																	],
																},
															],
														},
														{
															var: 'item.discount_application.maximum_discount_value',
														},
													],
												},
												{
													var: 'item.discount_application.maximum_discount_value',
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'percentage',
															],
														},
														{
															'*': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	'/': [
																		{
																			var: 'item.configuration.value',
																		},
																		100,
																	],
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'value',
																	],
																},
																{
																	if: [
																		{
																			'<=': [
																				{
																					var: 'cart_data.cart_total',
																				},
																				{
																					var: 'item.configuration.value',
																				},
																			],
																		},
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	if: [
																		{
																			'==': [
																				{
																					var: 'item.configuration.type',
																				},
																				'slab',
																			],
																		},
																		{
																			cart_segement_handling: [
																				{
																					var: 'item.cart_eligibility_rule',
																				},
																				{
																					var: 'cart_data',
																				},
																			],
																		},
																		0,
																	],
																},
															],
														},
													],
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'percentage',
													],
												},
												{
													'*': [
														{
															var: 'cart_data.cart_total',
														},
														{
															'/': [
																{
																	var: 'item.configuration.value',
																},
																100,
															],
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'value',
															],
														},
														{
															if: [
																{
																	'<=': [
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'slab',
																	],
																},
																{
																	cart_segement_handling: [
																		{
																			var: 'item.cart_eligibility_rule',
																		},
																		{
																			var: 'cart_data',
																		},
																	],
																},
																0,
															],
														},
													],
												},
											],
										},
									],
								},
							],
						},
						{
							var: 'cart_data.cart_total',
						},
						{
							if: [
								{
									var: 'item.discount_application.maximum_discount_value',
								},
								{
									if: [
										{
											'>=': [
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'percentage',
															],
														},
														{
															'*': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	'/': [
																		{
																			var: 'item.configuration.value',
																		},
																		100,
																	],
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'value',
																	],
																},
																{
																	if: [
																		{
																			'<=': [
																				{
																					var: 'cart_data.cart_total',
																				},
																				{
																					var: 'item.configuration.value',
																				},
																			],
																		},
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	if: [
																		{
																			'==': [
																				{
																					var: 'item.configuration.type',
																				},
																				'slab',
																			],
																		},
																		{
																			cart_segement_handling: [
																				{
																					var: 'item.cart_eligibility_rule',
																				},
																				{
																					var: 'cart_data',
																				},
																			],
																		},
																		0,
																	],
																},
															],
														},
													],
												},
												{
													var: 'item.discount_application.maximum_discount_value',
												},
											],
										},
										{
											var: 'item.discount_application.maximum_discount_value',
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'percentage',
													],
												},
												{
													'*': [
														{
															var: 'cart_data.cart_total',
														},
														{
															'/': [
																{
																	var: 'item.configuration.value',
																},
																100,
															],
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'value',
															],
														},
														{
															if: [
																{
																	'<=': [
																		{
																			var: 'cart_data.cart_total',
																		},
																		{
																			var: 'item.configuration.value',
																		},
																	],
																},
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															if: [
																{
																	'==': [
																		{
																			var: 'item.configuration.type',
																		},
																		'slab',
																	],
																},
																{
																	cart_segement_handling: [
																		{
																			var: 'item.cart_eligibility_rule',
																		},
																		{
																			var: 'cart_data',
																		},
																	],
																},
																0,
															],
														},
													],
												},
											],
										},
									],
								},
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'percentage',
											],
										},
										{
											'*': [
												{
													var: 'cart_data.cart_total',
												},
												{
													'/': [
														{
															var: 'item.configuration.value',
														},
														100,
													],
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'value',
													],
												},
												{
													if: [
														{
															'<=': [
																{
																	var: 'cart_data.cart_total',
																},
																{
																	var: 'item.configuration.value',
																},
															],
														},
														{
															var: 'cart_data.cart_total',
														},
														{
															var: 'item.configuration.value',
														},
													],
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'slab',
															],
														},
														{
															cart_segement_handling: [
																{
																	var: 'item.cart_eligibility_rule',
																},
																{
																	var: 'cart_data',
																},
															],
														},
														0,
													],
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		discount_type: {
			if: [
				{
					var: 'item.discount_application.maximum_discount_value',
				},
				{
					if: [
						{
							'>=': [
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'percentage',
											],
										},
										{
											'*': [
												{
													var: 'cart_data.cart_total',
												},
												{
													'/': [
														{
															var: 'item.configuration.value',
														},
														100,
													],
												},
											],
										},
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'value',
													],
												},
												{
													var: 'item.configuration.value',
												},
												{
													if: [
														{
															'==': [
																{
																	var: 'item.configuration.type',
																},
																'slab',
															],
														},
														{
															cart_segement_handling: [
																{
																	var: 'item.cart_eligibility_rule',
																},
																{
																	var: 'cart_data',
																},
															],
														},
														0,
													],
												},
											],
										},
									],
								},
								{
									var: 'item.discount_application.maximum_discount_value',
								},
							],
						},
						'value',
						{
							if: [
								{
									'==': [
										{
											var: 'item.configuration.type',
										},
										'percentage',
									],
								},
								'percentage',
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'value',
											],
										},
										'value',
										{
											if: [
												{
													'==': [
														{
															var: 'item.configuration.type',
														},
														'slab',
													],
												},
												'slab',
											],
										},
									],
								},
							],
						},
					],
				},
				{
					if: [
						{
							'==': [
								{
									var: 'item.configuration.type',
								},
								'percentage',
							],
						},
						'percentage',
						{
							if: [
								{
									'==': [
										{
											var: 'item.configuration.type',
										},
										'value',
									],
								},
								'value',
								{
									if: [
										{
											'==': [
												{
													var: 'item.configuration.type',
												},
												'slab',
											],
										},
										'slab',
									],
								},
							],
						},
					],
				},
			],
		},
	},
	max_discount_rule: {
		max_discount: [
			{
				var: 'objects',
			},
		],
	},
};

// Added custom JSON logics

// time_validate for running time validation
jsonLogic.add_operation('time_validate', (start_time, current_time, end_time) => {
	return start_time <= current_time && current_time <= end_time;
});

// segement_handling for running json rule which specific for each campaign based on requirement
jsonLogic.add_operation('segement_handling', (rule, whole_data) => {
	const answer = jsonLogic.apply(rule, whole_data);
	return !!answer;
});
jsonLogic.add_operation('cart_segement_handling', (rule, whole_data) => {
	const answer = jsonLogic.apply(rule, { cart_data: { cart_total: whole_data?.cart_total } });
	return answer;
});

// max_calculation for returning valid max object to user
jsonLogic.add_operation('max_discount', (objects) => {
	const result = _.reduce(
		objects,
		(acc: any, current: any) => {
			if (
				!acc ||
				current?.discount_value > acc?.discount_value ||
				(current?.discount_value === acc?.discount_value && current?.created_at > acc?.created_at)
			) {
				return current;
			}
			return acc;
		},
		null,
	);
	return result;
});

// function to get discount object from discount rule
export const valid_discount_for_product = (
	master_discount_rule_config: any,
	discount_campaigns: any,
	product_info: any,
	buyer_info: any,
	from_redux: boolean = true,
) => {
	// getting updated cart/document discount campaign
	const new_product_discount_campaigns: any = [];
	_.map(discount_campaigns, (item: any) => {
		let result: any = {};
		_.mapKeys(master_discount_rule_config?.product_get_discount_object, (logic: any, keys: any) => {
			let value: any;
			value = jsonLogic.apply(logic, {
				item,
				product_data: product_info,
				customer_data: {
					...(from_redux ? buyer_info?.buyer_info : buyer_info),
					is_guest_buyer: from_redux ? buyer_info?.is_guest_buyer : false,
				},
			});
			result[keys] = logic === 'discount_value' || logic === 'discounted_value' ? value : value || false;
		});
		new_product_discount_campaigns.push({
			...item,
			...result,
			current_time: current_time_now,
			start_time: item?.start_date,
			end_time: item?.end_date,
		});
	});

	// apply json logic rule on  cart/document data for each campaign to get discount objects
	const discount_rule = jsonLogic.apply(master_discount_rule_config?.product_campaign_eligibility, {
		product_discount: new_product_discount_campaigns,
	});

	// get discount value from discount rule for each discount campaign and return max discount
	const filtered_campaign: any = jsonLogic.apply(master_discount_rule_config?.max_discount_rule, { objects: discount_rule });

	// return valid max discount value for that product
	return filtered_campaign;
};

// function to get discount object from discount rule
export const valid_discount_for_cart_document = (cart_discount: any, master_discount_rule_config: any, cart_data: any, buyer: any) => {
	// getting updated cart/document discount campaign

	const new_cart_discount_campaigns: any = [];
	_.map(cart_discount, (item: any) => {
		let result: any = {};
		_.mapKeys(master_discount_rule.cart_get_discount_object, (logic: any, keys: any) => {
			let value: any;
			value = jsonLogic.apply(logic, {
				item,
				cart_data,
				customer_data: { ...(buyer?.buyer_info ? buyer?.buyer_info : {}), is_guest_buyer: buyer?.is_guest_buyer },
			});
			result[keys] = logic === 'discount_value' || logic === 'discounted_value' ? value : value || false;
		});
		new_cart_discount_campaigns.push({
			...item,
			...result,
			current_time: current_time_now,
			start_time: item?.start_date,
			end_time: item?.end_date,
		});
	});

	// apply json logic rule on  cart/document data for each campaign to get discount objects
	const cart_discount_rule = jsonLogic.apply(master_discount_rule_config.cart_campaign_eligibility, {
		cart_discount: new_cart_discount_campaigns,
	});

	// get discount value from discount rule for each discount campaign and return max discount
	const cart_filtered_campaign: any = jsonLogic.apply(master_discount_rule_config.max_discount_rule, { objects: cart_discount_rule });
	// return valid max discount value for that  cart
	return cart_filtered_campaign;
};

//function to get filtered discount according to buyer
export const filtered_valid_discounts_for_buyer = (campaign_list: any, master_discount_rule_config: any, buyer_info: any) => {
	const new_product_discount_campaigns: any = [];
	_.map(campaign_list, (item: any) => {
		let result: any = {};

		new_product_discount_campaigns.push({
			...item,
			...result,
			is_customer_eligible: jsonLogic.apply(master_discount_rule_config.product_get_discount_object.is_customer_eligible, {
				item,
				customer_data: { ...buyer_info?.buyer_info, is_guest_buyer: buyer_info?.is_guest_buyer },
			}),
			is_product_eligible: true,
			current_time: current_time_now,
			start_time: item?.start_date,
			end_time: item?.end_date,
		});
	});

	// apply json logic rule on  cart/document data for each campaign to get discount objects
	const discount_rule = jsonLogic.apply(master_discount_rule_config.product_campaign_eligibility, {
		product_discount: new_product_discount_campaigns,
	});
	return _.map(discount_rule, (item: any) => {
		return item?.id;
	});
};
