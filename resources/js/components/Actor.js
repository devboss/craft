import { Vector3 } from '../utils/Vector3';

export default class Actor {

    constructor ( position, mass, velocityDamping ) {
        this.position = position.clone();
        this.velocity = new Vector3();
        this.acceleration = new Vector3();

        this.mass = mass;
        this.velocityDamping = velocityDamping;
    }

    setPosition ( position ) {
        this.position.copy( position );
    }

    applyForce ( force ) {
        this.acceleration.add( force.clone().divideScalar( this.mass ) );
    }
    
    update () {
        this.velocity.add( this.acceleration );
        this.velocity.multiplyScalar( this.velocityDamping );
        this.position.add( this.velocity );
        this.acceleration.multiplyScalar( 0 );
    }
}
