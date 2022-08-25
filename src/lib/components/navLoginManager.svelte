<script>
        //import {loginModalStore, userDetailModalStore, userInfoStore} from './../../stores/stores';
        import { userInfoStore } from './../../stores/stores';
        import { loginPopupStore } from 'src/stores/popups/loginPopupStore';
        import { Spinner } from 'sveltestrap';
        function open_login_modal() {
            //$loginModalStore.toggleModal();
        }
        function open_user_detail_modal() {
            //$userDetailModalStore.toggleModal();
        }

        function login_btn_click() {
            console.log('login_btn_click');
            loginPopupStore.open();
            /*if($userInfoStore.isLogin){
                open_user_detail_modal();
            }else{
                open_login_modal();
            }*/
        }
</script>

{#if $userInfoStore}
<div class="login-btn-wraper">

    <div class="text">
        {#if !$userInfoStore.isLogin}
            התחבר
        {/if}
        {#if $userInfoStore.isLogin}
            שלום {$userInfoStore.me.businessName}
        {/if}
    </div>
<button class="btn login-btn" on:click={login_btn_click}>
    {#if !$userInfoStore.isLogin}
        <svg class="popup-animation" fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="32px" height="32px">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9069372 8 4 8.9069372 4 10 L 4 20 C 4 21.093063 4.9069372 22 6 22 L 18 22 C 19.093063 22 20 21.093063 20 20 L 20 10 C 20 8.9069372 19.093063 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 6 10 L 18 10 L 18 20 L 6 20 L 6 10 z M 12 13 C 10.9 13 10 13.9 10 15 C 10 16.1 10.9 17 12 17 C 13.1 17 14 16.1 14 15 C 14 13.9 13.1 13 12 13 z"/>
        <title>לחץ להתחברות</title>
        </svg>

    {:else}
        <svg class="popup-animation" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="32px" 
            height="32px"
            viewBox="0 0 600 600"
            fill="white">

            <title>שלום {$userInfoStore.me.username}</title>

            <defs>
            <clipPath id="circular-border">
                <circle cx="300" cy="300" r="250" />
            </clipPath>
            </defs>
            
            <circle cx="300" cy="300" r="280" fill="black" />
            <circle cx="300" cy="230" r="100" />
            <circle cx="300" cy="550" r="190" clip-path="url(#circular-border)" />
        </svg>
    {/if}
</button>
</div>
{/if}

<style lang="scss">
    .popup-animation {
        &:hover {
                animation: pop-animation 0.4s ease-in-out forwards;
            }
    }

    .login-btn-wraper {
        
        position: relative;
        .text {
            font-size: 0.8rem;
            color: black;
            text-align: center;
            position: absolute;
            top: 100%;
            width: max-content;
            left: 0;
            right: 0;
            z-index: 1;
            transform: translate(25%, -45%);
            @media screen and (max-width: 765px) {
                display: none;
            }
        }
    }
    
</style>