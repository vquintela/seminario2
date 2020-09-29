const express = require('express');
const router = express.Router();
const errorMessage = require('../lib/errorMessageValidation');
const categoriaSchema = require('../model/categoria');
const productoSchema = require('../model/producto');

router.get('/', async (req, res) => {
    const categorias = await categoriaSchema.find().lean();
    res.render('categorias', {
        titulo: 'Agregar categoría',
        boton: 'Guardar',
        action: '/categorias',
        categorias: categorias
    });
});

router.post('/', async (req, res) => {
    const value = req.body;
    const categoria = new categoriaSchema();
    categoria.nombre = value.nombre;
    categoria.categoriaPadre = value.categoriaPadre != "" ? value.categoriaPadre : "";

    try {
        await categoria.save();
        req.flash('success', 'Categoría ingresada correctamente.');
        res.redirect('/categorias');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const categorias = await categoriaSchema.find().lean();
        res.render('categorias', {
            titulo: 'Agregar categoría',
            boton: 'Guardar',
            action: '/categorias',
            categorias: categorias,
            e: mensaje,
            value: value.categoria
        });
    }
});

router.get('/editar/:id', async (req, res) => {
    const categoria = await categoriaSchema.findById({ _id: req.params.id }).lean();
    const categorias = await categoriaSchema.find({ _id: { $ne: req.params.id} }).lean();
    res.render('categorias', {
        titulo: 'Editar categoría',
        boton: 'Editar',
        action: `/categorias/editar/${categoria._id}`,
        categorias: categorias,
        value: categoria.nombre
    });
});

router.post('/editar/:id', async (req, res) => {
    try {
        await Marca.findByIdAndUpdate({ _id: req.params.id }, { marca: req.body.marca }, { runValidators: true });
        req.flash('success', 'Categoría actualizada');
        res.redirect('/categorias')
    } catch (error) {
        const categorias = await categoriaSchema.find({ _id: { $ne: req.params.id} }).lean();
        const mensaje = errorMessage.crearMensaje(error);
        res.render('categorias/', {
            titulo: 'Editar categoría',
            boton: 'Editar',
            action: `/categorias/editar/${req.params.id}`,
            e: mensaje,
            categorias: categorias,
            value: req.body.nombre
        });
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    await categoriaSchema.findByIdAndDelete({_id: req.params.id})
    req.flash('success', 'Categoría eliminada correctamente.');
    res.status(200).json('Ok');
});

router.put('/estado/:id', async (req, res) => {
    const estado = req.body.estado;
    await categoriaSchema.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    if (estado) await productoSchema.updateMany({estado: false}).where('mid_prod_cat').equals(req.params.id)
    req.flash('success', 'Estado modificado correctamente.');
    res.status(200).json('Ok');
});

router.get('/buscar/:estado', async (req, res) => {
    const categorias = await categoriaSchema.find({'a': req.params.estado}).lean();
    const estado = JSON.parse(req.params.estado) ? {nombre: 'Activas', value: 'true'} : {nombre: 'Inactivas', value: 'false'};
    res.render('categorías/', {
        titulo: 'Agregar categoría',
        boton: 'Guardar',
        action: '/categorías',
        categorias: categorias,
        estadoActual: estado
    });
});

module.exports = router;