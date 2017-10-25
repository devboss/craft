import * as types from '../constants/actionTypes';

export const batchActions = ( ...actions ) => ( { type: types.BATCH_ACTIONS, actions } );
export const setHash = ( hash ) => ( { type: types.SET_HASH, hash } );
export const setOpenScrollIndex = index => ( { type: types.SET_OPEN_SCROLL_INDEX, index } );
export const toggleMobileMenu = () => ( { type: types.TOGGLE_MOBILE_MENU } );
export const setGalleryScrollPolling = active => ( { type: types.SET_GALLERY_SCROLL_POLLING, active } );
export const addGalleryPolaroids = ( arr ) => ( { type: types.ADD_GALLERY_POLAROIDS, arr } );
export const setGalleryActivePolaroidIndex = index => ( { type: types.SET_GALLERY_ACTIVE_POLAROID_INDEX, index } );
export const setScrollPosition = ( $targetElement, position = undefined ) => ( { type: types.SET_SCROLL_POSITION, $targetElement, position } );
export const addOverlay = ( name, data ) => ( { type: types.ADD_OVERLAY, name, data } );
export const openOverlay = name => ( { type: types.OPEN_OVERLAY, name } );
export const closeOverlay = name => ( { type: types.CLOSE_OVERLAY, name } );
export const setGalleryOverlaySlideIndex = slideIndex => ( { type: types.SET_GALLERY_OVERLAY_SLIDE_INDEX, slideIndex } );
export const addAccordion = name => ( { type: types.ADD_ACCORDION, name } );
export const toggleAccordionIndex = ( name, index ) => ( { type: types.TOGGLE_ACCORDION_INDEX, name, index } );
export const setOverlayVideoId = vimeoId => ( { type: types.SET_OVERLAY_VIDEO_ID, vimeoId } );
export const addInlineVideo = ( vimeoId ) => ( { type: types.ADD_INLINE_VIDEO, vimeoId } );
export const setInlineVideoReady = ( vimeoId ) => ( { type: types.SET_INLINE_VIDEO_READY, vimeoId } );
export const setInlineVideoTouched = ( vimeoId, touched ) => ( { type: types.SET_INLINE_VIDEO_TOUCHED, vimeoId, touched } );
export const loadInlineVideoPoster = ( vimeoId ) => ( { type: types.LOAD_INLINE_VIDEO_POSTER, vimeoId } );
export const setInlineVideoPosterLoaded = ( vimeoId ) => ( { type: types.SET_INLINE_VIDEO_POSTER_LOADED, vimeoId } );
export const togglePlayInlineVideo = ( vimeoId, play ) => ( { type: types.TOGGLE_PLAY_INLINE_VIDEO, vimeoId, play } );

export const setCookiesAccepted = accepted => {
    const value = accepted ? 'true' : 'false';
    
    window.localStorage.setItem( 'cookiesAccepted', value );

    return { type: types.SET_COOKIES_ACCEPTED, accepted };
};
