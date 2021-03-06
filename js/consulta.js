// JavaScript Document 20100030838
var code_usuario = "";
 $( document).on( "click", ".autocomplete li", function() { 
	  $("#emp_transporte").val($(this).attr("id"));     
      var selectedItem = $(this).html();
	 //alert($(this).attr("id"));
      $('.autocompletePanel .ui-filterable input').val(selectedItem);   
      $('.autocomplete').hide();     
    });
	
$(document).ready(function(e) {  
	//getProgramaciones();	
	// Return today's date and time
	var currentTime = new Date()
	// returns the month (from 0 to 11)
	//var month = currentTime.getMonth() + 1
	// returns the day of the month (from 1 to 31)
	//var day = currentTime.getDate()
	// returns the year (four digits)
	var year = currentTime.getFullYear();
	//console.log(year.toString().substring(2));
	$("#serie_orden").val(year.toString().substring(2));
	code_usuario = $.QueryString["user"];
	//code_usuario = window.localStorage.getItem("code");
	$("#buscar").click(function(e) {
        getProgramaciones();
    });
	 $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
	
	$("#guardar").click(function(e) {
		if ( $(".panelDatos").css("display") == "block" ){
			if ( confirm("¿Desea continuar?") ){
			 	setGuardar();
			}
		}
    });	
 	
	$( ".autocomplete" ).on( "listviewbeforefilter", function (e, data) {        
		var $ul = $(this);                        // $ul refers to the shell unordered list under the input box
        var value = $(data.input).val();        // this is value of what user entered in input box
		var dropdownContent = "" ;                // we use this value to collect the content of the dropdown
        $ul.html("") ;                            // clears value of set the html content of unordered list
        
        // on third character, trigger the drop-down
        if ( value && value.length > 2 ) {
			  $('.autocomplete').show();           
			  $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading' ></span></div></li>" );
			  $ul.listview( "refresh" );
			 
			 $.ajax({
				url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_ActDUA.asmx/ListarEmpTrans",
				type: "POST",
				dataType : "json",
				data : '{"codemp":"' + value + '", "tip": 1}',
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);					 
					if ( resultado.length > 0 ){
						var count = 0;
						for (var i = 0; i<resultado.length;i++){
							dropdownContent += "<li id='" + resultado[i].empresa + "'>" + resultado[i].nombre + "</li>";
							$ul.html( dropdownContent );
							$ul.listview( "refresh" );
							$ul.trigger( "updatelayout"); 							 
						}
					} 
				},		
				error : function(jqxhr) 
				{
				   alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}
		
			});		
        }
      })

	 
	//CargarCombos();
});	


function CargarCombos(){
		
	$("#tipo_descarga").html("<option value=''>Seleccionar tipo descagar</option>");
	$("#tipo_embarque").html("<option value='0'>Seleccionar tipo embarque</option>");
	//$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_ActDUA.asmx/ListarTipoEmb",
        type: "POST",
		cache: false,
        dataType : "json",
        //data : '{"Empresa":"'+empresa+'", "IDEstado" : '+idestado+'}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			//$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$("#tipo_embarque").append("<option value='"+resultado[i].TE_ID+"'>"+resultado[i].DESCP+"</option>");					
				}
				$("#tipo_embarque").selectmenu('refresh', true);
			}
			else{
			}
        },
        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }
    });	
	
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_ActDUA.asmx/ListarTipoCarga",
        type: "POST",
		cache: false,
        dataType : "json",
        //data : '{"Empresa":"'+empresa+'", "IDEstado" : '+idestado+'}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			//$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$("#tipo_descarga").append("<option value='"+resultado[i].TD_CODIGO+"'>"+resultado[i].DESCRP+"</option>");					
				}
				$("#tipo_descarga").selectmenu('refresh', true);
			}
			else{
			}
        },
        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }
    });		 
	
}

