function descargarPDF() {
    // Obtiene el contenido del body del HTML
    var contenidoHTML = document.querySelector('body');
  
    // Crea un objeto jsPDF
    var pdf = new jsPDF('p', 'mm', 'a4');
  
    // Convierte el contenido del body a imagen usando html2canvas
    html2canvas(contenidoHTML).then(function (canvas) {
      // Obtiene la imagen generada en formato PNG
      var imgData = canvas.toDataURL('image/png');
  
      // Agrega la imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // Ajusta el tamaño (210x297mm para formato A4)
  
      // Guarda el PDF con el nombre "mi_archivo.pdf"
      pdf.save('mi_archivo.pdf');
    });
  }
  