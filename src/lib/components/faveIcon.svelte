
<script>
    export let name = 'star';
    export let width = "2.5rem";
    export let height = "2.5rem";
let icons = [
        {
          box: 256,
          name: "star-full",
          svg: `<g transform="translate(128 128) scale(0.72 0.72)" style="">
	<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
	<path d="M 89.95 34.92 c -0.135 -0.411 -0.519 -0.688 -0.95 -0.688 H 56.508 L 45.948 2.814 C 45.811 2.408 45.43 2.133 45 2.133 s -0.811 0.274 -0.948 0.681 l -10.56 31.417 H 1 c -0.432 0 -0.815 0.277 -0.95 0.688 s 0.009 0.861 0.357 1.117 l 26.246 19.314 l -10 31.21 c -0.131 0.409 0.014 0.856 0.36 1.11 c 0.348 0.257 0.817 0.261 1.168 0.012 L 45 68.795 l 26.818 18.889 c 0.173 0.122 0.375 0.183 0.576 0.183 c 0.208 0 0.416 -0.064 0.592 -0.194 c 0.347 -0.254 0.491 -0.701 0.36 -1.11 l -10 -31.21 l 26.246 -19.314 C 89.94 35.781 90.085 35.331 89.95 34.92 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,212,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</g>`
        },
        {
        box: 256,
        name: "star",
        svg: `<g transform="translate(128 128) scale(0.72 0.72)" style="">
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
            <path d="M 69.671 88.046 c -0.808 0 -1.62 -0.195 -2.37 -0.59 L 45 75.732 L 22.7 87.456 c -1.727 0.907 -3.779 0.757 -5.356 -0.388 c -1.577 -1.146 -2.352 -3.052 -2.023 -4.972 l 4.259 -24.832 L 1.539 39.678 c -1.396 -1.361 -1.889 -3.358 -1.287 -5.213 c 0.603 -1.854 2.176 -3.181 4.105 -3.461 l 24.932 -3.622 L 40.44 4.79 C 41.303 3.041 43.05 1.955 45 1.955 c 0 0 0 0 0.001 0 c 1.949 0 3.696 1.086 4.559 2.834 l 11.15 22.592 l 24.932 3.623 c 1.93 0.28 3.503 1.606 4.105 3.461 c 0.603 1.854 0.109 3.851 -1.287 5.213 L 70.419 57.264 l 4.26 24.832 c 0.329 1.921 -0.446 3.827 -2.023 4.972 C 71.764 87.717 70.721 88.046 69.671 88.046 z M 7.055 36.676 l 17.058 16.628 c 1.198 1.167 1.746 2.85 1.462 4.502 l -4.027 23.479 l 21.086 -11.086 c 1.481 -0.779 3.25 -0.779 4.732 0 l 21.085 11.086 l -4.027 -23.48 c -0.283 -1.649 0.264 -3.333 1.463 -4.501 l 17.058 -16.628 L 59.372 33.25 c -1.658 -0.242 -3.089 -1.282 -3.829 -2.783 L 45 9.106 L 34.457 30.468 c -0.74 1.5 -2.171 2.54 -3.827 2.782 L 7.055 36.676 z M 84.779 36.942 h 0.011 H 84.779 z M 44.18 7.444 c 0 0 0 0.001 0.001 0.002 L 44.18 7.444 C 44.18 7.445 44.18 7.445 44.18 7.444 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
            </g>
            </g>`
        }
    ];
    let displayIcon = icons.find((e) => e.name === name);
    $: {
        displayIcon = icons.find((e) => e.name === name);
    }
</script>
    <svg
        {...$$props}
        {width}
        {height}
        viewBox="0 0 {displayIcon.box} {displayIcon.box}">{@html displayIcon.svg}
    </svg>