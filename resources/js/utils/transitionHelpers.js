function parseTime ( strTime ) {
    let val = parseFloat( strTime );
    return strTime.indexOf( 'ms' ) > -1 ? val : val * 1000;
}

export function getTransitions ( $element ) {
    // firefox doesn't support retrieving values from shorthand
    // TODO: handle cases of spaces in timing function
    // const transition = $element.css( 'transition' );
    //
    // if ( transition.length ) {
    //     return $element.css( 'transition' )
    //         .split( ',' )
    //         .map( transition => {
    //             const parts = transition
    //                 .trim()
    //                 .split( ' ' );
    //
    //             return {
    //                 property: parts[ 0 ],
    //                 time: parseTime( parts[ 1 ] ),
    //                 ease: parts[ 2 ],
    //                 delay: parseTime( parts[ 3 ] )
    //             };
    //         } );
    // }

    const transitionProperties = $element.css( 'transition-property' ).split( ',' );
    const transitionDurations = $element.css( 'transition-duration' ).split( ',' );
    const transitionTimingFunctions = $element.css( 'transition-timing-function' ).split( ',' );
    const transitionDelays = $element.css( 'transition-delay' ).split( ',' );

    return transitionProperties.map( ( prop, index ) => ( {
        property: prop.trim(),
        time: parseTime( transitionDurations[ index ] ),
        ease: transitionTimingFunctions[ index ].trim(),
        delay: parseTime( transitionDelays[ index ] )
    } ) );
}

export function getLongestTransitionTime ( $element, includeDelay = true ) {
    return getTransitions( $element )
        .reduce( ( acc, transition ) => {
            const time = includeDelay ? transition.time + transition.delay : transition.time;
            return Math.max( acc, time );
        }, 0 );
}

export function getTransitionTimeForProperty ( $element, property, includeDelay = true ) {
    const transitions = getTransitions( $element );
    let transition = transitions.find( transition => transition.property === property );

    if ( !transition ) {
        transition = transitions.find( transition => transition.property === 'all' );

        if ( !transition ) {
            return 0;
        }
    }

    return includeDelay ? transition.time + transition.delay : transition.time;
}
