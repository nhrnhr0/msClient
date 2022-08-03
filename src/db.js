// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(5).stores({
  topLevelCategories: 'id, name, image,albums,timestemp',
  slimProducts: 'id, title, cimage, price, new_price',
  products: 'id, title, cimage, price, new_price, description',
});


export async function clear_all_db_data() {
  let primises = [db.topLevelCategories.clear(), db.slimProducts.clear(), db.products.clear()];
  return Promise.all(primises);
}

export async function clear_all_session_data() {
  const keys = ['sizes','colors','varients',]
  for(let key of keys) {
    sessionStorage.removeItem(key);
  }
}