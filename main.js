$.ajaxSetup({async: false});

var map,
        currentPlayIndex = false,
        cunli;
var days7 = 78400000*7;
var days30 = 78400000*30;
var latestTime = 0;
var lastTime = 0;

$.getJSON('http://kiang.github.io/TainanDengueMap/taiwan/Dengue.json', function (data) {
    DengueTW = data;
});

$.getJSON('http://happychang.github.io/fever-data/population.json', function (data) 
{
    population = data;
});

function initialize() {

    /*map setting*/
    $('#map-canvas').height(window.outerHeight / 2);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 12,
        center: {lat: 23.00, lng: 120.20}
    });

    $.getJSON('http://happychang.github.io/fever-data/cunli.json', function (data) {
        cunli = map.data.addGeoJson(topojson.feature(data, data.objects.cunli));
    });

    var areas = [];
    cunli.forEach(function (value) {
        var key = value.getProperty('VILLAGE_ID'),
                countyId = value.getProperty('COUNTY_ID'),
                townId = value.getProperty('TOWN_ID'),
                count = 0;

        if (DengueTW[key]) {
            DengueTW[key].forEach(function (val) {
                var recTime = new Date(val[0]).getTime();
		if( latestTime < recTime )
                {
                    latestTime = recTime;
                }
            });
        }

        if (population[key]) {
	    value.setProperty('pop', population[key]);
        }
    
        if(countyId.length === 2) {
            countyId += '000';
        }
        if(!areas[countyId]) {
            areas[countyId] = value.getProperty('C_Name');
        }
        if(!areas[townId]) {
            areas[townId] = value.getProperty('C_Name') + value.getProperty('T_Name');
        }
    });

//    $('#map-all').trigger('click');
    lastTime = latestTime;
    showDateMap(new Date(lastTime), cunli);

    var totalNum = 0, ignoreNum = 0;
    var block = '下面病例數字未包含村里資訊，因此無法在地圖中顯示：<div class="clearfix"><br /></div>';
    $.each(DengueTW, function (k, v) {
        if (k.length !== 11) {
            var num = 0;
            for (i in v) {
		var month = new Date(v[i][0]).getMonth();
            	if( month > 5 )
		{
	                num += v[i][1];
		}
            }
            if (k !== 'total') {
		if( num > 0 )
		{
	                ignoreNum += num;
        	        block += '<div class="col-lg-2">' + areas[k] + ': ' + num + '</div>';
		}
            } else {
                totalNum = num;
            }
        }
    })
    block += '<div class="clearfix"><br /></div>';
    block += '七月起目前共有病例 ' + totalNum + ' ，無法顯示的數量為 ' + ignoreNum;
    $('div#listNoneCunli').html(block);

    map.data.setStyle(function (feature) {

	var selected = $('input[name="map-type"]:checked').val();
	if( selected == 2 && feature.getProperty('sum') == 0 )
	{
		color = "white";
	}
	else
	{
		if( $('input[name="map-div"]:checked').val() == 1 )
		{
			color = ColorBar2(feature.getProperty('num'), feature.getProperty('pop'), selected ); 
		}
		else
		{
			color = ColorBar(feature.getProperty('num'), feature.getProperty('Shape_Area'), selected ); 
		}
	}
        
        return {
            fillColor: color,
            fillOpacity: 0.6,
            strokeColor: 'gray',
            strokeWeight: 1
        }
    });

    map.data.addListener('mouseover', function (event) {
        var Cunli = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {fillColor: 'white'});

	if( $('input[name="map-div"]:checked').val() == 1 )
	{
		area = event.feature.getProperty('pop');
        	density = parseInt(event.feature.getProperty('num') / area * 10000)/100 + '%';
		area = area + '人, ';
	}
	else
	{
		area = parseInt(event.feature.getProperty('Shape_Area')*10000000)/1000;
        	density = parseInt(event.feature.getProperty('num') / area);
		area = area + ' km2, ';
	}


        $('#content').html('<div>' + Cunli + '：' + event.feature.getProperty('num') + '例(' + area + density + ')</div>').removeClass('text-muted');
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
        $('#content').html('在地圖上滑動或點選以顯示數據').addClass('text-muted');
    });

    map.data.addListener('click', function (event) {
        var Cunli = event.feature.getProperty('VILLAGE_ID');
        var CunliTitle = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
        if ($('#myTab a[name|="' + Cunli + '"]').tab('show').length === 0) {
            $('#myTab').append('<li><a name="' + Cunli + '" href="#' + Cunli + '" data-toggle="tab">' + CunliTitle +
                    '<button class="close" onclick="closeTab(this.parentNode)">×</button></a></li>');
            $('#myTabContent').append('<div class="tab-pane fade" id="' + Cunli + '"><div></div></div>');
            $('#myTab a:last').tab('show');
            createStockChart(Cunli, cunli);
            $('#myTab li a:last').click(function (e) {
                $(window).trigger('resize');
            });
        }
    });
    createStockChart('total', cunli);

    $('#playButton1').on('click', function () {
        var maxIndex = DengueTW['total'].length;
        if (false === currentPlayIndex) {
            currentPlayIndex = 125;
        } else {
            currentPlayIndex += 1;
            $(this).addClass('active disabled').find('.glyphicon').show();
        }

        if (currentPlayIndex < maxIndex) {
            showDateMap(new Date(DengueTW['total'][currentPlayIndex][0]), cunli);
            setTimeout(function () {
                $('#playButton1').trigger('click');
            }, 300);
        } else {
            $(this).removeClass('active disabled').find('.glyphicon').hide();
            currentPlayIndex = false;
            $('#title').html('');
        }
        return false;
    });

    $('#playButton2').on('click', function () {
        var maxIndex = DengueTW['total'].length;
        if (false === currentPlayIndex) {
            currentPlayIndex = 0;
        } else {
            currentPlayIndex += 1;
            $(this).addClass('active disabled').find('.glyphicon').show();
        }

        if (currentPlayIndex < maxIndex) {
            showDateMap(new Date(DengueTW['total'][currentPlayIndex][0]), cunli);
            setTimeout(function () {
                $('#playButton2').trigger('click');
            }, 300);
        } else {
            $(this).removeClass('active disabled').find('.glyphicon').hide();
            currentPlayIndex = false;
            $('#title').html('');
        }
        return false;
    });

