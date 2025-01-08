import { onDestroy } from 'svelte';

export type ControlParams<T = unknown> =
	| NumberControlParams<T>
	| CheckboxControlParams<T>
	| SelectControlParams<T>
	| TextControlParams<T>
	| ButtonControlParams<T>
	| ColorControlParams<T>;

type BaseControl<T> = {
	name: string;
	group?: string;
	value: T;
};

export type NumberControlParams<T> = {
	type: 'number' | 'range';
	min?: number;
	max?: number;
	step?: number;
} & BaseControl<T>;

export type CheckboxControlParams<T> = {
	type: 'checkbox';
	value: boolean;
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

export type ColorControlParams<T> = {
	type: 'color';
} & BaseControl<T>;

export type ButtonControlParams<T> = {
	type: 'button';
	label: string;
	onClick?: () => void;
} & BaseControl<T>;

type OnControlChangeCallback<T> = (value: T) => void;

let controls = $state<ControlParams[]>([]);

export function getControls() {
	function addControl<T>(params: ControlParams<T>) {
		let value = $state(params);
		let onChange = $state<OnControlChangeCallback<T>>();

		controls.push(value);

		let prevValue = value.value;
		$effect(() => {
			if (prevValue === value.value) return;
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
			set value(newValue) {
				value.value = newValue;
			},
			set params(params: ControlParams<T>) {
				value = params;
			},
			get params() {
				return params;
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
