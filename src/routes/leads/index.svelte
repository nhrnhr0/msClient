<script>
import { loadBusinessTypes, save_lead_to_server } from "./../../api/api";
import AutoComplete from "simple-svelte-autocomplete";
import { onMount } from "svelte";
import {fly} from 'svelte/transition'

    let btypes = undefined;
    onMount(async()=> {
        await init();
    })
    async function init(reties=0) {
        // request get_btypes and if fails, types again 3 times
        try {
            btypes = await loadBusinessTypes();
        } catch (e) {
            console.log(e);
            if(reties < 3) {
                reties++;
                await init(reties);
            }
        }
    }
    let show_thank_you_message = false;
    let business_type_results;

    let ElBussinessNmae_error = ''
    let ElBussinessType_error = ''
    let ElBussinessContactMna_error = ''
    let ElBussinessPhone_error = ''
    function submit_form(e) {
        let ElBussinessNmae = document.querySelector('#bussiness_name')
        let ElBussinessType = document.querySelector('#bussiness_type')
        let ElBussinessAddress = document.querySelector('#bussiness_address')
        let ElBussinessContactMna = document.querySelector('#bussiness_contact_name')
        let ElBussinessPhone = document.querySelector('#bussiness_phone')
        let formDataObj = {
            'bussiness_name': ElBussinessNmae.value,
            'bussiness_type': ElBussinessType.value,
            'bussiness_address': ElBussinessAddress.value,
            'bussiness_contact_name': ElBussinessContactMna.value,
            'bussiness_phone': ElBussinessPhone.value,
        }
        let errorFound = false;
        ElBussinessType_error = '';
        ElBussinessNmae_error = '';
        ElBussinessContactMna_error = '';
        ElBussinessPhone_error = '';
        if (ElBussinessType.value === ''){
            ElBussinessType_error = 'שדה זה הוא שדה חובה'
            errorFound = true;
        }
        if (ElBussinessNmae.value === '') {
            ElBussinessNmae_error = 'שדה זה הוא שדה חובה'
            errorFound = true;
        }

        if (ElBussinessContactMna.value === '') {
            ElBussinessContactMna_error = 'שדה זה הוא שדה חובה'
            errorFound = true;
        }

        if (ElBussinessPhone.value === '') {
            ElBussinessPhone_error = 'שדה זה הוא שדה חובה'
            errorFound = true;
        }
        formDataObj['business_type'] = business_type_results;
        if (errorFound) {
            return;
        }

        save_lead_to_server(formDataObj).then(res => {
            show_thank_you_message = true;
            document.querySelector('form').reset();
            // business_type_results = undefined;
            // document.querySelector('.autocomplete-clear-button').click();
        }).catch(err => {
            alert(err);
        })
        console.log(formDataObj);
    }
