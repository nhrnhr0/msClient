<script context="module">
</script>

<script>
import { page } from "$app/stores";
import { BASE_URL, CLOUDINARY_URL } from "src/api/consts";
import { my_fetch } from "src/network/my_fetch";
import { Spinner } from "sveltestrap";
import { cartStore, dictCartStore } from "src/stores/cartStore";
import PriceTag from "src/new/priceTag.svelte";
import { onMount, onDestroy } from "svelte";
import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { add_products_slim_to_store } from "src/stores/sessionStorage/slimProducts";

export let page_info;
let next_page = undefined;
let bottom_loading = false;
let main_loading = false;

let my_products = [];
/*$: {
        if(products!=undefined) {
            my_products = [...products];
            main_loading = false;
        }else {
            
            // scroll top:
            if (browser) {
                let el = document.querySelector('.products-wraper');
                if (el) {
                    //el.scrollTo({ top: 0, behavior: 'smooth' })
                    el.scrollTop = 0;
                }
            }
            main_loading = true;
        }
    }*/
onMount(async () => {
  if ($page.query.toString() != "") {
    let store_next_page = window.sessionStorage.getItem(
      "galery_page_next_url_" + $page.query.toString()
    );
    if (store_next_page == "null") {
      next_page = null;
    } else {
      next_page =
        store_next_page ||
        BASE_URL + "/my-api/get-album-images" + "?" + $page.query.toString();
    }
    main_loading = true;
    let el = document.querySelector(".products-wraper");

    let products = window.sessionStorage.getItem(
      "galery_page_products_" + $page.query.toString()
    );
    if (products) {
      products = JSON.parse(products);
      my_products = [...products];
      main_loading = false;
      if (el) {
        //el.scrollTo({ top: 0, behavior: 'smooth' })
        let old_scroll_pos = window.sessionStorage.getItem(
          "galery_page_scroll_pos_" + $page.query.toString()
        );
        if (old_scroll_pos) {
          setTimeout(() => {
            old_scroll_pos = parseInt(old_scroll_pos);
            el.scrollTop = old_scroll_pos;
          });
        }
      }
    } else {
      load_more_products(true).then(() => {
        main_loading = false;
        if (el) {
          //el.scrollTo({ top: 0, behavior: 'smooth' })
          el.scrollTop = 0;
        }
      });
    }
  }
});
onDestroy(() => {});
let percent;
function products_grid_scrolled(e) {
  let el = e.target;
  let height = el.clientHeight;
  let scrollHeight = el.scrollHeight - height;
  let scrollTop = el.scrollTop;
  percent = Math.floor((scrollTop / scrollHeight) * 100);
  if (percent > 85 && !bottom_loading) {
    if (next_page) {
      bottom_loading = true;
      load_more_products();
    }
  }
  window.sessionStorage.setItem(
    "galery_page_scroll_pos_" + $page.query.toString(),
    scrollTop
  );
}

function load_more_products(reset = false) {
  console.log(next_page);

  return my_fetch(next_page)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // if (data.results) {
      //   add_products_slim_to_store(data.results);
      // }
      if (reset) {
        my_products = [...data.results];
      } else {
        my_products = [...my_products, ...data.results];
      }
      page_info = { ...data };
      bottom_loading = false;
      next_page = data.next;
      window.sessionStorage.setItem(
        "galery_page_products_" + $page.query.toString(),
        JSON.stringify(my_products)
      );
      window.sessionStorage.setItem(
        "galery_page_next_url_" + $page.query.toString(),
        next_page
      );
    });
}

function product_clicked(e) {
  let el = e.currentTarget;
  let id = el.dataset.productId;
  console.log("product_clicked", id);
  let new_query = new URLSearchParams($page.query);
  new_query.set("product_id", id);
  let new_url = $page.path + "?" + new_query.toString();
  //$page.query('product', id);
  goto(new_url);
}

