const express = require('express');
const router = express.Router();
const Marca = require('../model/marca');
const errorMessage = require('../lib/errorMessageValidation');
const Producto = require('../model/producto');
const { logAdmin } = require('../lib/auth');

router.get('/', logAdmin, async (req, res) => {
    let estado = {};
    if (req.query.estado) estado = { estado: req.query.estado };
    const marcas = await Marca.find(estado).lean();
    res.render('marcas/', {
        titulo: 'Agregar marca',
        boton: 'Guardar',
        action: '/marcas',
        marcas: marcas,
        actual: req.query.estado
    });
});

router.post('/', logAdmin, async (req, res) => {
    const value = req.body;
    const marca = new Marca({...value})
    try {
        await marca.save();
        req.flash('success', 'Marca Ingresada de Forma Correcta');
        res.redirect('/marcas');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const marcas = await Marca.find().lean();
        res.render('marcas/', {
            titulo: 'Agregar Marca',
            boton: 'Guardar',
            action: '/marcas',
            marcas: marcas,
            e: mensaje,
            value: value.marca
        });
    }
});

router.get('/editar/:id', logAdmin, async (req, res) => {
    const [marca, marcas] = await Promise.all([
        Marca.findById({ _id: req.params.id }).lean(),
        Marca.find().lean()
    ]);
    res.render('marcas/', {
        titulo: 'Editar Marca',
        boton: 'Editar',
        action: `/marcas/editar/${marca._id}`,
        marcas: marcas,
        value: marca.marca
    });
});

router.post('/editar/:id', logAdmin, async (req, res) => {
    try {
        await Marca.findByIdAndUpdate({ _id: req.params.id }, { marca: req.body.marca }, { runValidators: true });
        req.flash('success', 'Marca Actualizada');
        res.redirect('/marcas')
    } catch (error) {
        const marcas = await Marca.find().lean();
        const mensaje = errorMessage.crearMensaje(error);
        res.render('marcas/', {
            titulo: 'Editar Marca',
            boton: 'Editar',
            action: `/marcas/editar/${req.params.id}`,
            e: mensaje,
            marcas: marcas,
            value: req.body.marca
        });
    }
});

router.delete('/eliminar/:id', logAdmin, async (req, res) => {
    await Marca.findByIdAndDelete({_id: req.params.id})
    req.flash('success', 'Marca Eliminada de Forma Correcta');
    res.status(200).json('Ok');
});

router.put('/estado/:id', logAdmin, async (req, res) => {
    const estado = req.body.estado;
    await Marca.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    if (estado) await Producto.updateMany({estado: false}).where('marca_id').equals(req.params.id)
    req.flash('success', 'Estado Modificado de Forma Correcta');
    res.status(200).json('Ok');
});

module.exports = router;