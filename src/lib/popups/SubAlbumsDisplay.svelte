<script>
import { CLOUDINARY_URL } from "src/api/consts";

import {
  subAlbumsPopupStore,
  send,
  receive,
} from "src/stores/popups/subAlbumsPopupStore";
let modal_zIndex = 99;
let category;
$: {
  category = $subAlbumsPopupStore["category"];
}
function closeModal() {
  subAlbumsPopupStore.close();
}
</script>

{#if $subAlbumsPopupStore.isOpen}
  <div
    id="SubAlbumsDisplay"
    style="z-index: {modal_zIndex};"
    class="modal"
    class:active={$subAlbumsPopupStore.isOpen}
  >
    <div
      class="overlay"
      style="z-index: {modal_zIndex + 5};"
      on:click={closeModal}
    />
    <div
      class="modal_content"
      on:click|stopPropagation={() => {}}
      style="z-index: {modal_zIndex + 10};"
      in:receive={{ key: category?.id }}
      out:send={{ key: category?.id }}
    >
      <div class="modal-body">
        {#if category}
          <div class="my-card-back-slot">
            <div class="my-card-back">
              <button
                class="btn btn-secondary my-close-btn"
                on:click={() => {
                  closeModal();
                }}>חזור</button
              >
              <a href="/main?top={category.slug}" class="album-title-btn">
                {category.name}
              </a>
              <div class="albums">
                <!-- <a href="/main?top={category.slug}" class="album">
                  <img
                    src="{CLOUDINARY_URL}{category.get_image}"
                    width="20px"
                    height="20px"
                    alt=""
                  />
                  <div class="title">
                    כל ה{category.name}
                  </div>
                </a> -->
                {#each category.sub_albums as album}
                  <a
                    href="/main?top={category.slug}&album={album.slug}"
                    class="album"
                  >
                    <img
                      src="{CLOUDINARY_URL}{album.cimage}"
                      width="20px"
                      height="20px"
                      alt=""
                    />
                    <div class="title">
                      {album?.title}
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
.overlay {
  background: none;
}
.modal_content {
  width: auto;

  .modal-body {
    padding: 25px 50px 50px 50px;
    background: rgba(238, 238, 238, 0.781);
  }
}
.album-title-btn {
  text-decoration: none;
  color: black;
  border-radius: 10px;
  background-color: rgba(214, 214, 214, 0.815);
  font-size: xx-large;
  margin-bottom: 55px;
  //margin-top: 25px;
  font-weight: 500;
  &:hover {
    color: white;
    background-color: rgba(12, 12, 12, 0.815);
  }
}
.my-card-back-slot {
  height: 100%;
  .my-card-back {
    background-color: reba(0, 0, 0, 0.1);
    overflow-y: scroll;
    height: 100%;
    pointer-events: auto;

    .category-title {
      //margin-top: 50px;
      text-align: center;
    }
    .my-close-btn {
      margin: 0 0 15px 0;
      text-decoration: none;
      position: absolute;
      top: 5px;
      left: 20px;
      display: flex;
      border: none;
      //   background: none;
      //   color: black;
      padding: 5px;
      font-size: large;
      transition: all 0.2s ease-in-out;
      z-index: 9;
      &:hover {
        transform: scale(1.2);
      }
    }
    .albums {
      display: flex;
      flex-wrap: wrap;
      a.album {
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;

        color: black;
        border-radius: 10px;
        margin: 5px;
        // padding-top: 5px;
        // padding-bottom: 5px;
        padding: 5px;
        font-size: large;
        transition: all 0.2s;
        background-color: rgba(214, 214, 214, 0.815);
        &:hover {
          color: white;
          background-color: rgba(87, 85, 85, 0.815);
        }
      }
    }
  }
}
</style>
