/*import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);*/

import { cartStore, dictCartStore } from "src/stores/cartStore";
import { userInfoStore } from "src/stores/stores";
import { get } from "svelte/store";

export function clear_user_spesific_session_store_data() {
    debugger;
    for (var key in sessionStorage) {
        if (key.indexOf('galery_page_products_') !== -1 ||
        key.indexOf('galery_page_scroll_pos_') !== -1)
            sessionStorage.removeItem(key);
    }
}

export function edit_cart_price_promp(product_id) {
    let user = get(userInfoStore);
    if(user.isLogin && user.me.is_superuser) {
        console.log('edit_cart_price_promp', product_id)
        let product = get(cartStore).find(prod=> prod.id == product_id)
        if (product) {
            let old_price = product.price
            let new_price = prompt('בחר מחיר חדש:' ,old_price);
            if(new_price){
                product.price = new_price;
                cartStore.setProduct(product);
            }
        }
    }
}

export function mentries_to_data_array(mentries) {
	let data = [];
        for(let size_id_idx in Object.entries(mentries)) {
            let size_id = Object.entries(mentries)[size_id_idx][0];
            let colors_vals = Object.entries(mentries)[size_id_idx][1];
            for(let color_id_idx in Object.entries(colors_vals)) {
                let color_id = Object.entries(colors_vals)[color_id_idx][0];
                let inner_vals = Object.entries(colors_vals)[color_id_idx][1];
                if (inner_vals.hasOwnProperty('quantity')) {
                    data.push({
                        'size_id':color_id,
                        'color_id':size_id,
                        'quantity':inner_vals['quantity']
                    });
                }else if(Object.entries(inner_vals).length > 0) {
                    for(let ver_id_idx in Object.entries(inner_vals)) {
                        let ver_id = Object.entries(inner_vals)[ver_id_idx][0];
                        let last_vals = Object.entries(inner_vals)[ver_id_idx][1];
                            if (last_vals.hasOwnProperty('quantity')) {
                                data.push({
                                    'size_id':color_id,
                                    'color_id':size_id,
                                    'ver_id': ver_id,
                                    'quantity':last_vals['quantity']
                                });
                            }
                    }
                }
            }
        }
		return data;
	}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);


export function dateCellFormatter(cell, formatterParams, onRendered){
    // input: 2022-05-19T16:18:38.644219+03:00
    // output: 19/05/2022 16:18:38
    let date = new Date(cell.getValue()).toLocaleString('he-IL');
    return date;
}


export function fastpivot(arr){ 
	"use strict";
	var obj={};
	if(typeof arr!="string" && arr.length>0){

		//get columns
		var thekeys = Object.keys(arr[0]);

		var temp={};

		//loop through columns
		thekeys.forEach(function(f){ 
			temp[f]={}; 
			temp[f]["_labels"]=[];
			temp[f]["_labelsdata"]=[]; 
			temp[f]["_data"]={}; 
		});

		//loop all rows and for each column, store values
		arr.forEach(function(f,i){
		    thekeys.forEach(function(a){
		        var value=f[a];
		        temp[a]["_data"][value]=(temp[a]["_data"][value] || 0)+1;
		        temp[a]["_labels"][value]=null;
		    });
		});

		//now reloop the columns to store unique values
		thekeys.forEach(function(f){
			for(var i in temp[f]["_data"]){
				temp[f]["_labelsdata"].push(temp[f]["_data"][i]);
			}
			temp[f]["_labels"]=Object.keys(temp[f]["_labels"]);
		});

		obj=temp;
	}
	return obj;
}


export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}