// https://github.com/Modernizr/Modernizr/issues/762
export default function detectPreserve3d () {
    const element = document.createElement( 'p' );
    const html = document.getElementsByTagName( 'html' )[ 0 ];
    const body = document.getElementsByTagName( 'body' )[ 0 ];
    const properties = {
        webkitTransformStyle: '-webkit-transform-style',
        MozTransformStyle: '-moz-transform-style',
        msTransformStyle: '-ms-transform-style',
        transformStyle: 'transform-style'
    };

    body.insertBefore( element, null );

    let property;

    for ( property in properties ) {
        if ( element.style[ property ] !== undefined ) {
            element.style[ property ] = 'preserve-3d';
        }
    }

    const st = window.getComputedStyle( element, null );
    const transform = st.getPropertyValue( '-webkit-transform-style' ) ||
        st.getPropertyValue( '-moz-transform-style' ) ||
        st.getPropertyValue( '-ms-transform-style' ) ||
        st.getPropertyValue( 'transform-style' );

    let className = 'no-preserve-3d';
    window.preserve3d = false;

    if ( transform === 'preserve-3d' ) {
        window.preserve3d = true;
        className = 'preserve-3d';
    }

    html.classList.add( className );

    document.body.removeChild( element );
}
