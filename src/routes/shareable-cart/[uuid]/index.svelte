<script context="module">
import { fetch_wraper } from "src/api/api";
import { GET_SHAREABLE_CART_URL } from "src/api/consts";
import { shereCartStore } from "src/stores/shereCartStore";
import { onMount } from "svelte";

export async function load({ fetch, page, session, contex }) {
  let cart_uuid = page.params.uuid;
  let url = GET_SHAREABLE_CART_URL + cart_uuid + "/";
  let response = await fetch_wraper(url, {}, fetch);
  return {
    props: {
      cart: response.data,
    },
  };
}
</script>

<script>
export let cart = undefined;
onMount(() => {
  debugger;
  shereCartStore.setCart(cart);
  shereCartStore.openModal();
});
</script>

<pre>
    {JSON.stringify(cart, null, 2)}
</pre>
