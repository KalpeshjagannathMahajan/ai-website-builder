import { Button } from '@mui/material';
import { Meta, StoryFn, StoryObj } from '@storybook/react';

import Chip from '../Chips/Chip';
import Menu from './Menu';
import classes from './Menu.module.css';

export default {
	title: 'Components/Menu',
	component: Menu,
} as Meta<typeof Menu>;

export const BasicMenu: StoryFn = () => (
	<Menu
		closeOnItemClick
		LabelComponent={
			<Button variant='contained' color='primary'>
				Dashboard
			</Button>
		}
		onClickMenuItem={(item: any) => {
			console.log(item);
		}}
		menu={[{ label: 'Menu Item One' }, { label: 'Menu Item Two' }, { label: 'Menu Item 3', icon: 'downloadCloud' }]}
	/>
);

export const MenuWithSubText: StoryObj = {
	render: (args) => (
		<Menu
			LabelComponent={
				<Button variant='contained' color='primary'>
					Dashboard
				</Button>
			}
			menu={[
				{
					label: 'Menu Item One',
					subText: 'description for menu item',
				},
				{ label: 'Menu Item Two' },
			]}
			{...args}
		/>
	),
};

export const MenuWithIcons: StoryObj = {
	render: (args) => (
		<Menu
			LabelComponent={
				<Button variant='contained' color='primary'>
					Dashboard
				</Button>
			}
			menu={[
				{
					label: 'Menu Item One',
					icon: 'downloadCloud',
					subText: 'description for menu item',
				},
				{ label: 'Menu Item Two', icon: 'check' },
				{ label: 'Menu Item 3', icon: 'addUser' },
			]}
			{...args}
		/>
	),
};

export const MenuStory = () => (
	<Menu
		LabelComponent={
			<Button variant='contained' color='primary'>
				Dashboard
			</Button>
		}
		menu={[
			{
				label: 'Menu Item One',
				icon: 'downloadCloud',
				subText: 'description for menu item',
			},
			{
				label: 'Menu Item Two',
				icon: 'check',
				subText: 'description for menu item',
			},
			{
				label: 'Menu Item 3',
				icon: 'addUser',
				subText: 'description for menu item',
			},
		]}
	/>
);

export const ChipDropdown = () => (
	<Menu
		className={classes.chipDropdown}
		LabelComponent={<Chip label='Chipped' />}
		menu={[
			{
				label: 'Menu Item One',
				icon: 'downloadCloud',
				subText: 'description for menu item',
			},
			{
				label: 'Menu Item Two',
				icon: 'check',
				subText: 'description for menu item',
			},
			{
				label: 'Menu Item 3',
				icon: 'addUser',
				subText: 'description for menu item',
			},
		]}
	/>
);
