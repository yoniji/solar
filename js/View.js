var MASK_PATH_FLAT_LEFT = [{"x":2, "y":136, "tick":0},
			{"x":143, "y":253, "tick":24},
			{"x":376, "y":116, "tick":24},
			{"x":385, "y":195, "tick":12}
		],
MASK_PATH_FLAT_RIGHT = [{"x":262, "y":2, "tick":0},
			{"x":390, "y":108, "tick":24},
			{"x":377, "y":116, "tick":12},
			{"x":385, "y":195, "tick":12}
		],
MASK_PATH_DESCENDENT_LEFT = [{"x":2, "y":189, "tick":0},
			{"x":64, "y":310, "tick":24},
			{"x":276, "y":175, "tick":24},
			{"x":282, "y":201, "tick":12}
		],
MASK_PATH_DESCENDENT_RIGHT = [{"x":231, "y":9, "tick":0},
			{"x":305, "y":157, "tick":24},
			{"x":283, "y":170, "tick":12},
			{"x":282, "y":201, "tick":12}
		],
MASK_PATH_DOUBLE_LEFT = [{"x":2, "y":101, "tick":0},
			{"x":102, "y":293, "tick":24},
			{"x":289, "y":168, "tick":24},
			{"x":295, "y":190, "tick":12}
		],
MASK_PATH_DOUBLE_RIGHT = [{"x":252, "y":1, "tick":0},
			{"x":330, "y":143, "tick":24},
			{"x":290, "y":168, "tick":12},
			{"x":295, "y":190, "tick":12}
		];
var TileMapView = function(tileMapModel)
{
	this.model = tileMapModel;
	this.isDIY = true;
	
	this.tileMapBmp = null;
	
	this.tileMapPixelWidth = 0;
	this.tileMapPixelHeight = 0;
	
	this.tilePixelWidth = 0;
	this.tilePixelHeight = 0;
	
	this.angleX = 0;
	this.angleY = 0;
	
	this.startX = 0;
	this.startY = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	
	
	this.tokenViews = [];
	
	//layer1 is for token grid
	this.tokenLayer1;
	//layer2 is for solar panel,window...
	this.tokenLayer2;
	
	
	this.sunLayer;
	this.wireLayer;
	
	this.sun = null;
	this.sunshine = null;
	this.sunshineMask = null;
	
	this.wire = null;
	this.wireMask = null;
	
	this.wireMaskPoints = [];
	this.wireMaskTickCount = 0;
	this.wireMaskTotalTickCount = 0;
	this.wireMaskCurrentPoint = {};
	this.wireMaskMoveStep = {};
	
	this.switch = null;
	

};