function setGuardar(){
	
/*	if ( $("#numero_manifiesto").val() == "" || $("#numero_manifiesto").val() == "0" ){
		alerta("Ingresar numero de manifiesto");
		$("#numero_manifiesto").focus();
		return;
	}
	
	if ( $(".autocompletePanel .ui-filterable input").val() == "" ){
		alerta("Ingresar Empresa de Transporte");
		$(".autocompletePanel .ui-filterable input").focus();
		return;
	}
	
	if ( $("#nro_guia_bl").val() == "" ){
		alerta("Ingresar Nro Guia/BL");
		$("#nro_guia_bl").focus();
		return;
	}
	
	if ( $("#dcto_master").val() == "" ){
		alerta("Ingresar Dcto. Master");
		$("#dcto_master").focus();
		return;
	}
	*/
	
	var parametros = new Object();	
	
	parametros.orden = $("#serie_orden").val()	+ "/"  + $("#numero_orden").val();
	parametros.aduana = $("#orden_aduana").val();
	parametros.duaanterior = $("#numero_manifiesto_ant").val();	
	parametros.dua = $("#numero_manifiesto").val();
	parametros.master = $("#dcto_master").val();
	parametros.masteranterior = $("#dcto_master_ant").val();
	parametros.usu = code_usuario;	
	
	/*
	parametros.orden = $("#serie_orden").val()	+ "/"  + $("#numero_orden").val();	;
	parametros.dua = $("#numero_manifiesto").val();	
	
	parametros.codempr = $("#emp_transporte").val();	
	parametros.empt = $('.autocompletePanel .ui-filterable input').val();	
	parametros.guia = $("#nro_guia_bl").val();
	parametros.master = $("#dcto_master").val();
	parametros.tipdesc = $("#tipo_descarga").val();
	parametros.descarga = $("#tipo_descarga option:selected").text();
	parametros.tipemb = $("#tipo_embarque").val(); 
	parametros.tpembarque = $("#tipo_embarque option:selected").text();
    parametros.aduana = $("#orden_aduana").val();
	
	parametros.tipembanterior = $("#tipo_embarque_ant").val(); 
    parametros.tipdescanterior = $("#tipo_descarga_ant").val();	
	parametros.descargaanterior = $("#tipo_descarga_ant_desc").val(); 
    parametros.embarqueanterior = $("#tipo_embarque_ant_desc").val();	
	
	parametros.masteranterior = $("#dcto_master_ant").val();
	parametros.guiaanterior = $("#nro_guia_bl_ant").val();
	
	parametros.duaanterior = $("#numero_manifiesto_ant").val();	
	parametros.codempranterior = $("#emp_transporte_ant").val();	
	parametros.emptanterior = $("#emp_transporte_ant_desc").val();	
	*/
	
    console.log(parametros);
	//return;
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_ActDUA.asmx/Grabar",
        //url : "http://localhost:34927/AntaresAduanas/Movil/WS_ActDUA.asmx/Grabar",
		type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//"hola:" + console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 if ( resultado.code == 1){
				/*$("#observacion").val("")
				$("#cheque").val("")
				$("#concluido").val();	
				$("#ordenes").val(0);
				$("#ordenes").selectmenu('refresh', true);
				$("#concluido").selectmenu('refresh', true);*/
				getProgramaciones();
			 }			  
			 alerta(resultado.message);
			 
        },

        error : function(jqxhr) 
        { 
		   console.log(jqxhr);
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		
		
	
}


function alertDismissed(){
}
//

