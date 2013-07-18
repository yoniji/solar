
function OnEnterInputState()
{
	
	
	$('#solar-panel-select-next').click(function(){
		var area = $('#ipt-area').val();
		var houseArea = $('#ipt-house').val();
		if ( IsValidArea(area) && IsValidArea(houseArea)) {
			SM.SetStateByName( "menu" );
		} else {
			alert("请输入正确的面积");
		}
		
		
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
	g_area = parseInt($('#ipt-area').val());
	g_houseArea = parseInt($('#ipt-house').val());
	g_houseTileType = parseInt($('.radio-tileType:checked').val());
	g_powerConsumption = parseInt($('.powerConsumption input:checked').val());
	g_isReadFromConfig = false;
	$('#solarAreaInput').hide();
	$('#solar-panel-select-next').unbind('click');
	$('#solarSelectContainer').fadeIn();
}


var InputState = new State( OnEnterInputState, OnExitInputState );

function IsValidArea(value) {

        if (value.length == 0) {
            return false;
        }

        var intValue = parseInt(value);
        if (isNaN(intValue)) {
            return false;
        }

        if (intValue <= 0)
        {
            return false;
        }
        return true;
}