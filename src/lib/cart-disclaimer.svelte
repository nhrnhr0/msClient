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


<style lang="scss">
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