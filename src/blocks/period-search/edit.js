import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalInputControl as InputControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { label, controlType, min, max } = attributes;

	// Set default label.
	useEffect( () => {
		if ( null == label ) {
			setAttributes( { label: __( 'Period', 'unitone-search' ) } );
		}
	}, [ label ] );

	const blockProps = useBlockProps( {
		className: 'unitone-search-period-search unitone-search-form-control',
	} );

	let pattern;
	switch ( controlType ) {
		case 'month':
			pattern = 'd{4}-d{2}';
			break;
		case 'date':
		default:
			pattern = 'd{4}-d{2}-d{2}';
			break;
	}

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Block settings', 'unitone-search' ) }>
					<div style={ { gridColumn: '1 / -1' } }>
						<span
							dangerouslySetInnerHTML={ {
								__html: sprintf(
									// translators: %1$s: <code>
									__(
										'If you want to include future posts in the search and display, use the %1$s filter hook.',
										'unitone-search'
									),
									'<code>unitone_includes_future_posts</code>'
								),
							} }
						/>
					</div>

					<ToolsPanelItem
						hasValue={ () =>
							controlType !==
							metadata.attributes.controlType.default
						}
						isShownByDefault
						label={ __( 'Type', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								controlType:
									metadata.attributes.controlType.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone-search' ) }
							value={ controlType }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									controlType: newAttribute,
								} );
							} }
							options={ [
								{
									label: __( 'Date', 'unitone-search' ),
									value: 'date',
								},
								{
									label: __( 'Month', 'unitone-search' ),
									value: 'month',
								},
							] }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							min !== metadata.attributes.min.default
						}
						isShownByDefault
						label={ __( 'Minimum Date', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								min: metadata.attributes.min.default,
							} )
						}
					>
						<div className="unitone-search-date-control">
							<InputControl
								__next40pxDefaultSize
								label={ __( 'Minimum Date', 'unitone-search' ) }
								type={ controlType }
								pattern={ pattern }
								value={ min }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										min: newAttribute,
									} );
								} }
							/>
						</div>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							max !== metadata.attributes.max.default
						}
						isShownByDefault
						label={ __( 'Maximum Date', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								max: metadata.attributes.max.default,
							} )
						}
					>
						<div className="unitone-search-date-control">
							<InputControl
								__next40pxDefaultSize
								label={ __( 'Maximum Date', 'unitone-search' ) }
								type={ controlType }
								pattern={ pattern }
								className="unitone-search-date-control"
								value={ max }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										max: newAttribute,
									} );
								} }
							/>
						</div>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="unitone-search-period-search__header unitone-search-form-control__header">
					<RichText
						tagName="strong"
						value={ label }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								label: newAttribute,
							} );
						} }
						placeholder={ __( 'Label…', 'unitone-search' ) }
					/>
				</div>

				<div className="unitone-search-period-search__content unitone-search-form-control__content">
					<div className="unitone-search-period-search__start">
						<input
							type={ controlType }
							className="unitone-search-form-control"
							name="unitone-search-period-start"
							pattern={ pattern }
							min={ min || undefined }
							disabled
						/>
					</div>
					<div className="unitone-search-period-search__delimiter">
						{ __( '〜', 'unitone-search' ) }
					</div>
					<div className="unitone-search-period-search__end">
						<input
							type={ controlType }
							className="unitone-search-form-control"
							name="unitone-search-period-end"
							pattern={ pattern }
							min={ max || undefined }
							disabled
						/>
					</div>
				</div>
			</div>
		</>
	);
}
