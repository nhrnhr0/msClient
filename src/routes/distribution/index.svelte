<script>
    import AutoComplete from "simple-svelte-autocomplete";

    const business_types = ['אבטחה','הייטק','הפקות/ חיי לילה','חברות ניקיון וכוח אדם ','חקלאים/ גדש','לולים','מוסכים','מטבחים/ מסעדות','מלונאות','מנהל חינוך','מנהל תרבות','מנהל קורונה','מסגריות/ רתכים','מפעל/ תעשייה ','נגריות','נוי/ גננים','רפתות','אחר'];
    let _i_want_emails = true;
    let _i_want_wantsapp = true;
</script>

<div class="bg-wraper">
    <main>
        <form class="distribution-form  bg-color-primary">
            <div class="vip-text">
                <div>כל הלקוחות שלנו הם V.I.P אבל יש כאלה שמרוויחים <span class="mark-strong">יותר</span>...</div>
        
                <div>
                    <span class="mark-strong">
                        רוצים להרוויח גם?
                    </span>
                </div>
        
                <div>הצטרפו למועדון הלקוחות שלנו ותתחילו להרוויח <span class="mark-strong">יותר</span> על כל הזמנה!
                </div>
            </div>
            <!--
                טופס
                שם העסק
                סוג העסק - autocompleate from api
                שם איש הקשר
                - אני מעוניין בדיוור:
                - למייל - bool
                - לוואטסאפ - bool
            -->
        
                <div class="form-fields">
                    <fieldset>
                        <input required="{true}" type="text" name="business-name" id="business_name" placeholder="שם העסק">
                        <AutoComplete items="{business_types}" id="business_type" name="business type" placeholder="סוג העסק"></AutoComplete>
                    </fieldset>
                    <fieldset>
                        <input required="{true}" type="text" name="שם" id="name" placeholder="שם איש קשר">
                        <input required="{_i_want_wantsapp}" type="tel" name="טלפון" id="tel" placeholder="טלפון">
                        <input required="{_i_want_emails}" type="email" name="אימייל" id="email" placeholder="אימייל">
                        <div class="mailing-list-register">
                            <input type="checkbox" name="mailing-list" id="mailing-list" checked={_i_want_emails}>
                            <label for="mailing-list">
                                אני מעוניין בדיוור למייל
                            </label>
                            <br>
                            <input type="checkbox" name="whatsapp-list" id="whatsapp-list" checked={_i_want_wantsapp}>
                            <label for="whatsapp-list">
                                אני מעוניין בדיוור לוואטסאפ
                            </label>

                        </div>
                    </fieldset>
                    <!--
                    <div class="form-group">
                        <input class="checkbox" checked type="checkbox" name="מעוניין_בתוכן_שיווקי" id="check2">
                        <label class="checkbox-title" for="check2">אני מעוניין לקבל תוכן פרסומי</label>
                    </div>
                    -->
                </div>
                <button class="sub-btn" type="submit">רוצה הצעה משתלמת!</button>
        </form>
    </main>
</div>

<style lang="scss">
    :global(.input-container) {
        :global(.autocomplete-input) {
            //border: none;
        }
    }
    .mark-strong {
        font-weight: bolder;
    }

    .mark-bigger {
        font-size: larger;
    }
    .bg-color-primary {
        //background-color: var(--clr-primary);
        @include bg-gradient();
    }
    .bg-wraper  {
    background: url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl');
    background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('https://res.cloudinary.com/ms-global/image/upload/f_auto/v1634461664/msAssets/wall_bg_az5xzl')!important;
    background-position: center;
    overflow:hidden;
    width: 100%;
    height: 100vh;
    min-height: -webkit-fill-available;
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        
        height: 100%;
        .distribution-form {
            border-radius: 25px;
            --defualt-font: 1.5rem;
            font-size: var(--defualt-font);
            direction: rtl;
            text-align: center;
            padding:50px;
            width: 75%;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease 0s;
            
            &:hover,&:focus {
                box-shadow: 0px 15px 20px black;
            }
            .vip-text {
                font-size: 1.2rem;
            }
            .form-fields {
                padding-top: 30px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .sub-btn {
                color: #fff;
                background-color: #28a745;
                border-color: #28a745;
                display: inline-block;
                font-weight: 400;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                //border: 1px solid transparent;
                border: 1px solid #eee;
                padding: .375rem .75rem;
                font-size: 2rem;
                margin-top: 20px;
                line-height: 1.5;
                border-radius: .25rem;
                margin-bottom: 5px;
                transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

                &:hover {
                    color: #fff;
                    background-color: #218838;
                    border-color: #1e7e34;
                }
            }
            fieldset {
                display: flex;
                flex-direction: column;
                gap: 15px;
                
            }
        }
        
    }
    
}
</style>