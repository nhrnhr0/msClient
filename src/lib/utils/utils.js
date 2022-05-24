export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);