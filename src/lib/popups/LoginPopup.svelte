<script>
import { submit_cart_form } from 'src/api/api';

import { request_login, request_logout } from 'src/api/auth';
import AutoComplete from "simple-svelte-autocomplete";

    import {
        loginPopupStore
    } from 'src/stores/popups/loginPopupStore';
    import {
        userInfoStore
    } from 'src/stores/stores';
    import {
        fly
    } from 'svelte/transition';
    import {apiGetAllUsers} from 'src/api/api';
import { Spinner } from 'sveltestrap';
import { eraseCookie, setCookie } from '../utils/utils';
    let is_requesting =false;
    let error_detail = '';
    function login() {
        is_requesting = true;
        error_detail = '';
        
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;
        let response = request_login(username, password);
        response.then(json => json.json()).then(async data=> {
            if(data['error']) {
                error_detail = '\n' + JSON.stringify(data['error'], null, 4)
            /*}else if(data['non_field_errors'] && data['non_field_errors'].length > 0) {
                error_detail = data['non_field_errors'][0];
            }*/}else {
                //localStorage.setItem('refresh', data.refresh);
                
                $userInfoStore.access = data.token;
                let me = data.me;
                $userInfoStore.me=me;
                $userInfoStore.isLogin=true;
                /*update_campains_with_local_data(me.campains)
                if (me.show_prices) {
                    await update_cart_pricess();
                }*/
                setTimeout(()=> {
                        //toggleModal();
                        location.reload();

                    },1);
                /*
                let whoAmI = request_whoAmI();
                whoAmI.then(me=> {
                    
                    setTimeout(()=> {
                        toggleModal();
                    },1);
                    is_requesting = false;
                })
                */
            }
        }).catch(error => {
            console.log('error', error);
        })
        .finally(()=> {
            is_requesting = false;
        });

    }
    function logout() {
            request_logout().then((response) => {
                if (response.status === "success") {
                }else if(response.status === "warning"){
                    alert(response.detail);
                }
                $userInfoStore = {isLogin:false};
                window.location.reload();
                
                //window.location.href=window.location.href;
                
            });
        }
        let show_password = false;
        $: password_type = show_password? 'text': 'password';
        function keypress_submit_on_enter(e) {
            if (e.key === "Enter") {
                login();
            }
        }

        let all_users = undefined;
        let refreshing_users = false;

        $: {
            if(refreshing_users == false && all_users == undefined && $userInfoStore?.me?.is_superuser) {
                refresh_all_users();
            }
        }
        function refresh_all_users() {
        
        if ($userInfoStore.isLogin && $userInfoStore.me && $userInfoStore.me.is_superuser) {
                console.log('asking for apiGetAllUsers');
                refreshing_users = true;
                apiGetAllUsers().then((response) => {
                    console.log(response);
                    all_users = response;
                }).finally(()=> {
                    refreshing_users = false;
                });
            }
        }

        let admin_as_user = undefined;
        function update_admin_as_user() {
            
        if (admin_as_user) {
            $userInfoStore.actAs = all_users.find((user)=> {return user.id == parseInt(admin_as_user.id)});
            setCookie('actAs',$userInfoStore.actAs.id);
        }
        window.location.reload();
    }
    function remove_admin_as_user() {
        $userInfoStore.actAs = undefined;
        eraseCookie('actAs');
        window.location.reload();
    }

    function getUsers(user,keyword) {
        
        keyword = keyword.join(' ').toLowerCase();
        console.log('getUsers', keyword);
        return user.username.toLowerCase().includes(keyword) ||
            user.businessName.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.privateCompany.toLowerCase().includes(keyword);
        }
</script>

