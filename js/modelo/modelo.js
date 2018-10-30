/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoAgregado = new Evento(this);
  this.leerLocalStorage();
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var id;
    var cantPreguntas = this.preguntas.length;
    cantPreguntas > 0 ? id = cantPreguntas : id = 0;
    return id;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.preguntaAgregada.notificar();
  },


  borrarPregunta: function(idPregunta) {
    var arrayBorrado = this.preguntas.filter(item => item.id != idPregunta );
    this.preguntas = arrayBorrado;
    this.preguntaBorrada.notificar();
  },

  borrarTodasLasPreguntas: function() {
    this.preguntas = [];
    this.preguntaBorrada.notificar();
  },

  guardarEnLocalStorage: function() {
    var str = JSON.stringify(this.preguntas);
    localStorage.setItem('preguntas',str );
  },

  leerLocalStorage: function() {
    var preguntasLocales = JSON.parse(localStorage.getItem('preguntas'));
    this.preguntas = preguntasLocales;
  },

  editarPregunta: function(idPregunta, pregEditada) {
    var id = this.preguntas.findIndex(item => item.id == idPregunta);
    this.preguntas[id].textoPregunta = pregEditada;
    this.preguntaEditada.notificar();
  },

  agregarVoto: function(nombrePregunta, respuesta) {
    var id = this.preguntas.findIndex(item => item.textoPregunta == nombrePregunta);
    var respuestas = this.preguntas[id].cantidadPorRespuesta;
    var indexRespuesta = respuestas.findIndex(item => item.textoRespuesta == respuesta)
    respuestas[indexRespuesta].cantidad++
  },

  observableNotificar: function() {
    this.votoAgregado.notificar();
  }
};


