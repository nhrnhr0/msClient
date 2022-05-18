<script>
import { onMount } from "svelte";

import { submit_distribution_lead,loadAllIntrests,loadBusinessTypes, maps_key, loadBusinessTypesGroups } from "./../../api/api";
import AutoComplete from "simple-svelte-autocomplete";
import {Spinner} from 'sveltestrap';
import { prevent_default } from "svelte/internal";
import About from "$lib/about.svelte";

    let business_types = [];// = ['אבטחה','הייטק','הפקות/ חיי לילה','חברות ניקיון וכוח אדם ','חקלאים/ גדש','לולים','מוסכים','מטבחים/ מסעדות','מלונאות','מנהל חינוך','מנהל תרבות','מנהל קורונה','מסגריות/ רתכים','מפעל/ תעשייה ','נגריות','נוי/ גננים','רפתות', 'בית אריזה', 'טכנאי/מתקין','תחזוקה','נאמן בטיחות', 'אחר - פרט למטה', ];
    let _i_want_emails = true;
    let _i_want_wantsapp = true;
    let submited = false;
    let loaded = false;
    let mform;
    let selected_business_type;
    let intrests = [];
    let selected_intrests = [];
    let business_input;
    let business_types_groups;
    onMount(async ()=> {
        loaded = false;
        debugger;
        intrests = await loadAllIntrests();
        business_types = await loadBusinessTypes();
        business_types_groups = await loadBusinessTypesGroups();
        console.log('intrests: ', intrests);
        console.log('business types: ', business_types)
        loaded = true;
        
        /*window.$(document).ready(function() {
            
            setTimeout(()=>{
                    console.log('ready!');
                    window.$('#business_type').select2({
                        placeholder: 'בחר את תחומי העיסוק שלך',
                        allowClear: false,
                        dropdownAutoWidth: true,
                        closeOnSelect: false,
                    });
                    window.$('#business_type').on('change', business_type_results_changed)
                },0)
        })*/
        
    })

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
            data.intrests = instrests_results;
            data.business_types = business_type_results;
            /*let fields = mform.querySelectorAll('input')
            let data = {};
            for(let i = 0; i < fields.length; i++) {
                data[fields[i].name] = fields[i].value;
            }*/
            console.log('submiting data: ', data);
            submit_distribution_lead(data).then(res => {
                console.log('res=', res);
                if(res.status === 200) {
                    alert('הפרטים נשלחו בהצלחה');
                    window.location.href = '/';
                }
            });
        }
    }
    //const PHONE_PATTERN = '^(?:(?:(\\+?972|\\(\\+?972\\)|\\+?\\(972\\))(?:\\s|\\.|-)?([1-9]\\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\\s|\\.|-)?([^0\\D]{1}\\d{2}(?:\\s|\\.|-)?\\d{4})$'
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

    /*function validate_numbers(e) {
        var chr = String.fromCharCode(e.which);
        
        if(!(/[0-9]/.test(chr))) {
            e.preventDefault();
            return false;
        }
    }*/
    let hasCustomInBusinessType = false;
    let business_type_results;
    let instrests_results = [];
    let instrests_results2 = [];
    $: {
        console.log('business_type_results: ', business_type_results);
        if (business_type_results != undefined) {
            hasCustomInBusinessType = business_type_results.find(x => x === 'אחר - פרט למטה') != undefined;
        }
    }

    function add_bulk_intrests(intrestsToAdd, e) {
        e.preventDefault();
        debugger;
        let newIntrests = [...instrests_results2]
        intrestsToAdd.forEach(intrest => {
            let item = {
                name: intrest['title']?intrest['title']: intrest['name'],
            }
            if(newIntrests.filter((v)=>{return v.name == item.name}).length == 0){
                newIntrests.push(item);
            }
        });
        setTimeout(() => {
            instrests_results2 = [...newIntrests];
        }, 10);
    }

</script>
<svelte:head>
    <!--
	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key={maps_key}&callback=initMap&libraries=places&v=weekly&channel=2" async defer ></script>
    <script>
        function initMap() {
            console.log('initMap before timeout');
            setTimeout(() => {
                console.log('initMap');
                const options = {
                    strictBounds: false,

                };
                const input = document.getElementById("address");
                console.log('input: ', input);
                const autocomplete = new google.maps.places.Autocomplete(input, options);
                console.log('autocomplete: ', autocomplete);
            }, 200);
            
        }
        

    </script>
