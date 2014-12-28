$(function() {

	var banner = [
"### ###                              ###  ####      ##  ##   ",
" #   #                                #  #    #    #      #  ",
" #   #   ####   ## #  ###    ####     #  #         #      #  ",
" #   #  #    # #  ##     #  #         #   ####    #        # ",
" #   #  ###### #  ##  ####   ###      #       #    #      #  ",
"  # #   #       ## # #   #      #     #  #    #    #      #  ",
"   #     #####     #  ### # ####  #   #   ####      ##  ##   ",
"               ####                ###                       "
];

	var NUM_STARS = 200,
		STAR_SIZE = 4,
		ticks = 0,
		PIXEL_SIZE = 10,
		PIXEL_SPACE = 13,
		BANNER_X_OFFSET = 0,
		stars = [];

	var canvas = document.getElementById('starfield');

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		BANNER_X_OFFSET = canvas.width / 2 - (banner[0].length * PIXEL_SPACE) / 2;
	}

	function randomColor() {
		return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	}	

	function randomStar() {
		return {
			x: Math.ceil(Math.random() * canvas.width),
			y: Math.ceil(Math.random() * canvas.height),
			velocity: (Math.random() * 5) + 2,
			color: randomColor(),
			blink: Math.ceil( Math.random() * 5),
			on: Math.random() > 0.5 ? true : false
		}		
	}

	function updateStars() {
		for (i in stars) {
			stars[i].y += stars[i].velocity;
			if (stars[i].y > canvas.height) {
				stars[i] = randomStar();
				stars[i].y = 0 - Math.random() * 50;
			}
			if ( stars[i].blink < 4 ) {
				stars[i].on = true;
			} else if (ticks % stars[i].blink == 0) {
				stars[i].on = !stars[i].on; 
			}
		}
	}

	function tick() {
		ticks++;
		updateStars();
		updateCanvas();
	}

	function createStars() {
		for (var i=0;i<NUM_STARS;i++) {
			stars.push(randomStar());
		}
	}

	function updateCanvas() {
		// Clear
		var ctx = canvas.getContext('2d');
  		ctx.fillStyle = "#000";
  		ctx.fillRect(0, 0, canvas.width, canvas.height);

  		// Draw Stars
  		for (i in stars) {
  			if ( stars[i].on ) {
	  			ctx.fillStyle = stars[i].color;
	  			ctx.fillRect( stars[i].x, stars[i].y, STAR_SIZE, STAR_SIZE );
  			}
  		}

  		// Draw Banner
  		for (y in banner) {
  			for (x in banner[y] ) {
  				if ( banner[y][x] == '#' ) {
  					var size = 6 + Math.ceil(Math.random() * 7);
  					var offset = (PIXEL_SPACE/2) - (size/2);
  					ctx.fillStyle = randomColor();
	  				ctx.fillRect( 
	  					offset + BANNER_X_OFFSET + (x * PIXEL_SPACE), 
	  					offset + 100 + (y * PIXEL_SPACE), 
	  					size, size 
	  				);	
  				}
  			}
  		}
	}

	function init() {
		resizeCanvas();
		createStars();
		updateCanvas();
	}
	init();

	window.addEventListener('resize', resizeCanvas, false);

	setInterval(tick, 25);

});