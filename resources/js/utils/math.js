export function clamp ( value, min, max ) {
    return Math.min( Math.max( value, min ), max );
}

export function map ( val, sMin, sMax, dMin, dMax ) {
    return ( ( val - sMin ) / ( sMax - sMin ) ) * ( dMax - dMin ) + dMin;
}

export function lerp ( min, max, k ) {
    return min + ( max - min ) * k;
}

export function getRandomArbitrary ( min, max ) {
    return Math.random() * ( max - min ) + min;
}

export function getRandomRange ( base, range ) {
    return base + getRandomArbitrary( -1, 1 ) * range;
}

export function degToRad ( deg ) {
    return deg * Math.PI / 180;
}
