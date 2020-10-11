// MODAL
const modal = (titulo, texto) => {
    let mascara = document.getElementById('lamascara');
    mascara.style.display = "block";
    document.querySelector('body').style.overflowY = 'hidden';
    document.getElementById('titulo-modal').innerText = titulo;
    document.querySelector('#panelResultados').innerText = texto;
    return new Promise((resolve, reject) => {
        const btnCerrar = document.getElementById('cerrarModal');
        btnCerrar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(false);
        });
        const btnAceptar = document.getElementById('aceptarModal');
        btnAceptar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(true);
        });
    });
}
    
// Dropdown sidebar
document.querySelectorAll('.productos-menu').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.nextElementSibling.firstChild.nextElementSibling.classList.toggle('menu-show')
    });
});

//ANIMACION BTN SIDEBAR
const btnSidebar = document.getElementById('btn-sidebar');
if (btnSidebar) btnSidebar.addEventListener('click', () => {
  document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
});

const comentar = (id) => {
    const comentario = {
        producto: id,
        contenido: document.querySelector('#comentario').value,
        ranqueo: parseInt(document.querySelector('input[type="radio"]:checked').value)
    }
    fetch(`/productos/comentar/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comentario)
    })
        .then(res => res.json())
        .then(data => {
            const comentario = document.createElement('p', {is: 'comentario'});
            comentario.classList.add('text-muted');
            const contenido = document.createTextNode(data.contenido); 
            comentario.appendChild(contenido);
            document.querySelector('[comentarios]').appendChild(comentario);
        });
}

document.querySelector('#btn-comentario').addEventListener('click', ()=>{
    const producto = document.querySelector('#producto').value;
    comentar(producto);
});

// SACA EL MENSAJE DE REQ FLASH
window.onload = () => {
    const message = document.getElementById('message-success');
    if(message) {
        setTimeout(() => {
            message.remove();
        }, 2000)
    }
}
