import { transform } from 'lodash';
import { crossfade, scale, } from 'svelte/transition';

export const [send, receive] = crossfade({
    duration: 300,
    fallback: scale
});
