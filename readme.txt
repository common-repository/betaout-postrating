=== Betaout-postratings ===
Contributors: Betaout
Tags: like, rating, postratings, postrating, vote, digg, ajax, post, starrating
Requires at least: 2.8
Tested up to: 3.3.2
Stable tag: trunk

Adds an AJAX like system for your WordPress blog's post/page.

== Description ==


= Version 1.0 (22-08-2012) =
* NEW: Initial Release

== Installation ==

1. Open `wp-content/plugins` Folder
2. Put: `Folder: betaout-postrating`
3. Activate `BetaOut-ratings` Plugin`

= Usage =
1. Open `wp-content/themes/<YOUR THEME NAME>/index.php`
2. You may place it in archive.php, single.php, post.php or page.php also.
3. If you are using the_content(); Its add Rating in end of content.
4. Find: `<?php while (have_posts()) : the_post(); ?>`
5. Add Anywhere Below It (The Place You Want The Ratings To Show): `<?php if(function_exists('the_boratings')) { the_boratings(); } ?>`
6.6.If you want to show Rating  in between content add short code [borating] in content .