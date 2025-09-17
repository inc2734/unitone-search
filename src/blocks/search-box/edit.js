import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { store as coreStore } from '@wordpress/core-data';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { relatedPostType } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const allPostTypes = useSelect( ( select ) => {
		const { getPostTypes } = select( coreStore );

		const _allPostTypes = getPostTypes( { per_page: -1 } ) || [];

		return _allPostTypes.filter(
			( type ) =>
				type.viewable &&
				! type.hierarchical &&
				'media' !== type.rest_base
		);
	} );

	const blockProps = useBlockProps( {
		className: 'unitone-search-search-box',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-search-search-box__content',
		},
		{
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __(
							'Post Types to Search For',
							'unitone-search'
						) }
						value={ relatedPostType || '' }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								relatedPostType: newAttribute,
							} );
						} }
						options={ [
							{
								label: '',
								value: '',
							},
							...allPostTypes.map( ( postType ) => ( {
								label: postType.name,
								value: postType.slug,
							} ) ),
						] }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />

				<div className="unitone-search-search-box__action">
					<button
						className="unitone-search-search-box__clear"
						type="button"
					>
						{ __( 'Clear Filter', 'unitone-search' ) }
					</button>

					<button
						className="wp-element-button unitone-search-search-box__submit"
						type="button"
					>
						{ __( 'Apply Filter', 'unitone-search' ) }
					</button>
				</div>
			</div>
		</>
	);
}
