<script>
    import {all_swipers,cartModalStore, successModalStore, _modal_z_index_incrementor, productModalStore,userInfoStore, sizesJsonStore} from "./../../stores/stores";
    import {fly, fade} from 'svelte/transition';
    import { cartStore } from "./../../stores/cartStore"
    import { CLOUDINARY_URL, STATIC_BASE, SUBMIT_CART_URL } from "./../../api/consts";
    import { selectTextOnFocus } from '$lib/ui/inputActions';
    import { logStore } from "./../../stores/logStore";
    import { flip } from 'svelte/animate';
	import { get_user_uuid, submit_cart_form } from "./../../api/api";
	import {activeModalsStore } from '$lib/modals/modalManager';
	import {scrollFix} from '$lib/ui/scrollFix';
	import { productCartModalStore} from './../../stores/stores';
import { flashy_purchase } from "$lib/flashy";
import { Spinner } from "sveltestrap";


	
    export let isModalOpen = false;
	let is_cart_locked = false;
    let modal_zIndex = 0;
	let state = 0;
	let form_name, form_email, form_phone, form_message,form_business_name,form_privateCompany;
	let error_found = false;
	let error_message = '';
	let isSending = false;
	function checkout_back_click() {
		if(state > 0) {
			state = 0;
		}
	}
	function checkout_click() {
		if(state == 0) {
			error_found = false;
			for (const [key, value] of Object.entries($cartStore)) {
				if(value == undefined || value.amount == undefined || value.amount <= 0) {
					error_found = true;
					error_message = 'שדה כמות חסר או שגוי';
					break;
				}
			}
			if(error_found == false) {
				state = 1;
			}
		}
		/*else if(state == 1) {
			state = 2;
			cart_submit();
		}*/
	}
	function cart_submit() {
        if(mform.reportValidity()) {
            let cart_products = [];
            for(let key in $cartStore) {
                let product = $cartStore[key];
				// prep mentries
				// input: {"77": [{}, {}, {"quantity": 5}, {"quantity": 1}, {}, {}, {}, {}], "80": [{}, {}, {"quantity": 2}, {}, {"quantity": 5}, {}, {}, {}], "82": [{}, {},
				/*let mentries = [];
				if(product.mentries) {
					Object.keys(product.mentries).forEach(function(color_id) {
						let mentry = product.mentries[color_id];
						for(let size_idx = 0; size_idx < mentry.length; size_idx++) {
							let size_id = product.sizes[size_idx];
							if('quantity' in product.mentries[color_id][size_idx]) {
								mentries.push({
									"color_id": color_id,
									"size_id": product.sizes[size_idx],
									"quantity": product.mentries[color_id][size_idx].quantity
								});
							}else if(product.varients.length != 0) {
								for(let i= 0; i < product.varients.length; i++) {
									mentries.push({
										"color_id": color_id,
										"size_id": product.sizes[size_idx],
										"variant_id": product.varients[i].id,
										"quantity": product.mentries[color_id][size_idx][product.varients[i].id].quantity
									})
								}
							}
						}
					});
				}
				;*/
                cart_products.push({'id': product.id, 'amount': product.amount, 'price': product.client_price, 'mentries': product.mentries});
				
            }
			let actAs = $userInfoStore?.actAs;
            let data = {
                name: form_name || '',
                email: form_email || '',
                phone:form_phone || '',
				business_name: form_business_name || '',
                uuid: get_user_uuid() || '',
                message: form_message || '',
                products: cart_products,
				asUser: actAs,
				raw_cart: JSON.stringify($cartStore)
            };
            
            logStore.addLog(
                            {
                                'a': 'שליחת הזמנה',
                                't': 'submit order',
                                'f': {
                                    'type': 'cart',
                                },
                                'w':{
                                    'type':'order',
                                    'data':data,
                                }
                            }
                            );
			isSending = true;
            let response = submit_cart_form(data);
			
            response.then((data_json)=> {
				let cart_id = data_json['cart_id'];
				let product_ids = data_json['product_ids'];
                flashy_purchase(cart_id,product_ids)
                    if(data_json['status'] == 'success') {
                        $cartModalStore.toggleModal();
                        $successModalStore.toggleModal();
                        //$cartStore = {};
                        cartStore.clearCart();
                    }
				mform.reset();
				state = 0;
            });
			response.catch(function(error) {
				alert(error.toString());
				state = 0;
			});
			response.finally(function() {
				isSending = false;
			})
			
        }else {
			alert('נא למלא את כל השדות');
			state = 1;
		}
    }
    export function toggleModal() {
        isModalOpen = !isModalOpen;
		let main_wraper_element = document.querySelector('#main_wraper');
		//let sidebar_cart_element = document.querySelector('#sidebar-cart');
		let main_navbar_wraper = document.querySelector('#main-navbar-wraper');
		//activeModalsStore.modalToggle('cartModal2', isModalOpen);
        if(isModalOpen) {
            modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
			main_wraper_element.style = `width: calc(100vw - 315px);position: absolute;left: 0px;`
			main_navbar_wraper.style = `width: calc(100vw - 315px);left: 0px;`
			//sidebar_cart_element.style = `z-index: ${modal_zIndex*5};`

        }else {
			state = 0;
			main_wraper_element.style = `width:auto;`;
			//sidebar_cart_element.style = ``;
			main_navbar_wraper.style=`width: 100%;`;
		}
    }
	
    export function isOpen() {
        return isModalOpen;
    }
	function roundHalf(num) {
    	return Math.round(num*2)/2;
	}
    let mform;
    function delete_product_from_cart(key) {
        let element = document.querySelector(`.product[data-product="${key}"]`).classList.add('deleted')
        setTimeout(()=>{

        let item = $cartStore[key];
        let swiper = $all_swipers[item.albums[0]];
        //delete $cartStore[key];
        cartStore.removeFromCart(item);
        //$cartStore =$cartStore;
        swiper.fixDups();
        logStore.addLog(
                            {
                                'a': 'הסר מהעגלה',
                                't': 'remove from cart',
                                'f': {
                                    'type':'cart',
                                },
                                'w':{
                                    'type':'product',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
        }, 0);
    }

	function price_cell_click(e, cart_key){
		if($userInfoStore.isLogin && $userInfoStore.me && $userInfoStore.me.is_superuser == true) {
			// open popup to edit price
			let item = $cartStore[cart_key];
			let prom = prompt('ערוך מחיר', item.client_price);
			if(prom) {
				$cartStore[item.id].client_price = parseFloat(prom);;
			}
			e.preventDefault();
			e.stopPropagation();
		}

	}
	function open_edit_amount_dialog(product_id, product_title) {
		$productCartModalStore.toggleModal(product_id);
	}
    function open_product_modal(key) {
        let product = $cartStore[key];
		//product.albums = [15, 85]
		let min_album = Math.min(...product.albums);

        $productModalStore.setProduct(min_album, product.id);
        $productModalStore.toggleModal();

        logStore.addLog(
                            {
                                'a': 'פתיחת מוצר מעגלת קניות',
                                't': 'open product',
                                'f': {
                                    'type': 'cart',
                                },
                                'w':{
                                    'type':'product',
                                    'id':product.id,
                                    'ti':product.title, 
                                }
                            }
                            );
    }
	let show_prices = false;
	$: {
		show_prices = $userInfoStore && $userInfoStore.isLogin;
	}
</script>
{#if isModalOpen}

	{#if state == 1}
	<div id="cartModal" style="z-index: {modal_zIndex};" class="modal" class:active={isModalOpen}>
		<div class="overlay" style="z-index: {modal_zIndex+5};" on:click={toggleModal}>
		<div class="modal_content"in:fly="{{ y: 200, duration: 350 }}" on:click|stopPropagation|preventDefault={()=>{}} out:fade style="z-index: {modal_zIndex+10};">
			<div class="modal-header">
			<button title="Close" on:click={toggleModal} class="close-btn right">x</button>
			<h5 class="modal-title">וודא שליחת טופס</h5>
			<button title="Close" on:click={toggleModal} class="close-btn left">x</button>
			</div>
		
			<div class="modal-body">
				<form class="cart-form" bind:this={mform} method="POST" action="{SUBMIT_CART_URL}" >
					
					<div class="form-group">

						
						<div class="form-control">
							<label for="name">שם בחשבונית</label>
							<input bind:value="{form_name}" name="name" required="{!($userInfoStore && $userInfoStore.isLogin)}" placeholder="{$userInfoStore?.me?.businessName}"  type="text"></div>	

						
						<div class="form-control">
							<label for="email">אימייל</label>
							<input bind:value="{form_email}" name="email" placeholder="{$userInfoStore?.me?.email}" type="email"></div>

						
						<div class="form-control">
							<label for="phone">טלפון</label>
							<input bind:value="{form_phone}" name="tel" required="{!($userInfoStore && $userInfoStore.isLogin)}" placeholder="טלפון" type="tel"></div>

						
						<div class="form-control">
							<label for="privateCompany">ח.פ.</label>
							<input type="text" bind:value="{form_privateCompany}" name="privateCompany" required={false} placeholder="{$userInfoStore?.me?.privateCompany}">
						</div>
					</div>
					<div class="form-group">
						<div class="form-control"><textarea bind:value="{form_message}" name="message" required="{false}" placeholder="הודעה:"/>
					</div>
						</div>

						<!--
							table with all products
							product image
							product name
							product amount
							product price
							total price

							---- total price to all products
							
						-->
						<table class="products">
							<thead>
								<tr>
									<th>מוצר</th>
									<th>ברקוד</th>
									<th>האם יש ברקוד פיזי</th>
									<th>כמות</th>
									<th>מחיר</th>
									<th>סה"כ</th>
								</tr>
							</thead>
							<tbody>
								{#each Object.entries($cartStore) as  [key, val] (key)}
								{@const item = $cartStore[key]}
								<tr>
									<td>
										<div class="product-image-and-title">
											<div class="product-image">
												<img src="{CLOUDINARY_URL}{item.cimage}" alt="{item.title}">
											</div>
											<div class="product-title">
												<a href="#" on:click={open_product_modal.bind(this, item.id)}>{item.title}</a>
											</div>
										</div>
									</td>
									<td>
										{item?.barcode || ''}
									</td>
									<td>
										{item.has_physical_barcode? '✅':'❌'}
									</td>
									<td>
										<div class="product-amount" title="ערוך" on:click="{open_edit_amount_dialog(item.id, item.title)}">
											{item.amount}
										</div>
									</td>
									<td>
										<div class="product-price">
											{item.client_price}₪
										</div>
									</td>
									<td>
										<div class="product-total-price">
											{item.client_price * item.amount}₪
										</div>
								</tr>
								{/each}
							</tbody>
							<tr class="totals">
								<td colspan="2">
									<div  class="product-total-price">
										סה"כ ללא מע"מ
									</div>
									
									
									
								</td>
								<td>
									<div class="product-total-price-result">
										{roundHalf(Object.entries($cartStore).reduce((acc, [key, val]) => {
											return acc + val.client_price * val.amount
										}, 0))}₪
									</div>
								</td>
								<td colspan="2">
									<div class="product-total-price-tax">
										סה"כ כולל מע"מ
									</div>
								</td>
								<td>
									{roundHalf(Object.entries($cartStore).reduce((acc, [key, val]) => {
										return acc + val.client_price * val.amount * 1.17
									}, 0))}₪
								</td>
							</tr>
							
						</table>
						<button on:click="{cart_submit}" class="submit-btn btn">
							{#if isSending}
							<Spinner />
							{:else}
							שלח
							{/if}
						</button>
				</form>
			</div>
		
		</div>
		
	</div>
</div>
	{/if}
	
	{#if isModalOpen}
		<div class="sidebar-cart-wraper">
            <aside on:click|stopPropagation|preventDefault={()=>{}} transition:fly="{{x:340}}" id="sidebar-cart">
                <main>
                    <button class="close-button" on:click="{()=>{toggleModal();}}">X</button>
                    <h2>מוצרים שאהבתי<span class="count">{Object.keys($cartStore).length}</span></h2>
					<!--
					<h2 class="sub-title">הוסיפו מוצרים
						וקבלו הצעת מחיר משתלמת ללא עלות וללא התחייבות</h2>
						-->
					{#if error_found }
						{#key error_found}
							<h4 class="error-msg">{error_message}</h4>
						{/key}
					{/if}					
						{#if Object.keys($cartStore).length > 0}
							<ul class="products" use:scrollFix>
								{#each Object.keys($cartStore) as key, i (key)}
										<li class="product" data-product={key}
										animate:flip={{duration:200}}
										out:fly={{x:100,duration: 200,}}
										in:fly="{{x: 340,duration: 500,delay:i*120 }}" 
										>
										
											<div class="product-link">
												<span on:click={open_product_modal(key)} class="product-image">
													<img src="{CLOUDINARY_URL}f_auto,w_auto/{$cartStore[key].cimage}" alt="{$cartStore[key].title}">
												</span>
												<span class="product-details">
													<h3>{$cartStore[key].title}</h3>
													<hr>
													<div class="qty-price"  on:click={open_edit_amount_dialog(key, $cartStore[key].title)}>
														<div class="table">
															<div class="table-row">
																<div class="table-cell table-cell-title">
																	:כמות
																</div>
																<div class="table-cell qty">
																	{#if $cartStore[key].show_sizes_popup}
																		<div class="total-amount">{$cartStore[key].amount}</div>
																	{:else}
																		<input type="text" class="amount-input" id="cart_amount_{key}" use:selectTextOnFocus bind:value={$cartStore[key].amount}>
																	{/if}
																</div>
															</div>
														{#if show_prices}
															<div class="table-row" on:click={(e)=>price_cell_click(e,key)}>
																<div class="table-cell table-cell-title">
																	:'מחיר ליח
																</div>
																<div class="table-cell">
																		<span class="">{$cartStore[key].client_price}₪</span>
																</div>
															</div>
														{/if}
														
														
														<button class="edit-btn">
															ערוך
															<svg enable-background="new 0 0 45 45" height="25px" id="Layer_1" version="1.1" viewBox="0 0 45 45" width="25px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><rect height="23" transform="matrix(-0.7071 -0.7072 0.7072 -0.7071 38.2666 48.6029)" width="11" x="23.7" y="4.875"/><path d="M44.087,3.686l-2.494-2.494c-1.377-1.377-3.61-1.377-4.987,0L34.856,2.94l7.778,7.778l1.749-1.749   C45.761,7.593,45.465,5.063,44.087,3.686z" /><polygon points="16,22.229 16,30 23.246,30  "/><path d="M29,40H5V16h12.555l5-5H3.5C1.843,11,0,11.843,0,13.5v28C0,43.156,1.843,45,3.5,45h28   c1.656,0,2.5-1.844,2.5-3.5V23.596l-5,5V40z"/></g></svg>
															
														</button>
													</div>
													
												</span>
											</div>
											<div class="remove-button" on:click|preventDefault="{delete_product_from_cart(key)}">
												<svg xmlns="http://www.w3.org/2000/svg"  width="16px" height="16px" viewBox="0 0 32 36"><path fill="currentColor" d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"/></svg>
											</div>
										</li>
								{/each}
							</ul>
						{:else}
							<div class="empty-cart">
								<h2>אין מוצרים בהצעת מחיר</h2>
								
							</div>
						{/if}
					<div class="action-buttons">
					{#if state == 0}
						<button class="checkout-button" on:click="{checkout_click}" disabled={state == 2}>
								לקופה
						</button>
						{/if}
					</div>
				</main>
			</aside>
		</div>
                    <!--
                    <div class="totals">
                        
                        <div class="subtotal">
                            <span class="label">Subtotal:</span> <span class="amount">$54.00</span>
                        </div>
                         <div class="shipping">
                            <span class="label">Shipping:</span> <span class="amount">$7.95</span>
                        </div>
                        <div class="tax">
                            <span class="label">Tax:</span> <span class="amount">$71.95</span>
                        </div> 
                    </div>
                    -->
	{/if}

    
{/if}

<style lang="scss">
    // Brand colors
//$primary: #354165;
$primary: #3b3b3b;
//$secondary: #4dc0e3;
$secondary: #d4af37;
// Standard colors
$black: #000;
$white: #fff;
$red: #cc0000;

// Shades of gray
$gray-100: #f0f0f9;
$gray-200: #e1e1e7;
$gray-300: #d7d7de;
$gray-400: #cdcdd1;
$gray-500: #a5a5aa;
$gray-600: #98989b;
$gray-700: #75757a;
$gray-800: #666669;
$gray-900: #44444a;
$gray-1000: #333336;
$gray-1100: #222224;
$gray-1200: #131314;

// Mixin to generate hover & active states
@mixin hover-active() {
	&:active,
	&:hover {
		@content;
	}
}

// Replace `$search` with `$replace` in `$string`
@function str-replace($string, $search, $replace: "") {
	$index: str-index($string, $search);

	@if $index {
		@return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace);
	}

	@return $string;
}
    a {
	text-decoration: none;
	color: $primary;
	transition: color 0.5s linear;

	@include hover-active() {
		color: $secondary;
		text-decoration: none;
	}
}

.error-msg {
	color: $red;
	font-size: 0.8em;
	margin-top: 0.5em;
}
.modal_content {
	.modal-body {
		.cart-form {
			.form-group {
				display: flex;
				flex-direction: row;;
				justify-content: space-around;
				.form-control {
					flex:1;
					flex-grow: 1;
					flex-shrink: 0;
					margin:5px;
					line-height: 2.5;
					display:flex;
					flex-direction: column;

				}
			}

			table.products {
				th {
					
					font-size: 1em;
					text-align: start;
					font-weight: bold;
				}
				td {
					font-size: 1.2em;
					text-align: start;
					font-weight: bold;
				}
				width: 100%;
				thead {
					tr {
						th {
							
							padding: 10px;
							
							background-color: $gray-800;
						}
					}
				}
				tbody {
					tr {
						td {
							.product-amount {
								cursor: pointer;

							}
							.product-image-and-title {
								display: flex;
								justify-content: start;
								align-items: center;
								.product-image {
									width: 100px;
									height: 100px;
									img {
										width: 100%;
										height: 100%;
									}
								}
								.product-title {
									
									font-weight: bold;
								}
							}

							
						}
						// ligther colors on all odd rows
						&:nth-child(even) {
							background-color: $gray-600;
						}
					}

					

				}
				tr.totals {
					background-color:$gray-300;
					line-height: 2;
					td {
						
						.product-total-price {

						}
					}
				}
			}
			.submit-btn {
				margin-top: 1em;
				margin-bottom: 1em;
				width:100%;
				@include bg-gradient();
				box-shadow: 0 0 10px rgba(0,0,0,0.3);
				font-size: 2.5em;
				font-weight: bold;
				transition: all 0.3s ease 0s;
				&:hover, &:focus {
					box-shadow: 0px 15px 10px rgba(0,0,0,0.7);
					transform: translateY(-7px);
					
				}
				
			}

			.float-actions {
				position: fixed;
				top: 20px;
			}
		}
	}
}
#sidebar-cart {
    direction: ltr;
	background: $primary;
	color: $gray-700;
	padding: 15px 15px 0 15px;
	position: fixed;
	display: block;
	width: 315px;
	height: calc(100vh - calc(100vh - 100%));
	z-index: 999;
	//z-index: 2;
	top: 0;
	//right: -340px;
	box-shadow: -10px 0 15px rgba(0, 0, 0, 0.1);
	transition: all 0.75s ease-in-out;

    right: 0;
    visibility: visible;

	/*&.popup-state{
		width: 85vw;
	}*/
	.cart-info {
		color:white;
		direction: rtl;
		height: calc(100vh - 150px);
		//overflow: scroll;
		overflow: auto;
		.info {
			width:100%;
			.info-res {
				
				input {
					border-radius: 15px;
					width:100%;
					color:white;
				}
			}
		}
		form {
			.form-control {
				padding-top: 15px;
				margin: 5px;
				input, textarea {
					direction: rtl;
					text-align: right;
					border:none;
					border-radius: 15px;
					width:100%;
				}
			}
		}
	}

	button.close-button {
		margin: 0 0 15px 0;
        text-decoration: none;
        position: absolute;
        top: 5px;
        left: 20px;
        display: flex;
        border: none;
        background: none;
        color: white;
        font-size: x-large;
        transition: all 0.2s ease-in-out;

		@include hover-active() {
				//background-color: $gray-1100;
                transform: scale(1.4);
                color: $red;
		}
	}
	h2.sub-title {
		text-align: center;
	}

	h2 {
		color: $white;
		//font-family: Muli;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
		line-height: 1;
		margin: 5px 0 25px 0;
		display: flex;
		justify-content: center;

		span.count {
			color: $white;
			background: $secondary;
			padding: 8px;
			margin-left: 6px;
			position: relative;
			top: -1px;
			width: 18px;
			height: 18px;
			border-radius: 50px;
			font-size: 12px;
			letter-spacing: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	ul.products {
		margin: 0;
		padding: 0 0 15px 0;
		list-style: none;
		height: calc(100vh - 150px);
		overflow-x: hidden;
		overflow-y: auto;
		display: block;
		position: relative;
		z-index: 0;

		/*&:after {
			background: linear-gradient(180deg, transparent, $primary);
			height: 30px;
			width: 300px;
			z-index: 1;
			content: "";
			position: absolute;
			right: 0;
			bottom: 0;
		}*/

		li.product {
			margin: 0 0 10px 0;
			padding: 0;
			width: 100%;
			min-height: 30px;
			background: lighten($primary, 60%);
			border-radius: 3px;
			color: $gray-600;
			position: relative;
			z-index: 1;
			display: flex;
			flex-flow: row nowrap;
			transition: all 0.5s linear;
            

			@include hover-active() {
				background: $white;

				span.product-details {
					h3 {
						color: $secondary !important;
						-webkit-text-stroke-width: 0.1px;
						-webkit-text-stroke-color: $black;
                        
					}
				}

				img {
					border-color: $gray-300 !important;
				}
			}

			.product-link {
                cursor: default;
				width: 100%;
				color: $primary;
				padding: 10px;
				margin: 0;
				display: flex;
				
                flex-direction: row-reverse;
				flex-wrap: nowrap;

				span.product-image {
					display: inline-block;
					width: 75px;
					height: 50px;
					padding-left: 10px;
                    cursor: pointer;
					flex-shrink: 1;
					flex-grow: 0;

					img {
						width: 60px;
						height: 50px;
						border: 1px solid $gray-300;
						transition: all 0.5s linear;
					}
				}

				span.product-details {
					display: inline-block;
					width: 100%;
					min-height: 30px;
					color: $gray-700;
                    text-align: right;
					h3 {
						//margin: 3px 5px 5px 0px;
                        margin-bottom: 3px;
                        margin-left: 15px;
                        margin-right: 0px;
                        margin-top: 0px;
                        
						font-size: 13px;
						font-weight: 500;
						color: $gray-900;
						transition: all 0.5s linear;
					}

					div.qty-price {
						display: flex;
                        flex-direction: row-reverse;
						flex-wrap: nowrap;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						position: relative;
						z-index: 5px;
						margin-top: 8px;

						.table {
							display: flex;
							flex-direction: row-reverse;
							justify-content: space-between;
							width: 100%;
							.table-row {

								.table-cell {
									text-align: center;
									&.table-cell-title {
										font-size: 12px;
										text-align: center;
										width: 100%;
										font-weight: 500;
									}

								}
							}
						}
						.edit-btn {
								background: none;
								border: none;
								&:hover {
									color: $secondary;
									svg {
										fill: $secondary;
									}
								}
							}
						div.qty,
						div.price {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
						}
						
						div.qty {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							align-content: center;
							align-items: center;
							justify-content: flex-start;
							.total-amount {
								margin: auto;
							}
							input.amount-input {
								border: none;
								background: none;
								width: 55px;
								text-align: center;
							}
						}

						div.price {
							color: $secondary;
							font-weight: 500;
							font-size: 13px;
							display: inline-flex;
						}
					}
				}
			}

            .remove-button {
				height: 16px;
				width: 16px;
				margin: 0 0 10px 10px;
				text-decoration: none;
				position: absolute;
				top: 5px;
				//right: 0px;
                left: 0px;
				z-index: 2;
				display: flex;
                svg {
                    display: block;
                }
				/*span.remove-icon {
					width: 15px;
					height: 16px;
					//background: rgba($gray-700, 0.5);
					text-indent: -9999px;
					overflow: hidden;
					font-size: 0;
                    svg {
                        display: block;
                    }
					//-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 36'%3E%3Cpath fill='currentColor' d='M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z'/%3E%3C/svg%3E");
					transition: all 0.5s linear;
				}*/

				@include hover-active() {
                    cursor: pointer;
                        svg {
                            path {
                                color:$red;
                            }
                        }
						//background: $red;
				}
			}
            /*&.deleted {
                border: 1px solid red !important;
                opacity: 0!important;
                transform: translateY(-100px)!important;
            }*/
		}
        :global(li.product.deleted){
            transition: all 0.2s linear;
            transform: translatex(340px);
            opacity: 0;
        }
	}

	main{
		.empty-cart {
			text-align: center;
			h2 {
				color: #75757a;
			}
		}
	}
	/*
	div.totals {
		position: absolute;
		bottom: 80px;
		left: 0;
		right: 0;
		height: 45px;
		background: $gray-200;
		border-bottom: 1px solid $gray-300;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		
		div.subtotal,
		div.shipping,
		div.tax {
			padding: 15px;
			text-align: center;
			color: $gray-900;
			border-bottom: 1px solid $gray-300;
			text-transform: uppercase;
			letter-spacing: 1px;
			font-size: 14px;
			font-weight: 400;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;

			span.amount {
				color: darken($secondary, 15%);
				margin-left: 10px;
				font-weight: 600;
			}
		}
	}
    */
	div.action-buttons {
		padding: 0;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 80px;
		//background: $white;
		display: block;
		white-space: nowrap;
		//display:flex;
		display:flex;
		justify-content: center;
		align-items: center;
		button.checkout-back {
			display:block;
			visibility: hidden;
			margin-right: 10px;
			padding: 10px;
			border: 1px solid $gray-300;
			border-radius: 3px;
			background: $gray-200;
			color: $gray-900;
			font-size: 14px;
			font-weight: 500;
			text-transform: uppercase;
			letter-spacing: 1px;
			transition: all 0.5s linear;
			&.active {
				visibility: visible;
			}
			@include hover-active() {
				background: $gray-300;
				color: $gray-900;
			}
		}
		button.checkout-button {
			display: inline-block;
			
			padding: 10px;
			margin: 20px 15px;
			text-align: center;
			text-transform: uppercase;
			letter-spacing: 1px;
			font-size: 14px;
			border-width: 1px;
			border-style: solid;
			border-radius: 4px;
			transition: all 0.5s linear;
			//border-color: $secondary;
			//background: $secondary;
			margin-left: 5px;
			color: $white;
			font-weight: bold;
			font-size: larger;
			color: $black;
			width: 60%;
			@include bg-gradient();
			

			&:after {
				content: url("data:image/svg+xml,%3Csvg fill='%23#{str-replace('' + $black + '', '#', '')}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M311.03 131.515l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L387.887 239H12c-6.627 0-12 5.373-12 12v10c0 6.627 5.373 12 12 12h375.887l-83.928 83.444c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l116.485-116c4.686-4.686 4.686-12.284 0-16.971L328 131.515c-4.686-4.687-12.284-4.687-16.97 0z'/%3E%3C/svg%3E");
				width: 20px;
				height: 14px;
				display: inline-block;
				margin-left: 6px;
				vertical-align: middle;
				position: relative;
				top: -5px;
				z-index: 1;
			}

			@include hover-active() {
				//background: darken($secondary, 10%);
				border-color: darken($secondary, 40%);
				&:after {
					margin-left: 0px;
				}
			}
		}
	}
}


#cartModal.active {
    //transition: right 1s ease-in-out;
    .overlay  {
        #sidebar-cart {
            
        }
    }
}

</style>