TileMapView.prototype = {
	init : function()
	{	
		this._drawTileMap();
		
		//create token layer
		this.tokenLayer1 = new createjs.Container();
		this.tokenLayer2 = new createjs.Container();
		this.sunLayer = new createjs.Container();
		this.wireLayer = new createjs.Container();
		
		g_stage.addChild(this.tokenLayer1);
		g_stage.addChild(this.tokenLayer2);
		g_stage.addChild(this.sunLayer);
		g_stage.addChild(this.wireLayer);
		
		//calculate pixel width and height of one tile
		this.tilePixelWidth = Math.floor(this.tileMapPixelWidth / this.model.columnCount);
		this.tilePixelHeight = Math.round(this.tilePixelWidth * 1.6);
		
		
		this.offsetY = ( this.tileMapPixelHeight - this.tilePixelHeight * this.model.rowCount ) / 2;
		this.offsetX = ( this.tileMapPixelWidth - this.tilePixelWidth * this.model.columnCount ) / 2 + 0.5 * this.offsetY;
		
		console.log('tilePixelWidth: ' + this.tilePixelWidth);
		console.log('tilePixelHeight: ' + this.tilePixelHeight);
		
		this._initSunLayer();
		this._initWireLayer();
		this._initInvertor();
		this._drawTokens();
		
	},
	_drawTileMap : function() {
		switch( this.model.type ) {
			case TILE_MAP_TYPE_DOUBLE:
			this.tileMapPixelWidth = 240;
			this.tileMapPixelHeight = 120;
			this.angleX = -30;
			this.angleY = -24;
			this.startX = 205;
			this.startY = 160;
			//create house bitmap
			this.tileMapBmp = new createjs.Bitmap(g_assets['mixed-roof'].img);
			this.tileMapBmp.setTransform(108,48,0.5,0.5);
			g_stage.addChild(this.tileMapBmp);	
			break;
			
			case TILE_MAP_TYPE_DESCENDENT:
			this.tileMapPixelWidth = 240;
			this.tileMapPixelHeight = 120;
			this.angleX = -30;
			this.angleY = -24;
			this.startX = 225;
			this.startY = 180;
			//create house bitmap
			this.tileMapBmp = new createjs.Bitmap(g_assets['pitched-roof'].img);
			console.log(g_assets['pitched-roof']);
			this.tileMapBmp.setTransform(130,60,0.5,0.5);
			g_stage.addChild(this.tileMapBmp);	
			break;
			
			default:
			this.tileMapPixelWidth = 240;
			this.tileMapPixelHeight = 144;
			this.angleX = -50;
			this.angleY = -28;
			this.startX = 195;
			this.startY = 148;
			this.tileMapBmp = new createjs.Bitmap(g_assets['flat-roof'].img);
			this.tileMapBmp.setTransform(165,27,0.5,0.5);
			g_stage.addChild(this.tileMapBmp);	

			break
		}
		
	},
	_drawTokens : function() {
		this.tokenViews = [];
		this.tokenLayer1.removeAllChildren();
		this.tokenLayer2.removeAllChildren();
		this.tokenLayer1.setTransform(this.startX  + this.offsetX, this.startY  + this.offsetY, 1, 1, 0, this.angleX, this.angleY);
		this.tokenLayer2.setTransform(0, 0);
		
		for (token in this.model.tokens) {
			this.tokenViews.push( new TokenView(this.model.tokens[token], this) );
			this.tokenViews[ this.tokenViews.length - 1 ].drawToken();
		}
		if ( this.model.hasInvertor ) {
			this.switch.alpha = 1;
		}
	},
	_initInvertor : function() {
		this.switch = new createjs.Bitmap(g_assets['invertor'].img);
		switch( this.model.type ) {
			case TILE_MAP_TYPE_DOUBLE:
			this.switch.setTransform(446 , 215, 0.5, 0.5);
			break;
			case TILE_MAP_TYPE_DESCENDENT:
			this.switch.setTransform(480 , 230, 0.5, 0.5);
			break;
			default:
			this.switch.setTransform(503 , 213, 0.5, 0.5);
			break;
		}
		if (! this.model.hasInvertor ) {
			this.switch.alpha = 0;
		}
		
		g_stage.addChild(this.switch);
	},
	_initSunLayer : function() {
		 this.sun = new createjs.Bitmap(g_assets['sun'].img);
		 this.sun.x = 550;
		 this.sun.y = 40;
		 this.sun.alpha = 0;
		  this.sunLayer.addChild(this.sun);
		 this.sunshine = new createjs.Bitmap(g_assets['sunlight'].img);
		 this.sunshine.x = 365;
		 this.sunshine.y = 65;
		 this.sunLayer.addChild(this.sunshine);
		 
		 this.sunshineMask = new createjs.Shape(
                new createjs.Graphics().beginFill("#000000")
                        .drawCircle(0, 0, 32));
         this.sunshineMask.x = 532;
         this.sunshineMask.y = 42;
         this.sunshineMask.alpha = 0;
         
         this.sunshine.mask = this.sunshineMask;
         this.sunLayer.addChild(this.sunshineMask);
	},
	_initWireLayer : function() {

		this.wireMask = new createjs.Shape();
		
		switch ( this.model.type ) {
			case TILE_MAP_TYPE_FLAT:
			this.wire = new createjs.Bitmap(g_assets['line-flat'].img);
			this.wire.setTransform(178,30,0.89,0.89);
			break;
			case TILE_MAP_TYPE_DOUBLE:
			this.wire = new createjs.Bitmap(g_assets['line-mixed'].img);
			this.wire.setTransform(188,49,0.94,0.94);
			break;
			default:
			this.wire = new createjs.Bitmap(g_assets['line-pitched'].img);
			this.wire.setTransform(242,60,0.88,0.88);
			break;
			
			
		}
		this.wire.cache(0,0, g_canvas.width, g_canvas.height);
		this.wireMask.cache(0,0, g_canvas.width, g_canvas.height);
		
		var maskFilter = new createjs.AlphaMaskFilter(this.wireMask.cacheCanvas);
		this.wire.filters = [maskFilter];
		
		var that = this;
		this.wire.addEventListener('click',function(e){
			var x = that.wire.globalToLocal(e.stageX, e.stageY);
			console.log(x);
		} );
		
		
		
		//this.wireLayer.addChild(this.wireMask);
	},
	_moveToNextMaskAnimation : function() {
		
		if (this.wireMaskPoints.length < 2) {
			createjs.Ticker.removeEventListener("tick", animationTick);
			createjs.Ticker.addEventListener("tick", tick);
			
			setTimeout(onExitDIY, 1000);
			return;
		}
				
		var currentAnimation = this.wireMaskPoints.shift();
		this.wireMaskCurrentPoint = {"x" : currentAnimation.x, "y": currentAnimation.y };
		
		this.wireMaskTickCount = 0;
		this.wireMaskTotalTickCount = this.wireMaskPoints[0].tick;

		this.wireMaskMoveStep = {"x": (this.wireMaskPoints[0].x - currentAnimation.x) / this.wireMaskTotalTickCount ,  "y": (this.wireMaskPoints[0].y - currentAnimation.y) / this.wireMaskTotalTickCount };
		

	},
	_isPanelOnLeftSide : function() {
		return this.model.isPanelOnLeftSide();	
	},
	updateAnimation : function() {
		this.wireMaskTickCount ++;

		
		this.wireMask.graphics.moveTo(this.wireMaskCurrentPoint.x, this.wireMaskCurrentPoint.y);

		this.wireMaskCurrentPoint.x = this.wireMaskCurrentPoint.x + this.wireMaskMoveStep.x;
		this.wireMaskCurrentPoint.y = this.wireMaskCurrentPoint.y + this.wireMaskMoveStep.y;
		

		this.wireMask.graphics.setStrokeStyle(15, 'round', 'round').beginStroke("#000000").lineTo(this.wireMaskCurrentPoint.x , this.wireMaskCurrentPoint.y);
		
		this.wireMask.updateCache("source-overlay");
		this.wireMask.graphics.clear();
	
		var maskFilter = new createjs.AlphaMaskFilter(this.wireMask.cacheCanvas);
		this.wire.filters = [maskFilter];
		
		this.wire.updateCache(0,0, g_canvas.width, g_canvas.height);

		if ( this.wireMaskTickCount > this.wireMaskTotalTickCount -1 ) {
			
			this._moveToNextMaskAnimation();
			
		}
	},
	showSun : function() {
		this.isDIY = false;
		createjs.Tween.get(this.sun,{loop:false})
		.to({alpha:1,x:500,y:10},2000, createjs.Ease.sineIn)
		.call(this.showSunshine, [], this);
			
	},
	showSunshine : function() {

		createjs.Tween.get(this.sunshineMask,{loop:false})
		.to({scaleX:7,scaleY:7},1000, createjs.Ease.sineIn)
		.call(this.showWire, [], this);
		
			
	},
	showWire : function() {

		createjs.Ticker.removeEventListener("tick", tick);
		createjs.Ticker.addEventListener("tick", animationTick);
		
		this.wireMask.graphics.moveTo(0,121);
		
		var isLeftSide = this._isPanelOnLeftSide();
		switch( this.model.type ) {
			case TILE_MAP_TYPE_DOUBLE:
				if ( isLeftSide > 0 ) {
					this.wireMaskPoints = MASK_PATH_DOUBLE_LEFT.slice(0);
				} else {
					this.wireMaskPoints = MASK_PATH_DOUBLE_RIGHT.slice(0);
				}
			break;
			case TILE_MAP_TYPE_DESCENDENT:
				if ( isLeftSide  > 0 ) {
					this.wireMaskPoints = MASK_PATH_DESCENDENT_LEFT.slice(0);
				} else {
					this.wireMaskPoints = MASK_PATH_DESCENDENT_RIGHT.slice(0);
				}
			break;
			default:
				if ( isLeftSide  > 0 ) {
					this.wireMaskPoints = MASK_PATH_FLAT_LEFT.slice(0);
				} else {
					this.wireMaskPoints = MASK_PATH_FLAT_RIGHT.slice(0);
				}
			
		}
		
		
			
		this._moveToNextMaskAnimation();
		
		this.wireLayer.addChild(this.wire);
		
	},
	showInvertor : function() {
		this.switch.alpha = 1;
		this.model.hasInvertor = true;
	},
	putTokenInSelection : function(type) {

		this.model.putTokenInSelection(type);
		this._drawTokens();
	}
};