</script>
<div class="bg-wraper">
{#if show_thank_you_message}
    <div class="overlay">
        <div class="thank-you-message" in:fly="{{y:500, duraion:100}}">
            <div class="close-btn" on:click="{()=>{show_thank_you_message= false;}}">X</div>
            <div class="message">
                <h2>תודה שנרשמתם לדיוור שלנו</h2>
                <p>אנחנו נחזור אליכם בהקדם</p>
            </div>
        </div>
    </div>
{/if}
<main>
    <form class="distribution-form">
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
        <div class="form-group">
                <label for="bussiness_name">שם העסק
                    {#if ElBussinessNmae_error != '' }
                        <span class="error_message"> - 
                            {ElBussinessNmae_error}
                        </span>
                    {/if}
                </label>
                <input required type="text" class="form-control" id="bussiness_name" placeholder="שם העסק">
        </div>

        <div class="form-group">
            <label for="bussiness_type">תחום עיסוק
                {#if ElBussinessType_error != ''}
                    <span class="error_message"> -
                        {ElBussinessType_error}
                    </span>
                {/if}
            </label>
            <input required type="text" class="form-control" id="bussiness_type" placeholder="נגריות/מוסכים/וכ'ו">
            <!--
            <AutoComplete multiple={true} id="business_type" items={btypes} createText="לא נמצאו תוצאות, בחר ב'אחר'"
                create=false placeholder="תחום עיסוק" className="autocomplete-cls" delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="name" bind:value={business_type_results}  >
                <div class="tag-wraper" slot="tag" let:label="{label}" let:item="{item}" let:unselectItem="{unselectItem}">
                    <span class="tag">{label}</span>
                    <span class="delete-tag" on:click|preventDefault="{unselectItem(item)}">x</span>
                </div>
                <div slot="item" let:item let:label>
                    {#if label == 'אחר - פרט למטה'}
                        <div class="other-option">
                            {@html label}
                        </div>
                    {:else}
                        {@html label}
                    {/if}
                  </div>
            </AutoComplete>
            -->
        </div>
        
        
        <!--{#if business_type_results && business_type_results.includes('אחר - פרט למטה')}
            <div class="form-group">
                <label for="bussiness_type">תחום עיסוק - פרט בבקשה
                    {#if ElBussinessType_error != ''}
                        <div class="error_message"> -
                            {ElBussinessType_error}
                        </div>
                    {/if}
                </label>
                <input type="text" class="form-control" id="bussiness_type" placeholder="תחום עיסוק">
            </div>
        {/if}-->

        <div class="form-group">
            <label for="bussiness_address">כתובת</label>
            <input type="text" class="form-control" id="bussiness_address" placeholder="כתובת">
        </div>

        <!-- שם איש קשר -->
        <div class="form-group">
            <label for="bussiness_contact_name">שם איש קשר
                {#if ElBussinessContactMna_error != ''}
                    <span class="error_message"> -
                        {ElBussinessContactMna_error}
                    </span>
                {/if}
            </label>
            <input type="text" class="form-control" id="bussiness_contact_name" placeholder="שם איש קשר">
        </div>


        <div class="form-group">
            <label for="bussiness_phone">טלפון
                {#if ElBussinessPhone_error != ''}
                    <span class="error_message"> -
                        {ElBussinessPhone_error}
                    </span>
                {/if}
            </label>
            <input type="text" required class="form-control" id="bussiness_phone" placeholder="טלפון">
        </div>

        <button class="sub-btn" on:click|preventDefault="{submit_form}" type="submit">
            רוצה להצטרף לדיוור בוואצאפ
        </button>

    </form>
</main>
</div>

<style lang="scss">
    .other-option {
        background: #ccc;
        padding:5px;
    }
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        .thank-you-message {
            .close-btn {
                background: #eee;
                border-radius: 9999;
                position: absolute;
                top:0px;
                transform: translate(50%, -50%);
                width:50px;
                height:50px;
                cursor: pointer;
                &:hover {   
                    background: #ccc;
                }
            }
            background: #f5f4f4;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            text-align: center;
            h2 {
                //font-size: 2.5rem;
                font-weight: bold;
                //margin-bottom: 1rem;
            }
            p {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
        }
    }
    .error_message {
        color: red;
        margin:0px;
        padding:0px;
    }
    :global(.autocomplete-cls) {
        height: auto!important;
        :global(.input-container){
                padding-right: 2.8em!important;
                    :global(.tag-wraper){
                        background-color: rgb(170, 165, 165)!important;
                        border-radius: 15px!important;
                        margin-left: 4px;
                        margin-right: 4px;
                        :global(.delete-tag){
                            padding-left: 8px;
                            padding-right: 8px;
                        }
                    }
            :global(.autocomplete.is-multiple .tags) {
                margin-right: 2.7em;
            }
        }

        :global(.autocomplete-list) {
            position: absolute!important;
            top:100%!important;
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
        //height: -webkit-fill-available;
        //height: 100vh;
        overflow-y: auto;
        main {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            //height: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
            .distribution-form {
                @include bg-gradient();
                border-radius: 25px;
                --defualt-font: 1.5rem;
                font-size: var(--defualt-font);
                direction: rtl;
                text-align: center;
                padding:50px;
                width: 75%;
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease 0s;
                @media screen and (max-width: 768px) {
                    width: 95%;
                }
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
                    //white-space: nowrap;
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
                    font-weight: bold;
                    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

                    &:hover {
                        color: #fff;
                        background-color: #218838;
                        border-color: #1e7e34;
                    }
                    @media screen and (max-width: 768px) {
                        font-size: 1.2rem;
                        padding: 0.1rem 0.2rem
                    }
                }
                .form-group {
                    @media screen and (max-width: 768px) {
                        font-size: 1rem;
                        
                    }
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    label {
                        font-size: 1.2rem;
                        font-weight: bold;
                        
                        text-align: start;

                    }
                    input::placeholder {
                            text-align: center;
                        }
                    :global(.autocomplete-input) {
                        text-align: center;
                    }
                    
                }
            }
        }
    }
</style>