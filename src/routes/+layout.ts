import { setupInterceptors } from '../my-interceptors.js';
import type { LayoutLoad } from './$types';


export const load = (async () => {

    setupInterceptors()


    return {};
}) satisfies LayoutLoad;