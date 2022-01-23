<script>
import { submit_distribution_lead } from "./../../api/api";



    const business_types = ['אבטחה','הייטק','הפקות/ חיי לילה','חברות ניקיון וכוח אדם ','חקלאים/ גדש','לולים','מוסכים','מטבחים/ מסעדות','מלונאות','מנהל חינוך','מנהל תרבות','מנהל קורונה','מסגריות/ רתכים','מפעל/ תעשייה ','נגריות','נוי/ גננים','רפתות','אחר - פרט למטה'];
    let _i_want_emails = true;
    let _i_want_wantsapp = true;
    let submited = false;
    let mform;
    let selected_business_type;
    function submit_form(e) {
        submited = true;
        if(mform.reportValidity()) {
            console.log('submit=', submited);
            const formData = new FormData(mform);
            const data = {};
            for (let field of formData) {
                const [key, value] = field;
                data[key] = value;
            }
            /*let fields = mform.querySelectorAll('input')
            let data = {};
            for(let i = 0; i < fields.length; i++) {
                data[fields[i].name] = fields[i].value;
            }*/
            submit_distribution_lead(data).then(res => {
                console.log('res=', res);
                if(res.status === 200) {
                    alert('הפרטים נשלחו בהצלחה');
                    window.location.href = '/';
                }
            });
        }
    }
    const PHONE_PATTERN = '^(?:(?:(\\+?972|\\(\\+?972\\)|\\+?\\(972\\))(?:\\s|\\.|-)?([1-9]\\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\\s|\\.|-)?([^0\\D]{1}\\d{2}(?:\\s|\\.|-)?\\d{4})$'
    const EMAIL_PATTERN = `/^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/`
    function checkbox_state_change(e) {
        let checkbox = e.target;
        console.log(checkbox.name);
        if(checkbox.name === 'mailing-list' && !checkbox.checked && !_i_want_wantsapp) {
            _i_want_wantsapp = true;
        }else if(checkbox.name === 'whatsapp-list' && !checkbox.checked && !_i_want_emails) {
            _i_want_emails = true;
        }
    }

    function validate_numbers(e) {
        var chr = String.fromCharCode(e.which);
        
        if(!(/[0-9]/.test(chr))) {
            e.preventDefault();
            return false;
        }
    }
</script>

<div class="bg-wraper">
    <main>
        <form bind:this="{mform}"  class="distribution-form  bg-color-primary" class:submited={submited}>
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
                        <select required="{true}" title="סוג עסק" bind:value={selected_business_type} name="business-type" id="business_type" placeholder="סוג העסק">
                            <option value="" disabled selected>סוג עסק שלך</option>
                            {#each business_types as business_type}
                                <option value="{business_type}">{business_type}</option>
                            {/each}
                        </select>
                        <!--
                        <input bind:value={selected_business_type} required={true} pattern="{business_types.join('|')}" type="text" name="business_type" id="business_type" list="business_types" placeholder="סוג העסק - בחר (אחר) אם העסק שלך לא נמצא">
                        <datalist id="business_types">
                            {#each business_types as business_type}
                                <option value="{business_type}">
                            {/each}
                        </datalist>
                        -->
                    {#if selected_business_type == 'אחר - פרט למטה'}
                        <input required="{true}" type="text" name="business-type-other" id="business_type_other" placeholder="סוג העסק שלך">
                    {/if}
                    </fieldset>
                    <fieldset>
                        <input required="{true}" type="text" name="name" id="name" placeholder="שם איש קשר">
                        <!--https://stackoverflow.com/questions/34556308/how-to-validate-israeli-phone-number-->
                        <input required="{_i_want_wantsapp}" type="tel" name="phone" on:keypress="{validate_numbers}" pattern="{PHONE_PATTERN}" minlength="10" id="tel" placeholder="טלפון">
                        <input required="{_i_want_emails}" type="email" name="email" id="email" placeholder="אימייל">
                        <div class="mailing-list-register">
                            <input type="checkbox" name="mailing-list" id="mailing-list" on:click={checkbox_state_change} bind:checked={_i_want_emails}>
                            <label for="mailing-list">
                                אני מעוניין בדיוור למייל
                            </label>
                            <br>
                            <input type="checkbox" name="whatsapp-list" id="whatsapp-list" on:click={checkbox_state_change} bind:checked={_i_want_wantsapp}>
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
                <button class="sub-btn" on:click|preventDefault="{submit_form}" type="submit">רוצה הצעה משתלמת!</button>
        </form>
    </main>
</div>

<style lang="scss">
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
    min-height: -webkit-fill-available;
    height: 100vh;
    overflow-y: auto;
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

        .distribution-form.submited {
            .form-fields {
                input:invalid, select:invalid{
                    border: 1px solid #c00;
                }
                input:focus:invalid, select:focus:invalid{
                    outline: 1px solid #c00;
                }
                input:valid , select:valid {
                    border: 1px solid rgb(31, 204, 0);
                }
                input:focus:valid , select:focus:valid {
                    outline: 1px solid rgb(31, 204, 0);
                }
            }
        }
        @media screen and (max-width: 768px) {
            .distribution-form {
                width: 90%;
            }
            
        }
        @media screen and (max-width: 576px) {
            .distribution-form {
                width: 100%;
                font-size: 1.2rem;
                .sub-btn {
                    font-size: 1.5rem;
                }
            }
        }
        @media screen and (max-width: 380px ) {
            .distribution-form {
                width: 100%;
                font-size: 1.1rem;
                .sub-btn {
                    font-size: 1.3rem;
                }
            }
        }

        @media screen and (max-height: 675px) {
                .distribution-form{
                    margin-top: 250px;
                }
        }
        @media screen and (max-height: 462px) {
                .distribution-form{
                    margin-top: 350px;
                }
            
        }
    }
    
}
</style>