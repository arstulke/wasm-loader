export function isBrowser(): boolean {
    let isBrowser: boolean;
    if (typeof window === 'object') {
        return !('Deno' in window); // if window exists check whether Deno exists
    } else {
        return false;
    }
}
