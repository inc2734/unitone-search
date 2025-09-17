import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, context } ) {
	const { label, controlType, postType, taxonomy, flow, itemMinWidth } =
		attributes;

	// Reset the taxonomy once the post type has been switched in the search box.
	useEffect( () => {
		if ( context[ 'unitone-search/relatedPostType' ] !== postType ) {
			setAttributes( { taxonomy: undefined } );
		}
	}, [ context[ 'unitone-search/relatedPostType' ], postType ] );

	const taxonomiesWithRelatedPostType = useSelect(
		( select ) => {
			const { getPostType, getTaxonomy } = select( coreStore );

			if ( ! context[ 'unitone-search/relatedPostType' ] ) {
				return [];
			}

			const relatedPostType = getPostType(
				context[ 'unitone-search/relatedPostType' ]
			);

			const loadedTaxonomies = relatedPostType?.taxonomies
				.map( ( _taxonomy ) => {
					const _taxonomyObj = getTaxonomy( _taxonomy );
					return _taxonomyObj?.visibility?.show_ui
						? _taxonomyObj
						: false;
				} )
				.filter( Boolean );

			return loadedTaxonomies || [];
		},
		[ context[ 'unitone-search/relatedPostType' ] ]
	);

	const taxonomyAvailabled = taxonomiesWithRelatedPostType?.some(
		( value ) => value.slug === taxonomy
	);

	const terms = useSelect(
		( select ) => {
			return taxonomyAvailabled
				? select( coreStore ).getEntityRecords( 'taxonomy', taxonomy, {
						per_page: -1,
				  } ) || []
				: [];
		},
		[ taxonomy, taxonomyAvailabled ]
	);

	// Set default label.
	useEffect( () => {
		if ( null == label ) {
			setAttributes( {
				label: taxonomiesWithRelatedPostType?.filter(
					( value ) => value.slug === taxonomy
				)?.[ 0 ]?.name,
			} );
		}
	}, [ label, taxonomy, taxonomiesWithRelatedPostType ] );

	const blockProps = useBlockProps( {
		className: 'unitone-search-taxonomy-search unitone-search-form-control',
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Block settings', 'unitone-search' ) }>
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
							value={ controlType }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									controlType: newAttribute,
								} );
							} }
							options={ [
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
							taxonomy !== metadata.attributes.taxonomy.default
						}
						isShownByDefault
						label={ __( 'Taxonomy', 'unitone-search' ) }
						onDeselect={ () =>
							setAttributes( {
								taxonomy: metadata.attributes.taxonomy.default,
								label: metadata.attributes.label.default,
								postType: metadata.attributes.postType.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Taxonomy', 'unitone-search' ) }
							value={ taxonomy }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									taxonomy: newAttribute,
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
								...( taxonomiesWithRelatedPostType || [] ).map(
									( value ) => ( {
										label: value.name,
										value: value.slug,
									} )
								),
							] }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				{ ( () => {
					const isAvailable = !! taxonomy;
					const isLoading =
						1 > taxonomiesWithRelatedPostType.lengt ||
						1 > terms.length;

					if ( ! isAvailable ) {
						return (
							<>
								{ __(
									'Taxonomy is not availabled.',
									'unitone-search'
								) }
							</>
						);
					} else if ( isLoading ) {
						return <>{ __( 'Loading…', 'unitone-search' ) }</>;
					}

					return (
						<>
							<div className="unitone-search-taxonomy-search__header unitone-search-form-control__header">
								<RichText
									tagName="strong"
									value={ label }
									onChange={ ( newAttribute ) => {
										setAttributes( {
											label: newAttribute,
										} );
									} }
									placeholder={ __(
										'Label…',
										'unitone-search'
									) }
								/>
							</div>

							<div className="unitone-search-taxonomy-search__content unitone-search-form-control__content">
								{ 'checks' === controlType && (
									<div
										className={ `unitone-search-checkboxes unitone-search-is-layout-${ flow }` }
										style={ {
											'--unitone--item-min-width':
												itemMinWidth || undefined,
										} }
									>
										{ terms.map( ( term ) => (
											<label key={ term.slug }>
												<span className="unitone-search-checkbox">
													<input
														type="checkbox"
														className="unitone-search-checkbox__control"
														value={ term.slug }
														disabled
													/>
													<span className="unitone-search-checkbox__label">
														{ term.name }
													</span>
												</span>
											</label>
										) ) }
									</div>
								) }

								{ 'radios' === controlType && (
									<div
										className={ `unitone-search-radios unitone-search-is-layout-${ flow }` }
										style={ {
											'--unitone--item-min-width':
												itemMinWidth || undefined,
										} }
									>
										{ terms.map( ( term ) => (
											<label key={ term.slug }>
												<span className="unitone-search-radio">
													<input
														type="radio"
														className="unitone-search-radio__control"
														value={ term.slug }
														disabled
													/>
													<span className="unitone-search-radio__label">
														{ term.name }
													</span>
												</span>
											</label>
										) ) }
									</div>
								) }

								{ 'select' === controlType && (
									<div className="unitone-search-select">
										<div className="unitone-search-select">
											<select
												className="unitone-search-select__control"
												disabled
											>
												<option value=""></option>
												{ terms.map( ( term ) => (
													<option
														key={ term.slug }
														value={ term.slug }
													>
														{ term.name }
													</option>
												) ) }
											</select>
											<span className="unitone-search-select__toggle"></span>
										</div>
									</div>
								) }
							</div>
						</>
					);
				} )() }
			</div>
		</>
	);
}