var TokenView = function(tokenModel, tileMapView) {
	this.model = tokenModel;
	this.tileMapView = tileMapView;
	this.shape = null;
	this.x = 0;
	this.y = 0;
	this.baseSize = 50;
	this.width = this.tileMapView.tilePixelWidth;
	this.height = this.tileMapView.tilePixelHeight;
	this.img = "";
	
}
TokenView.prototype = {
	_drawNormalToken : function(type) {
	
		switch( type ) {
			case TOKEN_TYPE_NONE:
			this.shape.graphics.setStrokeStyle(1, 'round', 'round').beginStroke("#e98f67").beginFill("#df5e25").drawRect(0, 0, this.width, this.height);
			this.shape.setTransform(this.x, this.y);
			break;
			
			default:
			this.shape.setTransform(this.x ,this.y ,this.scale,this.scale);
			break;
		}
		
	},
	_drawSelectedToken : function(type) {
		switch( type ) {
			case TOKEN_TYPE_NONE:
			this.shape.graphics.clear().setStrokeStyle(1, 'round', 'round').beginStroke("#e98f67").beginFill("#9B3524").drawRect(0, 0, this.width, this.height);
			this.shape.setTransform(this.x, this.y);
			break;
			
			default:
			break;
		}
		
	},
	_handleClick : function(e) {
		if ( this.tileMapView.isDIY ) {
			this.model.isSelected = !this.model.isSelected;
			if ( this.model.type != TOKEN_TYPE_NONE ) {
				g_TileMapView.putTokenInSelection(TOKEN_TYPE_NONE);
			} else {			
				if ( this.model.isSelected ) {
					this._drawSelectedToken(this.model.type);
				} else {
					this._drawNormalToken(this.model.type);
				}
			}
		}
		
		
		
	},
	_calculateBitmapBaseSize : function() {
		if ( this.width < 21 ) {
			this.baseSize = 20;
			return;
		}
		if ( this.width < 33 ) {
			this.baseSize = 32;
			return;
		}
		if ( this.width > 50 ) {
			this.baseSize = 100;
			return;
		}
		
	},
	_getTokenBitmap : function(type) {
		this._calculateBitmapBaseSize();
		switch( type ) {
			case TOKEN_TYPE_SOLAR:
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.img = "token-solar-p-" + this.baseSize;
			} else {
				this.img = "token-solar-" + this.baseSize;
			}
			
			return new createjs.Bitmap(g_assets[this.img].img);
			
			case TOKEN_TYPE_HEATER:
			this.img = "token-heater-" + this.baseSize;
			return new createjs.Bitmap(g_assets[this.img].img);
			
			case TOKEN_TYPE_CHIMNEY:
			this.img = "token-chimney-" + this.baseSize;
			return new createjs.Bitmap(g_assets[this.img].img);
			
			case TOKEN_TYPE_WINDOW:
			this.img = "token-window-" + this.baseSize;
			return new createjs.Bitmap(g_assets[this.img].img);
			
			case TOKEN_TYPE_RECEIVER:
			this.img = "token-sl-" + this.baseSize;
			return new createjs.Bitmap(g_assets[this.img].img);
			
			default:
			return null;
		}
	},
	_setTokenOffset : function(type) {
		var token = this.model;
		
		this.x = token.startTile.globalX;
		this.y = token.startTile.globalY;
			
		switch( type ) {

			case TOKEN_TYPE_SOLAR:
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.x = this.x - this.width * 0.4;
				this.y = this.y - this.height * 0.7;
			}
			break;
			
			case TOKEN_TYPE_HEATER:
			this.scale = this.scale;
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.x = this.x + this.width * 0.1;
				this.y = this.y - this.height * 1.1;
			} else {
				this.x = this.x;
				this.y = this.y - this.height * 0.8;
			}
			
			
			break
			
			case TOKEN_TYPE_CHIMNEY:
			this.scale = this.scale * 0.8;
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.x = this.x + this.width * 0.6;
				this.y = this.y - this.height * 0.5;
			} else {
				this.x = this.x + this.width * 0.4;
				this.y = this.y - this.height * 0.2;
			}
			
			break;
			
			case TOKEN_TYPE_WINDOW:
			this.scale = this.scale * 0.7;
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.x = this.x + this.width * 0.5;
				this.y = this.y - this.height * 0.4;
			} else {
				this.x = this.x + this.width * 0.3;
				this.y = this.y - this.height * 0.2;
			}
			
			
			break;
			
			case TOKEN_TYPE_RECEIVER:
			this.x = this.x + this.width * 0.3;
			this.y = this.y - this.height * 0.4;
			break
		}
	},
	drawToken : function() {
		var token = this.model;
		this.x = this.width * token.startTile.column;
		this.y = this.height * token.startTile.row;	
		
		if ( token.type == TOKEN_TYPE_NONE ) {
			this.shape = new createjs.Shape();
		} else {
			this.shape = this._getTokenBitmap(token.type);
			this.scale = this.width / this.baseSize;
			
		}
		
		if ( token.type == TOKEN_TYPE_NONE ) {
			this._drawNormalToken(token.type);
			this.tileMapView.tokenLayer1.addChild( this.shape );
			var globalPoint = this.shape.localToGlobal(0 ,0 );

			this.model.startTile.globalX = globalPoint.x;
			this.model.startTile.globalY = globalPoint.y;

		} else if (token.type == TOKEN_TYPE_SOLAR) {
		
			if ( g_type == TILE_MAP_TYPE_FLAT ) {
				this.tileMapView.tokenLayer2.addChild( this.shape );
				this._setTokenOffset(token.type);
				this._drawNormalToken(token.type);
			} else {
				this._drawNormalToken(token.type);
				this.tileMapView.tokenLayer1.addChild( this.shape );
			}
			
		} else {
			this.tileMapView.tokenLayer2.addChild( this.shape );
			this._setTokenOffset(token.type);
			this._drawNormalToken(token.type);
		}
		
		
		
		this.shape.addEventListener('click',this._handleClick.bind(this) );
		
		
	}
}


function showAlertMessage(text) {
	alert(text);
}