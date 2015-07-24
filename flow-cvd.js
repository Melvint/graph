var ColorVisionDeficiency = {
	type: 'ColorVisionDeficiency',
    title: 'ColorVisionDeficiency',
    info: "Test block",
    i: {
		//inputs
        IN: 0
    },
    o: {
        //outputs
        OUT: 0
    },
    vars: {
	       
			enabled: false,
			c_type: -1,
			curr_cb: 'normal'	
    },
    //добавляем радиокнопки
    init: function (i, o, that) {
		//place controls
	    radio("type","normal","Normal",that.widget.box);
		radio("type","redblind","Red-Blind",that.widget.box);
		radio("type","greenblind","Green-Blind",that.widget.box);
		radio("type","redweak","Red-Weak",that.widget.box);
		radio("type","greenweak","Green-Weak",that.widget.box);
		checkbox("enable", true, "Enable",that.widget.box);
		
		//init events
		radios = that.widget.box.getElementsByClassName("cvdRadio");
		for(var i=0;i<radios.length;i++){
	        radios[i].addEventListener('click', radioChange(ColorVisionDeficiency,that), false);
	    }
		tumbler = that.widget.box.getElementsByClassName("cvdCheckbox");
		tumbler[0].addEventListener('click', tumblerChange(ColorVisionDeficiency,that), false);
        that.widget.resize();
    }
};

function radioChange(destination,that)
{	
	//alert("Set event successfully")
	return function()
	{
		destination.vars.curr_cb = this.getAttribute("value");	
		//alert(this.getAttribute("value"));
	}	
}

function tumblerChange(destination,that)
{	
//alert("Set event successfully")
	return function()
	{
		radios = that.widget.box.getElementsByClassName("cvdRadio");
		for(var i=0;i<radios.length;i++){
		        radios[i].disabled = !(this.checked);
		}
		destination.vars.enabled = this.checked;	
		//alert(this.getAttribute("value"));
	}	
}

function checkbox(name,value,label,destination)
{
	var cb = document.createElement('input');
	cb.type = "checkbox";
	cb.className = "cvdCheckbox";
	cb.name = name;
	cb.checked = value;
	var lbl = document.createElement('label');
	lbl.className = "cvdLabel";
	lbl.appendChild(document.createTextNode(label));
	lbl.appendChild(cb);
	destination.appendChild(lbl);
	return cb;
};

function radio(name,value,label,destination)
{
	var cb = document.createElement('input');
	cb.type = "radio";
	cb.className = "cvdRadio";
	cb.name = name;
	cb.value = value;
	var lbl = document.createElement('label');
	lbl.className = "cvdLabel";
	lbl.appendChild(document.createTextNode(label));
	lbl.appendChild(cb);
	destination.appendChild(lbl);
	return cb;
};

types.push(ColorVisionDeficiency);