<script>
        import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle
        } from 'sveltestrap';
        import {loginModalStore, userInfoStore} from './../../stores/stores';
        function open_login_modal() {
            $loginModalStore.toggleModal();
        }
</script>



<Dropdown id="navLoginManager" class="login-menu">
    <DropdownToggle color="none" caret aria-label="menu">  
        {#if $userInfoStore}
            {#if !$userInfoStore.isLogin}
                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px">    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9069372 8 4 8.9069372 4 10 L 4 20 C 4 21.093063 4.9069372 22 6 22 L 18 22 C 19.093063 22 20 21.093063 20 20 L 20 10 C 20 8.9069372 19.093063 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 6 10 L 18 10 L 18 20 L 6 20 L 6 10 z M 12 13 C 10.9 13 10 13.9 10 15 C 10 16.1 10.9 17 12 17 C 13.1 17 14 16.1 14 15 C 14 13.9 13.1 13 12 13 z"/></svg>
            {:else}
                <!-- Written by Treer (gitlab.com/Treer) -->
                <svg 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlns:xlink="http://www.w3.org/1999/xlink" 
                    width="48px" 
                    height="48px"
                    viewBox="0 0 600 600"
                    fill="white">
                
                    <title>Abstract user icon</title>
                
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
        {/if}

    </DropdownToggle>
    <DropdownMenu>                    
        {#if !$userInfoStore.isLogin}
            <DropdownItem>
                <button on:click="{open_login_modal}" class="btn btn-dark">
                    התחבר
                </button>
            </DropdownItem>
        {:else}
        <DropdownItem>
            <div class="title">
                שלום
                {$userInfoStore.me['name']}
            </div>
        </DropdownItem>
        <DropdownItem>
            <button class="btn btn-dark">
                שנה סיסמא
            </button>
        </DropdownItem>
        <DropdownItem>
            <button class="btn btn-dark">
                עדכון פרטים
            </button>
        </DropdownItem>
        <DropdownItem>
            <button class="btn btn-dark">
                התנתק
            </button>
        </DropdownItem>
        {/if}
    </DropdownMenu>
</Dropdown>


<style lang="scss">
    :global(.dropdown-menu) {
        
        padding-left: 20px;
        padding-right: 20px;
        .title {
            text-align: center;
            font-size: larger;
            font-weight: bold;
            padding-bottom: 10px;
            text-decoration: underline;
        }
        .btn {
            width: 100%;
            margin: auto;
            margin-top: 5px;;
            
        }
    }
</style>