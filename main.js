import * as THREE from 'three'; 
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
const renderer = new THREE.WebGLRenderer(); renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild(renderer.domElement);

//creating a path
const geometry = new THREE.PlaneGeometry(5,50);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const path = new THREE.Mesh(geometry, material);
path.rotation.x = -Math.PI / 2;
scene.add(path); 

//creating a character I will use a cube a placeholder
const characterGeometry = new THREE.BoxGeometry(1, 1, 1);
const characterMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const character = new THREE.Mesh(characterGeometry, characterMaterial);
character.position.set(0, 0.5, 0);
scene.add(character);

// Creating an obstacle (a red cube)
const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1); // Obstacle is also a cube
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for the obstacle
const obstacles = []; // Array to hold multiple obstacles

// Define obstacle positions
const obstaclePositions = [
    { x: 0, z: 10 },
    { x: 2, z: 20 },
    { x: -2, z: 30 },
    { x: 1, z: 40 }
];

// Create obstacles based on the positions
obstaclePositions.forEach(pos => {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(pos.x, 0.5, pos.z);
    obstacles.push(obstacle);
    scene.add(obstacle);
});
//camera position
camera.position.set(0, 5, 10);//behind the runner
camera.lookAt(character.position);//make the camera look at the charecter

//I added arrow keys to move the character  
let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveLeft = true;
    } else if (event.key === 'ArrowRight') {
        moveRight = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight') {
        moveRight = false;
    }
});

const gameOverMessage = document.getElementById('gameOverMessage');
//reset the game 
function resetGame() {
    character.position.set(0, 0.5, 0); // Reset character position

    // Reset all obstacle positions
    obstacles.forEach((obstacle, index) => {
        const pos = obstaclePositions[index];
        obstacle.position.set(pos.x, 0.5, pos.z);
    });

    gameOverMessage.style.display = 'none'; // Hide the game over message
}

if ( WebGL.isWebGL2Available() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

function animate() { 
    renderer.render( scene, camera ); 
    
    //move the character forward
    character.position.z += 0.1;//move the character forward

    // Move the path backward to simulate running
    path.position.z = character.position.z - 20; // Path follows the character's position

    //camera should keep track of the character at all times
    camera.position.z = character.position.z + 10;
    camera.lookAt(character.position);//camera focus on the runner at all times
    
    const characterBox = new THREE.Box3().setFromObject(character);
    // Check for collision with each obstacle
            for (let i = 0; i < obstacles.length; i++) {
                const obstacleBox = new THREE.Box3().setFromObject(obstacles[i]);
                if (characterBox.intersectsBox(obstacleBox)) {
                    console.log("Collision detected with obstacle " + i + "! Game Over.");
                    gameOverMessage.style.display = 'block'; // Show the game over message
                    setTimeout(resetGame, 2000); // Reset the game after 2 seconds
                    return; // Stop further execution for this frame
                }
            }

    // Move the character left or right based on the key pressed
    if (moveLeft && character.position.x > -2) {
        character.position.x -= 0.1; // Move left
    }
    if (moveRight && character.position.x < 2) {
        character.position.x += 0.1; // Move right
    }
    renderer.setAnimationLoop( animate );
} 



