import { onDestroy } from 'svelte';

export type ControlParams<T = unknown> =
	| NumberControlParams<T>
	| CheckboxControlParams<T>
	| SelectControlParams<T>
	| TextControlParams<T>
	| ButtonControlParams<T>;

type BaseControl<T> = {
	name: string;
	value: T;
};

export type NumberControlParams<T> = {
	type: 'number' | 'range';
	min?: number | string;
	max?: number | string;
	step?: number | string;
} & BaseControl<T>;

export type CheckboxControlParams<T> = {
	type: 'checkbox';
} & BaseControl<T>;

export type SelectControlParams<T> = {
	type: 'select';
	options: {
		label?: string;
		value: T;
	}[];
} & BaseControl<T>;

export type TextControlParams<T> = {
	type: 'text';
} & BaseControl<T>;

export type ButtonControlParams<T> = {
	type: 'button';
	label: string;
	onClick: () => void;
} & BaseControl<T>;

type OnControlChangeCallback<T> = (value: T) => void;

let controls = $state<ControlParams[]>([]);

export function getSettings() {
	function addControl<T>(params: ControlParams<T>) {
		let value = $state(params);
		let onChange = $state<OnControlChangeCallback<T>>();

		controls.push(value);

		$effect(() => {
			onChange?.(value.value);
		});

		function remove() {
			const index = controls.indexOf(value);
			controls.splice(index, 1);
		}

		onDestroy(remove);

		return {
			get value() {
				return value.value;
			},
			onChange: (callback: OnControlChangeCallback<T>) => {
				onChange = callback;
			},
			remove,
		};
	}

	return {
		get controls() {
			return controls;
		},
		addControl,
	};
}