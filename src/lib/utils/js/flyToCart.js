import { _modal_z_index_incrementor } from "./../../../stores/stores";
import {get} from 'svelte/store';
export function flyToCart(item) {
    let img = item;
                        
    let clone = img.cloneNode(true);
    
    clone.style.position = 'absolute';
    let bodyRect = document.body.getBoundingClientRect();
    let elemRect = img.getBoundingClientRect();
    let offsetTop   = elemRect.top - bodyRect.top;
    let offsetLeft   = elemRect.left - bodyRect.left;


    clone.style.top = offsetTop + 'px';
    clone.style.left = offsetLeft + 'px';
    clone.style.zIndex = (get(_modal_z_index_incrementor) + 50) + '00';
    clone.style.opacity = '1';
    let cart = document.querySelector('#cart-btn');
    document.body.appendChild(clone);
    let cartRect = cart.getBoundingClientRect();
    let cartOffsetTop   = cartRect.top - bodyRect.top;
    let cartOffsetLeft   = cartRect.left - bodyRect.left;
    clone.animate(
        [
            {
                'top': offsetTop + 'px',
                'left': offsetLeft + 'px',
                'width': img.width / 2 + 'px',
                'height': img.height / 2 + 'px',
                'opacity': '1',
                offset: '0',
            },
            {
                'top': offsetTop + 'px',
                'left': offsetLeft + 'px',
                'width': '75px',
                'height': '75px',
                'opacity': '0.5',
                offset: '0.3',
            },
            {
                'top': offsetTop + 'px',
                'left': offsetLeft + 'px',
                'width': '75px',
                'height': '75px',
                'opacity': '0.5',
                offset: '0.5',
            },
            {
                'top': cartOffsetTop + 10 + 'px',
                'left': cartOffsetLeft + 10 + 'px',
                'width': 75 + 'px',
                'height': 75 + 'px',
                'opacity': '0.5',
                offset: '0.9',
            },
            {
                offset: '1',
                'opacity': '0.5',
                'top': cartOffsetTop + 10 + 'px',
                'left': cartOffsetLeft + 10 + 'px',
                'width': 75 + 'px',
                'height': 75 + 'px',
            }
        ],
        {
            duration: 10000,
            iterations: 1,
            easing: 'ease-in-out'
        },
    ).finished.then(()=> {
        clone.remove();
    });
}
