$(function() {

	var banner = [
		"### ###                              %%%  %%%%      %%  %%  ",
		" #   #                                %  %    %    %      % ",
		" #   #   ####   ## #  ###    ####     %  %         %      % ",
		" #   #  #    # #  ##     #  #         %   %%%%    %        %",
		" #   #  ###### #  ##  ####   ###      %       %    %      % ",
		"  # #   #       ## # #   #      #     %  %    %    %      % ",
		"   #     #####     #  ### # ####  %   %   %%%%      %%  %%  ",
		"               ####                %%%                      "
	];

	var NUM_STARS = 200,
		STAR_SIZE = 3,
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
		ship_loaded = false,
		ship_images = [],
		ship_files = [ 'images/ship-1.png', 'images/ship-2.png', 'images/ship-3.png',
			'images/ship-4.png', 'images/ship-5.png' ],
		ship_frame = 0,
		ship_x = 0;

	var sounds = jsfxlib.createWaves({
		explosion: ["noise",0.0000,0.4000,0.0000,0.2460,0.6750,0.4840,20.0000,831.0000,2400.0000,
			-0.2220,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.3016,0.0000,
			0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
		laser: ["saw",0.0000,0.4000,0.0000,0.0540,0.0000,0.1420,20.0000,797.0000,2400.0000,
			-0.4340,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,
			0.0000,0.0000,1.0000,0.0000,0.0000,0.2480,0.0000]
	});

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
				var banner_x = banner_pixels[j].x + BANNER_X_OFFSET + banner_pixels[j].sin_offset,
						banner_y = banner_pixels[j].y + BANNER_Y_OFFSET + banner_pixels[j].sin_offset;
				if ( bullets[i].y <= banner_y &&
					 bullets[i].x >  banner_x &&
					 bullets[i].x < banner_x + PIXEL_SIZE ) {
					bullets.splice(i,1);
					createExplosion( banner_x + PIXEL_SIZE/2, banner_y + PIXEL_SIZE/2 );
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
		sounds.explosion.cloneNode(true).play();
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
		updateShipAnimation();
		updateCanvas();
	}

	function createStars() {
		for (var i=0;i<NUM_STARS;i++) {
			stars.push(randomStar());
		}
	}

	function updateShipPosition(e) {
		ship_x = e.clientX - 32;
	}

	function updateShipAnimation() {
		ship_frame++;
		if (ship_frame >= ship_images.length)
			ship_frame = 0;
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
			ctx.fillRect(
				BANNER_X_OFFSET + banner_pixels[i].sin_offset + banner_pixels[i].x,
				BANNER_Y_OFFSET + banner_pixels[i].sin_offset + banner_pixels[i].y,
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
  		if ( ship_loaded )
  			ctx.drawImage(ship_images[ship_frame], ship_x, canvas.height - 85, 64, 64 );
	}

	function shoot(e) {

    // Don't Shoot links!
    if (e.target.tagName === 'A') return false;

		sounds.laser.cloneNode(true).play();
		bullets.push({
			x: e.clientX - LASER_WIDTH/2,
			y: canvas.height - 80
		});
	}

	function updateBanner() {
		for (i in banner_pixels) {
			banner_pixels[i].sin_offset = Math.sin( ticks/12 + banner_pixels[i].x*13 ) * 3;
		}
	}

	function pixelizeBanner() {
  		for (y in banner) {
  			for (x in banner[y] ) {
  				if ( banner[y][x] != ' ' ) {
  					banner_pixels.push({
  						x: x * PIXEL_SPACE,
  						y: y * PIXEL_SPACE,
  						color: banner[y][x],
  						sin_offset: 0
  					});
  				}
  			}
  		}
	}

	function loadShip() {
		var frame_count = ship_files.length,
			frames_loaded = 0;
		for ( i in ship_files ) {
			var frame = new Image();
			frame.src = ship_files[ i ];
			frame.onload = function() {
				if (++frames_loaded == frame_count) {
					ship_loaded = true;
				}
			}
			ship_images.push( frame );
		}
	}

	function init() {
		resizeCanvas();
		loadShip();
		createStars();
		pixelizeBanner();
		updateCanvas();
	}
	init();

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousemove', updateShipPosition, false);
	window.addEventListener('click', shoot, false);

	setInterval(tick, 25);

	// Prevent double click selection except for in dialog
	$(window).on('mousedown', function(e) {
		if ( !$(e.target).is('.dialog') ) {
			e.preventDefault();
			return false;
		}
	});

});
