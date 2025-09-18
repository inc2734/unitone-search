<?php
/**
 * Plugin name: unitone Search
 * Version: 1.0.0
 * Tested up to: 6.8
 * Requires at least: 6.8
 * Requires PHP: 7.4
 * Description: A search filter plugin for the WordPress theme unitone.
 * Author: Takashi Kitajima
 * Author URI: https://2inc.org
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: unitone-search
 *
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

namespace UnitoneSearch;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UNITONE_SEARCH_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'UNITONE_SEARCH_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

$autoloader_path = UNITONE_SEARCH_PATH . '/vendor/autoload.php';
if ( file_exists( $autoloader_path ) ) {
	require_once $autoloader_path;
} else {
	exit;
}

class Bootstrap {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, '_bootstrap' ) );
	}

	/**
	 * Bootstrap.
	 */
	public function _bootstrap() {
		require UNITONE_SEARCH_PATH . '/inc/updater.php';

		$theme = wp_get_theme( get_template() );
		if ( 'unitone' !== $theme->template ) {
			add_action(
				'admin_notices',
				function () {
					?>
					<div class="notice notice-warning is-dismissible">
						<p>
							<?php esc_html_e( '[unitone Search] Needs the unitone.', 'unitone-search' ); ?>
						</p>
					</div>
					<?php
				}
			);
			return;
		}

		require UNITONE_SEARCH_PATH . '/inc/i18n.php';
		require UNITONE_SEARCH_PATH . '/inc/blocks.php';

		add_action( 'template_redirect', array( $this, '_template_redirect' ) );

		new App\Rest();
		new App\Query();
	}

	/**
	 * If the paging destination does not exist, redirect to the first page.
	 */
	public function _template_redirect() {
		global $wp_query;

		if ( is_null( filter_input( INPUT_GET, 'unitone-search' ) ) ) {
			return;
		}

		if ( is_404() && 1 < get_query_var( 'paged' ) ) {
			$request_uri = wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			if ( $request_uri ) {
				$sub_directory = wp_parse_url( $home_url, PHP_URL_PATH ) ?? '';
				$absolute_path = preg_replace( '|^' . preg_quote( $sub_directory ) . '|', '', $request_uri );
				$redirect      = untrailingslashit( $home_url ) . $absolute_path;
				$redirect      = preg_replace( '|/page/\d+|', '', $redirect );
				$redirect      = preg_replace( '|paged=\d+|', '', $redirect );

				wp_safe_redirect( $redirect );
				exit;
			}
		}
	}
}

new \UnitoneSearch\Bootstrap();

/**
 * Uninstall.
 */
function unitone_search_uninstall() {
	$posts = get_posts(
		array(
			'post_type'      => 'unitone-search',
			'posts_per_page' => -1,
		)
	);

	foreach ( $posts as $post ) {
		wp_delete_post( $post->ID, true );
	}
}

/**
 * Register uninstall hook.
 */
function unitone_search_activate() {
	register_uninstall_hook( __FILE__, '\UnitoneSearch\unitone_search_uninstall' );
}
register_activation_hook( __FILE__, '\UnitoneSearch\unitone_search_activate' );
