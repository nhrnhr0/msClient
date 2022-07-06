<script>

import Navbar from "src/lib/Navbar.svelte";

// on load:
// get all sizes, colors, and varients on the server and pass them to the page to be stored in a store.
// if the data was requested from the store before the store was initialized, request the new data from the server.
// also get the top level categories and pass them to the page.
// if the data was requested from the store before the store was initialized, request the new data from the server.
</script>



<Navbar></Navbar>
<slot/>