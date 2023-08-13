
export function pushProductState(categoryId, productId) {
    pushState(`/category/${categoryId}/products/${productId}`);
}
export function pushCategoryState(categoryId) {
    pushState(`/category/${categoryId}`);
}
export function pushMainPage() {
    pushState('/');
}

export function pushState(url) {
    
    console.log('pushState: ', url);
    window.history.pushState(null, null, url);

    window.ga('set', 'page', url);
    window.ga('send', 'pageview', url);
}