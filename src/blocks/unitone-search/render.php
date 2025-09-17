<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

if ( empty( $attributes['formId'] ) ) {
	return;
}

$form_id = $attributes['formId'];

$the_query = new \WP_Query(
	array(
		'post_type'        => 'unitone-search',
		'posts_per_page'   => 1,
		'suppress_filters' => false,
		'no_found_rows'    => true,
		'p'                => $form_id,
	)
);

while ( $the_query->have_posts() ) {
	$the_query->the_post();

	the_content();
}
wp_reset_postdata();
