
<!--
<div class="header-1" id="header">
    
</div>
-->

<div class="header-2">
    <div class="header-image">
        <div class="inner-header">
            <img src="https://res.cloudinary.com/ms-global/image/upload/v1635779280/msAssets/logo_ms_outline_veuwpb"
                alt="M.S. Global" width="450px" height="auto" style="max-width: 100%;" />
            <div class="text">
                שיווק &bull; פרסום &bull; מכירות
            </div>
        </div>
        <!--
        <img class="class-bg-image"
            height="334px" style="max-height:334px" src="https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_auto/v1634462230/msAssets/bg_ppl_img_pwk06i"
            alt="אמ. אס גלובל נשמח לעמוד לשירותכם">
            -->
            <picture class="class-bg-image" stlye="border:1px solid red;">
                <source
                media="(max-width: 767px)"
                sizes="(max-width: 334px) 100vw, 334px"
                srcset="
                https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_500/v1634462230/msAssets/bg_ppl_img_pwk06i.jpg 500w,
                https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_634/v1634462230/msAssets/bg_ppl_img_pwk06i.jpg 634w">
                
                <img
                sizes="(max-width: 2560px) 40vw, 1024px"
                srcset="
                https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_480/v1634462230/msAssets/bg_ppl_img_pwk06i.jpg 480w,
                https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_1024/v1634462230/msAssets/bg_ppl_img_pwk06i.jpg 1024w"
                src="https://res.cloudinary.com/ms-global/image/upload/f_auto,h_334,c_crop,g_center,w_1024/v1634462230/msAssets/bg_ppl_img_pwk06i.jpg"
                alt="">
                </picture>
        <div class="content">
            <!--
            <div class="title">
                נשמח לעמוד לשירותכם
            </div>
            -->
        </div>
    </div>
</div>

<style lang="scss">
    .header-2 {
        .header-image {
            
            margin-left: 20px;
            //padding-top: 50px;
            margin-right: 20px;
            //padding-bottom: 50px;

            .inner-header {
                position: absolute;
                top: 50%;
                transform: translate(0,-40%);
                
                //text-shadow: -2px -1px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
                /*font-family: 'Rounded Mplus 1c';*/
                color: white;
                text-align: center;
                font-weight: bold;
                //position: relative;
                z-index: 1;
                width: 100%;
                margin: auto;

                padding-top: 2%;
                padding-bottom: 2%;
                font-size: 2.4rem;

                /*@media screen and (max-width:640px) {
                    font-size: 0.8rem;
                    img {
                        width:150px;
                    }
                }*/
                @media screen and (max-width: 1000px) {
                    font-size: 1.35rem;
                    img {
                        width: 250px;
                        
                    }
                }
                @media screen and (max-width: 500px) {
                    font-size: 1.1rem;
                    img {
                        width: 200px;
                    }
                }
                @media screen and (max-width: 390px) {
                    font-size: 0.9rem;
                    img {
                        width: 160px;
                    }
                }
            }
            @media screen and (max-width:390px) {
                margin-left: 0px;
                margin-right: 0px;
            }
        }
    }

    .header-2 {
        .header-image {
            position: relative;
            filter: brightness(0.8);
            .class-bg-image {
                width: 100vw;
                //border:1px solid red;
                filter: contrast(0.657);
                img {
                    width: 100%;
                    height: auto;
                    max-width: 100%;
                    max-height: 334px;
                }
            }

            .content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                width: 100%;
                font-size: 70px;
                color: white;
                ;
                text-shadow: rgb(0, 0, 0) 3px 0px 0px, rgb(0, 0, 0) 2.83487px 0.981584px 0px, rgb(0, 0, 0) 2.35766px 1.85511px 0px, rgb(0, 0, 0) 1.62091px 2.52441px 0px, rgb(0, 0, 0) 0.705713px 2.91581px 0px, rgb(0, 0, 0) -0.287171px 2.98622px 0px, rgb(0, 0, 0) -1.24844px 2.72789px 0px, rgb(0, 0, 0) -2.07227px 2.16926px 0px, rgb(0, 0, 0) -2.66798px 1.37182px 0px, rgb(0, 0, 0) -2.96998px 0.42336px 0px, rgb(0, 0, 0) -2.94502px -0.571704px 0px, rgb(0, 0, 0) -2.59586px -1.50383px 0px, rgb(0, 0, 0) -1.96093px -2.27041px 0px, rgb(0, 0, 0) -1.11013px -2.78704px 0px, rgb(0, 0, 0) -0.137119px -2.99686px 0px, rgb(0, 0, 0) 0.850987px -2.87677px 0px, rgb(0, 0, 0) 1.74541px -2.43999px 0px, rgb(0, 0, 0) 2.44769px -1.73459px 0px, rgb(0, 0, 0) 2.88051px -0.838247px 0px;
                font-weight: bold;

                .text {}
            }
            /*
            @media screen and (max-width:640px) {
                .content {
                    .title {
                        font-size: 50px;
                    }
                }
            }

            @media screen and (max-width:500px) {
                .content {
                    .title {
                        font-size: 40px;
                    }
                }
            }*/
        }

    }
</style>