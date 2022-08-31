<script context="module">
// load function is called when the page is loaded.
export async function load({ fetch, page, session, contex }) {
  let data_promise = fetch_main_page_albums(fetch);
  let main_categories_promise = get_topLevelCategories(fetch);
  let logos_promise = my_fetch(LOGOS_API_URL, { method: "GET" }, fetch).then(
    (response) => response.json()
  );
  let [data, main_categories, logos] = await Promise.all([
    data_promise,
    main_categories_promise,
    logos_promise,
  ]);
  return {
    props: {
      main_albums: data,
      main_categories: main_categories,
      logos: logos,
    },
  };
}
</script>

<script>
import Header from "src/lib/header.svelte";
import LogoSwiper from "src/lib/swipers/logoSwiper.svelte";
import TopLevelCategoriesBlock from "src/new/TopLevelCategoriesBlock.svelte";
import { userInfoStore } from "src/stores/stores";
import { sl_disable, sl_enable } from "$lib/utils/scroll-lock";
import { activeModalsStore } from "src/lib/modals/modalManager";
import { browser } from "$app/env";
import { onMount } from "svelte";
import { fetch_main_page_albums } from "src/network/fetch_main_page_albums";
import MainPageAlbums from "src/new/MainPageAlbums.svelte";
import CallToActionForm from "src/lib/components/CallToActionForm.svelte";
import PersonalCampaigns from "src/new/PersonalCampaigns.svelte";
import About from "src/lib/about.svelte";
import ContentForm from "src/lib/contentForm.svelte";
import NewProductsSwiper from "src/new/NewProductsSwiper.svelte";
import { get_topLevelCategories } from "src/stores/sessionStorage/topLevelCategories";
import { my_fetch } from "src/network/my_fetch";
import { LOGOS_API_URL } from "src/api/consts";
import TopLevelCategoriesBlock2 from "src/new/TopLevelCategoriesBlock2.svelte";
export let main_albums;
export let main_categories;
export let logos;
function open_whatsapp_link() {
  const whatsapp_text = encodeURIComponent("אני מעוניין לראות מחירים באתר");
  var url = `https://api.whatsapp.com/send?phone=972547919908&text=${whatsapp_text}`;
  window.open(url, "_blank");
}
activeModalsStore.subscribe((modals) => {
  if (browser) {
    if (Object.keys(modals).length == 0) {
      sl_disable();
    } else {
      sl_enable();
    }
  }
});
</script>

<Header />
<LogoSwiper {logos} />
<TopLevelCategoriesBlock2 {main_categories} />
{#if $userInfoStore.isLogin == false}
  <div class="whatsapp-btn-wraper">
    <button on:click={open_whatsapp_link} class="whatsapp-btn">
      רוצים לראות מחירים באתר?
    </button>
  </div>
{/if}
<NewProductsSwiper />
<CallToActionForm />
<PersonalCampaigns />
<About />
<MainPageAlbums {main_albums} />
<ContentForm />

<footer id="footer">
  <div class="footer-top">
    <div class="container" />
  </div>
  <div class="copyright">
    &copy; Copyright <strong>M.S. Global</strong>. All Rights Reserved
  </div>
  <div class="credits">
    Designed by <a href="https://ms-global.co.il/">M.S. Global</a>
  </div>
  <div class="contact">
    <div class="contact-item">
      <div class="contact-text">
        <a href="tel:+972-52-4314-139">+972-52-4314-139</a>
        <div class="text">משרד</div>
      </div>
      <div class="contact-icon">
        <a rel="noopener" target="_blank" href="https://wa.me/+972524314139">
          <img
            src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png"
            alt="whatsapp"
          />
        </a>
      </div>
    </div>

    <div class="contact-item">
      <div class="contact-text">
        <a href="mailto: main@ms-global.co.il">main@ms-global.co.il</a>
        <div class="text">אימייל</div>
      </div>
      <div class="contact-icon">
        <a rel="noopener" target="_blank" href="mailto: main@ms-global.co.il">
          <img
            src="https://res.cloudinary.com/ms-global/image/upload/v1640258102/msAssets/icons8-email-64_jtvddl.png"
            alt="whatsapp"
          />
        </a>
      </div>
    </div>

    <div class="contact-item">
      <div class="contact-text">
        <a href="tel:+972-54-791-9908">+972-54-791-9908</a>
        <div class="text">מכירות</div>
      </div>
      <div class="contact-icon">
        <a rel="noopener" target="_blank" href="https://wa.me/+972547919908">
          <img
            src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png"
            alt="whatsapp"
          />
        </a>
      </div>
    </div>
  </div>
</footer>

<style lang="scss">
.whatsapp-btn-wraper {
  display: flex;
  justify-content: center;
  align-items: center;
  .whatsapp-btn {
    background-color: #25d366;
    color: #fff;
    border: 1px solid #25d366;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    font-size: 1.4rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 25px;
    transition: all 0.3s ease-in-out;
    &:hover {
      box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
      transform: translateY(-7px);
    }
  }
}

#footer {
  background: #353c41;
  padding: 5px 0;
  color: #fff;
  font-size: 14px;
  direction: ltr;

  width: 100% !important;
  .contact {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .contact-item {
      width: 100%;
      display: inline-block;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover,
      &:focus {
        background-color: #dfba41;
      }
      @media screen and (max-width: 1230px) {
        flex-direction: column-reverse;
      }

      .contact-icon {
        img {
          width: 30px;
          height: 30px;
        }
        margin-left: 10px;
      }
      .contact-text {
        font-size: 16px;
        display: inline-block;

        .text {
          display: inline-block;
          &::before {
            content: " - ";
            margin-left: 4px;
            margin-right: 4px;
          }
        }

        @media screen and (max-width: 1100px) {
          display: flex;
          flex-direction: column-reverse;
          text-align: center;
          .text {
            &::before {
              content: "";
              margin-left: 4px;
              margin-right: 4px;
            }
          }
        }
      }
    }
    @media screen and (max-width: 568px) {
      //flex-direction: column;
      .contact-item {
        flex: 1;
        margin-right: 2px;
      }
    }
  }
  .copyright {
    text-align: center;
  }

  .credits {
    padding-top: 10px;
    text-align: center;
    font-size: 13px;
    color: #ccc;
  }
}
</style>
