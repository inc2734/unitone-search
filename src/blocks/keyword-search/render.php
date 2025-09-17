<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

$block_wrapper = get_block_wrapper_attributes( array( 'class' => 'unitone-search-keyword-search unitone-search-fieldset' ) );
?>

<fieldset <?php echo $block_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $attributes['label'] ) : ?>
		<div class="unitone-search-keyword-search__header unitone-search-fieldset__header">
			<label for="unitone-search-keyword-search-s">
				<span><?php echo wp_kses_post( $attributes['label'] ); ?></span>
			</label>
		</div>
	<?php endif; ?>

	<div class="unitone-search-keyword-search__content unitone-search-fieldset__content">
		<input
			type="text"
			class="unitone-search-form-control"
			id="unitone-search-keyword-search-s"
			name="s"
			placeholder="<?php echo esc_attr( $attributes['placeholder'] ); ?>"
			value="<?php echo esc_attr( get_search_query() ); ?>"
		/>
	</div>
</fieldset>
