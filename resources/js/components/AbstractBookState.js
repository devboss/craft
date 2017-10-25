import AbstractState from './AbstractState';

export default class AbstractBookState extends AbstractState {

    constructor ( context, bookName ) {
        super( context );

        this.name = bookName;
    }

    close () {
        window.location.hash = '';
    }

    setPageByIndex ( nextPageIndex ) {
        const page = this.context
            .stateGet( [ 'books', this.name, 'pages' ] )
            .find( page => page.get( 'pageIndex' ) === nextPageIndex );

        const pageName = page ? '/' + page.get( 'name' ) : '';

        window.location.hash = `#/books/${ this.name }${ pageName }`;
    }
}
