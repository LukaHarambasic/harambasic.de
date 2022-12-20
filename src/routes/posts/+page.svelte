<script lang="ts">
    import List from './List.svelte';
    import BaseFootnote from '$lib/components/Base/BaseFootnote.svelte';
    import type { Post } from '$lib/types/post';

    const rawPosts: Post[] = []
</script>

<List raw={rawPosts} />
<BaseFootnote>
    <!-- TODO adapt urls -->
    Check out the <a href="globals.blogFeedURL">RSS feed</a> or
    <a href="globals.twitterURL">my Twitter account</a>
    to keep up to date.
</BaseFootnote>