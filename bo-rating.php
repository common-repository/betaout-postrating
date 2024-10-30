<?php
/*
Plugin Name: BetaOut-ratings
Plugin URI:http://access.betaout.com
Description: Adds an AJAX rating system for your WordPress blog's post/page.
Version: 1.0
Author: Rohit Tyagi,Amit Srivastava
Author URI:
*/



register_activation_hook( __FILE__, 'betaoutpostratings_activate' );
function betaoutpostratings_activate(){
   $name=get_bloginfo('url');
    $url="http://api.betasa.info/user/wordpressplugin/?pluginName=betaout-postratings&url=$name";
    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_exec($ch);
}

function the_boratings($start_tag = 'div', $custom_id = 0, $display = true) {
	global $id;
	// Allow Custom ID
	if(intval($custom_id) > 0) {
		$ratings_id = $custom_id;
	} else {
		$ratings_id = $id;
	}
	// Loading Style

         $post = get_post($id);
          $post_ratings = get_post_custom($id);

         $loading='<'.$start_tag .' class="engage_ratingDiv" engage_ratingSetting="110_21" engage-ratingData-contentId="'.$ratings_id .'"engage_ratingType="half" engage_ratingIconSize="Small" engage_ratingIcon="heart">';
               $loading.='</'.$start_tag.'>';


                 if(!$display) {
                 return $loading;
                 }else{
                 echo $loading;
                 return;
                 }
}


add_action('wp_head', 'borating_javascripts_header');
function borating_javascripts_header() {
	wp_print_scripts('jquery');
}
add_action('wp_enqueue_scripts', 'boratings_scripts');
function boratings_scripts() {

	if(@file_exists(TEMPLATEPATH.'/rating.css')) {
		wp_enqueue_style('betaout-postrating', get_stylesheet_directory_uri().'/rating.css', false, '1.0', 'all');
	} else {
		wp_enqueue_style('betaout-postrating', plugins_url('betaout-postrating/rating.css'));
	}
	wp_enqueue_script('betaout-postrating', plugins_url('betaout-postrating/rating.js'), array('jquery'), '', false);
         wp_localize_script('betaout-postrating', 'boratingL10n', array(
		'plugin_url' => plugins_url('betaout-postrating'),
		'ajax_url' => admin_url('admin-ajax.php', (is_ssl() ? 'https' : 'http')),
		'text_wait' => __('Please rate only 1 post at a time.', 'betaout-postrating'),

	));
}


function bocheck_rated($post_id) {

	if(isset($_COOKIE["rated_$post_id"])) {
		return true;
	} else {
		return false;
	}

}

