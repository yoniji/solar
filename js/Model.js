var Tile = function(row, column)
{
	this.row = row;
	this.column = column;
	this.globalX = 0;
	this.globalY = 0;
	this.token = null;
	this.disabled = false;
}

Tile.prototype = {
	isSameTile : function(tile) {
		return ( ( this.row == tile.row ) && ( this.column == tile.column ) );
	}
}

////////////////////////////
var g_canvas,
g_stage,
g_TileMap,
g_TileMapView,
g_TileId = 0;

var TILE_MAP_TYPE_FLAT = 1,
TILE_MAP_TYPE_DESCENDENT = 2,
TILE_MAP_TYPE_DOUBLE = 3,
TILE_WIDTH = 1,
TILE_HEIGHT = 1.6;

var TOKEN_TYPE_NONE = 0,
TOKEN_TYPE_SOLAR = 1,
TOKEN_TYPE_WINDOW = 2,
TOKEN_TYPE_HEATER = 3,
TOKEN_TYPE_CHIMNEY = 4;
TOKEN_TYPE_RECEIVER = 5;

var TileMap = function(area, type)
{
	this.type = type;
	this.area = area;
	this.width = 0;
	this.height = 0;
	this.rowCount = 0;
	this.columnCount = 0;

	this.tiles = [];
	this.tokens = [];	
	
	this.init(tokenList);
};
TileMap.prototype = {
	init : function() {
		this._calculateSideLength();
		this._calculateRowAndColumnCount();
		this._initTilesArray();
	},
	_calculateSideLength : function() {
		switch( this.type ) {
			case TILE_MAP_TYPE_DOUBLE:
			var widthLengthRatio = 0.5;
			this.width = Math.round(Math.sqrt(this.area / ( widthLengthRatio  * 0.7  * 2)));
			this.height = Math.round(this.width * widthLengthRatio );
			break;
			
			case TILE_MAP_TYPE_DESCENDENT:
			var widthLengthRatio = 0.54;
			this.width = Math.round(Math.sqrt(this.area / ( widthLengthRatio * 2 )));
			this.height = Math.round(this.width * widthLengthRatio );
			break;
			
			default:
			this.height = Math.round(Math.sqrt(this.area));
			this.width = this.height;
			break;
		}
		console.log( 'width:' + this.width + ' and length: ' + this.height );
	},
	_calculateRowAndColumnCount : function() {

		this.columnCount = Math.floor(this.width / TILE_WIDTH);
		this.rowCount = Math.floor(this.height / TILE_HEIGHT);

		console.log( 'columnCount:' + this.columnCount + ' and rowCount: ' + this.rowCount );
	},
	_initTilesArray : function() {
		var disabledStartRow = disabledEndRow = this.rowCount, 
		disabledStartColumn, disabledEndColumn = this.columnCount;
		
		if ( this.type == TILE_MAP_TYPE_DOUBLE ) {
			disabledStartRow = Math.floor(0.4 * this.rowCount );
			disabledStartColumn = Math.floor( 0.275 * this.columnCount );
			disabledEndColumn = Math.ceil( 0.725 * this.columnCount );
			
			console.log(disabledStartRow + ',' + disabledStartColumn + ',' + disabledEndColumn);
		}
		
		for(i = 0; i < this.rowCount; i++)
		{
			for(j = 0; j < this.columnCount; j++)
			{
				this.tiles.push(new Tile(i, j));
				
				if ( i > disabledStartRow - 1 ) {
					if ( j > (disabledStartColumn - 1 ) && j < (disabledEndColumn  ) ) {
						this.tiles[ this.tiles.length - 1].disabled = true;
					}
					
				}
			}
		}
		
	},
	initTokenArray : function(tokenList) {
		if ( tokenList && tokenList.length > 0 ) {
			this.tokens = tokenList.slice(0);
			return;
		}
		for(i = 0; i < this.tiles.length ; i++)
		{
			if (  this.tiles[i].disabled ) {
				continue;
			}
			var newToken = createToken(TOKEN_TYPE_NONE);
			this.tokens.push(newToken);
			
			var tokenIndex = this.tokens.length - 1;
			
			this.tiles[i].token = this.tokens[tokenIndex];
			
			this.tokens[tokenIndex].tiles.push({ 'column': this.tiles[i].column, 'row': this.tiles[i].row} );
			this.tokens[tokenIndex].startTile = this.tiles[i];
			
			
		}
	},
	getTile : function(row, column)
	{
		return this.tiles[row * this.columnCount + column];
	},
	isTileFillable : function( row, column ) {
		if ( row < this.rowCount && column < this.columnCount ) {
			//tile exist
			var tile = this.getTile( row, column );
			if ( !tile.disabled && tile.token.isSingle() ) {
				return true;
			}
		}
		return false;	
	},
	getTokenIndexById : function(id) {
		for ( index in this.tokens ) {
			if ( this.tokens[index].id == id ) {
				return index;
			}
		}
		return -1;	
	},
	removeTokenWithId : function(id) {
		var index = this.getTokenIndexById(id);
		this.tokens.splice(index,1);
	},
	putTokenInSelection : function(type) {
	
		var tobeRemoved = [];
		var newTokens = [];
	
		for ( tokenIndex in this.tokens ) {
		
			
			if ( this.tokens[tokenIndex].isSelected == true ) {
				
				var oldToken = this.tokens[tokenIndex];
				var isChanged = false;
				
				//check every tile in old token
				for ( tileIndex in oldToken.tiles ) {
				
					var newToken = createToken(type);
					var tile = g_TileMap.getTile(oldToken.tiles[tileIndex].row, oldToken.tiles[tileIndex].column);
					if ( newToken.checkIfCanFillDelegate(tile, newToken) ) {
						newToken.fillTilesDelegate(tile, newToken);
						newTokens.push(newToken);
						isChanged = true;
					}
				}
				if (isChanged) {
					tobeRemoved.push(oldToken.id);	
				} else {
					this.tokens[tokenIndex].isSelected = false;
				}
			}			
		}
		
		console.log(tobeRemoved.length);
		for ( index in tobeRemoved ) {
			this.removeTokenWithId(tobeRemoved[index]);
		}
		
		this.tokens = this.tokens.concat(newTokens);
		return true;
	}
};



