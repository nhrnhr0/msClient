<script>
import { userInfoStore } from "src/stores/stores";

export let price;
export let new_price;
export let top = "25px";
export let left = "25px";
export let font_size = "1.2em";
export let out_of_stock = false;
let show_price_tag;
$: {
  show_price_tag =
    $userInfoStore &&
    $userInfoStore.isLogin &&
    (new_price || price) &&
    $userInfoStore.hidePrices == false &&
    out_of_stock == false;
}
</script>

{#if show_price_tag}
  <div
    class="price-tag"
    style="top:{top};left:{left};--amount-font-size:{font_size}"
  >
    {#if new_price}
      <del>
        <span class="amount">
          {price}₪
        </span>
      </del>
      <ins>
        <span class="amount">
          {new_price}₪
        </span>
      </ins>
    {:else}
      <span class="amount">
        {price}₪
      </span>
    {/if}
  </div>
{/if}
{#if out_of_stock}
  <div class="sold-out-wraper">
    <img
      src="https://res.cloudinary.com/ms-global/image/upload/v1648713887/msAssets/pngfind.com-pubg-player-png-5352359_1_bepovk.png"
      class="sold-out-icon"
      alt="מלאי לא זמין"
    />
    <div class="out-of-stock-can-order-label">אין במלאי, ניתן להזמין</div>
  </div>
{/if}

<style lang="scss">
.sold-out-wraper {
  position: absolute;
  z-index: 1;
  width: 100px !important;
  height: auto !important;
  max-width: 50%;
  top: 30px;
  right: 0px;
  .sold-out-icon {
    border: none;
    background: none;
    //transform: translate(-50%, 0);
    width: 100%;
    height: auto;
  }
  .out-of-stock-can-order-label {
    color: white;
    text-shadow: 1px 1px 1px black;
    font-size: 0.8em;
    text-align: center;
    position: absolute;
  }
}
.price-tag {
  position: absolute;
  top: 5px;
  left: 5px;
  line-height: 1;
  padding: 2%;
  font-weight: 700;
  border-radius: 25px;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  font-size: x-large;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .amount {
    font-size: var(--amount-font-size);
  }
  del {
    flex: 1;
    font-size: smaller;
    color: #ff000080;
    text-decoration: none;
    position: relative;
    display: block;
    text-align: center;
    &::before {
      content: " ";
      display: block;
      width: 100%;
      border-top: 2px solid rgba(255, 0, 0, 0.8);
      height: 9px;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: rotate(-7deg);
    }
  }
  ins {
    color: green;
    text-decoration: none;
  }
}
</style>
