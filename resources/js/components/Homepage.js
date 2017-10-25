import $ from 'jquery';
import AbstractComponent from './AbstractComponent';
import counter from '../utils/counter';
import lazySizes from 'lazysizes';

export default class Homepage extends AbstractComponent {

    constructor ( ...args ) {
        super( ...args );

        this.properties = {
            smallUp: {
                fitWidth: true,
                menuHeight: 80,
                auraLeftPerc: 0,
                auraTopPerc: 0,
                auraWidthPerc: 1,
                auraAspect: 375 / 344,
                backgroundAspect: 375 / 671
            },
            largeUp: {
                fitWidth: false,
                menuHeight: 0,
                auraLeftPerc: 1835 / 4820,
                auraTopPerc: 298 / 1536,
                auraWidthPerc: 1094 / 4820,
                auraAspect: 547 / 367,
                backgroundAspect: 2410 / 768
            }
        };

        this.$container = this.$element.find( '.homepage__container' );

        this.$auraPicture = this.$element.find( '.homepage__aurora' );
        this.$homepageSnow = this.$element.find( '.homepage__snow' );

        this.$aura = $()
            .add( this.$auraPicture )
            .add( this.$homepageSnow );

        this.mediaQueryManager.addListener( this.onBreakpointChanged.bind( this ) );
        this.onBreakpointChanged();
    }
    
    onBreakpointChanged () {
        this.currentProperties = this.mediaQueryManager.parseObjectWithMatches( this.properties );
        this.onResize();
    }

    onResize () {
        const props = this.currentProperties;
        const containerTop = props.menuHeight;

        let containerHeight, containerWidth;

        if ( props.fitWidth ) {
            containerWidth = window.innerWidth;
            containerHeight = containerWidth / props.backgroundAspect;
        }
        else {
            containerHeight = window.innerHeight - containerTop;
            containerWidth = props.backgroundAspect * containerHeight;

            if ( containerWidth < window.innerWidth ) {
                containerWidth = window.innerWidth;
                containerHeight = containerWidth / props.backgroundAspect;
            }
        }

        const containerLeft = ( window.innerWidth - containerWidth ) * 0.5;

        const auraLeft = props.auraLeftPerc * containerWidth;
        const auraTop = props.auraTopPerc * containerHeight;
        const auraWidth = props.auraWidthPerc * containerWidth;
        const auraHeight = auraWidth / props.auraAspect;

        // as .homepage__container is relative, using top messes up scrolling, so add as marginTop to .homepage
        this.$element.css( {
            marginTop: containerTop
        } );

        this.$container.css( {
            left: containerLeft,
            width: containerWidth,
            height: containerHeight
        } );

        this.$aura.css( {
            left: auraLeft,
            top: auraTop,
            width: auraWidth,
            height: auraHeight
        } );

        super.onResize();
    }
}
