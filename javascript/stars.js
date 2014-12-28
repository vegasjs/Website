$(function() {

	var banner = [
		"### ###                              %%%  %%%%      %%  %%   ",
		" #   #                                %  %    %    %      %  ",
		" #   #   ####   ## #  ###    ####     %  %         %      %  ",
		" #   #  #    # #  ##     #  #         %   %%%%    %        % ",
		" #   #  ###### #  ##  ####   ###      %       %    %      %  ",
		"  # #   #       ## # #   #      #     %  %    %    %      %  ",
		"   #     #####     #  ### # ####  %   %   %%%%      %%  %%   ",
		"               ####                %%%                       "
	];

	var NUM_STARS = 200,
		STAR_SIZE = 4,
		ticks = 0,
		PIXEL_SIZE = 10,
		PIXEL_SPACE = 13,
		BANNER_X_OFFSET = 0,
		BANNER_Y_OFFSET = 50,
		BULLET_SPEED = 15,
		LASER_WIDTH=5,
		stars = [],
		bullets = [],
		banner_pixels = [],
		debris = [],
		ship = new Image(),
		ship_x = 0;

	var canvas = document.getElementById('starfield'),
		ctx = canvas.getContext('2d');

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
			speed: (Math.random() * 5) + 2,
			color: randomColor(),
			blink: Math.ceil( Math.random() * 5),
			on: Math.random() > 0.5 ? true : false
		}		
	}

	function updateBullets() {
		var i = bullets.length;
		BULLETS: while (i--) {
			bullets[i].y -= BULLET_SPEED;
			if (bullets[i].y < -20) {
				bullets.splice(i,1);
				continue;
			}
			var j = banner_pixels.length;
			while (j--) {
				if ( bullets[i].y <= banner_pixels[j].y + banner_pixels[j].sin_offset &&
					 bullets[i].x > banner_pixels[j].x && 
					 bullets[i].x < banner_pixels[j].x + PIXEL_SIZE ) {
					bullets.splice(i,1);
					createExplosion( banner_pixels[j].x + PIXEL_SIZE/2, 
						banner_pixels[j].sin_offset + banner_pixels[j].y + PIXEL_SIZE/2 );
					banner_pixels.splice(j,1);
					continue BULLETS;
				}
			}
		}
	}

	function updateStars() {
		for (i in stars) {
			stars[i].y += stars[i].speed;
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

	function createExplosion(x,y) {
		var bits = 20 + Math.ceil( Math.random() * 10);
		while(bits--) {
			debris.push({
				x: x,
				y: y,
				speed: Math.random() * 10,
				angle: Math.ceil( Math.random() * 360 ),
				life: Math.ceil( Math.random() * 10 )
			});
		}
	}

	function updateDebris() {
		var i = debris.length;
		while(i--) {
			// Get rid of old debris
			if ( debris[i].life-- < 0 ) {
				debris.splice(i,1);
				continue;
			}
			debris[i].x += debris[i].speed * Math.cos( debris[i].angle );
			debris[i].y += debris[i].speed * Math.sin( debris[i].angle );
		}
	}

	function tick() {
		ticks++;
		updateStars();
		updateBanner();
		updateBullets();
		updateDebris();
		updateCanvas();
	}

	function createStars() {
		for (var i=0;i<NUM_STARS;i++) {
			stars.push(randomStar());
		}
	}

	function updateShip(e) {
		ship_x = e.clientX - 32;
	}

	function updateCanvas() {
		// Clear
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
  		for (i in banner_pixels ) {
			ctx.fillStyle = banner_pixels[i].color == '%' ? randomColor() : "#FFF";
			ctx.fillRect( banner_pixels[i].x, banner_pixels[i].sin_offset + banner_pixels[i].y, 
				PIXEL_SIZE, PIXEL_SIZE );	
  		}

  		// Draw Debris
  		for (i in debris) {
  			ctx.fillStyle = ticks % 2 == 0 ? "#F00" : "#FF0";
  			ctx.fillRect( 
  				debris[i].x, 
  				debris[i].y, 
  				1 + (Math.random() * 6), 
  				1 + (Math.random() * 6)
			);
  		}

  		// Draw Bullets
  		for (i in bullets) {
  			ctx.fillStyle = ticks % 2 == 0 ? "#F0F" : "#0FF";
  			ctx.fillRect( bullets[i].x, bullets[i].y, LASER_WIDTH, 10 );
  		}

  		// Draw Ship
  		ctx.drawImage(ship, ship_x, canvas.height - 80, 64, 64 );
	}

	function shoot(e) {
		bullets.push({
			x: e.clientX - LASER_WIDTH/2,
			y: canvas.height - 80
		});
	}

	function updateBanner() {
		for (i in banner_pixels) {
			banner_pixels[i].sin_offset = Math.sin( ticks/15 + banner_pixels[i].x*13 ) * 3;	
		}
	}

	function pixelizeBanner() {
  		for (y in banner) {
  			for (x in banner[y] ) {
  				if ( banner[y][x] != ' ' ) {
  					banner_pixels.push({
  						x: BANNER_X_OFFSET + (x * PIXEL_SPACE),
  						y: BANNER_Y_OFFSET + (y * PIXEL_SPACE),
  						color: banner[y][x],
  						sin_offset: 0
  					});
  				}
  			}
  		}
	}

	function init() {
		resizeCanvas();

		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

		createStars();
		pixelizeBanner();
		updateCanvas();
		ship.src = "images/ship.gif"
	}
	init();

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousemove', updateShip, false);
	window.addEventListener('click', shoot, false);

	setInterval(tick, 25);

});