<script context="module">
  import "../app.scss";
  import Navbar from "$lib/Navbar.svelte";
  import { stateQuery} from './../stores/queryStore'
  

</script>
<Navbar></Navbar>
<!--<div class="hidden">
<input type="text" bind:value={$stateQuery['product']}> 
<input type="text" bind:value={$stateQuery['category']}> 
</div>-->
<div class="bg-wraper">
  <slot />
</div>

<script>
</script>

<style lang="scss">
  .bg-wraper  {
    background: url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl')!important;
    background-position: center;
  }
</style>