<div id="loginPopup" class="modal" class:active={$loginPopupStore.isOpen}>
    <div class="overlay" on:click={()=> {loginPopupStore.close()}}>
        {#if $loginPopupStore.isOpen}
            <div on:click="{(e)=>{e.stopPropagation();}}" class="modal_content" in:fly={{y:200, duration:250}}>
                <div class="modal-header">
                    <button title="Close" on:click={()=> {loginPopupStore.close()}} class="close-btn right">x</button>
                    <!-- if the user is loged in: show hello <user> -->
                    <!-- if not: show login and username and password field -->
                    {#if $userInfoStore.isLogin}
                        <h3>שלום {$userInfoStore.me.username}</h3>
                    {:else}
                        <h3>התחברות</h3>
                    {/if}
                    <button title="Close" on:click={()=> {loginPopupStore.close()}} class="close-btn left">x</button>
                </div>
                <div class="modal-body">
                    {#if $userInfoStore.isLogin}
                        <div class="user-data">
                            <h3>
                                שלום {$userInfoStore.me.username}
                                {#if $userInfoStore?.me?.is_superuser && $userInfoStore?.actAs}
                                    (בתור משתמש: {$userInfoStore.actAs.businessName})
                                {/if}
                            </h3>
                                <h5>פרטי עסק</h5>
                                <div class="row">
                                    {#if $userInfoStore.me.is_superuser}
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="company_phone">פעל כמשתמש.:</label>

                                                <AutoComplete items={all_users}
                                                bind:selectedItem={admin_as_user}
                                                labelFieldName="businessName"
                                                itemFilterFunction="{getUsers}" >
                                                    <div slot="item" let:item={item} let:label={label}>
                                                        <div class="item">{item.username}</div>
                                                    </div>
                                                </AutoComplete>
                                                
                                            </div>
                                        </div>
                                    {/if}
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="company_name">שם עסק:</label>
                                            <div class="data">{$userInfoStore.me['businessName']}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="company_phone">אימייל:</label>
                                            <div class="data">{$userInfoStore.me['email']}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="company_phone">ח.פ.:</label>
                                            <div class="data">{$userInfoStore.me['privateCompany']}</div>
                                        </div>
                                    </div>
                                
                                    
                                </div>
                                <div class="action-buttons">
                                    <button class="btn btn-danger" on:click={()=> {logout()}}>התנתק</button>
                                    {#if $userInfoStore.me.is_superuser}
                                        <button on:click|preventDefault|stopPropagation={refresh_all_users}>
                                            {#if refreshing_users}
                                                <Spinner/>
                                            {:else}
                                                רענן משתמשים
                                            {/if}
                                        </button>
                                        <button on:click|preventDefault|stopPropagation={update_admin_as_user}>פעל בתור מתשמש</button>
                                        <button on:click|preventDefault|stopPropagation={remove_admin_as_user}>חזור לאדמין</button>
                                    {/if}
                                </div>
                        </div>
                        

                    {:else}
                        <div class="login-form">
                            <div class="form-group">
                                <label for="username">שם משתמש:</label>
                                <input type="text" class="form-control" id="username" placeholder="שם משתמש">
                            </div>
                            <div class="form-group">
                                <label for="password">סיסמה:</label>
                                <input on:keypress={keypress_submit_on_enter} type="{password_type}" class="form-control" id="password" placeholder="סיסמה">
                            </div>
                            <!-- checkbox to show /hide password -->
                            <div class="form-group">
                                <div class="checkbox">
                                    <label>
                                        <input bind:checked="{show_password}" type="checkbox" id="show_password">הצג סיסמה
                                    </label>
                                </div>
                            </div>
                            <div class="erro">
                                {#if error_detail != '' && is_requesting == false}
                                    <div style="direction:ltr;text-align:left" class="alert alert-danger">
                                        <pre>
                                            {error_detail}
                                        </pre>
                                    </div>
                                {/if}
                            </div>
                            <button type="submit" disabled={is_requesting} class="btn btn-primary submit" on:click="{()=>{login()}}">
                                {#if is_requesting}
                                    <Spinner/>
                                {:else}
                                    התחבר
                                {/if}
                            </button>

                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>


<style lang="scss">
    #loginPopup {
        .overlay {
            .modal_content {
                width: auto;
                .modal-body {
                    padding: 0;
                    .login-form {
                        margin: 0;
                        padding-left: 35px;
                        padding-right: 35px;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        .form-group {
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 10px;
                        }

                        .submit {
                            width:100%;
                        }
                    }

                    


                    .user-data {
                        .row {
                            margin-bottom: 10px;
                            max-width: 450px;
                            .form-group {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                
                                background-color: rgba(112, 110, 110, 0.253);
                                padding: 10px;
                                border-radius: 5px;
                                margin:5px;
                                width: auto;
                                label {
                                    text-decoration: underline;
                                }
                                .data {
                                    direction: ltr;
                                    text-align: left;
                                }
                            }
                        }
                        .action-buttons {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            margin-top: 10px;
                            margin-bottom: 10px;
                            button {
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>