////////////////////////////



var Token = function(type, checkIfCanFillDelegate, fillTilesDelegate)
{
	this.type = type;
	this.tiles = [];
	this.startTile = null;	
	this.isSelected = false;
	g_TileId = g_TileId + 1;
	this.id = g_TileId;
		
	// check if token is over boundary of tile map
	if (checkIfCanFillDelegate == null)
	{
		this.checkIfCanFillDelegate = function(startTile, newToken) { 
		console.log("check");
		return true; 
		};
	}
	else
	{
		this.checkIfCanFillDelegate = checkIfCanFillDelegate;
	}
	// fill token into all tiles
	if (fillTilesDelegate == null)
	{
		this.fillTilesDelegate = function(startTile, newToken) { 
		console.log("fill");
		};
	}
	else
	{
		this.fillTilesDelegate = fillTilesDelegate;
	}
	
	
	
};

Token.prototype = {
	updateTiles : function()
	{
		this.fillTilesDelegate(this);
		this.onUpdateEvent();
	},
	
	getArea : function()
	{
		this.updateTiles();
		return this.tiles.length;
	},
	
	draw : function()
	{
		this.drawDelegate(token);
	},
	isSingle : function() {
		if ( this.type < 2  || this.type > 3 ) {
			return true;
		}
		return false;
	}
};

////////////////////////////

function checkIfCanFillSingleToken(startTile, newToken)
{
	return true;
	
}

function fillTilesOfSingleToken(startTile, newToken)
{
	var oldToken = startTile.token;
	newToken.tiles.push({ 'row' : startTile.row, 'column':startTile.column });
	newToken.startTile = startTile;
	startTile.token = newToken;
}


function checkIfCanFillDoubleToken(startTile, newToken)
{
	var row, column;
	var oldToken = startTile.token;
	row = startTile.row;
	column = startTile.column;	
	
	return g_TileMap.isTileFillable(row, column + 1);
}

function fillTilesOfDoubleToken(startTile, newToken)
{
	var oldToken = startTile.token;
	newToken.startTile = startTile;
	newToken.tiles.push( { 'row' : startTile.row, 'column':startTile.column });
	newToken.tiles.push( { 'row' : startTile.row, 'column':startTile.column + 1 });
	
	console.log(startTile);
	var nearbyToken = g_TileMap.getTile(startTile.row, startTile.column + 1).token;
	
	g_TileMap.removeTokenWithId(nearbyToken.id);
	startTile.token = newToken;
	g_TileMap.getTile(startTile.row, startTile.column + 1).token = newToken;

}

function checkIfCanFillThreeToken(startTile, newToken)
{
	var row, column;
	var oldToken = startTile.token;
	row = startTile.row;
	column = startTile.column;
	
	return (g_TileMap.isTileFillable(row, column + 1) && g_TileMap.isTileFillable(row, column + 2));
}

function fillTilesOfThreeToken(startTile, newToken)
{
	var oldToken = startTile.token;
	newToken.startTile = startTile;
	newToken.tiles.push( { 'row' : startTile.row, 'column':startTile.column });
	newToken.tiles.push( { 'row' : startTile.row, 'column':startTile.column + 1 });
	newToken.tiles.push( { 'row' : startTile.row, 'column':startTile.column + 2 });
	
	var nearbyToken = g_TileMap.getTile(startTile.row, startTile.column + 1).token;
	g_TileMap.removeTokenWithId(nearbyToken.id);
	 nearbyToken = g_TileMap.getTile(startTile.row, startTile.column + 2).token;
	g_TileMap.removeTokenWithId(nearbyToken.id);
	
	startTile.token = newToken;
	g_TileMap.getTile(startTile.row, startTile.column + 1).token = newToken;
	g_TileMap.getTile(startTile.row, startTile.column + 2).token = newToken;
}

// factory function
function createToken(type)
{

	switch(type)
	{
		case TOKEN_TYPE_WINDOW:
		case TOKEN_TYPE_HEATER:
			return new Token(type, checkIfCanFillDoubleToken, fillTilesOfDoubleToken);
		
		default:
			return new Token(type, checkIfCanFillSingleToken, fillTilesOfSingleToken);
	}
}