/* radio for map type */
	$('#map-all').on('click', function () 
	{
		$('#color1').html('人數: <span class="colorBox" style="background-color: white;"></span>0' +
					'<span class="colorBox" style="background-color: #87cefa;"></span>1人' +
					'<span class="colorBox" style="background-color: #00bfff;"></span>2~4人');
		if( $('input[name="map-div"]:checked').val() == 1 )
		{
			$('#color2').html('發生率: <span class="colorBox" style="background-color: #00FF00;"></span><0.2%' +
                            		'<span class="colorBox" style="background-color: #00CC00;"></span>0.2%-0.4%' +
                            		'<span class="colorBox" style="background-color: #FFFF00;"></span>0.4%~0.7%' +
                            		'<span class="colorBox" style="background-color: #ffd700;"></span>0.7%~1%');
			$('#color3').html('<span class="colorBox" style="background-color: #FF8C00;"></span>1%~2%' +
                            		'<span class="colorBox" style="background-color: #FF6600;"></span>2%~4%' +
                            		'<span class="colorBox" style="background-color: #FF0000;"></span>4%~8%' +
                            		'<span class="colorBox" style="background-color: #CC0000;"></span>8%~16%' +
                            		'<span class="colorBox" style="background-color: #a020f0;"></span>>16%');
		}
		else
		{
			$('#color2').html('密度: <span class="colorBox" style="background-color: #00FF00;"></span><16' +
	                            	'<span class="colorBox" style="background-color: #00CC00;"></span>16~32' +
	                            	'<span class="colorBox" style="background-color: #FFFF00;"></span>32~64' +
	                            	'<span class="colorBox" style="background-color: #ffd700;"></span>64~128' +
	                            	'<span class="colorBox" style="background-color: #FF8C00;"></span>128~256');
			$('#color3').html('<span class="colorBox" style="background-color: #FF6600;"></span>256~512' +
	                            	'<span class="colorBox" style="background-color: #FF0000;"></span>512~1024' +
	                            	'<span class="colorBox" style="background-color: #CC0000;"></span>1024~2048' +
	                            	'<span class="colorBox" style="background-color: #a020f0;"></span>>2048');
		}
		showDateMap(new Date(lastTime), cunli);
	});

	$('#map-30').on('click', function () 
	{
		$('#color1').html('人數: <span class="colorBox" style="background-color: white;"></span>0' +
					'<span class="colorBox" style="background-color: #87cefa;"></span>1人' +
					'<span class="colorBox" style="background-color: #00bfff;"></span>2~4人');
		if( $('input[name="map-div"]:checked').val() == 1 )
		{
			$('#color2').html('發生率: <span class="colorBox" style="background-color: #00FF00;"></span><0.2%' +
                            		'<span class="colorBox" style="background-color: #00CC00;"></span>0.2%-0.4%' +
                            		'<span class="colorBox" style="background-color: #FFFF00;"></span>0.4%~0.7%' +
                            		'<span class="colorBox" style="background-color: #ffd700;"></span>0.7%~1%');
			$('#color3').html('<span class="colorBox" style="background-color: #FF8C00;"></span>1%~2%' +
                            		'<span class="colorBox" style="background-color: #FF6600;"></span>2%~4%' +
                            		'<span class="colorBox" style="background-color: #FF0000;"></span>4%~8%' +
                            		'<span class="colorBox" style="background-color: #CC0000;"></span>8%~16%' +
                            		'<span class="colorBox" style="background-color: #a020f0;"></span>>16%');
		}
		else
		{
			$('#color2').html('密度: <span class="colorBox" style="background-color: #00FF00;"></span><16' +
	                            	'<span class="colorBox" style="background-color: #00CC00;"></span>16~32' +
	                            	'<span class="colorBox" style="background-color: #FFFF00;"></span>32~64' +
	                            	'<span class="colorBox" style="background-color: #ffd700;"></span>64~128' +
	                            	'<span class="colorBox" style="background-color: #FF8C00;"></span>128~256');
			$('#color3').html('<span class="colorBox" style="background-color: #FF6600;"></span>256~512' +
	                            	'<span class="colorBox" style="background-color: #FF0000;"></span>512~1024' +
	                            	'<span class="colorBox" style="background-color: #CC0000;"></span>1024~2048' +
	                            	'<span class="colorBox" style="background-color: #a020f0;"></span>>2048');
		}
		showDateMap(new Date(lastTime), cunli);
	});

	$('#map-7change').on('click', function () 
	{
		if( $('input[name="map-div"]:checked').val() == 1 )
		{
			$('#color1').html('減少: <span class="colorBox" style="background-color: #00FF00;"></span>0.1%~0.2%' +
					'<span class="colorBox" style="background-color: #00CC00;"></span>0.2%~0.4%' +
					'<span class="colorBox" style="background-color: #87cefa;"></span>0.4%~0.8%' +
					'<span class="colorBox" style="background-color: #00bfff;"></span>>0.8%');
			$('#color2').html('持平: <span class="colorBox" style="background-color: #FFFF00;"></span>-4~+4人' +
                            		'<span class="colorBox" style="background-color: #ffd700;"></span>-0.1%~+0.1%');
			$('#color3').html('增加: <span class="colorBox" style="background-color: #FF8C00;"></span>0.1%~0.2%' +
                            		'<span class="colorBox" style="background-color: #FF6600;"></span>0.2%~0.4%' +
                            		'<span class="colorBox" style="background-color: #FF0000;"></span>0.4%~0.8%' +
                            		'<span class="colorBox" style="background-color: #CC0000;"></span>>0.8%');
		}
		else
		{
			$('#color1').html('減少: <span class="colorBox" style="background-color: #00FF00;"></span>8~16' +
					'<span class="colorBox" style="background-color: #00CC00;"></span>16~32' +
					'<span class="colorBox" style="background-color: #87cefa;"></span>32~64' +
					'<span class="colorBox" style="background-color: #00bfff;"></span>>64');
			$('#color2').html('持平: <span class="colorBox" style="background-color: #FFFF00;"></span>-4~+4人' +
                            		'<span class="colorBox" style="background-color: #ffd700;"></span>-8~+8');
			$('#color3').html('增加: <span class="colorBox" style="background-color: #FF8C00;"></span>8~16' +
                            		'<span class="colorBox" style="background-color: #FF6600;"></span>16~32' +
                            		'<span class="colorBox" style="background-color: #FF0000;"></span>32~64' +
                            		'<span class="colorBox" style="background-color: #CC0000;"></span>>64');
		}
		showDateMap(new Date(lastTime), cunli);
	});

