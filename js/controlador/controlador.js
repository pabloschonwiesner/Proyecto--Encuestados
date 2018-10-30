/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
      this.modelo.guardarEnLocalStorage();
  },

  borrarPregunta: function(idPregunta) {
    this.modelo.borrarPregunta(idPregunta);
    this.modelo.guardarEnLocalStorage();
  },

  borrarTodas: function() {
    this.modelo.borrarTodasLasPreguntas();
    this.modelo.guardarEnLocalStorage();
  },

  editarPregunta: function(idPregunta, preguntaEditada) {
    var pregunta = this.modelo.editarPregunta(idPregunta, preguntaEditada);
    this.modelo.guardarEnLocalStorage();
  },

  agregarVoto: function(nombrePregunta, respuestaSeleccionada) {
    this.modelo.agregarVoto(nombrePregunta, respuestaSeleccionada);
    this.modelo.guardarEnLocalStorage();
  },

  observableNotificar: function() {
    this.modelo.observableNotificar();
  }
};
