/* eslint-disable */
import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Counter from './Counter';

export default {
	title: 'Components/Counter',
	component: Counter,
} as Meta<typeof Counter>;

export const Interactive: StoryObj = {
	render: (args) => {
		// const [count, setCount] = useState(0);
		const incrementCounter = () => {};
		const decrementCounter = () => {};
		return (
			<Box
				sx={{
					width: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					min={0}
					max={100}
					step={10}
					// count={count}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					// count={count}
					min={0}
					max={100}
					step={10}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					// count={count}
					min={0}
					max={100}
					step={10}
					{...args}
				/>
			</Box>
		);
	},
};

export const AllVariants: StoryObj = {
	render: (args) => {
		const [count, setCount] = useState(0);
		const incrementCounter = (val: any) => {
			setCount(count + 1);
		};
		const decrementCounter = () => {
			setCount(count - 1);
		};
		return (
			<Box
				sx={{
					width: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					initialCount={5}
					isBtnDisableOnMin
					min={5}
					max={100}
					step={5}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					initialCount={25}
					min={15}
					max={100}
					step={10}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					hasVariant
					handleVariant={() => console.log('handle variant')}
					handleRemoveFromCart={() => {}}
					min={15}
					max={100}
					step={10}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					initialCount={24}
					min={12}
					max={100}
					step={15}
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					initialCount={24}
					min={12}
					max={100}
					step={15}
					error
					{...args}
				/>
				<Counter
					handleIncrement={incrementCounter}
					handleDecrement={decrementCounter}
					handleLimit={() => {}}
					handleRemoveFromCart={() => {}}
					initialCount={24}
					min={12}
					max={100}
					step={15}
					disableIncrement
					{...args}
				/>
			</Box>
		);
	},
};
