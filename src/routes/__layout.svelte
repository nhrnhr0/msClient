<script context="module">
  import "../app.scss";
  import Navbar from "$lib/Navbar.svelte";
  //import { stateQuery} from './../stores/stores'
import { onMount } from "svelte";
  import {all_swipers,userDetailModalStore, albumsJsonStore,cartModalStore, successModalStore, productModalStore, categoryModalStore,productImageModalStore,loginModalStore, sizesJsonStore, colorsJsonStore, userInfoStore} from './../stores/stores'
    
  
</script>




<svelte:head>
  <meta name="theme-color" content="#FFD700" />

  </svelte:head>
  
<LoginModal bind:this={$loginModalStore}></LoginModal>
<ProductModal bind:this={$productModalStore}></ProductModal>
<ProductImageModal bind:this={$productImageModalStore}></ProductImageModal>
<CategoryModal bind:this={$categoryModalStore}> </CategoryModal>
<CartModal2 bind:this={$cartModalStore}></CartModal2>
<SuccessModal bind:this={$successModalStore}></SuccessModal>
<UserDetailsModal bind:this={$userDetailModalStore}></UserDetailsModal>
<Navbar></Navbar>
<!--<div class="hidden">
<input type="text" bind:value={$stateQuery['product']}> 
<input type="text" bind:value={$stateQuery['category']}> 
</div>-->
<script>
  import CartModal2 from '$lib/modals/cartModal2.svelte';
  import CategoryModal from "$lib/modals/cModal.svelte";
  import ProductModal from "$lib/modals/pModal.svelte";
  import ProductImageModal from "$lib/modals/pImgModal.svelte";
  import SuccessModal from '$lib/modals/successModal.svelte';
  import LoginModal from '$lib/modals/loginModal.svelte';
  import UserDetailsModal from '$lib/modals/userDetailsModal.svelte';

</script>

<div id="main_wraper" class="bg-wraper">
  <slot />
</div>

<style lang="scss">
  .bg-wraper  {
    background: url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl')!important;
    background-position: center;
    overflow:hidden;
  }
</style>
