function ColorBar(value, area, type) 
{
	density = value / area / 10000;
	if(type < 2)
	{
		if(value == 0)			return "white"
		else if(value <= 1)		return "#87cefa"
		else if(value <= 4)		return "#00bfff"
		else if(density <= 16)		return "#00FF00"
		else if(density <= 32)		return "#00CC00"
		else if(density <= 64)		return "#FFFF00"
		else if(density <= 128)		return "#ffd700"
		else if(density <= 256)		return "#FF8C00"
		else if(density <= 512)		return "#FF6600"
		else if(density <= 1024)	return "#FF0000"
		else if(density <= 2048)	return "#CC0000"
		else				return "#a020f0"
	}
	else if(type == 2)
	{
		if(value <= 4 && value >= -4)	return "#FFFF00"
    		else if(density <= -64)		return "#00bfff"
		else if(density <= -32)		return "#87cefa"
		else if(density <= -16)		return "#00CC00"
		else if(density <= -8)		return "#00FF00"
		else if(density < 8)		return "#ffd700"
		else if(density < 16)		return "#FF8C00"
		else if(density < 32)		return "#FF6600"
		else if(density < 64)		return "#FF0000"
		else if(density < 128)		return "#FF0000"
		else				return "#a020f0"
	}
}

function ColorBar2(value, pop, type) 
{
	density = value / pop * 10000;
	if(type < 2)
	{
		if(value == 0)			return "white"
		else if(value <= 1)		return "#87cefa"
		else if(value <= 4)		return "#00bfff"
		else if(density <= 20)		return "#00FF00"
		else if(density <= 30)		return "#00CC00"
		else if(density <= 50)		return "#FFFF00"
		else if(density <= 100)		return "#ffd700"
		else if(density <= 200)		return "#FF8C00"
		else if(density <= 400)		return "#FF6600"
		else if(density <= 800)		return "#FF0000"
		else if(density <= 1600)	return "#CC0000"
		else				return "#a020f0"
	}
	else if(type == 2)
	{
		if(value <= 4 && value >= -4)	return "#FFFF00"
    		else if(density <= -80)		return "#00bfff"
		else if(density <= -40)		return "#87cefa"
		else if(density <= -20)		return "#00CC00"
		else if(density <= -10)		return "#00FF00"
		else if(density < 10)		return "#ffd700"
		else if(density < 20)		return "#FF8C00"
		else if(density < 40)		return "#FF6600"
		else if(density < 80)		return "#FF0000"
		else if(density < 160)		return "#CC0000"
		else				return "#a020f0"
	}
}

function ColorBar3(value, start) 
{
	var day = (value - start)/86400000;
	if(value == 0 )			return "white"
	else if(day >= 78)		return "#CCCCCC"
	else if(day >= 71)		return "#AAAAAA"
	else if(day >= 64)		return "#87cefa"
	else if(day >= 57)		return "#00bfff"
	else if(day >= 50)		return "#00FF00"
	else if(day >= 43)		return "#00CC00"
	else if(day >= 36)		return "#FFFF00"
	else if(day >= 29)		return "#ffd700"
	else if(day >= 22)		return "#FF8C00"
	else if(day >= 15)		return "#FF6600"
	else if(day >= 8)		return "#FF0000"
	else if(day >= 1)		return "#CC0000"
	else				return "#a020f0"
}
