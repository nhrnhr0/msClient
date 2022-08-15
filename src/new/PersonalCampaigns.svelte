<script>
import { onMount } from "svelte";
import {userInfoStore} from "src/stores/stores";
import MainPageCampaignSwiper from "./MainPageCampaignSwiper.svelte";
import NewProductsSwiper from "./NewProductsSwiper.svelte";
import HotProductsSwiper from "./HotProductsSwiper.svelte";

    let campains = [];
    onMount(()=> {
        campains = $userInfoStore?.me?.campains || [];
    })
</script>
{#each campains as campain}
    <MainPageCampaignSwiper campain={campain} />
{/each}