</svelte:head>
<div class="bg-wraper">
    <main>
            <form bind:this="{mform}" autocomplete="off" class="distribution-form  bg-color-primary" class:submited={submited}>
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
                            <input required="{true}" autocomplete="off"  type="text" name="business-name" id="business_name" placeholder="שם העסק">
                            <!--<select required="{true}" autocomplete="off" title="סוג עסק" bind:value={selected_business_type} name="business-type" id="business_type" placeholder="סוג העסק">
                                <option value="" disabled selected>סוג עסק שלך</option>
                                {#each business_types as business_type}
                                    <option value="{business_type}">{business_type}</option>
                                {/each}
                            </select>
                            -->
                            <!--
                            <select name="business-type[]" id="business_type" placeholder="סוג העסק" multiple="multiple">
                            
                                {#each business_types as business_type}
                                    <option value={business_type['name']}>{business_type['name']}</option>
                                {/each}
                            </select>
                            -->
                            <AutoComplete multiple={true} id="business_type" items={business_types} createText="לא נמצאו תוצאות, בחר ב'אחר'"
                                create=false placeholder="תחום עיסוק" className="autocomplete-cls" delay=200 localFiltering="{false}" labelFieldName="name" valueFieldName="name" bind:value={business_type_results}  >
                                <!--
                                    <div slot="loading" let:loadingText={loadingText}>
                                        <Spinner
                                            size="sm"
                                            speed="750"
                                            unit="em"
                                            color="#A82124"
                                            thickness="2"
                                        />
                                        <span>{loadingText}</span>
                                    </div>


                                    <div slot="item" let:item={item} let:label={label}>
                                        {@html label}
                                    </div>
                                -->
                                <div class="tag-wraper" slot="tag" let:label="{label}" let:item="{item}" let:unselectItem="{unselectItem}">
                                    <span class="tag">{label}</span>
                                    <span class="delete-tag" on:click|preventDefault="{unselectItem(item)}">x</span>
                                </div>
                            </AutoComplete>
                            <!--
                            <input bind:value={selected_business_type} required={true} pattern="{business_types.join('|')}" type="text" name="business_type" id="business_type" list="business_types" placeholder="סוג העסק - בחר (אחר) אם העסק שלך לא נמצא">
                            <datalist id="business_types">
                                {#each business_types as business_type}
                                    <option value="{business_type}">
                                {/each}
                            </datalist>
                            -->
                            
                        {#if hasCustomInBusinessType} 
                                <input autocomplete="off" required="{true}" type="text" name="business-type-other" id="business_type_other" placeholder="פרט על סוג העסק שלך">
                        {/if}
                        <input required="{true}" type="text" name="address" id="address" placeholder="כתובת">
                        {#if business_types_groups && business_types_groups.length > 0}
                        <div class="business-types-groups-btns">
                            <button on:click={(e)=>{e.preventDefault(); add_bulk_intrests(intrests, e)}}> הכל </button>
                            {#each business_types_groups as business_types_group}
                            <button on:click={(e)=>{e.preventDefault(); add_bulk_intrests(business_types_group.intrests,e)}}>{business_types_group.name}</button>
                            {/each}
                        </div>
                                <!-- <button on:click="{(e)=>{
                                    e.preventDefault();
                                    debugger;
                                    let newIntrests = [...instrests_results2]
                                    let intrestsToAdd = business_types_group.intrests;
                                    intrestsToAdd.forEach(intrest => {
                                        let item = {
                                            name: intrest['title'],
                                        }
                                        if(newIntrests.filter((v)=>{return v.name == item.name}).length == 0){
                                            newIntrests.push(item);
                                        }
                                    });
                                    setTimeout(() => {
                                        instrests_results2 = [...newIntrests];
                                    }, 10);
                                    
                                }}">{business_types_group.name}</button>
                            {/each} -->
                        {/if}
                        <AutoComplete multiple={true} id="intrested" items={intrests} createText="לא נמצאו תוצאות"
                                create=false placeholder="מוצרים מעניינים" className="autocomplete-cls" delay=200 localFiltering="{false}"  labelFieldName="name" valueFieldName="name" bind:selectedItem={instrests_results2} bind:value={instrests_results}  >
                                <!--
                                    <div slot="loading" let:loadingText={loadingText}>
                                        <Spinner
                                            size="sm"
                                            speed="750"
                                            unit="em"
                                            color="#A82124"
                                            thickness="2"
                                        />
                                        <span>{loadingText}</span>
                                    </div>


                                    <div slot="item" let:item={item} let:label={label}>
                                        {@html label}
                                    </div>
                                -->
                                <div class="tag-wraper" slot="tag" let:label="{label}" let:item="{item}" let:unselectItem="{unselectItem}">
                                    <span class="tag">{label}</span>
                                    <span class="delete-tag" on:click|preventDefault="{unselectItem(item)}">x</span>
                                </div>
                            </AutoComplete>

                            {JSON.stringify(instrests_results)}
                        </fieldset>
                        
                        <fieldset>
                            <input required="{true}" autocomplete="off" type="text" name="name" id="name" placeholder="שם איש קשר">
                            <!--https://stackoverflow.com/questions/34556308/how-to-validate-israeli-phone-number-->
                            <input required="{_i_want_wantsapp}" autocomplete="off" type="tel" name="phone" minlength="10" id="tel" placeholder="טלפון">
                            <input required="{_i_want_emails}" autocomplete="off" type="email" name="email" id="email" placeholder="אימייל">
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
    .business-types-groups-btns {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        margin-top: 20px;
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

    }
    /*:global(.select2) {
        :global(span.selection) {
            :global(span.select2-selection) {
                //border: 1px solid black;//light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
                writing-mode: horizontal-tb !important;
                text-rendering: auto;
                color: -internal-light-dark(black, white);
                letter-spacing: normal;
                word-spacing: normal;
                line-height: normal;
                text-transform: none;
                text-indent: 0px;
                text-shadow: none;
                text-align: start;
                appearance: auto;
                -webkit-rtl-ordering: logical;
                cursor: text;
                background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
                margin: 0em;
                padding: 1px 2px;
                border-width: 2px;
                
                border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
                border-image: initial;
            }
            :global(.select2-search){
                :global(textarea.select2-search__field) {
                    height: auto;
                    line-height: 0.5;
                    margin-top: 0px;
                    
                }
            }
        }
    }*/
    
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
        display: flex;
        justify-content: center;
        align-items: center;
        //height: 100%;
        padding-top: 20px;
        padding-bottom: 20px;
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
                    //margin-top: 250px;
                }
        }
        @media screen and (max-height: 462px) {
                .distribution-form{
                    //margin-top: 350px;
                }
            
        }
    }
    
}
</style>