
var TileMapView = function(tileMapModel)
{
	this.model = tileMapModel;
	
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
	this.switch = null;
	

};

TileMapView.prototype = {
	init : function()
	{	
		this._drawTileMap();
		
		//create token layer
		this.tokenLayer1 = new createjs.Container();
		this.tokenLayer2 = new createjs.Container();
		g_stage.addChild(this.tokenLayer1);
		g_stage.addChild(this.tokenLayer2);
		
		//calculate pixel width and height of one tile
		this.tilePixelWidth = Math.floor(this.tileMapPixelWidth / this.model.columnCount);
		this.tilePixelHeight = Math.round(this.tilePixelWidth * 1.6);
		
		
		this.offsetY = ( this.tileMapPixelHeight - this.tilePixelHeight * this.model.rowCount ) / 2;
		this.offsetX = ( this.tileMapPixelWidth - this.tilePixelWidth * this.model.columnCount ) / 2 + 0.5 * this.offsetY;
		
		console.log('tilePixelWidth: ' + this.tilePixelWidth);
		console.log('tilePixelHeight: ' + this.tilePixelHeight);
		
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
			this.tileMapBmp = new createjs.Bitmap("img/mixed-roof.png");
			this.tileMapBmp.setTransform(108,48,0.5,0.5);
			g_stage.addChild(this.tileMapBmp);	
			break;
			
			case TILE_MAP_TYPE_DESCENDENT:
			this.tileMapPixelWidth = 260;
			this.tileMapPixelHeight = 140;
			this.angleX = -30;
			this.angleY = -24;
			this.startX = 198;
			this.startY = 140;
			//create house bitmap
			this.tileMapBmp = new createjs.Bitmap("img/pitched-roof.png");
			this.tileMapBmp.setTransform(70,10,0.5,0.5);
			g_stage.addChild(this.tileMapBmp);	
			break;
			
			default:
			this.tileMapPixelWidth = 240;
			this.tileMapPixelHeight = 240;
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

		

	},
	_initInvertor : function() {
		this.switch = new createjs.Bitmap("img/invertor.png");
		this.switch.setTransform(446 , 215, 0.5, 0.5);
		this.switch.alpha = 0;;
		g_stage.addChild(this.switch);
	},
	showInvertor : function() {
		this.switch.alpha = 1;
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
	_inti : function(){
		
	},
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
			this.img = "img/token-solar-" + this.baseSize + ".png";
			return new createjs.Bitmap(this.img);
			
			case TOKEN_TYPE_HEATER:
			this.img = "img/token-heater-" + this.baseSize + ".png";
			return new createjs.Bitmap(this.img);
			
			case TOKEN_TYPE_CHIMNEY:
			this.img = "img/token-chimney-" + this.baseSize + ".png";
			return new createjs.Bitmap(this.img);
			
			case TOKEN_TYPE_WINDOW:
			this.img = "img/token-window-" + this.baseSize + ".png";
			return new createjs.Bitmap(this.img);
			
			case TOKEN_TYPE_RECEIVER:
			this.img = "img/token-sl-" + this.baseSize + ".png";
			return new createjs.Bitmap(this.img);
			
			default:
			return null;
		}
	},
	_setTokenTransform : function(type) {
		var token = this.model;
		
		this.x = token.startTile.globalX;
		this.y = token.startTile.globalY;
			
		switch( type ) {

			
			case TOKEN_TYPE_HEATER:
			//todo: change x and y base on roof type
			this.scale = this.scale * 1.5;
			
			this.x = this.x;
			this.y = this.y - this.height * 0.9;

			
			break
			
			case TOKEN_TYPE_CHIMNEY:
			this.scale = this.scale * 0.8;
			this.x = this.x + this.width * 0.4;
			this.y = this.y - this.height * 0.2;
			break;
			
			case TOKEN_TYPE_WINDOW:
			this.scale = this.scale * 0.7;
			this.x = this.x + this.width * 0.3;
			this.y = this.y - this.height * 0.2;
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
		
		if ( token.type == TOKEN_TYPE_NONE || token.type == TOKEN_TYPE_SOLAR ) {
			this._drawNormalToken(token.type);
			this.tileMapView.tokenLayer1.addChild( this.shape );
			var globalPoint = this.shape.localToGlobal(0 ,0 );

			this.model.startTile.globalX = 0 + globalPoint.x;
			this.model.startTile.globalY = 0 + globalPoint.y;
			console.log(globalPoint);

		} else {
			this.tileMapView.tokenLayer2.addChild( this.shape );
			this._setTokenTransform(token.type);
			this._drawNormalToken(token.type);
		}
		
		
		
		this.shape.addEventListener('click',this._handleClick.bind(this) );
		
		
	}
}