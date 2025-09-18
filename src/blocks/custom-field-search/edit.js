import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

import {
	SelectControl,
	TextareaControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import { optionsToJsonArray } from './helper';

import metadata from './block.json';

export default function ( { attributes, setAttributes, context } ) {
	const {
		label,
		key,
		postType,
		controlType,
		options,
		compare,
		type,
		flow,
		itemMinWidth,
	} = attributes;

	const [ keys, setKeys ] = useState( [] );
	const [ finalControlType, setFinalControlType ] = useState( controlType );
	const [ finalOptions, setFinalOptions ] = useState( [] );

	// Reset the key once the post type has been switched in the search box.
	useEffect( () => {
		if ( context[ 'unitone-search/relatedPostType' ] !== postType ) {
			setAttributes( { key: undefined, label: null } );
		}
	}, [ context[ 'unitone-search/relatedPostType' ], postType ] );

	// Get post meta keys with post type.
	useEffect( () => {
		setKeys( [] );

		apiFetch( {
			path: `/unitone-search/v1/post-meta-keys/${ context[ 'unitone-search/relatedPostType' ] }`,
			method: 'GET',
		} ).then( ( v ) => {
			setKeys( v );
		} );
	}, [ context[ 'unitone-search/relatedPostType' ] ] );

	// Set default label.
	useEffect( () => {
		if ( null == label ) {
			setAttributes( {
				label: key,
			} );
		}
	}, [ key ] );

	// Set final control type.
	useEffect( () => {
		if ( 'text' === controlType ) {
			switch ( type ) {
				case 'numeric':
					setFinalControlType( 'number' );
					break;
				case 'date':
					setFinalControlType( 'date' );
					break;
				case 'datetime':
					setFinalControlType( 'datetime-local' );
					break;
				case 'time':
					setFinalControlType( 'time' );
					break;
				default:
					setFinalControlType( 'text' );
			}
		} else {
			setFinalControlType( controlType );
		}
	}, [ controlType, type ] );

	// console.log( '-----' );
	// console.log( controlType );
	// console.log( finalControlType );

	// Set default options
	useEffect( () => {
		if (
			'checks' === finalControlType ||
			'radios' === finalControlType ||
			'select' === finalControlType
		) {
			if ( '' === options ) {
				setAttributes( {
					options: 'value1\n"value2" : "label2"\n"value3" : "label3"',
				} );
			}
		} else {
			setAttributes( {
				options: '',
			} );
		}
	}, [ finalControlType, options ] );

	// Set final options.
	useEffect( () => {
		if ( !! options ) {
			setFinalOptions( optionsToJsonArray( options ) );
		} else {
			setFinalOptions( [] );
		}
	}, [ options ] );

	const blockProps = useBlockProps( {
		className: 'unitone-search-custom-field-search unitone-search-fieldset',
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone-search' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							key !== metadata.attributes.key.default
						}
						isShownByDefault
						label={ __( 'Key', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								key: metadata.attributes.key.default,
								label: metadata.attributes.label.default,
								postType: metadata.attributes.postType.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Key', 'unitone-search' ) }
							value={ key }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									key: newAttribute,
									label: undefined,
									postType:
										context[
											'unitone-search/relatedPostType'
										],
								} );
							} }
							options={ [
								{
									label: '',
									value: undefined,
								},
								...keys.map( ( v ) => ( {
									label: v,
									value: v,
								} ) ),
							] }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							controlType !==
							metadata.attributes.controlType.default
						}
						isShownByDefault
						label={ __( 'Control Type', 'unitone-search' ) }
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
							label={ __( 'Control Type', 'unitone-search' ) }
							help={ __(
								'For "Text," depending on the "Type," it will automatically change to the appropriate control. For "Checkbox," "Radio Button," and "Select Box," you need to set the choices.',
								'unitone-search'
							) }
							value={ controlType }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									controlType: newAttribute,
								} );
							} }
							options={ [
								{
									label: __( 'Text', 'unitone-search' ),
									value: 'text',
								},
								{
									label: __( 'Checks', 'unitone-search' ),
									value: 'checks',
								},
								{
									label: __( 'Radios', 'unitone-search' ),
									value: 'radios',
								},
								{
									label: __( 'Select', 'unitone-search' ),
									value: 'select',
								},
							] }
						/>
					</ToolsPanelItem>

					{ [ 'checks', 'radios' ].includes( controlType ) && (
						<ToolsPanelItem
							hasValue={ () =>
								flow !== metadata.attributes.flow.default
							}
							isShownByDefault
							label={ __( 'Flow', 'unitone-search' ) }
							onDeselect={ () =>
								setAttributes( {
									flow: metadata.attributes.flow.default,
								} )
							}
						>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Flow', 'unitone-search' ) }
								value={ flow }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										flow: newAttribute,
									} );
								} }
								options={ [
									{
										label: __( 'Inline', 'unitone-search' ),
										value: 'inline',
									},
									{
										label: __( 'Stack', 'unitone-search' ),
										value: 'stack',
									},
									{
										label: __( 'Grid', 'unitone-search' ),
										value: 'grid',
									},
								] }
							/>
						</ToolsPanelItem>
					) }

					{ 'grid' === flow && (
						<ToolsPanelItem
							hasValue={ () =>
								itemMinWidth !==
								metadata.attributes.itemMinWidth.default
							}
							isShownByDefault
							label={ __(
								'Item Minimum Width',
								'unitone-search'
							) }
							onDeselect={ () =>
								setAttributes( {
									itemMinWidth:
										metadata.attributes.itemMinWidth
											.default,
								} )
							}
						>
							<UnitControl
								__next40pxDefaultSize
								label={ __(
									'Item Minimum Width',
									'unitone-search'
								) }
								value={ itemMinWidth }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										itemMinWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					) }

					<ToolsPanelItem
						hasValue={ () =>
							controlType !== metadata.attributes.options.default
						}
						isShownByDefault
						label={ __( 'options', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								options: metadata.attributes.options.default,
							} )
						}
					>
						{ ( 'checks' === finalControlType ||
							'radios' === finalControlType ||
							'select' === finalControlType ) && (
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'options', 'unitone-search' ) }
								value={ options }
								help={ sprintf(
									// translators: %1$s: line-break-char.
									__(
										'Required. Enter in the following format: "value" : "label"%1$s or value%1$s',
										'unitone-search'
									),
									'\u21B5'
								) }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										options: newAttribute,
									} );
								} }
							/>
						) }
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							type !== metadata.attributes.type.default
						}
						isShownByDefault
						label={ __( 'Type', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								type: metadata.attributes.type.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone-search' ) }
							value={ type }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									type: newAttribute,
								} );
							} }
							options={ [
								{
									label: __( 'NUMERIC', 'unitone-search' ),
									value: 'numeric',
								},
								{
									label: __( 'CHAR', 'unitone-search' ),
									value: 'char',
								},
								{
									label: __( 'DATE', 'unitone-search' ),
									value: 'date',
								},
								{
									label: __( 'DATETIME', 'unitone-search' ),
									value: 'datetime',
								},
								{
									label: __( 'TIME', 'unitone-search' ),
									value: 'time',
								},
							] }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							compare !== metadata.attributes.compare.default
						}
						isShownByDefault
						label={ __( 'Compare', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								compare: metadata.attributes.compare.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Compare', 'unitone-search' ) }
							value={ compare }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									compare: newAttribute,
								} );
							} }
							options={ [
								{
									label: '=',
									value: '=',
								},
								{
									label: '!=',
									value: '!=',
								},
								{
									label: '>',
									value: '>',
								},
								{
									label: '>=',
									value: '>=',
								},
								{
									label: '<',
									value: '<',
								},
								{
									label: '<=',
									value: '<=',
								},
								{
									label: 'LIKE',
									value: 'LIKE',
								},
								{
									label: 'NOT LIKE',
									value: 'NOT LIKE',
								},
							] }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<fieldset { ...blockProps }>
				<legend className="unitone-search-custom-field-search__header unitone-search-fieldset__header">
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

				<div className="unitone-search-custom-field-search__content unitone-search-fieldset__content">
					{ ( 'date' === finalControlType ||
						'datetime-local' === finalControlType ||
						'time' === finalControlType ) && (
						<div className="unitone-search-date-control">
							<input
								type={ finalControlType }
								className="unitone-search-form-control"
								disabled
							/>
						</div>
					) }

					{ 'checks' === finalControlType && (
						<div
							className={ `unitone-search-checkboxes unitone-search-is-layout-${ flow }` }
							style={ {
								'--unitone--item-min-width':
									itemMinWidth || undefined,
							} }
							role="group"
						>
							{ finalOptions.map( ( option ) => (
								<label key={ option.value }>
									<span className="unitone-search-checkbox">
										<input
											type="checkbox"
											className="unitone-search-checkbox__control"
											value={ option.value }
											disabled
										/>
										<span className="unitone-search-checkbox__label">
											{ option.label }
										</span>
									</span>
								</label>
							) ) }
						</div>
					) }

					{ 'radios' === finalControlType && (
						<div
							className={ `unitone-search-radios unitone-search-is-layout-${ flow }` }
							style={ {
								'--unitone--item-min-width':
									itemMinWidth || undefined,
							} }
							role="group"
						>
							{ finalOptions.map( ( option ) => (
								<label key={ option.value }>
									<span className="unitone-search-radio">
										<input
											type="radio"
											className="unitone-search-radio__control"
											value={ option.value }
											disabled
										/>
										<span className="unitone-search-radio__label">
											{ option.label }
										</span>
									</span>
								</label>
							) ) }
						</div>
					) }

					{ 'select' === finalControlType && (
						<div className="unitone-search-select">
							<select
								className="unitone-search-select__control"
								disabled
							>
								<option value=""></option>
								{ finalOptions.map( ( option ) => (
									<option
										key={ option.value }
										value={ option.value }
									>
										{ option.label }
									</option>
								) ) }
							</select>
							<span className="unitone-search-select__toggle"></span>
						</div>
					) }

					{ ( 'text' === finalControlType ||
						'number' === finalControlType ) && (
						<input
							type={ finalControlType }
							className="unitone-search-form-control"
							disabled
						/>
					) }
				</div>
			</fieldset>
		</>
	);
}
