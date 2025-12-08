function efectoCambio() {
            const dynamicElement = document.querySelector('.dynamic-edition');
            const editions = ["Edición Especial ITI", "NOTICIAS DE ÚLTIMA HORA", "REPORTE UPV"];
            let index = 0;

            function updateEdition() {
                index = (index + 1) % editions.length; 
                dynamicElement.textContent = editions[index];
            }

            setInterval(updateEdition, 4000); 
        }

        window.onload = efectoCambio
    ;