/* radio for map type2 */
	$('#map-area').on('click', function () 
	{
		$('input[name="map-type"]:checked').trigger('click');
	});

	$('#map-population').on('click', function () 
	{
		$('input[name="map-type"]:checked').trigger('click');
	});

}

function createStockChart(Cunli, cunli) {
    var series = [];

    for (var i = 0; i < DengueTW[Cunli].length; i++) {
	var recDate = new Date(DengueTW[Cunli][i][0]);
        if( recDate.getMonth() > 5 )
        {
          series.push([recDate.getTime(), DengueTW[Cunli][i][1]]);
        }
    }

    Highcharts.setOptions({
        lang: {
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            loading: '載入中'
        }
    });

    $('#' + Cunli).highcharts('StockChart', {
        chart: {
            alignTicks: false,
            width: $('#myTabContent').width(),
            height: $('#myTabContent').height()
        },
        rangeSelector: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            positioner: function () {
                return {x: 10, y: 30}
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            showDateMap(new Date(this.x), cunli);
                        }
                    }
                },
            }
        },
        series: [{
                type: 'column',
                name: Cunli,
                data: series,
            }]
    });
}

function showDateMap(clickedDate, cunli) {
    var yyyy = clickedDate.getFullYear().toString(),
            mm = (clickedDate.getMonth() + 1).toString(),
            dd = clickedDate.getDate().toString(),
            clickedDateKey = yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

    lastTime = clickedDate.getTime();
    var time1 = lastTime - days7;
    var time2 = time1 - days7;

    cunli.forEach(function (value) {
        var key = value.getProperty('VILLAGE_ID'),
                count = 0;
	var count1=0, count2=0;

        if (DengueTW[key]) {
            DengueTW[key].forEach(function (val) {
		
		if( $('input[name="map-type"]:checked').val() == 1 )
		{
	                var diff = clickedDate.getTime() - new Date(val[0]).getTime();
			if( diff < days30 && diff >= 0)
	        	{
	                    count += val[1];
      			}
		}
		else if(  $('input[name="map-type"]:checked').val() == 2 )
		{
	                var recordTime = new Date(val[0]).getTime();
			if( recordTime > lastTime )
			{
			}
			else if( recordTime > time1 )
	                {
	                    count1 += val[1];
	                }
			else if( recordTime > time2 )
			{
	                    count2 += val[1];
			}
		}
		else
		{
                	var recordDate = new Date(val[0]);
	        	if( recordDate.getMonth() > 5 )
	        	{
                		if (recordDate <= clickedDate)
				{
		                    count += val[1];
                		}
			}		
		}
            });
        }

	if( $('input[name="map-type"]:checked').val() == 2 )
	{
	        value.setProperty('num', count1 - count2); 
		value.setProperty('sum', count1 + count2); 
	}
	else
	{
        	value.setProperty('num', count);
	}
    });
    $('#title').html(clickedDateKey + ' 累積病例');
}

function showDayMap(clickedDate, cunli) {
    var yyyy = clickedDate.getFullYear().toString(),
            mm = (clickedDate.getMonth() + 1).toString(),
            dd = clickedDate.getDate().toString(),
            clickedDateKey = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);

    $('#title').html(clickedDateKey + ' 當日病例');
    cunli.forEach(function (value) {
        var key = value.getProperty('VILLAGE_ID'),
                count = 0;

        if (DengueTW[key]) {
            DengueTW[key].forEach(function (val) {
                if (clickedDateKey == val[0]) {
                    count += val[1];
                }
            });
        }
        value.setProperty('num', count);
    });
}

$(window).resize(function () {
    var len = $('#myTabContent > .tab-pane').length;
    for (var i = 0; i < len; i++) {
        $('#myTabContent > .tab-pane').eq(i).highcharts().setSize($('#myTabContent').width(), $('#myTabContent').height());
    }
});

function closeTab(node) {
    var nodename = node.name;
    node.parentNode.remove();
    $('#' + nodename).remove();
    $('#myTab a:first').tab('show');
}

google.maps.event.addDomListener(window, 'load', initialize);
