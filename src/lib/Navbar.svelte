<script>
    import AutoComplete from "simple-svelte-autocomplete";
    import {cartDomElementStore} from './../stores/cartStore';
    import {albumsJsonStore, loginModalStore, productModalStore, userInfoStore} from './../stores/stores'
    import {CLOUDINARY_URL, SEARCH_API_URL} from './../api/consts';

    /*import {
        faShoppingCart
    } from '@fortawesome/free-solid-svg-icons'*/
    import { fade, fly } from 'svelte/transition';

    import {
            Dropdown,
            DropdownItem,
            DropdownMenu,
            DropdownToggle,
Spinner
        } from 'sveltestrap';
        import {categoryModalStore} from './../stores/stores'
        import { cartStore } from './../stores/cartStore';
        import { onDestroy } from "svelte";
        //import boop from '$lib/components/boop/boop'
        import Cart from '$lib/components/cart/cart.svelte'
import NavLoginManager from "./components/navLoginManager.svelte";
import { apiSearchProducts } from "./../api/api";
import { logStore } from "./../stores/logStore";

import AlbumsView from "./components/AlbumsView.svelte";
        

        
        let searchValue;
        async function searchProducts(keyword) {
            let json = await apiSearchProducts(keyword);
            let data = json;
            let albums = [];
            let album = undefined;
            // get all the albums from the products and count how much products from each album
            for(let i = 0; i < data.all.length; i++) {
                let my_item = data.all[i];
                album = undefined;
                for(let item_album_iter = 0; item_album_iter < my_item.albums.length; item_album_iter++) {
                    /*if(my_item.albums[alb_iter].is_campain == false) {
                        album = my_item.albums[alb_iter];
                        break;
                    }*/
                    let alb = $albumsJsonStore.find(album => album.id == my_item.albums[item_album_iter]);
                    if(alb && alb.is_campain == false && alb.is_public == true) {
                        album = alb;
                        break;
                    }
                }
                // the product is only visible in campain, so hide from search
                if(album == undefined) {
                    // remove item i from data.all
                    data.all.splice(i, 1);
                    continue;
                }else {
                    my_item.albumId = album.id;
                }
                var album_index = albums.findIndex(a => a.id == album.id);
                if(album_index == -1) {
                    album.item_count = 1;
                    albums.push(album);
                }else{
                    albums[album_index].item_count += 1;
                }
            }

            albums.sort(function (a, b) {
                if (a.item_count > b.item_count) {
                    return -1;
                } else if (a.item_count <= b.item_count) {
                    return 1
                }
                return 0;
            });
            // keep only the first 5 albums:
            albums = albums.slice(0, 5);

            // add the albums in the start and after the products
            let items = albums.concat(data.all);

            return items;
        }

        function autocompleteItemSelected(item) {

            if(item == undefined) {
                return;
            }
            let keyword = document.querySelector('input.autocomplete-input').value;
            
            if(item.item_count) {
                $categoryModalStore.setAlbum(item);
                $categoryModalStore.toggleModal();
                logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה מחיפוש',
                                't': 'open category',
                                'f':{
                                    'type':'search',
                                    'term': keyword,
                                },
                                'w':{
                                    'type':'category',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
            }else {
                $productModalStore.setProduct(item.albumId, item.id);
                $productModalStore.toggleModal();
                logStore.addLog(
                            {
                                'a': 'פתיחת מוצר מחיפוש',
                                't': 'open product',
                                'f':{
                                    'type':'search',
                                    'term': keyword,
                                },
                                'w':{
                                    'type':'product',
                                    'id':item.id,
                                    'ti':item.title, 
                                }
                            }
                            );
            }
            
        }
        let isBooped = false;
    function setIsBooped(val) {
		isBooped = val;
	}


</script>
<nav id="main-navbar-wraper" class="navbar navbar-expand-* navbar-light">
    <div class="container-fluid">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a class="navbar-logo" href="javascript:window.location.href=window.location.href" aria-label="logo" role="button">
            <img class="nav-logo" height="32px" width="auto"
                src="https://res.cloudinary.com/ms-global/image/upload/f_auto,w_auto/v1634457672/msAssets/favicon_rza3n9"
                alt="">
        </a>
        <!--
        <Dropdown id="navCategoryList" class="main-category-menu">
            <DropdownToggle color="none" caret aria-label="menu">  
                <svg viewBox="0 0 100 80" width="40" height="40">
                    <rect width="100" height="20"></rect>
                    <rect y="30" width="100" height="20"></rect>
                    <rect y="60" width="100" height="20"></rect>
                </svg>
            </DropdownToggle>
            
            <DropdownMenu >                    
                <h1 class="drop-title"> מחלקות מוצרים</h1>
                {#if groupedAlbums }
                    {#each groupedAlbums as key_val_album }
                        <DropdownItem header>
                            
                            <Dropdown class="category-menu-2">
                                {#if key_val_album['value']}
                                <DropdownToggle color="none" caret aria-label="submenu">
                                        {#if key_val_album['key'] == 'undefined'}
                                            אחר
                                        {:else}
                                            {key_val_album['key']}
                                        {/if}
                                        
                                </DropdownToggle >
                                {/if}
                                <DropdownMenu end class="category-menu-2-menu">
                                    {#if key_val_album['value']}
                                        {#each key_val_album['value'] as  album}
                                        <DropdownItem on:click={menuItemClicked(album)}>
                                                {album.title}
                                        </DropdownItem>
                                        {/each}
                                    {/if}
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownItem>
                    {/each}
                {/if}
            </DropdownMenu>
        </Dropdown>
        -->

        <form class="d-flex" id="search_form">
            <AutoComplete id="search_input" on:focus loadingText="מחפש מוצרים..." createText="לא נמצאו תוצאות חיפוש" showLoadingIndicator=true noResultsText="" onChange={autocompleteItemSelected} create=true placeholder="חיפוש מוצרים..." className="autocomplete-cls" searchFunction={searchProducts} delay=200 localFiltering="{false}" labelFieldName="title" valueFieldName="value" bind:value={searchValue}  >
                <div slot="loading" let:loadingText={loadingText}>
                    <Spinner
                        size="sm"
                        speed="750"
                        unit="em"
                        color="#A82124"
                        thickness="2"
                    />
                    <span>{loadingText}</span>
                    <!-- spinner -->
                    
                </div>
                <div slot="item" let:item={item} let:label={label}>
                    {#if item.item_count}
                        <div class="list-category">
                            <div class="search-item">
                                {item.title} ({item.item_count})
                                <img class="logo" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" alt="M.S. Global">
                            </div>
                        </div>
                    {:else}
                        <div class="search-item">
                            <img alt="{item.title}" style="height:25px;" src="{CLOUDINARY_URL}f_auto,w_auto/{item.cimage}" />
                            <img class="logo" src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1634457672/msAssets/favicon_rza3n9" alt="M.S. Global">
                            {@html label}
                        </div>
                    {/if}
                </div>
            </AutoComplete>
            <!--
            <input class="form-control" id="search" autocomplete="on" type="search" placeholder="חיפוש..."
                aria-label="Search">
                -->
            <!-- <button class="btn btn-outline-success" type="submit">Search</button>-->
            <div class="spiner" style="display: none;"></div>

        </form>
        <Cart bind:this={$cartDomElementStore}></Cart>

        <NavLoginManager></NavLoginManager>
            
                
            
            <div>
            <a class="same-size-icon" rel="noopener" target="_blank" href="https://wa.me/+972547919908" >
                <img src="https://res.cloudinary.com/ms-global/image/upload/w_auto,f_auto/v1636418636/msAssets/whatsapp_be98kb.png" alt="whatsapp">
            </a>
        </div>
            
        <div id="navbar_filler" class="none">
            <!--used as a filler in the navbar-->
        </div>



        
        
        

    </div>
    <AlbumsView 
        albumSelected={(album)=> {
            logStore.addLog(
                            {
                                'a': 'פתיחת קטגוריה מהנאב-בר',
                                't': 'open category',
                                'f':{
                                    'type':'navbar',
                                },
                                'w':{
                                    'type':'category',
                                    'id':album.id,
                                    'ti':album.title, 
                                }
                            }
                            );
        }}/>
</nav>



<style lang="scss">
    .same-size-icon {
        // 
        img {
            
            &:hover {
                animation: pop-animation 0.4s ease-in-out forwards;
            }
        }
    }
    /*@keyframes pop-animation {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1.1);
        }
    }*/

    /*
    .container-fluid {
        overflow: visible;
    }
    .album-horazonal-list {

        
        &.active {
            cursor: -webkit-grabbing;
        }
        //white-space: nowrap;
        transition: all 2s;//0.2s;
        
        //will-change: transform;
        user-select: none;
        //cursor: pointer;


        width:100%;
        display: flex;
        height: 100%;
        
        gap: 20px;
        -ms-overflow-style: none;  
        scrollbar-width: none;  
        overflow-x: scroll;
        &::-webkit-scrollbar {
            display: none;
            
        }
        .album-babel {
            display: flex;
            flex-direction: row-reverse;
            //background: radial-gradient(circle, white 0%, white 32%, #c7c7c7 84%);
            border: 2px solid black;
            border-radius: 25px;
            padding-left: 3px;
            padding-right: 3px;
            overflow-y: visible;
            position: relative;
            justify-content: center;
            align-items: center;
            .sub-album {
                display: none;  
                position: absolute;
                top: 100%;
                left: 0;
                
                width: 100%;

            }
            &:hover, &:focus {
                background-color: #f5f5f5;
                border-bottom-left-radius: 0px;
                border-bottom-right-radius: 0px;
                // make sub-album visible
                .sub-album {
                    display: block;
                    background-color: #f5f5f5;
                }
            }
            .album-title {
                //font-size: 1.2em;
                font-weight: bold;;
                width: 100%;
                height: 100%;
                
                display: flex;
                justify-content: center;
                align-items: center;
                white-space: nowrap;
                
                
                //max-width: 170px;
                .text {
                    //font-size: 1.2em;
                    font-weight: bold;
                    width: 100%;
                    //height: 100%;
                    text-align: center;

                    //white-space: nowrap ;
                }
            }
            img {
                width: 40px;
                height: 40px;
            }
        }
    }
*/
        :root {
            --autocomplete-bg-hover-clr: rgb(136, 135, 135);
            --autocomplete-txt-hover-clr: rgb(255, 255, 255);
        }
:global(#navCategoryList) {
        :global(.dropdown-toggle) {
            :global(svg) {
                width: 32px;
                height: 32px;;
            }
        }
        :global(.dropdown-menu.show) {
          grid-template-columns: repeat(1, 1fr);
          //left: 0%!important;
          padding-top: 55px;
            overflow-y: visible;
          .drop-title {
            font-size: 1.56rem;
            top: 0px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            text-align: center;
            min-width: fit-content; 
            
          }
          @media screen and (max-width: 900px) {
            grid-template-columns: repeat(1, 1fr);
          }
          @media screen and (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
            
          }
          @media screen and (max-width: 400px) {
            grid-template-columns: repeat(1, 1fr);
            :global(.drop-title) {
                text-align: center;
                width: 100%;
                padding-top: 5px;
            }
          }
        }


    }
:global(#navLoginManager) {
    :global(.dropdown-toggle) {
        padding: 0px;
        &::after {
            display: none;
        }
    }
}
/*
:global(.main-category-menu) {
        :global(.dropdown-menu) {
            grid-template-columns: repeat(1, 1fr);
            :global(.dropdown-toggle) {
                        display: inline-block;
                        width: 100%;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    margin-bottom: 10px;
    padding: .5rem 1rem;

    font-size: 1rem;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    
    color: #fff;
    background-color: #212529;
    border-color: #212529;

                    }
            :global(.dropdown-header) {
            
                :global(.category-menu-2){
                :global(.category-menu-2-menu.show) {
                    display: grid;
                    transform: translate3d(-70%, 32px, 0px)!important;
                    left:-100%;
                    width: 290px;
                    @media screen and (max-width: 600px) {
                        transform: translate3d(-20%, 42px, 0px)!important;
                    }
                    @media screen and (max-width: 400px) {
                        transform: translate3d(-0%, 42px, 0px)!important;
                        width: 110%;
                    }
                }
                :global(.dropdown-menu.show) {
                    max-height: 55vh;
                    overflow-y: scroll!important;;
                    padding-top: 15px!important;
                    
                        
                    }
                    :global(.dropdown-item) {
                        display: inline-block;
                        font-weight: 400;
                        line-height: 1.5;
                        color: #212529;
                        text-align: center;
                        text-decoration: none;
                        vertical-align: middle;
                        cursor: pointer;
                        user-select: none;
                        background-color: transparent;
                        border: 1px solid transparent;
                        margin-bottom: 10px;
                        padding: .5rem 1rem;
                        margin-left: auto;
                        margin-right: auto;
                        width: 90%;
                        font-size: 1rem;
                        border-radius: 0.25rem;
                        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        
                        color: #fff;
                        background-color: #212529;
                        border-color: #212529;

                    }
                }
            }
                }
            }
            

*/
/*
:global(.autocomplete-cls)  {
    
    
    * {
        font-size: large;
    }
    
    :global(.autocomplete-list) {
        border:1px solid red;
    }
}*/
.list-category {
    
    //background-color: black;



    .search-item {
        padding-top: 5px;
        padding-bottom: 5px;
      text-align: right;
      border: 2px solid black;
      border-radius: 15px;
      //border: 5px black solid;
      background-color: #FFD880;
      text-align: center;
      font-size: larger;
    font-weight: bold;
    }

    &:hover {
      .search-item {
        //background-color: #40508d;
        background-color: var(--autocomplete-bg-hover-clr);
        color: var(--autocomplete-txt-hover-clr);
      }
    }
  }

  .search-item {
    text-align: right;
    padding-bottom:2px;
    padding-top:2px;
    .logo {
      //display: inline-block;
      height: 20px;
      //transform: translate(0, 25%);
      float: left;
    }
  }



    /*.navbar :global(#navCategoryList){
        position: inherit;
        :global(.dropdown-menu.show) {
            background: rgb(242, 242, 242);
            display:flex;
            width: 95vw;
            overflow-y: hidden;
            justify-content: space-around;
            flex-wrap: wrap;
            :global(.dropdown-item) {
                flex-basis: 1%;
                margin:auto;
                text-align: center;
            }
    }
}*/
    .navbar {
        position: fixed;
        width:100%;
        .container-fluid {
            flex-wrap: nowrap;
        }
        
        @include bg-gradient();
        //position: sticky;
        top: 0;
        z-index: 10;

        .nav-logo {
            //width: auto;
            //height: 40px;
            @media screen and (max-width: 800px) {
                display: none;
            }
        }

        #search_form {
            flex-basis: 50%;
            :global(.autocomplete) {
                min-width: 83px;
                width: 100%;
                flex: 1;
                :global(.autocomplete-list) {
                    :global(.autocomplete-list-item) {
                        :global(.logo) {
                            @media screen and (max-width: 768px) {
                                display: none;
                            }
                        }
                        
                    }
                    :global(.autocomplete-list-item.selected) {
                        background-color: var(--autocomplete-bg-hover-clr);
                            color: vart(--autocomplete-txt-hover-clr);  
                    }

                    @media screen and (max-width: 550px) {
                        min-width: 90vw;
                        top: 100%;
                        right: -70px;
                        position: absolute;
                    }
                    
                }
                :global(.autocomplete-input) {
                    border-radius: 25px;
                    border: 1px solid #ccc;
                }
                /*:global(.autocomplete-input) {
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid #ccc;
                    padding: 0;
                    font-size: 1.2em;
                    :global(.autocomplete-input-icon) {
                        display: none;
                    }
                }*/
            }

            /*.menu {}

            .collapsible {

                //background-color: #777;
                //color: white;
                background-color: transparent;
                cursor: pointer;
                width: 100%;
                border: none;
                text-align: left;
                outline: none;
                font-size: 15px;
                border: 1px solid;
                color: rgba(0, 0, 0, .5);
                border-color: rgba(0, 0, 0, .1);

                &.active,
                &:hover {
                    background-color: #0000003d;
                }
            }



            .content {
                position: absolute;
                //padding: 0 18px;
                display: none;
                overflow: hidden;

                //transform: translate(75%, 25%);
                background-color: #e2e2e2;
                border-radius: 15px;
                border: 1px solid black;

                ul {
                    list-style: none;
                    padding: 0px;
                    margin: 0px;

                    li {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        font-size: xx-large;
                        white-space: nowrap;

                        @mixin menu-link-spaceing {
                            padding: 0px;
                            padding-left: 0px;
                            padding-right: 0px;
                        }

                        a {
                            width: 250px;
                            height: 50px;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            img {
                                @include menu-link-spaceing();
                                height: 40px;
                                width: auto;
                                //width: 100px;
                                margin: auto;
                            }
                        }

                        //margin-top:5px;
                        //margin-bottom:5px;
                        width: 100%;

                        &:hover {
                            background-color: #8a8a8a;
                            cursor: pointer;
                        }

                        & .who-us {
                            @include menu-link-spaceing();
                            font-size: larger;
                        }
                    }
                }
            }

            &.active {
                .content {
                    display: block !important;
                }
            }*/
        }
/*
        #navCategoryList {
            .dropdown-item {
                padding: .25rem 1rem;

                .btn {
                    width: 100%;
                }
            }
        }

        .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin: auto;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
*/
    }
</style>