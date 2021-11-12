export function pushProductState(productId) {
    pushState(`/products/${productId}`);
}
export function pushCategoryState(categoryId) {
    pushState(`/category/${categoryId}`);
}
export function pushMainPage() {
    pushState('/');
}

export function pushState(url) {
    window.history.pushState(null, null, url);
}