const timeouts = {};
let uid = 0;

export function setAnimationTimeout ( fn, delay = 0 ) {
    const start = performance.now();
    const id = ( uid++ ).toString();

    function loop ( time ) {
        const delta = time - start;

        delta >= delay ? fn.call() : timeouts[ id ] = requestAnimationFrame( loop );
    }

    timeouts[ id ] = requestAnimationFrame( loop );
    return id;
}

export function clearAnimationTimeout ( id ) {
    if ( !timeouts.hasOwnProperty( id ) ) {
        return false;
    }

    cancelAnimationFrame( timeouts[ id ] );
    delete timeouts[ id ];
    return true;
}
