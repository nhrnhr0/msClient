<script>
  import "../app.scss";
  import Navbar from "$lib/Navbar.svelte";

</script>
<Navbar></Navbar>
<div class="bg-wraper">
  <slot />
</div>


<style lang="scss">
  .bg-wraper  {
    background: url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background-position: center;
  }
</style>