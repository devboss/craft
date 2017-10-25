import breakpointRanges from './breakpointRanges';

window.lazySizesConfig.customMedia = {
    '--small': `(max-width: ${ breakpointRanges.small[ 1 ] }px)`,
    '--medium': `(max-width: ${ breakpointRanges.medium[ 1 ] }px)`,
    '--large': `(max-width: ${ breakpointRanges.large[ 1 ] }px)`,
    '--xlarge': `(max-width: ${ breakpointRanges.xlarge[ 1 ] }px)`
};
