/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaBorrada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaGuardada.suscribir(function() {
    contexto.reconstruirLista();
  })

};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    //completar
    nuevoItem = $(`<li class="list-group-item" id=${pregunta.id}></li>`);
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var guardar = this.innerText;
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        //completar
        var textoRespuesta = $(this).val();
        var respuesta = {'textoRespuesta': textoRespuesta, 'cantidad': 0}
        if(respuesta.textoRespuesta && respuesta.textoRespuesta != '') {
          respuestas.push(respuesta);
        }
      })
      
      if(guardar=='Guardar Pregunta') {
        var id = e.pregunta.attr('data-id');
        this.innerText = 'Agregar Pregunta'
        e.pregunta.removeAttr('data-id');
        contexto.controlador.guardarPregunta(value, respuestas, id)
      } else {
        if(value) {
          contexto.controlador.agregarPregunta(value, respuestas);
        }
      }
      
      contexto.limpiarFormulario();
    });
    //asociar el resto de los botones a eventos

    // borrar una pregunta
    e.botonBorrarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      if(id) {
        contexto.controlador.borrarPregunta(id);
      }
    });

    // borrar todas las preguntas
    e.borrarTodo.click(function() {
      contexto.controlador.borrarTodas();
    });

    // editar pregunta
    e.botonEditarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      var preguntas = contexto.controlador.obtenerPreguntas();
      var pregunta = preguntas.find(item => item.id == id);
      e.pregunta[0].value = pregunta.textoPregunta;
      e.pregunta[0].setAttribute('data-id', id);
      var respuestas = pregunta.cantidadPorRespuesta;
      contexto.elementos.respuesta.find('[name="option[]"]').remove();
      for (var i=0;i<respuestas.length;++i){
        var elem = contexto.construirElementoRespuesta(respuestas[i])[0];
        contexto.elementos.respuesta.after(elem);
      }
      e.botonAgregarPregunta[0].innerText = 'Guardar Pregunta'
    })
  },

  construirElementoRespuesta: function(respuesta) {
    var nuevoItem;
    //completar
    nuevoItem = $(`<div class="form-group answer has-feedback has-success"></div>`);
    var input = $(`<input class="form-control" type="text" name="option[]" data-fv-field="option[]" value="${respuesta.textoRespuesta}" />`);
    var i = $(`<i class="form-control-feedback glyphicon glyphicon-ok" data-fv-icon-for="option[]" style=""></i>`);
    var button = $(`<button type="button" class="btn btn-default botonBorrarRespuesta"><i class="fa fa-minus"></i></button>`);
    var validacion1 = $(`<small class="help-block" data-fv-validator="notEmpty" data-fv-for="option[]" data-fv-result="VALID" style="display: none;">La respuesta no puede ser vacía</small>`);
    var validacion2 = $(`<small class="help-block" data-fv-validator="stringLength" data-fv-for="option[]" data-fv-result="VALID" style="display: none;">La respuesta debe tener menos de 100 caracteres</small>`);
    
    nuevoItem.append(input);
    // nuevoItem.append(i);
    nuevoItem.append(button);
    nuevoItem.append(validacion1);
    nuevoItem.append(validacion2);
    
    return nuevoItem;
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
