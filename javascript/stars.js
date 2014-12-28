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
		BULLET_VELOCITY = 15,
		LASER_WIDTH=5,
		stars = [],
		bullets = [],
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
			velocity: (Math.random() * 5) + 2,
			color: randomColor(),
			blink: Math.ceil( Math.random() * 5),
			on: Math.random() > 0.5 ? true : false
		}		
	}

	function updateBullets() {
		var i = bullets.length;
		while (i--) {
			bullets[i].y -= BULLET_VELOCITY;
			if (bullets[i].y < -20) {
				bullets.splice(i,1);
			}
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
		updateBullets();
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
  		for (y in banner) {
  			for (x in banner[y] ) {
  				if ( banner[y][x] != ' ' ) {
  					ctx.fillStyle = banner[y][x] == '%' ? randomColor() : "#FFF";
  					var sinoffset = Math.sin( ticks/15 + x*13 ) * 3;
						ctx.fillRect( 
	  					BANNER_X_OFFSET + (x * PIXEL_SPACE), 
	  					sinoffset + BANNER_Y_OFFSET + (y * PIXEL_SPACE), 
	  					PIXEL_SIZE, PIXEL_SIZE
	  				);				
  				}
  			}
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

	function init() {
		resizeCanvas();

		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

		createStars();
		updateCanvas();
		ship.src = "images/ship.gif"
	}
	init();

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousemove', updateShip, false);
	window.addEventListener('click', shoot, false);

	setInterval(tick, 25);

});