//Game constants
const walk = 200;
const blastSpeed = 400;

//Initial score is zero
let score;
let vBlast;

//This is a helper function to compute the distance
//between two sprites
function distance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//This setup function is called once
//So you can set everything up.
function setup(sprites) {
    //Set up the sprites
    sprites[0].image = "🧑🏼‍🏭";
    sprites[0].x = 15;
    sprites[0].y = 0;

    sprites[1].image = "";
    sprites[1].x = 500;
    sprites[1].y = 300;

    sprites[2].image = "";
    sprites[2].x = 300;
    sprites[2].y = 100;
    
    sprites[3].image = "💥";
    sprites[3].x = 500;
    sprites[3].y = 300;

    sprites[4].image = "👻";
    sprites[4].x = 400;
    sprites[4].y = 200;

    vBlast = false;
    score = 0;
}



/**
 * Game function called every frame
 * @param sprites   Array of sprite objects
 * @param t         Time since start of game
 * @param dt        Time since last frame
 * @param up        Is up pressed?
 * @param down      "
 * @param left      "
 * @param right     "
 * @param space     "
 * @returns The current score
 */
function frame(sprites, t, dt, up, down, left, right, space) {
    //Keep references to the sprites in some variables with
    //better names:

    //The buster is made of one sprite
    const buster = sprites[0];

    const head = sprites[1];
    const gun = sprites[2];
    const blast = sprites[3];
    const ghost = sprites[4];

    //Move Buster
    if (up) {
        buster.y += walk * dt;
    } if (down) {
        buster.y -= walk * dt;
    }
    if (right) {
        buster.x += walk * dt;
        gun.flipH = false;
    }
    if (left) {
        buster.x -= walk * dt;
        gun.flipH = true;
    }
    //The head follows the body...
    //head.x = hunter.x - 12;
    //head.y = hunter.y + 35;
    //And bobs up and down
    //head.y += 2 * Math.sin((left||right?9:3) * t);

    //The bow also follows the body, but flipHs to one
    //side or the other
    gun.y = buster.y + 15;
    if (gun.flipH) {
        gun.x = buster.x - 20;
    } else {
        gun.x = buster.x + 40;
    }

    //If the arrow is not moving...
    if (vBlast == 0) {
        //It follows the hunter like the bow
        blast.y = buster.y + 10;
        if (gun.flipH) {
            blast.x = buster.x - 40;
            blast.flipH = true;
        } else {
            blast.x = buster.x + 30;
            blast.flipH = false;
        }
    } else {
        //If the arrow is moving, change it's z position
            blast.x += dt * vBlast;
            blast.flipH = vBlast < 0;
        //And stop it when it goes off screen
        if (blast.x < -100 || blast.x > 900)
            vBlast = 0;
    }

    //While the space bar is pressed...
    if (space) {
        //draw the bow
        if (gun.flipH)
            blast.x = buster.x - 30;
        else
            blast.x = buster.x + 20;
        blast.y = buster.y + 10;
        //Set arrow velocity to +/- based on direction
        vBlast = gun.flipH ? -blastSpeed : blastSpeed;
        //Note while this sets the velocity each frame,
        //the position keeps getting reset until you
        //release the arrow
    }

    if (ghost.image == "💰") {
        //If the buck is meat...
        if (distance(buster, ghost) < 50) {
            //When the hunter touches the meat, give points..
            score++;
            //And make it back into a deer
            ghost.image = "👻";
            ghost.x = 780 * Math.random();
            ghost.y = 470 * Math.random();
        }
    } else {
        //It's still a deer, so check to see if arrow
        //hit it.
        //If space is not held, and the arrow is moving,
        //and the distaice is small
        if (!space && vBlast && distance(blast, ghost) < 20) {
            score++; 
            vBlast = 0;
            ghost.image = "💰";
        }
    }

    return score;
};



export default {
    name: "Ghost Buster",
    instructions: "<b>Shoot 👻, collect 💰!</b><br>Arrow keys to move.<br>Space to shoot a blast.",
    icon: "👻",
    background: {
        "background-color": "purple"
    },
    frame,
    setup,
};