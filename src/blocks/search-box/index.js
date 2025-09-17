import { registerBlockType } from '@wordpress/blocks';
import { layout } from '@wordpress/icons';

import metadata from './block.json';
import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( metadata.name, {
	icon: {
		src: layout,
	},
	edit,
	save,
} );
