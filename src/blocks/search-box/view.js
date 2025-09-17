document.addEventListener( 'DOMContentLoaded', () => {
	const forms = document.querySelectorAll( '.unitone-search-search-box' );
	[].slice.call( forms ).forEach( ( form ) => {
		const clearButton = form.querySelector( '#unitone-search-clear' );
		if ( !! clearButton ) {
			clearButton.addEventListener( 'click', () => {
				[].slice
					.call( form.querySelectorAll( 'select' ) )
					.forEach( ( select ) => ( select.selectedIndex = 0 ) );

				[].slice
					.call(
						form.querySelectorAll(
							'input[type=checkbox], input[type="radio"]'
						)
					)
					.forEach( ( input ) => ( input.checked = false ) );

				[].slice
					.call(
						form.querySelectorAll(
							'input:not([type=checkbox]):not([type="radio"]):not([type="hidden"][name="post_type"]):not([type="hidden"][name="unitone-search"])'
						)
					)
					.forEach( ( input ) => ( input.value = '' ) );
			} );
		}
	} );
} );
