<script>
export let active = false;
export let width;
export let height;
export let max_width;
export let max_height;
</script>

<div
  class="flip-card"
  style="--card-width:{width};--card-height:{height};--card-max-height:{max_height};--card-max-width:{max_width};"
  class:active
>
  <div class="flip-card-inner">
    {#if !active}
      <div class="flip-card-front">
        <slot name="front" />
      </div>
    {:else}
      <div class="flip-card-back">
        <slot name="back" />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
.flip-card {
  background-color: transparent;
  width: var(--card-width);
  height: var(--card-height);
  max-width: var(--card-max-width);
  max-height: var(--card-max-height);
  perspective: 1000px;
  transition: all cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s;
  &.active {
    position: absolute;
    z-index: 9999;
    background: blue;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    max-width: 80vw;
    max-height: 80vh;
    width: 100%;
  }
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  //   transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.flip-card.active .flip-card-inner {
  //   transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  background-color: #bbb;
  color: black;
}

.flip-card-back {
  /* background-color: #2980b9; */
  color: white;
  transform: rotateY(180deg);
}
</style>
