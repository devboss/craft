const classRegistry = {

    registry: {},

    registerClass ( name, ClassRef ) {
        if ( this.registry.hasOwnProperty( name ) ) {
            throw new Error( 'Attempt to register Class against existing name: ' + name );
        }

        this.registry[ name ] = ClassRef;
    },

    /**
     * @param {string} name
     * @returns {Object}
     */
    getClass ( name ) {
        const ClassRef = this.registry[ name ] || false;

        if ( !ClassRef ) {
            throw new Error( 'No Class registered with name ' + name );
        }

        return ClassRef;
    }
};

export default classRegistry;
