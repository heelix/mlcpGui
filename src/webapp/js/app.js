
$(document).ready(function() {
	var source   = $("#settings-template").html();
	var template = Handlebars.compile(source);
	var mlcp_form_template = Handlebars.compile($("#mlcp_template").html());

	$('#myWizard').wizard();
	$('#myWizard').on('actionclicked.fu.wizard', function (evt, data) {
  		var checkedVal = null;
		checkedVal = $("#command-section input[name=command]:checked").val();
	  if(data.direction === "next" && data.step === 1){
		  var fileToLoad = null;
		  
		  switch(checkedVal)
		  {
		  	case "import":
			  	loadConfigSettings ("/json/inputOptions.json", template, true, "#settings");
		  		break;
		  	case "export":
		  		loadConfigSettings ("/json/outputOptions.json", template, true, "#settings");
		  		break;
		  	case "copy":
		  		loadConfigSettings ("/json/copyOptions.json", template, true, "#settings");
		  		break;
		  	case "extract":
		  		loadConfigSettings ("/json/extractOptions.json", template, true, "#settings");
		  		break;
		  }
	  } else if(data.direction === "next" && data.step === 2) { //Optional Settings
	  		$.getJSON( "/json/optionalSettings.json", function( json ) {
				var html = template(json);
				$("#opt_settings").html(html);
			});
	  } else if(data.direction === "next" && data.step === 3) { //Form Settings
	  		$('#myWizard').wizard('addSteps', -1, [
			    {
			      //badge: 'badge-customicon',
			      label: checkedVal.charAt(0).toUpperCase() + checkedVal.substring(1).concat(" ").concat("Settings"),
			      pane: '<form method="POST" id="mlcp_settings_form" action="/mlcp"><div id="mlcp_settings">Content</div><div id="optional_settings"></div><input type="submit" class="btn btn-primary" value="Submit" /></form>'
			    }
			  ]);

	  		loadConfigSettings (null, mlcp_form_template, false, "#mlcp_settings");
	  		loadConfigSettings (null, mlcp_form_template, false, "#optional_settings");
	  		$("#host_hidden").val($("input[name=host]").val());
			$("#port_hidden").val($("input[name=port]").val());
			$("#username_hidden").val($("input[name=username]").val());
			$("#password_hidden").val($("input[name=password]").val());
			$("#command_hidden").val($("input:radio:checked").val());
			$('span').tooltip();
			// $("#mlcp_settings_form").on("click", function(){
			// 	if( $(this + " input").length === 0 )
			// 		$(this + " input[type=button]").attr("disabled", "disabled");
			// 	else
			// 		$(this + " input[type=button]").removeaAttr("disabled");
			// });
	  } 

	});

	$(".btn-prev").on("click", function(){
		$('#myWizard').wizard('removeSteps', 4, 1);
	});



	// $("#settings").on("click", "input[type=checkbox]", function(){
	// 	console.log($(this).val());
	// 	if($(this).val() === "-aggregate_record_namespace" && $(this).is(":checked"))
	// 		$("")
	// })

	Handlebars.registerPartial('inputFileTypeOptions', $("#inputFileTypeOptions-partial").html());
	Handlebars.registerPartial('documentTypeOptions', $("#documentTypeOptions-partial").html());
	Handlebars.registerPartial('inputCodecOptions', $("#inputCompressionCodecOptions-partial").html());
	Handlebars.registerPartial('sequencTypeOptions', $("#sequenceValueTypeOptions-partial").html());
	Handlebars.registerPartial('outputTypeOptions', $("#outputTypeOptions-partial").html());
	
	Handlebars.registerHelper('fieldLabel', function(setting) {
	  return setting.slice( 1 );
	});
	Handlebars.registerHelper("mod20if", function(index_count,position,block){
		if(position === 'start' && parseInt(index_count) % 2 === 0)
	    	return block.fn(this);
	   	
	   	if (position === 'end' && (parseInt(index_count)+1) % 2 === 0)
	   		return block.fn(this);
	});
	Handlebars.registerHelper("valIsBoolean", function(type, block){
		console.log(type)
		if(type === 'boolean')
	    	return block.fn(this);
	});
	Handlebars.registerHelper("valIsString", function(type, block){
		if(type === 'string' || type === 'filename' || type === "comma-list")
	    	return block.fn(this);
	});
	Handlebars.registerHelper("valIsNumber", function(type, block){
		if(type === 'number')
	    	return block.fn(this);
	});
	Handlebars.registerHelper("valIsCharacter", function(type, block){
		if(type === 'character')
	    	return block.fn(this);
	});
	Handlebars.registerHelper("valIsType", function(type, block){
		if(type === 'type')
	    	return block.fn(this);
	});
	Handlebars.registerHelper("OptionsTypePartial", function(type){
		var options = null;
		switch(type.input_name){
			case "-input_file_type":
				options = 'inputFileTypeOptions';
				break;
			case "-document_type":
				options = 'documentTypeOptions';
				break;
			case "-input_compression_codec":
				options = 'inputCodecOptions';
				break;
			case "-sequencefile_value_type":
				options = 'sequencTypeOptions';
				break;
			case "-output_type":
				options = 'outputTypeOptions';
				break;
		}
	    return options;
	});

});

function loadConfigSettings (setting, template, load, destination) {
	if(load)
		$.getJSON( setting, function( json ) {
			var html = template(json);
			$(destination).html(html);
		});

	else {
		var json = creatMLCPFields(destination);
		var html = template(json);
		$(destination).html(html);
		addRemoveListeners();
	}
}

function creatMLCPFields(destination) {
    var settings = null;
    var wrapper = {};
    var settingsArray = [];
    var title = "";
	if(destination === '#mlcp_settings'){
		settings = $('#settings input:checkbox:checked');
		title = "MLCP Settings";
	} else{
		settings = $('#opt_settings input:checkbox:checked');
		title = "Optional Settings";
	}
	if(settings.length){
		settings.sort(dynamicSortMultiple("type", "name"));
		wrapper.fieldsetTitle = title;
	    $(settings).each(function() {
	        item = {}
	        item.input_name = $(this).val();
	        item.field_type = $(this).data("type");
	        item.field_label = $(this).data("field-label");
	        item.hint = $(this).data("hint");
	        settingsArray.push(item);
	    });
	    wrapper.fields = settingsArray;
	}
    console.log(wrapper)
	return wrapper;
}

function SortByFieldtype(a, b){
  var aName = a.type.toLowerCase();
  var bName = b.type.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

//Methods for sorting array of selected input fields
function dynamicSort(property) { 
    return function (obj1,obj2) {
        return obj1[property] > obj2[property] ? 1
            : obj1[property] < obj2[property] ? -1 : 0;
    }
}

function dynamicSortMultiple() {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function addRemoveListeners () {
	$(".glyphicon-remove").on("click", function(){
		$(this).parents("div.col-md-6").remove();
	})
}

