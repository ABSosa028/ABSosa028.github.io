
//funcion pedir en whatsapp segun id enviando la imagen del id

function pedir(id) {
    const img = document.getElementById(id).src;
    const url = `https://api.whatsapp.com/send?phone=+50233873562&text=Hola%2C%20deseo%20pedir%20el%20siguiente%20producto%20${img}`;
    window.open(url);
    }

