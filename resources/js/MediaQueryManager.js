export default class MediaQueryManager {

    constructor ( ranges = {
        small: [ 0, 639 ],
        medium: [ 640, 1023 ],
        large: [ 1024, 1440 ],
        xlarge: [ 1441, Number.MAX_SAFE_INTEGER ]
    }, autoCreate = true ) {
        this.ranges = ranges;
        this.queries = {};
        this.queryNames = [];
        this.matchingQueryNames = null;
        this.listeners = [];

        if ( autoCreate ) {
            this.createQueriesFromDirections();
        }
    }

    createQueriesFromDirections ( directions = [ 'Up', 'Down', 'Only' ] ) {
        Object.keys( this.ranges ).forEach( rangeName => {
            directions.forEach( direction => {
                this.createQuery( rangeName, direction );
            } );
        } );

        this.findMatches();
    }

    createQueries ( queryNames ) {
        let rangeName, direction, match;
        let rangeNames = Object.keys( this.ranges );

        queryNames.forEach( queryName => {
            match = queryName.match( /^(.+)(Up|Down|Only)$/ );

            if ( !match ) {
                throw new Error( 'Incorrectly formed query name: ' + queryName );
            }

            rangeName = match[ 1 ];
            direction = match[ 2 ];

            if ( !rangeNames.includes( rangeName ) ) {
                throw new Error( 'No current range with name: ' + rangeName + ', from queryName: ' + queryName );
            }

            this.createQuery( rangeName, direction );
        } );

        this.findMatches();
    }

    createQuery ( rangeName, direction ) {
        const query = this[ 'getQuery' + direction ]( rangeName );

        if ( query ) {
            query.addListener( this.onQueryChange.bind( this ) );
        }
    }

    findMatches () {
        this.matchingQueryNames = Object.keys( this.queries ).filter( queryName => this.queries[ queryName ].matches );
    }

    matches ( queryName ) {
        if ( !this.queryNames.includes( queryName ) ) {
            throw new Error( 'Attempt to test for query name which isn\'t registered: ' + queryName );
        }

        return this.matchingQueryNames.includes( queryName );
    }

    parseObjectWithMatches ( obj ) {
        // http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order/38218582#38218582
        // getOwnPropertyNames maintains insertion order providing no key is an integer (which it isn't)
        return Object.getOwnPropertyNames( obj ).reduce( ( acc, queryName ) => {
            if ( this.matches( queryName ) ) {
                return Object.assign( acc, obj[ queryName ] );
            }

            return acc;
        }, {} );
    }

    addListener ( cb, scope = window ) {
        this.listeners.push( {
            cb,
            scope
        } );
    }

    removeListener ( cb, scope = window ) {
        const index = this.listeners.findIndex( obj => obj.cb === cb && obj.scope === scope );

        if ( index > -1 ) {
            this.listeners.splice( index, 1 );
        }
    }

    callListeners ( matchingQueryNames ) {
        const listeners = this.listeners.slice();

        listeners.forEach( listener => {
            listener.cb.call( listener.scope, matchingQueryNames );
        } );
    }

    // TODO: debounce?
    onQueryChange ( q ) {
        this.findMatches();
        this.callListeners( this.matchingQueryNames );
    }

    cacheQuery ( key, mediaQueryString ) {
        if ( !this.queries.hasOwnProperty( key ) ) {
            this.queryNames.push( key );
            this.queries[ key ] = window.matchMedia( mediaQueryString );
        }

        return this.queries[ key ];
    }

    getQueryUp ( range ) {
        const key = range + 'Up';
        return this.cacheQuery( key, `only screen and (min-width:${ this.ranges[ range ][ 0 ] }px)` );
    }

    getQueryDown ( range ) {
        const key = range + 'Down';
        const bound = this.ranges[ range ][ 1 ];

        if ( bound === 0 ) {
            return false;
        }

        return this.cacheQuery( key, `only screen and (max-width:${ bound }px)` );
    }

    getQueryOnly ( range ) {
        const key = range + 'Only';
        const bounds = this.ranges[ range ];

        if ( bounds[ 1 ] === 0 ) {
            return false;
        }

        return this.cacheQuery( key, `only screen and (min-width:${ bounds[ 0 ] }px) and (max-width:${ bounds[ 1 ] }px)` );
    }
}
