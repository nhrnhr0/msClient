export const selectTextOnFocus = ( node ) => {
    const handleFocus = event => { node && typeof node.select === 'function' && node.select() }
    node.addEventListener( 'focus', handleFocus )
    return { destroy() { node.removeEventListener( 'focus', handleFocus ) } }
}

export const deleteInitialValue = ( node ) => {
    const handleFocus = event => { 
        if(node && node.value === '0') {
            node.value = '';
        }
    }
    node.addEventListener( 'focus', handleFocus )
    return { destroy() { node.removeEventListener( 'focus', handleFocus ) } }
}