<script>
import { userInfoStore } from "./../stores/stores";

    function open_whatsapp_link() {
        const whatsapp_text = encodeURIComponent('אני מעוניין לראות מחירים באתר')
        var url = `https://api.whatsapp.com/send?phone=972547919908&text=${whatsapp_text}`;
        window.open(url, '_blank');
    }
</script>

<div class="about">
    <div class="container">
        <div class="hero-description">
            <div class="gold-animation">
            מטיילים באתר • מוסיפים לעגלה • שולחים אלינו
            </div>
            הוסיפו לעגלה את המוצרים המועדפים עליכם, שלחו אלינו וקבלו הצעת מחיר משתלמת ישירות למייל  
            <br>
            ללא עלות וללא התחייבות,
            <br>
            אמ אס גלובל - מבינים את העסק שלכם
        </div>
    </div>
</div>
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
    .about {
        overflow: hidden;

        .container {
            background: #d1d1d1;
            font-size: 1.3rem;

            margin: 10px auto;
            width: 100%;
            text-align: center;

            -webkit-box-shadow: 0px 19px 28px 10px rgba(0, 0, 0, 0.89);
            box-shadow: 0px 19px 28px 10px rgba(0, 0, 0, 0.89);
            background: #dbd8d8;
            border-radius: 35px;
            margin-top: 75px;
            margin-bottom: 75px;
            .hero-description {
                color:black;
                font-weight: bold!important;;
                // reduce the font size as the screen size decreases
                @media screen and (max-width: 600px) {
                    font-size: 1.5rem;
                }
                @media screen and (max-width: 400px) {
                    font-size: 1.2rem;
                }

                .gold-animation{
                    font-size: 32px;
                    stroke-width: 0.5px;
                    -webkit-text-stroke-width: 0.5px;
                    -webkit-text-stroke-color: #000000;
                    padding-bottom: 0px;
                }
            }
        }
    }
</style>