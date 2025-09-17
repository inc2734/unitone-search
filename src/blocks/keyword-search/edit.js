import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { label, placeholder } = attributes;

	// Set default label.
	useEffect( () => {
		if ( null == label ) {
			setAttributes( { label: __( 'Keywords', 'unitone-search' ) } );
		}
	}, [ label ] );

	const blockProps = useBlockProps( {
		className: 'unitone-search-keyword-search unitone-search-fieldset',
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone-search' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							placeholder !==
							metadata.attributes.placeholder.default
						}
						isShownByDefault
						label={ __( 'Placeholder', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								placeholder:
									metadata.attributes.placeholder.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Placeholder', 'unitone-search' ) }
							value={ placeholder }
							onChange={ ( newAttribute ) =>
								setAttributes( { placeholder: newAttribute } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<fieldset { ...blockProps }>
				<div className="unitone-search-keyword-search__header unitone-search-fieldset__header">
					<label htmlFor="unitone-search-keyword-search-s">
						<RichText
							tagName="span"
							value={ label }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									label: newAttribute,
								} );
							} }
							placeholder={ __( 'Label…', 'unitone-search' ) }
						/>
					</label>
				</div>

				<div className="unitone-search-keyword-search__content unitone-search-fieldset__content">
					<input
						type="text"
						className="unitone-search-form-control"
						id="unitone-search-keyword-search-s"
						name="s"
						placeholder={ placeholder }
						disabled
					/>
				</div>
			</fieldset>
		</>
	);
}
