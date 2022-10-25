<script context="module">
import { isNumeric } from "$lib/utils/utils";
import { onMount } from "svelte";

import { fetch_wraper } from "./../../../api/api";
import { ALBUMS_API_URL, CLOUDINARY_URL } from "./../../../api/consts";

export async function load({ fetch, page, session, contex }) {
  //console.log(page);
  //console.log("load", page.params);
  //let url = ALBUMS_API_URL + page.params.id + "/";
  let params = page.params;
  let server_url = ALBUMS_API_URL + params.id + "/";
  //console.log(url);
  if (isNumeric(params.id)) {
    try {
      let response = await fetch_wraper(server_url, { method: "GET" }, fetch);
      //console.log(response);
      response.fotter = response.fotter.replace(/(\r\n|\n|\r)/gm, "");
      let favicon = `${CLOUDINARY_URL}/c_scale,w_300/c_scale,u_v1649744644:msAssets:image_5_qo7yhx.jpg,w_300/${response?.cimage}`;
      response.favicon = favicon;
      return {
        props: {
          data: response,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        props: {},
      };
    }
  } else {
    return {
      props: {},
    };
  }
}
</script>

<script>
import { flashy_page_view } from "$lib/flashy";

export let data;
onMount(() => {
  flashy_page_view();
  sessionStorage.setItem(
    "onLoadTask",
    JSON.stringify({ type: "category", data: data })
  );
  window.location.replace("/");
});
</script>

<svelte:head>
  <title>{data?.title}</title>
  <link sizes="60x60" rel="icon" href={data.favicon} />
  <meta name="description" content={data?.fotter} />
  <meta name="keywords" content={data?.keywords} />
  <meta name="title" content={data?.title} />

  <meta property="og:title" content={data?.title} />
  <meta property="og:description" content={data?.fotter} />
  <meta property="og:image" content={data.favicon} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="M.S. Global" />
  <meta property="og:locale" content="IL" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content={data?.title} />
  <meta property="twitter:description" content={data?.description} />
  <meta property="twitter:image" content={data.favicon} />

  <!-- Size of image. Any size up to 300. Anything above 300px will not work in WhatsApp -->
  <meta property="og:image:width" content="300" />
  <meta property="og:image:height" content="300" />
</svelte:head>
{@debug}
<a href="./{data.id}/products/">products</a>
