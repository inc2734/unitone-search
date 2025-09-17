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
		className: 'unitone-search-period-search unitone-search-fieldset',
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
				<ToolsPanel label={ __( 'Settings', 'unitone-search' ) }>
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

			<fieldset { ...blockProps }>
				<legend className="unitone-search-period-search__header unitone-search-fieldset__header">
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
				</legend>

				<div className="unitone-search-period-search__content unitone-search-fieldset__content">
					<div className="unitone-search-period-search__start">
						<label
							htmlFor="unitone-search-period-start"
							className="screen-reader-text"
						>
							{ __( 'Start date', 'unitone-search' ) }
						</label>
						<div className="unitone-search-date-control">
							<input
								type={ controlType }
								className="unitone-search-form-control"
								id="unitone-search-period-start"
								name="unitone-search-period-start"
								pattern={ pattern }
								min={ min || undefined }
								disabled
							/>
						</div>
					</div>
					<div className="unitone-search-period-search__delimiter">
						{ __( '〜', 'unitone-search' ) }
					</div>
					<div className="unitone-search-period-search__end">
						<label
							htmlFor="unitone-search-period-end"
							className="screen-reader-text"
						>
							{ __( 'End date', 'unitone-search' ) }
						</label>
						<div className="unitone-search-date-control">
							<input
								type={ controlType }
								className="unitone-search-form-control"
								id="unitone-search-period-end"
								name="unitone-search-period-end"
								pattern={ pattern }
								min={ max || undefined }
								disabled
							/>
						</div>
					</div>
				</div>
			</fieldset>
		</>
	);
}
