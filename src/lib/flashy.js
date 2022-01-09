


export function flashy_page_view() {
    window.flashy('PageView');
}

export function flashy_add_to_cart(content_ids) {
    window.flashy('AddToCart', {
        'content_ids': content_ids,
        'value': 0,
        'currency': 'USD'
    });
}

export function flashy_update_cart(cart) {
    console.log('flashy_update_cart: ', cart);
    
    if(Object.keys(cart).length != 0) {
        window.flashy('UpdateCart', {
            'content_ids': Object.keys(cart),
            'value': 0,
            'currency': 'USD'
        });
    }
    
}
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }


export function flashy_purchase(cart_id, product_ids) {
    window.flashy('Purchase', {
        'content_ids': product_ids,
        'value': 100,
        'currency': 'USD',
        'order_id': '' + cart_id
    });
}