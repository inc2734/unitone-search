<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

/**
 * Load textdomain.
 */
function unitone_search_load_textdomain() {
	load_plugin_textdomain( 'unitone-search', false, basename( UNITONE_SEARCH_PATH ) . '/languages' );
}
add_action( 'init', 'unitone_search_load_textdomain', 1 );
