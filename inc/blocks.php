<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

/**
 * Register post types.
 */
function unitone_search_register_post_types() {
	register_post_type(
		'unitone-search',
		array(
			'label'        => __( 'unitone Search', 'unitone-search' ),
			'public'       => false,
			'show_ui'      => true,
			'show_in_rest' => true,
			'capabilities' => array(
				'edit_post'          => 'manage_options',
				'read_post'          => 'manage_options',
				'delete_post'        => 'manage_options',
				'edit_posts'         => 'manage_options',
				'delete_posts'       => 'manage_options',
				'publish_posts'      => 'manage_options',
				'read_private_posts' => 'manage_options',
			),
			'supports'     => array( 'title', 'editor', 'custom-fields' ),
			'template'     => array(
				array(
					'unitone-search/search-box',
					array(
						'relatedPostType' => 'post',
						'style'           => array(
							'border' => array(
								'width' => '1px',
							),
						),
						'borderColor'     => 'unitone-light-gray',
						'backgroundColor' => 'unitone-pale-gray',
						'lock'            => array(
							'move'   => true,
							'remove' => true,
						),
					),
					array(
						array(
							'unitone/flex',
							array(),
							array(
								array(
									'unitone-search/keyword-search',
									array(
										'unitone' => array(
											'flexGrow'  => '1',
											'flexBasis' => '100%',
										),
									),
								),
								array(
									'unitone-search/taxonomy-search',
									array(
										'postType' => 'post',
										'taxonomy' => 'category',
										'unitone'  => array(
											'flexGrow' => '1',
										),
									),
								),
								array(
									'unitone-search/taxonomy-search',
									array(
										'postType' => 'post',
										'taxonomy' => 'post_tag',
										'unitone'  => array(
											'flexGrow' => '1',
										),
									),
								),
							),
						),
					),
				),
			),
		)
	);
}
add_action( 'init', 'unitone_search_register_post_types' );

/**
 * Register block categories.
 *
 * @param array $categories array Array of block categories.
 * @return array
 */
function unitone_search_register_block_categories( $categories ) {
	$categories[] = array(
		'slug'  => 'unitone-search',
		'title' => __( '[unitone] Search', 'unitone-search' ),
	);

	return $categories;
}
add_filter( 'block_categories_all', 'unitone_search_register_block_categories' );

/**
 * Register blocks.
 */
function unitone_search_register_blocks() {
	wp_register_block_types_from_metadata_collection(
		UNITONE_SEARCH_PATH . '/dist/blocks',
		UNITONE_SEARCH_PATH . '/dist/blocks-manifest.php'
	);

	foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $block_type => $block ) {
		if ( 0 === strpos( $block_type, 'unitone--search/' ) ) {
			$handle = str_replace( '/', '-', $block_type ) . '-editor-script';
			wp_set_script_translations( $handle, 'unitone-search', UNITONE_MONKEY_SEARCH_PATH . '/languages' );
		}
	}
}
add_action( 'init', 'unitone_search_register_blocks' );
