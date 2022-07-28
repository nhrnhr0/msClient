<script context="module">
    import { writable } from "svelte/store";
  
    import "src/app.scss";
    import Navbar from "$lib/Navbar.svelte";
    //import { stateQuery} from './../stores/stores'
    import { onMount } from "svelte";
    
  </script>

  <script>
  </script>
  
  <svelte:head>
    <meta name="theme-color" content="#FFD700" />
  </svelte:head>
  <Navbar />
  
  <div id="main_wraper" class="bg-wraper">
    <slot />
    <!--<footer id="footer">
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
            <div class="text">אימייל ראשי</div>
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
    </footer>-->
  </div>
  
  <style lang="scss">
    /*.bg-wraper {
      background: url("https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl");
      background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
        url("https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl") !important;
      background-position: center;
      overflow: hidden;
      padding-top: 78px;
    }*/
    #main_wraper {
      height: 100vh;
    }

  </style>
  