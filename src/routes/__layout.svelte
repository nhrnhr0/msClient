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
      <footer id="footer">
        <div class="footer-top">
            <div class="container">

            </div>
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
                  <a href="tel:+972-52-4314-139">+972-52-4314-139</a><div class="text">משרד</div>
                </div>
                <div class="contact-icon">
                  <a rel="noopener" target="_blank" href="https://wa.me/+972524314139">
                    <img src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png" alt="whatsapp" />
                  </a>
                </div>
              </div>
  
              <div class="contact-item">
                <div class="contact-text">
                  <a href="mailto: main@ms-global.co.il">main@ms-global.co.il</a>
                  <div class="text">אימייל ראשי</div>
                </div>
                <div class="contact-icon">
                  <a rel="noopener" target="_blank" href="mailto: main@ms-global.co.il">
                    <img src="https://res.cloudinary.com/ms-global/image/upload/v1640258102/msAssets/icons8-email-64_jtvddl.png" alt="whatsapp" />
                  </a>
                </div>
              </div>
  
              <div class="contact-item">
                <div class="contact-text">
                  <a href="tel:+972-54-791-9908">+972-54-791-9908</a><div class="text">מכירות</div>
                </div>
                <div class="contact-icon">
                  <a rel="noopener" target="_blank" href="https://wa.me/+972547919908">
                    <img src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png" alt="whatsapp" />
                  </a>
                </div>
              </div>
  

  
  
  
  
              
        </div>
    </footer>
</div>

<style lang="scss">
  .bg-wraper  {
    background: url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl')!important;
    background-position: center;
    overflow:hidden;
  }

  #footer {
    background: #353c41;
    padding: 5px 0;
    color: #fff;
    font-size: 14px;
    direction: ltr;
    
      width: 100%!important;
      .contact {
        display: flex;;
        justify-content: space-between;
        width: 100%;
        @media screen and (max-width: 568px) {
          flex-direction: column;
        }
        .contact-item {
          
          width: 100%;
          display: inline-block;
          margin-right: 20px;
          display:flex;
          justify-content: center;
          align-items: center;
          
          &:hover, &:focus {
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
                content: ' - ';
                margin-left:4px;
                margin-right: 4px;
              }
            }

            @media screen and (max-width: 1100px) {
              display:flex;
              flex-direction: column-reverse;
              text-align: center;
              .text {
                &::before {
                  content: '';
                  margin-left:4px;
                  margin-right: 4px;
                }
              }
            }
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
