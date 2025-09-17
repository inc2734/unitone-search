<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */

$related_post_type = $attributes['relatedPostType'] ?? false;
if ( ! $related_post_type ) {
	return;
}

$action_to = get_post_type_archive_link( $related_post_type );
if ( ! $action_to ) {
	return;
}

$block_wrapper = get_block_wrapper_attributes( array( 'class' => 'unitone-search-search-box' ) );
?>

<form
	<?php echo $block_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	method="get"
	<?php if ( $action_to ) : ?>
		action="<?php echo esc_url( $action_to ); ?>"
	<?php endif; ?>
>
	<div class="unitone-search-search-box__content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>

	<div class="unitone-search-search-box__action">
		<input type="hidden" name="post_type" value="<?php echo esc_attr( $related_post_type ); ?>" />
		<input type="hidden" name="unitone-search" value="<?php the_ID(); ?>" />

		<button type="button" id="unitone-search-clear" class="unitone-search-search-box__clear">
			<?php esc_html_e( 'Clear Filter', 'unitone-search' ); ?>
		</button>

		<button type="submit" class="wp-element-button unitone-search-search-box__submit">
			<?php esc_html_e( 'Apply Filter', 'unitone-search' ); ?>
		</button>
	</div>
</form>
