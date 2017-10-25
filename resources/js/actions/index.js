import * as actions from './actions';
import * as loaderActions from './loaderActions';
import * as bookActions from './bookActions';

// Object here so we can reference actions by string even when code is minified as in LinkDispatcher.js
export default {
    batchActions: actions.batchActions,
    setHash: actions.setHash,
    setOpenScrollIndex: actions.setOpenScrollIndex,
    toggleMobileMenu: actions.toggleMobileMenu,
    setGalleryScrollPolling: actions.setGalleryScrollPolling,
    addGalleryPolaroids: actions.addGalleryPolaroids,
    setGalleryActivePolaroidIndex: actions.setGalleryActivePolaroidIndex,
    setScrollPosition: actions.setScrollPosition,
    addOverlay: actions.addOverlay,
    openOverlay: actions.openOverlay,
    closeOverlay: actions.closeOverlay,
    setGalleryOverlaySlideIndex: actions.setGalleryOverlaySlideIndex,
    addAccordion: actions.addAccordion,
    toggleAccordionIndex: actions.toggleAccordionIndex,
    setOverlayVideoId: actions.setOverlayVideoId,
    addInlineVideo: actions.addInlineVideo,
    setInlineVideoReady: actions.setInlineVideoReady,
    setInlineVideoTouched: actions.setInlineVideoTouched,
    loadInlineVideoPoster: actions.loadInlineVideoPoster,
    setInlineVideoPosterLoaded: actions.setInlineVideoPosterLoaded,
    togglePlayInlineVideo: actions.togglePlayInlineVideo,
    showLoader: loaderActions.showLoader,
    hideLoader: loaderActions.hideLoader,
    addBook: bookActions.addBook,
    setCurrentBook: bookActions.setCurrentBook,
    setBookPerspective: bookActions.setBookPerspective,
    setBookPageLoaded: bookActions.setBookPageLoaded,
};
