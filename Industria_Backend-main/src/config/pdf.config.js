const moment = require('moment');

const fonts = {
    Roboto: {
        normal: Buffer.from(
            require("../../node_modules/pdfmake/build/vfs_fonts").pdfMake.vfs["Roboto-Regular.ttf"],
            'base64'),
        bold: Buffer.from(
            require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'],
            'base64'),
        italics: Buffer.from(
            require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Italic.ttf'],
            'base64')
    }
};

const styles = {
    header: {
        bold: true,
        fontSize: 14,
        alignment: 'center',
        color: '#000000',

    },
    subTitle: {
        italics: true,
        alignment: 'left',
        fontSize: 8,
        color: '#000000',

    },
    label: {
        bold: false,
        fontSize: 12,
        alignment: 'justify',
        color: '#000000',

    },
    jump: {
        bold: false,
        fontSize: 0.1,
        alignment: 'justify',
        lineHeight: 30
    }
}

var content = [];

function contenido(titulo, empresa,gastos) {
    //TITULO Y SUB
    content = [
        { text: titulo, style: 'header', lineHeight: 2 },
        { text: empresa, style: 'subTitle' },

    ];

    jump(content);
    var table = makeGastosTable(gastos);


    content.push(table);
    jump(content);

 


    return content;

}

function jump(c) {
    c.push({ text: `${Date.now()}`, style: 'jump' })
    return c
}

function makeGastosTable(gastos) {
    //COLUMNAS
    var headTable = [
        { text: 'Descripcion', bold: true },
        { text: 'Tipo',alignment: 'center', bold: true },
        { text: 'Fecha',alignment: 'center', bold: true },
        { text: 'Total',alignment: 'center', bold: true },
    ];
    
    //TAMAÑO DE COLUMNAS
    //widths: [ '*', 'auto', 100, '*' ], //ancho de columnas
    var widths = ['*', 'auto', 'auto', 'auto'];

    //AGREGAR COLUMNAS 
    var body = [headTable]
    var ttg = 0;

    //AGRRGAR VALORES A COLUNAS
    gastos.forEach(g => {
        
        body.push([g.descripcion, g.nombre,moment(g.fecha).utc().format('DD/MM/YYYY'), g.totalgasto]);
        ttg+=g.totalgasto;
    });
   
        body.push([{ text: 'Total', bold: true }, ' ',' ', ttg]);

    var tabla = {
        table: {
            headerRows: 1,
            widths,
            body
        }
    };
    return tabla
}

module.exports = {
    fonts,
    styles,
    contenido
}

/*
Style properties 
font: string: name of the font
fontSize: number: size of the font in pt
fontFeatures: string[]: array of advanced typographic features supported in TTF fonts (supported features depend on font file)
lineHeight: number: the line height (default: 1)
bold: boolean: whether to use bold text (default: false)
italics: boolean: whether to use italic text (default: false)
alignment: string: (‘left’ or ‘center’ or ‘right’ or ‘justify’) the alignment of the text
characterSpacing: number: size of the letter spacing in pt
color: string: the color of the text (color name e.g., ‘blue’ or hexadecimal color e.g., ‘#ff5500’)
background: string the background color of the text
markerColor: string: the color of the bullets in a buletted list
decoration: string: the text decoration to apply (‘underline’ or ‘lineThrough’ or ‘overline’)
decorationStyle: string: the style of the text decoration (‘dashed’ or ‘dotted’ or ‘double’ or ‘wavy’)
decorationColor: string: the color of the text decoration, see color
 */