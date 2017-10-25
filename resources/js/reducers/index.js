import { combineReducers } from 'redux-immutable';

import hash from './hash';
import navScrolls from './navScrolls';
import mobileMenu from './mobileMenu';
import gallery from './gallery';
import scrollPosition from './scrollPosition';
import overlays from './overlays';
import books from './books';
import accordions from './accordions';
import videos from './videos';
import loader from './loader';
import cookies from './cookies';

const rootReducer = combineReducers( {
    hash,
    navScrolls,
    mobileMenu,
    gallery,
    scrollPosition,
    overlays,
    books,
    accordions,
    videos,
    loader,
    cookies
} );

export default rootReducer;
