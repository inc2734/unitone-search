<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

$wp_taxonomy = get_taxonomy( $attributes['taxonomy'] );
if ( ! $wp_taxonomy ) {
	return;
}

$get_taxonomy_terms_with_depth = function ( $args ) {
	$terms = get_terms( $args );
	if ( ! $terms || is_wp_error( $terms ) ) {
		return array();
	}

	$terms_by_id = array();
	foreach ( $terms as $term ) {
		$terms_by_id[ $term->term_id ] = $term;
	}

	if ( ! function_exists( 'get_terms_with_depth_recursive' ) ) {
		/**
		 * Helper function to recursively retrieve a list of terms with hierarchy.
		 *
		 * @param array $terms_by_id Array of terms keyed by term id.
		 * @param int $parent_id Parent term id.
		 * @param int $depth Depth level.
		 */
		function get_terms_with_depth_recursive( $terms_by_id, $parent_id = 0, $depth = 0 ) {
			$result = array();

			foreach ( $terms_by_id as $term_id => $term ) {
				if ( $term->parent === $parent_id ) {
					$term->depth = $depth;
					$result[]    = $term;
					$result      = array_merge( $result, get_terms_with_depth_recursive( $terms_by_id, $term_id, $depth + 1 ) );
				}
			}
			return $result;
		}
	}

	$sorted_terms = get_terms_with_depth_recursive( $terms_by_id );

	return $sorted_terms;
};

$terms = $wp_taxonomy->hierarchical
	? $get_taxonomy_terms_with_depth(
		array(
			'taxonomy'   => $wp_taxonomy->name,
			'hide_empty' => false,
		)
	)
	: get_terms(
		array(
			'taxonomy'   => $wp_taxonomy->name,
			'hide_empty' => false,
		)
	);
if ( ! $terms ) {
	return;
}

$terms = apply_filters(
	'unitone_search_taxonomy_search_terms',
	$terms,
	array(
		'taxonomy'  => $wp_taxonomy->name,
		'post_id'   => get_the_ID(),
		'post_type' => get_post_type(),
	)
);

$http_this = filter_input( INPUT_GET, 'unitone-search-taxonomies', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ?? array();
$http_this = $http_this[ $wp_taxonomy->name ] ?? array();
$http_this = is_array( $http_this ) ? $http_this : array();

$block_wrapper = get_block_wrapper_attributes( array( 'class' => 'unitone-search-taxonomy-search unitone-search-fieldset' ) );
?>

<fieldset <?php echo $block_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $attributes['label'] ) : ?>
		<legend class="unitone-search-taxonomy-search__header unitone-search-fieldset__header">
			<span><?php echo wp_kses_post( $attributes['label'] ); ?></span>
		</legend>
	<?php endif; ?>

	<div class="unitone-search-taxonomy-search__content unitone-search-fieldset__content">
		<?php if ( 'checks' === $attributes['controlType'] ) : ?>
			<div
				class="unitone-search-checkboxes unitone-search-is-layout-<?php echo esc_attr( $attributes['flow'] ); ?>"
				style="<?php echo esc_attr( $attributes['itemMinWidth'] ? '--unitone--item-min-width:' . $attributes['itemMinWidth'] : '' ); ?>"
				role="group"
			>
				<?php foreach ( $terms as $_term ) : ?>
					<label>
						<span class="unitone-search-checkbox">
							<input
								type="checkbox"
								class="unitone-search-checkbox__control"
								name="unitone-search-taxonomies[<?php echo esc_attr( $wp_taxonomy->name ); ?>][]"
								value="<?php echo esc_attr( $_term->slug ); ?>"
								<?php if ( $http_this && in_array( $_term->slug, $http_this, true ) ) : ?>
									checked
								<?php endif; ?>
							/>
							<span class="unitone-search-checkbox__label"><?php echo esc_html( $_term->name ); ?></span>
						</span>
					</label>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( 'radios' === $attributes['controlType'] ) : ?>
			<div
				class="unitone-search-radios unitone-search-is-layout-<?php echo esc_attr( $attributes['flow'] ); ?>"
				style="<?php echo esc_attr( $attributes['itemMinWidth'] ? '--unitone--item-min-width:' . $attributes['itemMinWidth'] : '' ); ?>"
				role="group"
			>
				<?php foreach ( $terms as $_term ) : ?>
					<label>
						<span class="unitone-search-radio">
							<input
								type="radio"
								class="unitone-search-radio__control"
								name="unitone-search-taxonomies[<?php echo esc_attr( $wp_taxonomy->name ); ?>][]"
								value="<?php echo esc_attr( $_term->slug ); ?>"
								<?php if ( $http_this && in_array( $_term->slug, $http_this, true ) ) : ?>
									checked
								<?php endif; ?>
							/>
							<span class="unitone-search-radio__label"><?php echo esc_html( $_term->name ); ?></span>
						</span>
					</label>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( 'select' === $attributes['controlType'] ) : ?>
			<div class="unitone-search-select">
				<select
					name="unitone-search-taxonomies[<?php echo esc_attr( $wp_taxonomy->name ); ?>][]"
					class="unitone-search-select__control"
				>
					<option value=""></option>
					<?php foreach ( $terms as $_term ) : ?>
						<option
							value="<?php echo esc_attr( $_term->slug ); ?>"
							<?php if ( $http_this && in_array( $_term->slug, $http_this, true ) ) : ?>
								selected
							<?php endif; ?>
						>
							<?php echo esc_html( str_repeat( '&#160;&#160;', $_term->depth ?? 0 ) . ' ' . $_term->name ); ?>
						</option>
					<?php endforeach; ?>
				</select>
				<span class="unitone-search-select__toggle"></span>
			</div>
		<?php endif; ?>
	</div>
</fieldset>
