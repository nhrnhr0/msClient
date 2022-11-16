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


export const fullNumbersOnly = ( node ) => {
    const handleKeyDown = event => {
        console.log('keycode: ', event.keyCode);
        
        let iligalKeyCode = [109,110,190,189,46,8]
        if(iligalKeyCode.includes(event.keyCode)) {
            event.preventDefault();
        }
        /*if(event.keyCode < 48 || event.keyCode > 57) {
            
        }*/
    }
    node.addEventListener( 'keydown', handleKeyDown )
    return { destroy() { node.removeEventListener( 'keydown', handleKeyDown ) } }
}