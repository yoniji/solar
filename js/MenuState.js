
function OnEnterMenuState()
{
	
	
	$('#solarSelectList li').bind('click', function(){
		$('#solarSelectList li.selected').removeClass('selected');
		$(this).addClass('selected');
		$('#solar-panel-select-next').fadeIn();
	});
	
	$('#solar-panel-select-next').bind('click',function(){
		
		var id= $('#solarSelectList li.selected .solarSelectItem').attr('data-id');
		if (id) {
			g_type = parseInt(id);
			SM.SetStateByName('ingame');
		} else {
			showAlertMessage('您还没有选择房屋');
		}
	
	});
	
	
	
	$('#solarDiy').fadeIn();
	$('#solarSelectContainer,#solar-panel-select').show();
}

function OnExitMenuState()
{
	$('#solarSelectContainer,#solar-panel-select').hide();
}


var MenuState = new State( OnEnterMenuState, OnExitMenuState );
