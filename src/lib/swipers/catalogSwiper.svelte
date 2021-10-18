<script export="module">
    import Lazy from 'svelte-lazy';
    export let album;
</script>
<pre><code>
    <Lazy height={300}>
        {JSON.stringify(album, null, 2)}
    </Lazy>

</code>
</pre>