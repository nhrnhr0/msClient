<script>
    //import {albumsJsonStore} from './../stores/stores'
    import {albumsJsonStore,categoryModalStore} from './../../stores/stores';
    
import {
        Swiper,
        SwiperSlide
    } from 'swiper/svelte';
    import {CLOUDINARY_URL} from './../../api/consts';
    export let albumSelected;
    export let direction;
    let groupedAlbums; // group groupedAlbums albumsJsonStore by topLevelCategory, if topLevelCategory is not found, create others
        albumsJsonStore.subscribe((albums) => {
            if (albums.length > 0) {
            let groupedAlbumsTemp = albums.reduce((acc, album) => {
                const topLevelCategory = album.topLevelCategory;
                if (!acc[topLevelCategory]) {
                    acc[topLevelCategory] = [];
                }
                acc[topLevelCategory].push(album);
                return acc;
            }, {});
            // put undefined topLevelCategory albums at the end
            
            console.log('groupedAlbums', groupedAlbums);


            let groupedAlbumsTempArr = [];
            let entries = Object.entries(groupedAlbumsTemp);
            
            let lastVal = undefined;
            for(let i = 0; i < entries.length; i++) {
                let key = entries[i][0];
                let value = entries[i][1];
                if (key == 'undefined') {
                    lastVal = value;
                }else {
                    groupedAlbumsTempArr.push({
                        key: key,
                        value: value
                    });
                }
            }
            groupedAlbumsTempArr.push({
                key: 'undefined',
                value: lastVal
            });

            groupedAlbums = groupedAlbumsTempArr;
            }
        });
        function menuItemClicked(album) {
            $categoryModalStore.setAlbum(album);
            if($categoryModalStore.isModalOpen == false) {
                $categoryModalStore.toggleModal();
            }


            if(albumSelected) {
                albumSelected(album);
            }
            
        }
</script>
{#if groupedAlbums}
<div class="albums-view" style="direction:{direction}">
    <Swiper class="category-swiper"
                slidesPerView="{'auto'}"
                spaceBetween="{10}" 
                allowTouchMove="{true}"
                preventClicks="{false}"
                observer="{true}"
                loop="{false}"
                resistance="{false}"
                >
                {#if groupedAlbums.length > 0}
                    {#each Object.entries(groupedAlbums) as album}
                    {#if album[1] && album[1].value && album[1].value.length > 0}
                        <SwiperSlide>
                            <div class="category-swiper-slide">
                                
                                    <div class="album-title">
                                        {#if album[1]['key'] == 'undefined'}
                                            <div class="text">
                                                אחר
                                            </div>
                                        {:else}
                                            
                                            <div class="text">{album[1]['key']}</div>
                                        {/if}
                                    </div>
                                        <img alt="" src="{CLOUDINARY_URL}{album[1]?.value[0]?.cimage}" width="40px" height="40px"/>
                                    <div class="sub-album">
                                        {#if album[1] && album[1].value && album[1].value.length > 0}
                                            {#each album[1].value as album}
                                                <div class="album-item" on:click="{menuItemClicked(album)}">
                                                    <img alt="" src="{CLOUDINARY_URL}{album.cimage}" width="40px" height="40px"/>
                                                    <div class="text">{album.title}</div>
                                                </div>
                                            {/each}
                                        {/if}
                                    </div>
                            </div>
                        </SwiperSlide>
                        {/if}
                    {/each}
                {/if}
            </Swiper>
</div>
{/if}


<style lang="scss">
    .albums-view {
        
        background:transparent;
        z-index: 1890;
        width:100%;
        position: relative;
        //overflow: hidden;
        //border:1px solid red;
        //overflow-y: visible;
        
        :global(.swiper) {
            
            margin-top: 0px;
            max-width: none;
        }
    }
    :global(.category-swiper) {
        z-index: 99999;
        margin: 0px;
        padding:0px;
        //border:1px solid blue;
        width: 100%;
        height: 100%;
        //width:100%;
        
        //border:1px solid blue;
        margin-bottom: 0px;
        padding-bottom: 0px;;
        overflow: visible !important;
        
        cursor: default;
        //overflow-y: visible;
        :global(.swiper-wrapper) {
            z-index: 99999;
            margin:0px;
        }
        :global(.swiper-slide) {
            z-index: 99999;
            width: fit-content;
            //border: 1px solid red;
            
        }
        //max-width:99vw;
        .category-swiper-slide {
            /*width: 100%!important;
            height: 100%;*/
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            border: 1px solid #5f5f5f;
            border-radius: 25px;
            padding-left: 10px;
            padding-right: 10px;
            max-width: fit-content;
            background-color: white;
            //border: 1px solid red;
            //overflow-y: visible;
            &:hover, &:focus {
                background-color: #5f5f5f;
                color: white;
                .sub-album {
                    display: block;
                }
                border-bottom-right-radius: 0px;
                border-bottom-left-radius: 0px;
            }
            .sub-album {
                z-index: 9999999;
                display:none;
                position: absolute;
                top:100%;
                left:0px;
                background-color: #5f5f5f;
                color:white;
                //height: 100%;
                z-index: 9999999;
                width:100%;
                max-height: 70vh;
                overflow-y: scroll;
                .album-item {
                    z-index: 9999999;
                    cursor: pointer;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    border-top: 1px solid #ffffff;
                    img {
                        width: 40px;
                        height: 40px;
                        margin-left: 5px;
                    }
                    .text {
                        
                        overflow: visible; 
                        white-space: normal;
                        height:auto; 
                        /*white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;*/
                    }
                    &:hover, &:focus {
                        background-color: #7e7e7e;
                        color: white;
                        .text {
                        }
                    }
                    /*&:last-child {
                        border-bottom-right-radius: 25px;
                        border-bottom-left-radius: 25px;
                        border:1px sloid peru;
                    }*/
                }

            }
        }
    }

</style>