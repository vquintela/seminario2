const { Schema, model } = require('mongoose');

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Nombre muy largo maximo 15 caracteres!"]
    },
    descripcion: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [1500,"¡Descripcion muy larga, maximo 1500 caracteres!"]
    },
    id_prod_cat: {
        type: Schema.Types.ObjectId,
        ref: "categoria",
        required: [true, '¡Campo obligatorio!'],
    },
    id_prod_cat_padre: {
        type: Schema.Types.ObjectId,
        ref: "categoria",
        required: [true, '¡Campo obligatorio!'],
    },
    marca_id: {
        type: Schema.Types.ObjectId,
        ref: 'marca',
        required: [true, '¡Campo obligatorio!']
    },
    precio: {
        type: Number,
        required: [true, '¡Campo requerido!'],
        min: [0, '¡Solo Valor positivo!'],
        max: [1000000, '¡Valor Exagerado!']
    },
    cantidad: {
        type: Number,
        required: [true, '¡Campo requerido!'],
        min: [0, '¡Solo Valor positivo!'],
        max: [1000000, '¡Valor Exagerado!']
    },
    modelo: {
        type: String,
        required: [true, '¡Campo requerido!'],
        maxlength:[50,"¡Modelo muy largo maximo 50 caracteres!"]
    },
    imagen: {
        type: String,
        default: 'sinimagen.png'
    },
    destacado: {
        type: Boolean,
        default: false,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    comentarios: {
        type: Boolean,
        default: false
    }
});

module.exports = model('producto', productoSchema);