function getProgramaciones(){
	$(".panelSinDatos, .panelDatos").hide();
	$.mobile.loading('show');
 	//$("#ordenes").html("<option value='0'>Seleccionar</option>");
	var orden = $("#serie_orden").val() + "/" +  $("#numero_orden").val() 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_ActDUA.asmx/MostrarDatos",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"orden":"' + orden + '"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			$.mobile.loading('hide');
			console.log(data.d);
			resultado = $.parseJSON(data.d);
		
			//console.log(resultado);
			
			if ( resultado.code == 1){	
				var arrOrden = resultado.message
				console.log(arrOrden);
				if ( arrOrden.length > 0 ){				
					for (var i = 0; i<arrOrden.length;i++){
						//var nroOrden = resultado[i].nombre;		
						//nroOrden = nroOrden.toString().substring(0,11);		
						//$("#ordenes").append("<option value='"+ $.trim(resultado[i].orden)+"'>"+ $.trim(resultado[i].nombre)+"</option>");
						var nro_orden = $.trim(arrOrden[i].NRO_ORDEN)
						var arrOrdenSintad = nro_orden.split("/");
						$("#numero_orden").val(arrOrdenSintad[1]);
						//console.log(arrOrden[1]);
						$("#orden_aduana").val($.trim(arrOrden[i].CODI_ADUA));
						$("#orden_regimen").val($.trim(arrOrden[i].REGI_PROC));
						$("#orden_cliente").val($.trim(arrOrden[i].NOMB_CLTE));					
						$("#aduana_manifiesto").val($.trim(arrOrden[i].ADU_MANIF));
						$("#anno_manifiesto").val($.trim(arrOrden[i].ANO_MANIF));
						$("#numero_manifiesto").val($.trim(arrOrden[i].NRO_MANIF));

						//$("#emp_transporte").val($.trim(arrOrden[i].EMP_TRANS));
						//$('.autocompletePanel .ui-filterable input').val(arrOrden[i].NOM_TRANS);   
						//$("#emp_transporte").val($.trim(resultado[i].NOM_TRANS));
						$("#nro_guia_bl").val($.trim(arrOrden[i].NROGUIA));
						$("#dcto_master").val($.trim(arrOrden[i].DOC_MASTER));

						//$("#tipo_descarga").val($.trim(arrOrden[i].TIP_DESCARGA));
						//$("#tipo_embarque").val($.trim(arrOrden[i].tip_certi));

						//$("#tipo_embarque").selectmenu('refresh', true);
						//$("#tipo_descarga").selectmenu('refresh', true);					

						$("#numero_manifiesto_ant").val($.trim(arrOrden[i].NRO_MANIF));					
						//$("#emp_transporte_ant").val($.trim(arrOrden[i].EMP_TRANS));
						//$("#emp_transporte_ant_desc").val($.trim(arrOrden[i].NOM_TRANS));					
						//$("#nro_guia_bl_ant").val($.trim(arrOrden[i].NROGUIA));
						$("#dcto_master_ant").val($.trim(arrOrden[i].DOC_MASTER));	
						
						$("#dt_puerto").val($.trim(arrOrden[i].DT_PUERTO));	
						$("#linea_aerea").val($.trim(arrOrden[i].NOM_TRANS));	
						$("#cant_bultos").val($.trim(arrOrden[i].CANT_BULT));	
						$("#peso").val($.trim(arrOrden[i].KLS_BRUTO + " KG.")); 
						//$("#tipo_descarga_ant").val($.trim(arrOrden[i].tipo_desc));
						//$("#tipo_embarque_ant").val($.trim(arrOrden[i].tip_certi));					
						//$("#tipo_descarga_ant_desc").val($.trim(arrOrden[i].TIP_DESCARGA));
						//$("#tipo_embarque_ant_desc").val($.trim(arrOrden[i].TIP_EMBARQUE));	

						$(".panelDatos").fadeIn("fast");
					}
					//$("#ordenes").selectmenu('refresh', true);
				}
				else{
					$(".panelSinDatos").fadeIn("fast");
				}
			}
			else{
				$(".panelSinDatos").fadeIn("fast");
				alerta(resultado.message);
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}


function alerta(mensaje){
	if ( navigator.notification == null ){
		alert(mensaje);
		return;
	}
	 navigator.notification.alert(
            mensaje,  // message
            alertDismissed,         // callback
           'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	
}