add_action('wp_ajax_borating', 'process_borating');
add_action('wp_ajax_nopriv_borating', 'process_borating');
function process_borating() {
	global $wpdb, $user_identity, $user_ID;

	if(isset($_GET['action']) && $_GET['action'] == 'borating')
	{
		$post_id = intval($_GET['pid']);
                $rating=intval($_GET['rating']);
		if($post_id > 0 ) {
			// Check For Bot
			$bots_useragent = array('googlebot', 'google', 'msnbot', 'ia_archiver', 'lycos', 'jeeves', 'scooter', 'fast-webcrawler', 'slurp@inktomi', 'turnitinbot', 'technorati', 'yahoo', 'findexa', 'findlinks', 'gaisbo', 'zyborg', 'surveybot', 'bloglines', 'blogsearch', 'ubsub', 'syndic8', 'userland', 'gigabot', 'become.com');
			$useragent = $_SERVER['HTTP_USER_AGENT'];
			foreach ($bots_useragent as $bot) {
				if (stristr($useragent, $bot) !== false) {
					return;
				}
			}
			header('Content-Type: text/html; charset='.get_option('blog_charset').'');
			$rated = bocheck_rated($post_id);
			// Check Whether Post Has Been Rated By User
			if(!$rated) {
				// Check Whether Is There A Valid Post
				$post = get_post($post_id);
				// If Valid Post Then We Rate It
				if($post && !wp_is_post_revision($post)) {


                                        $post_ratings = get_post_custom($post_id);
					$count=$post_ratings['borating_boratingcount'][0];
                                        $average=$post_ratings['borating_boratingaverage'][0];

                                         $newAverage=round(($average*$count+$rating)/($count+1),2);
                                         $newCount=$count+1;

                                         if (!update_post_meta($post_id, 'borating_boratingcount', $newCount)) {
						add_post_meta($post_id, 'borating_boratingcount', $newCount, true);
					}
                                        if (!update_post_meta($post_id, 'borating_boratingaverage', $newAverage)) {
						add_post_meta($post_id, 'borating_boratingaverage', $newAverage, true);
					}
                                         $dataArray=array();
                                         $dataArray["totalCount"]=$newCount;
                                         $dataArray["totalAverage"]=round($newAverage*2)/2;

					echo json_encode($dataArray);
					exit();
				} else {
					printf(__('Invalid Post ID. Post ID #%s.', 'wp-loveit'), $post_id);
					exit();
				} // End if($post)
			} else {
				printf(__('You Had Already Rated This Post. Post ID #%s.', 'wp-loveit'), $post_id);
				exit();
			}// End if(!$rated)
		} // End if($rate && $post_id && check_allowtorate())
	} // End if(isset($_GET['action']) && $_GET['action'] == 'borating')
}


add_action('wp_ajax_ratingdata', 'process_ratingdata');
add_action('wp_ajax_nopriv_ratingdata', 'process_ratingdata');
function process_ratingdata() {
	global $wpdb, $user_identity, $user_ID;

	if(isset($_GET['action']) && $_GET['action'] == 'ratingdata')
	{
		$post_id = intval($_GET['pid'][0]);
                  $dataArray=array();
                foreach($_GET['pid'] as $post_id)
                {
                    if($post_id > 0 ) {
			// Check For Bot
			$bots_useragent = array('googlebot', 'google', 'msnbot', 'ia_archiver', 'lycos', 'jeeves', 'scooter', 'fast-webcrawler', 'slurp@inktomi', 'turnitinbot', 'technorati', 'yahoo', 'findexa', 'findlinks', 'gaisbo', 'zyborg', 'surveybot', 'bloglines', 'blogsearch', 'ubsub', 'syndic8', 'userland', 'gigabot', 'become.com');
			$useragent = $_SERVER['HTTP_USER_AGENT'];
			foreach ($bots_useragent as $bot) {
				if (stristr($useragent, $bot) !== false) {
					return;
				}
			}
			header('Content-Type: text/html; charset='.get_option('blog_charset').'');

				// Check Whether Is There A Valid Post
				$post = get_post($post_id);
				// If Valid Post Then We Rate It
				if($post && !wp_is_post_revision($post)) {


                                        $post_ratings = get_post_custom($post_id);
					$count=$post_ratings['borating_boratingcount'][0];
                                        $average=$post_ratings['borating_boratingaverage'][0];

                                         $dataArray[$post_id]["totalCount"]=$count;
                                         $dataArray[$post_id]["totalAverage"]=round($average*2)/2;

				} else {
					printf(__('Invalid Post ID. Post ID #%s.', 'wp-loveit'), $post_id);
					exit();
				} // End if($post)

		} // End if($rate && $post_id && check_allowtorate())
                }

            echo json_encode($dataArray);
            exit();
	} // End if(isset($_GET['action']) && $_GET['action'] == 'borating')
}


//Function:to replace short code if exit else add rating in end of content

   add_action('the_content', 'add_boratings_to_content');
    function add_boratings_to_content($content) {
        if(strpos($content, '[borating]'))
        {
            $content= str_replace('[borating]', the_boratings('div', $id, false),$content);
        }
        else if (!is_feed()) {
             $content .= the_boratings('div', 0, false);

         }
       return $content;
    }



?>