function get_product_url(p) {
  let new_query = new URLSearchParams($page.query);
  new_query.set("product_id", p.id);
  let new_url = $page.path + "?" + new_query.toString();
  return new_url;
}
let product_wraper_clientWidth;
/*$: {
        if(products){
            selected_product = products.find(p => p.catalogImage.id == $page.query.get('product_id'));
            let new_query = $page.query;
            new_query.delete('product_id');
            backUrl = $page.path + '?' + new_query.toString();
        }
    }*/
</script>

<div
  class="products-wraper"
  on:scroll={products_grid_scrolled}
  class:small-view={product_wraper_clientWidth < 650}
  class:small-view-mobile={product_wraper_clientWidth < 400}
  bind:offsetWidth={product_wraper_clientWidth}
>
  {#if main_loading}
    <div class="spinner-container">
      <Spinner />
    </div>
  {/if}
  {#each my_products as product}
    <a
      href={get_product_url(product)}
      class="product"
      data-product-id={product.id}
      title={product.title}
    >
      <div class="product-image">
        {#if $dictCartStore[product.id]}
          <div class="ribbon ribbon-top-right"><span>המוצר בסל</span></div>
        {/if}
        <img src={CLOUDINARY_URL + product.cimage} alt={product.title} />
        <PriceTag
          price={product.price}
          new_price={product.new_price}
          top={"4px"}
          left={"4px"}
          font_size={"0.6em"}
          out_of_stock={product.out_of_stock}
        />
      </div>
      <div class="product-info">
        <div class="product-title">
          {product.title.length > 25
            ? product.title.substring(0, 25) + "..."
            : product.title}
        </div>
        <!-- {#if product.price != 0}
                                <div class="product-price">
                                    {product.price} ₪
                                </div>
                            {/if} -->
      </div>
    </a>
  {/each}
  {#if bottom_loading}
    <h2 class="loading-title"><Spinner /></h2>
  {/if}
</div>

<style lang="scss">
.loading-title {
  width: 100%;
  text-align: center;
  text-align: center;
}
.spinner-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.products-wraper {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  width: 100%;
  //height: 100%;
  overflow: scroll;
  padding: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.199);
  padding: 15px;

  border-radius: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  gap: 5px;
  transition: all 3s ease-in-out;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 215px);
  height: calc(var(--vh, 1vh) * 100 - 215px);
  margin-bottom: 92px;
  margin-left: 15px;

  @media screen and (max-width: 768px) {
    margin-left: 5px;
  }
  & .product {
    position: relative;
    cursor: pointer;
    display: flex;
    //flex: 1 0 0;
    flex: 1 1 10%;
    flex-direction: column;
    text-decoration: none;

    & .product-image {
      background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
      //background: radial-gradient(circle, #f9f295b5 0%, #f9f295ba 32%, #e0aa3eb8 84%);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      img {
        width: 175px;
        height: 175px;
      }
    }
    & .product-info {
      background: rgb(117, 116, 116);
      z-index: 1;
      & .product-title {
        margin-right: 4px;
        margin-left: 4px;
        font-size: 16px;
        color: white;
        text-align: center;
        height: 48px;
        line-height: 1;
      }

      & .product-price {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 16px;
        background-color: rgba(255, 255, 255, 1);
        width: auto;
        text-align: center;
        border-radius: 25px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
        line-height: 2;
        padding-left: 3px;
        padding-right: 3px;
      }
    }

    &:hover {
      & .product-image {
        img {
          transform: scale(1.1);
          //z-index: -1;
          filter: brightness(1.3); //brightness(0.8);
        }
      }
      & .product-info {
        background: rgb(117, 116, 116);
        & .product-title {
          font-weight: bold;
        }
      }
    }
  }
  &.small-view {
    & .product {
      & .product-image {
        img {
          width: 100px;
          height: 100px;
        }
      }
      & .product-info {
        & .product-title {
          font-size: 12px;
        }
        & .product-price {
          font-size: 12px;
        }
      }
    }

    &.small-view-mobile {
      & .product {
        & .product-image {
          img {
            width: 100%;
            height: 100%;
            min-width: 65px;
          }
        }
      }
    }
  }
}
</style>
