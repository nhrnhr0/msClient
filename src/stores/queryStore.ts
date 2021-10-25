// SPDX-License-Identifier: CC0-1.0
import { goto } from '$app/navigation';
import type { Subscriber, Unsubscriber, Updater, Writable } from 'svelte/store';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { Page } from '@sveltejs/kit';

declare type Invalidator<T> = (value?: T) => void;




export const location2query = <T extends Record<string, string | string[]>>(value: Page): T => {
	const currentQuery: T = {} as T;
	value.query.forEach((_, key) => {
		if (key.endsWith('[]')) {
			currentQuery[key as keyof T] = value.query.getAll(key) as T[keyof T];
		} else {
			currentQuery[key as keyof T] = _ as T[keyof T];
		}
	});
	return currentQuery;
};

export const query2location = <T extends Record<string, string | string[]>>(
	actualValue: T
): URLSearchParams => {
	const urlSearchParams = new URLSearchParams();
	for (const k in actualValue) {
		if (actualValue[k] != null) {
			if (k.endsWith('[]')) {
				for (const e of actualValue[k]) {
					urlSearchParams.append(k, e);
				}
			} else {
				urlSearchParams.append(k, actualValue[k] as string);
			}
		}
	}
	return urlSearchParams;
};

export const query = <T extends Record<string, string | string[]>>(
	defaultValue: T
): Writable<T> => {
	const subscribe = (run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber => {
		return page.subscribe(
			(value) => {
				if (value) {
					run({ ...defaultValue, ...location2query(value) });
				}
			},
			invalidate
				? (value) => {
						if (value) {
							invalidate({ ...defaultValue, ...location2query(value) });
						}
				  }
				: undefined
		);
	};
	const set = (value: T): void => {
		const actualValue: T = { ...defaultValue, ...value };
		/*goto(`?${query2location(actualValue).toString()}`, {
			replaceState: false,
			noscroll: true,
			keepfocus: true
		});*/
		history.pushState({}, null, `?${query2location(actualValue).toString()}`);
	};
	const update = (updater: Updater<T>): void => {
		set(updater({ ...defaultValue, ...location2query(get(page)) }));
	};
	return {
		subscribe,
		set,
		update
	};
};


export let stateQuery= query({'product':'-1', 'category':'-1'});
