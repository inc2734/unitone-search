<?php
/**
 * @package unitone-search
 * @author Takashi Kitajima
 * @license GPL-2.0+
 */


$http_start = filter_input( INPUT_GET, 'unitone-search-period-start' );
$http_end   = filter_input( INPUT_GET, 'unitone-search-period-end' );

switch ( $attributes['controlType'] ) {
	case 'month':
		$pattern = '\d{4}-\d{2}';
		break;
	case 'date':
	default:
		$pattern = '\d{4}-\d{2}-\d{2}';
		break;
}

$min = $attributes['min'] && preg_match( '|^' . $pattern . '$|', $attributes['min'] )
	? $attributes['min']
	: false;

$max = $attributes['max'] && preg_match( '|^' . $pattern . '$|', $attributes['max'] )
	? $attributes['max']
	: false;

$block_wrapper = get_block_wrapper_attributes( array( 'class' => 'unitone-search-period-search unitone-search-fieldset' ) );
?>

<fieldset <?php echo $block_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $attributes['label'] ) : ?>
		<legend class="unitone-search-period-search__header unitone-search-fieldset__header">
			<span><?php echo wp_kses_post( $attributes['label'] ); ?></span>
		</legend>
	<?php endif; ?>

	<div class="unitone-search-period-search__content unitone-search-fieldset__content">
		<div class="unitone-search-period-search__start">
			<label for="unitone-search-period-start" class="screen-reader-text"><?php esc_html_e( 'Start date', 'unitone-search' ); ?></label>
			<div class="unitone-search-date-control">
				<input
					type="<?php echo esc_attr( $attributes['controlType'] ); ?>"
					class="unitone-search-form-control"
					id="unitone-search-period-start"
					name="unitone-search-period-start"
					pattern="<?php echo esc_attr( $pattern ); ?>"
					value="<?php echo esc_attr( $http_start ); ?>"
					<?php if ( $min ) : ?>
						min="<?php echo esc_attr( $min ); ?>"
					<?php endif; ?>
				/>
			</div>
		</div>
		<div class="unitone-search-period-search__delimiter">
			<?php esc_html_e( '〜', 'unitone-search' ); ?>
		</div>
		<div class="unitone-search-period-search__end">
			<label for="unitone-search-period-end" class="screen-reader-text"><?php esc_html_e( 'End date', 'unitone-search' ); ?></label>
			<div class="unitone-search-date-control">
				<input
					type="<?php echo esc_attr( $attributes['controlType'] ); ?>"
					class="unitone-search-form-control"
					id="unitone-search-period-end"
					name="unitone-search-period-end"
					pattern="<?php echo esc_attr( $pattern ); ?>"
					value="<?php echo esc_attr( $http_end ); ?>"
					<?php if ( $max ) : ?>
						max="<?php echo esc_attr( $max ); ?>"
					<?php endif; ?>
				/>
			</div>
		</div>
	</div>
</fieldset>
