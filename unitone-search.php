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
 * @author inc2734
 * @license GPL-2.0+
 */

namespace UnitoneSearch;

use Unitone\App\DynamicBlock;

define( 'UNITONE_SEARCH_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'UNITONE_SEARCH_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

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
	}
}

require_once __DIR__ . '/vendor/autoload.php';
new \UnitoneSearch\Bootstrap();
