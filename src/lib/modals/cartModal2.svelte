<script>
	import {
		all_swipers,
		cartModalStore,
		successModalStore,
		productPhotoModalStore,
		_modal_z_index_incrementor,
		productModalStore,
		userInfoStore,
		cartHistoryModalStore,
		sizesJsonStore,
	} from "./../../stores/stores";
	import {
		fly,
		fade
	} from "svelte/transition";
	import {
		cartStore
	} from "./../../stores/cartStore";
	import {
		BASE_URL,
		CLOUDINARY_URL,
		STATIC_BASE,
		SUBMIT_CART_URL,
	} from "./../../api/consts";
	import {
		selectTextOnFocus
	} from "$lib/ui/inputActions";
	import {
		logStore
	} from "./../../stores/logStore";
	import {
		flip
	} from "svelte/animate";
	import {
		get_user_uuid,
		submit_cart_form
	} from "./../../api/api";
	import {
		activeModalsStore
	} from "$lib/modals/modalManager";
	import {
		scrollFix
	} from "$lib/ui/scrollFix";
	import {
		productCartModalStore
	} from "./../../stores/stores";
	import {
		flashy_purchase
	} from "$lib/flashy";
	import {
		Spinner
	} from "sveltestrap";
	import {
		page
	} from "$app/stores";

	export let isModalOpen = false;
	let is_cart_locked = false;
	let modal_zIndex = 0;
	let state = 0;
	let form_name,
		form_email,
		form_phone,
		form_message,
		form_business_name,
		form_privateCompany;
	let error_found = false;
	let error_message = "";
	let isSending = false;

	function checkout_back_click() {
		if (state > 0) {
			state = 0;
		}
	}

	function checkout_click() {
		if (state == 0) {
			error_found = false;
			for (const [key, value] of Object.entries($cartStore)) {
				if (
					value == undefined ||
					value.amount == undefined ||
					value.amount <= 0
				) {
					error_found = true;
					error_message = "שדה כמות חסר או שגוי";
					break;
				}
			}
			if (error_found == false) {
				activeModalsStore.modalToggle("cartModal2", isModalOpen);
				currentStep = 1;
				state = 1;
			}
		}
		/*else if(state == 1) {
			state = 2;
			cart_submit();
		}*/
	}
	let currentStep = 1;

	function stepBtnClick() {
		if (currentStep == 1) {
			currentStep = 2;
		} else if (currentStep == 2) {
			cart_submit();
		}
	}

	function cart_submit() {
		if (mform.reportValidity()) {
			let cart_products = [];
			for (let key in $cartStore) {
				let product = $cartStore[key];
				cart_products.push({
					id: product.id,
					amount: product.amount,
					price: product.price,
					mentries: product.mentries,
					print: product.print,
					embro: product.embro,
				});
			}
			let actAs = $userInfoStore?.actAs;
			let order_type = document.querySelectorAll('select[name="order_type"]');
			if (order_type.length == 1) {
				order_type = order_type[0].value;
			} else {
				order_type = "הזמנה";
			}
			console.log("order_type: ", order_type);
			let data = {
				name: form_name || "",
				email: form_email || "",
				phone: form_phone || "",
				business_name: form_business_name || "",
				order_type: order_type,
				uuid: get_user_uuid() || "",
				message: form_message || "",
				products: cart_products,
				asUser: actAs,

				raw_cart: JSON.stringify($cartStore),
			};

			logStore.addLog({
				a: "שליחת הזמנה",
				t: "submit order",
				f: {
					type: "cart",
				},
				w: {
					type: "order",
					data: data,
				},
			});
			isSending = true;
			let response = submit_cart_form(data);

			response.then((data_json) => {
				let cart_id = data_json["cart_id"];
				let product_ids = data_json["product_ids"];
				flashy_purchase(cart_id, product_ids);
				if (data_json["status"] == "success") {
					$cartModalStore.toggleModal();
					$successModalStore.toggleModal();
					//$cartStore = {};
					cartStore.clearCart();
				}
				mform.reset();
				state = 0;
			});
			response.catch(function (error) {
				alert(error.toString());
				state = 0;
			});
			response.finally(function () {
				isSending = false;
			});
		} else {
			alert("נא למלא את כל השדות");
			state = 1;
		}
	}
	let sidebar_top = 0;
	export function toggleModal() {
		isModalOpen = !isModalOpen;
		let main_wraper_element = document.querySelector('#main_wraper');
		//let sidebar_cart_element = document.querySelector('#sidebar-cart');
		let main_navbar_wraper = document.querySelector('#main-navbar-wraper');
		let is_under_700px = window.matchMedia("(max-width: 700px)").matches;
		//activeModalsStore.modalToggle('cartModal2', isModalOpen);
		if (isModalOpen) {

			modal_zIndex = 1200 + (++$_modal_z_index_incrementor * 15);
			if (!is_under_700px) {
				main_wraper_element.style = `width: calc(100vw - 315px - 15px);position: absolute;left: 0px;max-height: 100vh;`
				main_navbar_wraper.style = `width: calc(100vw - 315px - 15px);left: 0px;`
				sidebar_top = 0;
			} else {
				//debugger;
				//document.querySelector('#sidebar-cart').style = `top: 62px;`
				sidebar_top = 62;
			}
			//sidebar_cart_element.style = `z-index: ${modal_zIndex*5};`

		} else {
			state = 0;
			if (!is_under_700px) {
				main_wraper_element.style = `width:auto;`;
				//sidebar_cart_element.style = ``;
				main_navbar_wraper.style = `width: 100%;`;
			}
			activeModalsStore.modalToggle('cartModal2', isModalOpen);

		}
	}

	export function isOpen() {
		return isModalOpen;
	}

	function roundHalf(num) {
		return Math.round(num * 2) / 2;
	}
	let mform;

	function delete_product_from_cart(key) {
		let element = document
			.querySelector(`.product[data-product="${key}"]`)
			.classList.add("deleted");
		setTimeout(() => {
			let item = $cartStore[key];
			let swiper = $all_swipers[item.albums[0]];
			//delete $cartStore[key];
			cartStore.removeFromCart(item);
			//$cartStore =$cartStore;
			swiper.fixDups();
			logStore.addLog({
				a: "הסר מהעגלה",
				t: "remove from cart",
				f: {
					type: "cart",
				},
				w: {
					type: "product",
					id: item.id,
					ti: item.title,
				},
			});
		}, 0);
	}

	function price_cell_click(e, cart_key) {
		if (
			$userInfoStore.isLogin &&
			$userInfoStore.me &&
			$userInfoStore.me.is_superuser == true
		) {
			// open popup to edit price
			let item = $cartStore[cart_key];
			let prom = prompt("ערוך מחיר", item.price);
			if (prom) {
				$cartStore[item.id].price = parseFloat(prom);
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

		logStore.addLog({
			a: "פתיחת מוצר מעגלת קניות",
			t: "open product",
			f: {
				type: "cart",
			},
			w: {
				type: "product",
				id: product.id,
				ti: product.title,
			},
		});
	}
	let show_prices = false;
	$: {
		show_prices = $userInfoStore && $userInfoStore.isLogin;
	}
	//let checked = true;

	function copy_cart_click() {
		let cart_json =
		$cartStore; //{"5":{"id":5,"title":"פנדה מונביסו","description":"* החברה האיטלקית חוזרת לישראל עם דגם הדגל\r\n* נעל איכותית מאוד ברמה הגבוהה ביותר\r\n* עמידות בתנאי שטח קשים במיוחד\r\n* עור מלא נגד מים שמן וכימיקלים\r\n* בדים פנימיים אנטיבאקטרילים\r\n* תקן אירופאי וישראלי\r\n* 02/S3\r\n* אפשרות מיגון או ללא מיגון","cimage":"v1635672267/site/products/%D7%A4%D7%A0%D7%93%D7%94_%D7%9E%D7%95%D7%A0%D7%A1%D7%99%D7%91%D7%95_6nOpUNm_qYDCukF_NPmcgGo_WGqneJr_fD2vSpt_3x0EezN_LQgb69Q_2cOLJC7_Gn42nNk.png","colors":[84],"sizes":[112,105,104,103,102,101,100,99,98,97,96,95,94],"varients":[{"id":1,"name":"02"},{"id":3,"name":"S3"}],"can_tag":false,"discount":null,"albums":[5],"amountSinglePack":1,"amountCarton":6,"show_sizes_popup":true,"client_price":320,"out_of_stock":false,"barcode":"8028027316463","has_physical_barcode":false,"price":320,"amount":2,"print":false,"embro":false,"mentries":{"84":{"94":{"1":{},"3":{}},"95":{"1":{},"3":{}},"96":{"1":{},"3":{}},"97":{"1":{},"3":{}},"98":{"1":{},"3":{}},"99":{"1":{},"3":{}},"100":{"1":{},"3":{}},"101":{"1":{"quantity":2},"3":{}},"102":{"1":{},"3":{}},"103":{"1":{},"3":{}},"104":{"1":{},"3":{}},"105":{"1":{},"3":{}},"112":{"1":{},"3":{}}}}},"409":{"id":409,"title":"סנדלי עור איכותיים","description":"* סנדלים איכותיות \r\n* מתאימות למטיילים","cimage":"v1635672478/site/products/photo_2021-10-18_18-06-01-removebg-preview_NzDO1VX.png","colors":[84],"sizes":[96,97,98,99,100,101,102,103,104],"varients":[],"can_tag":false,"discount":null,"albums":[5],"amountSinglePack":1,"amountCarton":0,"show_sizes_popup":true,"client_price":150,"out_of_stock":false,"barcode":null,"has_physical_barcode":false,"price":150,"amount":5,"print":false,"embro":false,"mentries":{"84":{"96":{"quantity":5},"97":{},"98":{},"99":{},"100":{},"101":{},"102":{},"103":{},"104":{"quantity":null}}}}}
		// copy the dictionary keys with the values (entries) to the clipboard
		let clipboardResult = {}
		for (let key in cart_json) {
			clipboardResult[key] = {
				mentries: cart_json[key].mentries,
				amount: cart_json[key].amount
			}
		}
		let url = $page.host + "/" + "?cart_json=" + encodeURI(JSON.stringify(clipboardResult));
		navigator.clipboard.writeText(url);
	}
</script>

{#if isModalOpen}
  {#if state == 1}
    <div
      id="cartModal"
      style="z-index: {modal_zIndex};"
      class="modal"
      class:active={isModalOpen}
    >
      <div
        class="overlay"
        style="z-index: {modal_zIndex + 5};"
        on:click={toggleModal}
      >
        <div
          class="modal_content"
          in:fly={{ y: 200, duration: 350 }}
          on:click|stopPropagation|preventDefault={() => {}}
          out:fade
          style="z-index: {modal_zIndex + 10};"
        >
          <div class="modal-header">
            <button title="Close" on:click={toggleModal} class="close-btn right"
              >x</button
            >
            <h5 class="modal-title">לקופה</h5>
            <button title="Close" on:click={toggleModal} class="close-btn left"
              >x</button
            >
          </div>

          <div class="modal-body">
            <form
              class="cart-form"
              bind:this={mform}
              method="POST"
              action={SUBMIT_CART_URL}
            >
              {#if $userInfoStore?.me?.is_superuser}
                <h3>סוכן: {$userInfoStore.me.username}</h3>
              {/if}
              {#if currentStep == 1}
                <div in:fly={{ x: -340 }} class="step step-1">
                  <table class="products">
                    <thead>
                      <tr>
                        <th>מוצר</th>
                        <th class="hide-on-md">ברקוד</th>
                        <th class="">האם יש ברקוד פיזי</th>
                        {#if $userInfoStore?.me?.is_superuser}
                          <th class="hide-on-md">הדפסה</th>
                          <th class="hide-on-md">רקמה</th>
                        {/if}
                        <th>כמות</th>
                        {#if show_prices}
                          <th>מחיר</th>
                          <th>סה"כ</th>
                        {/if}
                      </tr>
                    </thead>
                    <tbody>
                      {#each Object.entries($cartStore) as [key, val] (key)}
                        {@const item = $cartStore[key]}
                        <tr>
                          <td>
                            <div class="product-image-and-title">
                              <div class="product-image">
                                <img
                                  src="{CLOUDINARY_URL}{item.cimage}"
                                  alt={item.title}
                                />
                              </div>
                              <div class="product-title">
                                <a
                                  href="#"
                                  on:click={open_product_modal.bind(
                                    this,
                                    item.id
                                  )}>{item.title}</a
                                >
                              </div>
                            </div>
                          </td>
                          <td class="hide-on-md">
                            {item?.barcode || ""}
                          </td>
                          <td class="">
                            {item.has_physical_barcode ? "✅" : "❌"}
                          </td>
                          {#if $userInfoStore?.me?.is_superuser}
                            <td class="hide-on-md">
                              <div
                                on:click={(e) => {
                                  $cartStore[key].print =
                                    !$cartStore[key].print;
                                }}
                              >
                                {#if $cartStore[key].print}
                                  ✅
                                {:else}
                                  ❌
                                {/if}
                              </div>
                            </td>
                            <td class="hide-on-md">
                              <div
                                on:click={(e) => {
                                  $cartStore[key].embro =
                                    !$cartStore[key].embro;
                                }}
                              >
                                {#if $cartStore[key].embro}
                                  ✅
                                {:else}
                                  ❌
                                {/if}
                              </div>
                            </td>
                          {/if}
                          <td>
                            <div
                              class="product-amount"
                              title="ערוך"
                              on:click={open_edit_amount_dialog(
                                item.id,
                                item.title
                              )}
                            >
                              {item.amount}
                            </div>
                          </td>
                          {#if show_prices}
                            <td>
                              <div class="product-price">
                                {#if item.out_of_stock == false}
                                  {item.price}₪
                                {/if}
                              </div>
                            </td>
                            <td>
                              <div class="product-total-price">
                                {#if item.out_of_stock == false}
                                  {roundHalf(item.price * item.amount)}₪
                                {/if}
                              </div>
                            </td>
                          {/if}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                  {#if show_prices}
                    <div class="totals">
                      <div class="product-total-price">סה"כ ללא מע"מ</div>
                      <div class="product-total-price-result">
                        {roundHalf(
                          Object.entries($cartStore).reduce(
                            (acc, [key, val]) => {
                              /*let ret = acc;
											if (val.out_of_stock == false) {
												ret += val.price * val.amount;
											}*/
                              return (
                                acc +
                                val.price *
                                  val.amount *
                                  (val.out_of_stock == false ? 1 : 0)
                              );
                            },
                            0
                          )
                        )}₪
                      </div>
                      <div class="product-total-price-tax">סה"כ כולל מע"מ</div>
                      {roundHalf(
                        Object.entries($cartStore).reduce((acc, [key, val]) => {
                          /*let ret = acc;
										if (val.out_of_stock == false) {
											ret += val.price * val.amount;
										}*/
                          return (
                            acc +
                            val.price *
                              val.amount *
                              1.17 *
                              (val.out_of_stock == false ? 1 : 0)
                          );
                        }, 0)
                      )}₪
                    </div>
                  {/if}
                </div>
              {:else}
                <div in:fly={{ x: -340 }} class="step step-2">
                  <div class="form-group">
                    <div class="form-control">
                      <label for="name">שם בחשבונית</label>
                      <input
                        bind:value={form_name}
                        name="name"
                        required={!($userInfoStore && $userInfoStore.isLogin)}
                        placeholder={$userInfoStore?.actAs?.businessName ||
                          $userInfoStore?.me?.businessName}
                        type="text"
                      />
                    </div>

                    <div class="form-control">
                      <label for="email">אימייל</label>
                      <input
                        bind:value={form_email}
                        name="email"
                        placeholder={$userInfoStore?.actAs?.email ||
                          $userInfoStore?.me?.email}
                        type="email"
                      />
                    </div>

                    <div class="form-control">
                      <label for="phone">טלפון</label>
                      <input
                        bind:value={form_phone}
                        name="tel"
                        required={!($userInfoStore && $userInfoStore.isLogin)}
                        placeholder="טלפון"
                        type="tel"
                      />
                    </div>

                    <div class="form-control">
                      <label for="privateCompany">ח.פ.</label>
                      <input
                        type="text"
                        bind:value={form_privateCompany}
                        name="privateCompany"
                        required={false}
                        placeholder={$userInfoStore?.actAs?.privateCompany ||
                          $userInfoStore?.me?.privateCompany}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-control">
                      <textarea
                        bind:value={form_message}
                        name="message"
                        required={false}
                        placeholder="הודעה:"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-control">
                      {#if $userInfoStore?.isLogin}
                        <!-- האם הזמנה או הצעת מחיר -->
                        <div class="form-group">
                          <div class="form-control">
                            <label for="order_type">סוג הזמנה</label>
                            <select name="order_type">
                              <option value="הזמנה">הזמנה</option>
                              <option value="הצעת מחיר">הצעת מחיר</option>
                            </select>
                          </div>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}

              <div class="send-wra">
                {#if currentStep == 1}
                  <button on:click={stepBtnClick} class="submit-btn btn">
                    הבא
                    <img
                      class="arrow-left"
                      width="32px"
                      height="32px"
                      alt="right arrow"
                      src="/right-arrow-hover.png"
                    />
                  </button>
                {:else}
                  <button on:click={stepBtnClick} class="submit-btn btn">
                    {#if isSending}
                      <Spinner />
                    {:else}
                      שלח
                    {/if}
                  </button>
                {/if}
                <button
                  on:click={() => {
                    currentStep -= 1;
                  }}
                  class="btn back-btn"
                  style:display={currentStep == 1 ? "none" : "block"}
                  >הקודם</button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if isModalOpen}
    <div class="sidebar-cart-wraper">
      <aside
        on:click|preventDefault={() => {}}
        transition:fly={{ x: 340 }}
        id="sidebar-cart"
        style:top={sidebar_top + "px"}
      >
        <main>
          <button
            class="close-button"
            on:click={() => {
              toggleModal();
            }}>X</button
          >
          <h2>
            מוצרים שאהבתי<span class="count"
              >{Object.keys($cartStore).length}</span
            >
          </h2>

          <div
            class="upload-image-wraper"
            on:click={() => {
              $productPhotoModalStore.openModal();
            }}
          >
            <span>שלח מוצר שלא מצאת</span>
            <img
              class="upload"
              width="45px"
              height="45px"
              src="https://res.cloudinary.com/ms-global/image/upload/v1649581221/msAssets/upload_camera_s12a01.png"
              alt=""
            />
          </div>
          {#if $userInfoStore.isLogin}
            <!-- Show cart history button if user is logged in cart sidebar -->
            <button
              class="cart-history-button"
              on:click={() => {
                toggleModal();
                cartHistoryModalStore.openModal();
              }}>היסטוריית הזמנות</button
            >
          {/if}
          <!--
					<h2 class="sub-title">הוסיפו מוצרים
						וקבלו הצעת מחיר משתלמת ללא עלות וללא התחייבות</h2>
						-->
          {#if error_found}
            {#key error_found}
              <h4 class="error-msg">{error_message}</h4>
            {/key}
          {/if}
          {#if Object.keys($cartStore).length > 0}
            <ul class="products" use:scrollFix>
              {#each Object.keys($cartStore) as key, i (key)}
                <li
                  class="product"
                  data-product={key}
                  animate:flip={{ duration: 200 }}
                  out:fly={{ x: 100, duration: 200 }}
                  in:fly={{ x: 340, duration: 500, delay: i * 120 }}
                >
                  <div class="product-link">
                    <span
                      on:click={open_product_modal(key)}
                      class="product-image"
                    >
                      <img
                        src="{CLOUDINARY_URL}f_auto,w_auto/{$cartStore[key]
                          .cimage}"
                        alt={$cartStore[key].title}
                      />
                    </span>
                    <span class="product-details">
                      <h3>{$cartStore[key].title}</h3>
                      <hr />
                      <div
                        class="qty-price"
                        on:click={open_edit_amount_dialog(
                          key,
                          $cartStore[key].title
                        )}
                      >
                        <div class="table">
                          <div class="table-row">
                            <div class="table-cell table-cell-title">:כמות</div>
                            <div class="table-cell qty">
                              {#if $cartStore[key].show_sizes_popup}
                                <div class="total-amount">
                                  {$cartStore[key].amount}
                                </div>
                              {:else}
                                <input
                                  type="text"
                                  class="amount-input"
                                  id="cart_amount_{key}"
                                  use:selectTextOnFocus
                                  bind:value={$cartStore[key].amount}
                                />
                              {/if}
                            </div>
                          </div>
                          {#if show_prices && $cartStore[key].out_of_stock == false}
                            <div
                              class="table-row"
                              on:click={(e) => price_cell_click(e, key)}
                            >
                              <div class="table-cell table-cell-title">
                                :'מחיר ליח
                              </div>
                              <div class="table-cell">
                                <span class="">{$cartStore[key].price}₪</span>
                              </div>
                            </div>
                          {/if}

                          <button class="edit-btn">
                            ערוך
                            <svg
                              enable-background="new 0 0 45 45"
                              height="25px"
                              id="Layer_1"
                              version="1.1"
                              viewBox="0 0 45 45"
                              width="25px"
                              xml:space="preserve"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              ><g
                                ><rect
                                  height="23"
                                  transform="matrix(-0.7071 -0.7072 0.7072 -0.7071 38.2666 48.6029)"
                                  width="11"
                                  x="23.7"
                                  y="4.875"
                                /><path
                                  d="M44.087,3.686l-2.494-2.494c-1.377-1.377-3.61-1.377-4.987,0L34.856,2.94l7.778,7.778l1.749-1.749   C45.761,7.593,45.465,5.063,44.087,3.686z"
                                /><polygon
                                  points="16,22.229 16,30 23.246,30  "
                                /><path
                                  d="M29,40H5V16h12.555l5-5H3.5C1.843,11,0,11.843,0,13.5v28C0,43.156,1.843,45,3.5,45h28   c1.656,0,2.5-1.844,2.5-3.5V23.596l-5,5V40z"
                                /></g
                              ></svg
                            >
                          </button>
                        </div>
                      </div></span
                    >
                  </div>
                  <div
                    class="remove-button"
                    on:click|preventDefault={delete_product_from_cart(key)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16px"
                      height="16px"
                      viewBox="0 0 32 36"
                      ><path
                        fill="currentColor"
                        d="M30.9 2.3h-8.6L21.6 1c-.3-.6-.9-1-1.5-1h-8.2c-.6 0-1.2.4-1.5.9l-.7 1.4H1.1C.5 2.3 0 2.8 0 3.4v2.2c0 .6.5 1.1 1.1 1.1h29.7c.6 0 1.1-.5 1.1-1.1V3.4c.1-.6-.4-1.1-1-1.1zM3.8 32.8A3.4 3.4 0 0 0 7.2 36h17.6c1.8 0 3.3-1.4 3.4-3.2L29.7 9H2.3l1.5 23.8z"
                      /></svg
                    >
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
              <button
                class="checkout-button"
                on:click={checkout_click}
                disabled={state == 2}
              >
                לקופה
              </button>
              <button class="copy-button" title="העתק" on:click={copy_cart_click}>
                <img width="25px" height="25px" src="https://res.cloudinary.com/ms-global/image/upload/v1655639299/msAssets/copy-two-paper-sheets-interface-symbol_wldmek.png" alt="copy" />
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
  .copy-button {
    padding: 10px;
    background: rgba(255, 255, 255, 0.507);
    border: none;
    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }
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

  

  // Replace `$search` with `$replace` in `$string`
  @function str-replace($string, $search, $replace: "") {
    $index: str-index($string, $search);

    @if $index {
      @return str-slice($string, 1, $index - 1) + $replace +
        str-replace(
          str-slice($string, $index + str-length($search)),
          $search,
          $replace
        );
    }

    @return $string;
  }
  @mixin hover-active() {
  &:active,
  &:hover {
    @content;
  }
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

  .step {
    &.step-1 {
    }
    &.step-2 {
    }
  }

  .error-msg {
    color: $red;
    font-size: 0.8em;
    margin-top: 0.5em;
  }
  .modal_content {
    .modal-header {
      .modal-title {
        font-size: 1.34em;
        font-weight: bold;
      }
    }
    .modal-body {
      .cart-form {
        .form-group {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          @media screen and (max-width: 945px) {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          .form-control {
            flex: 1;
            flex-grow: 1;
            flex-shrink: 0;
            margin: 5px;
            line-height: 2.5;
            display: flex;
            flex-direction: column;
          }
        }

        table.products {
          th {
            font-size: 1em;
            text-align: center;
            font-weight: bold;
          }
          td {
            font-size: 1.2em;
            text-align: center;
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
                  transition: color 0.5s linear;
                  @include hover-active() {
                    color: $secondary;
                    text-decoration: none;
                  }
                }
                .product-image-and-title {
                  display: flex;
                  justify-content: start;
                  align-items: center;
                  @media screen and (max-width: 1100px) {
                    flex-direction: column;
                    align-items: start;
                  }
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
                  @media screen and (max-width: 1100px) {
                    .product-image {
                      width: 50px;
                      height: 50px;
                    }
                    .product-title {
                      font-size: 0.8em;
                    }
                  }
                }

                @media screen and (max-width: 765px) {
                  font-size: 1rem;
                }
              }
              // ligther colors on all odd rows
              &:nth-child(even) {
                background-color: $gray-600;
              }
            }
          }
        }
        div.totals {
          background-color: $gray-300;
          line-height: 2;
          //display: flex;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          justify-content: space-around;
          font-size: 1.5rem;
          font-weight: bold;
          width: 100%;
          @media screen and (max-width: 945px) {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          @media screen and (max-width: 1100px) {
            font-size: 1rem;
          }
        }

        .float-actions {
          position: fixed;
          top: 20px;
        }

        .send-wra {
          display: flex;
          flex-direction: row-reverse;
          gap: 20px;
          .back-btn {
            margin-top: 1em;
            margin-bottom: 1em;

            //@include bg-gradient();
            background-color: var(--details-btn-color);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            font-weight: bold;
            transition: all 0.3s ease 0s;
            &:hover,
            &:focus {
              box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
              transform: translateY(-7px);
            }
          }

          .submit-btn {
            margin-top: 1em;
            margin-bottom: 1em;
            width: 100%;
            @include bg-gradient();
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

            font-weight: bold;
            transition: all 0.3s ease 0s;
            &:hover,
            &:focus {
              box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
              transform: translateY(-7px);
            }
            img.arrow-left {
              transform: rotate3d(0, 0, 1, 180deg);
            }
          }
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
    //z-index: 997;
    z-index: 2;
    top: 0;
    //right: -340px;
    box-shadow: -10px 0 15px rgba(0, 0, 0, 0.1);
    transition: all 0.75s ease-in-out;

    right: 0;
    visibility: visible;

    /*&.popup-state{
		width: 85vw;
	}*/
    .upload-image-wraper,
    .cart-history-button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $gray-800;
      margin-bottom: 15px;
      border-radius: 25px;
      cursor: pointer;
      //box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.418);
      color: white;
      font-size: larger;
      font-weight: bold;
      @include hover-active() {
        background-color: $gray-700;
        box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
      }
    }

    .cart-history-button {
      width: 100%;
      border: none;
    }
    .cart-info {
      color: white;
      direction: rtl;
      height: calc(100vh - 150px);
      //overflow: scroll;
      overflow: auto;
      .info {
        width: 100%;
        .info-res {
          input {
            border-radius: 15px;
            width: 100%;
            color: white;
          }
        }
      }
      form {
        .form-control {
          padding-top: 15px;
          margin: 5px;
          input,
          textarea {
            direction: rtl;
            text-align: right;
            border: none;
            border-radius: 15px;
            width: 100%;
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
      height: calc(100vh - 193px);
      overflow-x: hidden;
      overflow-y: auto;
      display: block;
      position: relative;
      z-index: 0;
      @media screen and (max-width: 700px) {
        height: calc(100vh - 193px - 62px);
      }

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
                color: $red;
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
      :global(li.product.deleted) {
        transition: all 0.2s linear;
        transform: translatex(340px);
        opacity: 0;
      }
    }

    main {
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
      display: flex;
      justify-content: center;
      align-items: center;
      button.checkout-back {
        display: block;
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

      @media screen and (max-width: 700px) {
        bottom: 62px;
      }
    }
  }
  .hide-on-md {
    @media (max-width: 1000px) {
      display: none;
    }
  }

  #cartModal.active {
    //transition: right 1s ease-in-out;
    .overlay {
      #sidebar-cart {
      }
    }
  }
</style>