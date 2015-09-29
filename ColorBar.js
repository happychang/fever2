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
		else if(density <= 40)		return "#00CC00"
		else if(density <= 70)		return "#FFFF00"
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
