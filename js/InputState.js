
function OnEnterInputState()
{
	
	
	$('#solar-panel-select-next').click(function(){
		var area = parseInt($('#ipt-area').val());
		SM.SetStateByName( "menu" );
		
	});
	
	$('.solarAreaInput-tileType').click(function() {
		
		$('.solarAreaInput-tileType.selected').removeClass('selected').prev('input')[0].checked = false;
		
		$(this).addClass('selected');
		$(this).prev('input').attr('checked','true');
	});
	
	$('.solarAreaInput-tileType').click(function() {
		
		$('.solarAreaInput-tileType.selected').removeClass('selected').prev('input')[0].checked = false;
		
		$(this).addClass('selected');
		$(this).prev('input')[0].checked = true;
	});
	
	$('.powerConsumption').click(function() {
		
		$('.powerConsumption input:checked')[0].checked = false;
		$('.powerConsumption.selected').removeClass('selected');
		
		$(this).addClass('selected');
		$(this).children('input').first()[0].checked = true;
	});
	$('#solarDiy').fadeIn();

}

function OnExitInputState()
{
	$('#solarAreaInput').hide();
	$('#solar-panel-select-next').unbind('click');
	$('#solarSelectContainer').fadeIn();
}


var InputState = new State( OnEnterInputState, OnExitInputState );
