//Game constants
const walk = 200;
const arrowSpeed = 400;

//Initial score is zero
let score;
let vArrow;

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
    sprites[0].image = "🧍🏻‍♂️";
    sprites[0].x = 15;
    sprites[0].y = 0;

    sprites[1].image = "";
    sprites[1].x = 3;
    sprites[1].y = 35;

    sprites[2].image = "🔫";
    sprites[2].x = 40;
    sprites[2].y = 20;
    sprites[2].color = "#8E562E";

    sprites[3].image = "";
    sprites[3].x = -100;
    sprites[3].y = -100;

    sprites[4].image = "👻";
    sprites[4].x = 500;
    sprites[4].y = 300;

    vArrow = false;
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

    //The hunter is made of three sprites
    const hunter = sprites[0];
    const head = sprites[1];
    const bow = sprites[2];

    const arrow = sprites[3];

    const ghost = sprites[4];

    //Move Hunter
    if (up) {
        hunter.y += walk * dt;
    } if (down) {
        hunter.y -= walk * dt;
    }
    if (right) {
        hunter.x += walk * dt;
        bow.flipH = false;
    }
    if (left) {
        hunter.x -= walk * dt;
        bow.flipH = true;
    }
    //The head follows the body...
    head.x = hunter.x - 12;
    head.y = hunter.y + 35;
    //And bobs up and down
    head.y += 2 * Math.sin((left||right?9:3) * t);

    //The bow also follows the body, but flipHs to one
    //side or the other
    bow.y = hunter.y + 15;
    if (bow.flipH) {
        bow.x = hunter.x - 20;
    } else {
        bow.x = hunter.x + 40;
    }

    //If the arrow is not moving...
    if (vArrow == 0) {
        //It follows the hunter like the bow
        arrow.y = hunter.y + 10;
        if (bow.flipH) {
            arrow.x = hunter.x - 40;
            arrow.flipH = true;
        } else {
            arrow.x = hunter.x + 30;
            arrow.flipH = false;
        }
    } else {
        //If the arrow is moving, change it's z position
        arrow.x += dt * vArrow;
        arrow.flipH = vArrow < 0;
        //And stop it when it goes off screen
        if (arrow.x < -100 || arrow.x > 900)
            vArrow = 0;
    }

    //While the space bar is pressed...
    if (space) {
        //draw the bow
        if (bow.flipH)
            arrow.x = hunter.x - 30;
        else
            arrow.x = hunter.x + 20;
        arrow.y = hunter.y + 10;
        //Set arrow velocity to +/- based on direction
        vArrow = bow.flipH ? -arrowSpeed : arrowSpeed;
        //Note while this sets the velocity each frame,
        //the position keeps getting reset until you
        //release the arrow
    }

    if (ghost.image == "🥩") {
        //If the buck is meat...
        if (distance(hunter, ghost) < 50) {
            //When the hunter touches the meat, give points..
            score++;
            //And make it back into a deer
            ghost.image = "🦌";
            ghost.x = 780 * Math.random();
            ghost.y = 470 * Math.random();
        }
    } else {
        //It's still a deer, so check to see if arrow
        //hit it.
        //If space is not held, and the arrow is moving,
        //and the distaice is small
        if (!space && vArrow && distance(arrow, ghost) < 20) {
            score++; 
            vArrow = 0;
            ghost.image = "🥩";
        }
    }

    return score;
};

export default {
    name: "Ghost Buster",
    instructions: "<b>Shoot 👻, eat 🥩!</b><br>Arrow keys to move.<br>Space to shoot an arrow.",
    icon: "👻",
    background: {
        "background-color": "green"
    },
    frame,
    setup,
};