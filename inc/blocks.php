<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

/**
 * Register blocks.
 */
function unitone_search_register_blocks() {
	wp_register_block_types_from_metadata_collection(
		UNITONE_SEARCH_PATH . '/build',
		UNITONE_SEARCH_PATH . '/build/blocks-manifest.php'
	);

	foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $block_type => $block ) {
		if ( 0 === strpos( $block_type, 'unitone--search/' ) ) {
			$handle = str_replace( '/', '-', $block_type ) . '-editor-script';
			wp_set_script_translations( $handle, 'unitone-search', UNITONE_MONKEY_SEARCH_PATH . '/languages' );
		}
	}
}
add_action( 'init', 'unitone_search_register_blocks' );
