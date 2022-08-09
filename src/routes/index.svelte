<script>
    import Header from "src/lib/header.svelte";
    import LogoSwiper from "src/lib/swipers/logoSwiper.svelte";
    import TopLevelCategoriesBlock from "src/new/TopLevelCategoriesBlock.svelte";
    import {
        userInfoStore
    } from "src/stores/stores";
    import {
        sl_disable,
        sl_enable
    } from "$lib/utils/scroll-lock";
    import {
        activeModalsStore
    } from "src/lib/modals/modalManager";
import { browser } from "$app/env";
import { onMount } from "svelte";

    function open_whatsapp_link() {
        const whatsapp_text = encodeURIComponent('אני מעוניין לראות מחירים באתר')
        var url = `https://api.whatsapp.com/send?phone=972547919908&text=${whatsapp_text}`;
        window.open(url, '_blank');
    }
    onMount(()=> {
        document.querySelector('#main_wraper').style.height = 'auto';
    })
    activeModalsStore.subscribe(modals => {
        if (browser) {
            if (Object.keys(modals).length == 0) {
                sl_disable();
            } else {
                sl_enable();
            }
        }
    });
</script>
<Header></Header>
<LogoSwiper></LogoSwiper>
<TopLevelCategoriesBlock />

{#if $userInfoStore.isLogin == false}
    <div class="whatsapp-btn-wraper">
        <button on:click="{open_whatsapp_link}" class="whatsapp-btn">
            רוצים לראות מחירים באתר?
        </button>
    </div>
{/if}


<style lang="scss">
    .whatsapp-btn-wraper{ 
        display: flex;
        justify-content: center;
        align-items: center;
        .whatsapp-btn {
            background-color: #25d366;
            color: #fff;
            border: 1px solid #25d366;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
            font-size: 1.4rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            margin-bottom: 20px;
            padding:25px;
            transition: all 0.3s ease-in-out;
            &:hover {
              box-shadow: 0px 15px 10px rgba(0, 0, 0, 0.7);
              transform: translateY(-7px);
            }

        }
    }
</style>