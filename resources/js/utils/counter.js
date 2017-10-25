export default function counter ( length, eachOrCompleteCb, completeCb = null ) {
    let count = 0;
    let allArgs = [];
    let eachCb = completeCb !== null ? eachOrCompleteCb : null;
    completeCb = completeCb !== null ? completeCb : eachOrCompleteCb;

    return function ( ...args ) {
        allArgs.push( args );

        if ( eachCb ) {
            eachCb( ...args );
        }

        if ( ++count === length ) {
            allArgs = [];
            count = 0;
            completeCb( allArgs );
        }
    };
}
