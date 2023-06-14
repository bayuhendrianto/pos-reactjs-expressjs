var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
const { BookingClass } = require('../class/booking.class');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var numeral = require("numeral");
var { logoBlack, logoWhite } = require("../assets/logo")

function generateDateTimeStringFormat(date) {
    var today = date ? new Date(date) : new Date(),
        year = today.getFullYear().toString(),
        month = ('0' + (today.getMonth() + 1)).slice(-2),
        date = ('0' + today.getDate()).slice(-2),
        hour = ('0' + today.getHours()).slice(-2),
        minutes = ('0' + today.getMinutes()).slice(-2),
        dateTime = `${date}/${month}/${year} ${hour}:${minutes}`,
        timeFormat = `${hour}:${minutes}`,
        dateFormat = `${year}-${month}-${date}`

    return {
        dateTime: dateTime,
        timeFormat: timeFormat,
        dateFormat: dateFormat,
    }
}

const paymentStatus = (status) => {
    let _status = "";
    switch (status) {
        case "none":
            _status = "Menunggu Pembayaran"
            break;
        case "pending":
            _status = "Menunggu Pembayaran"
            break;
        case "settlement":
            _status = "Lunas"
            break;
        case "deny":
            _status = "Pembayaran Ditolak"
            break;
        case "cancel":
            _status = "Pembayaran Dibatalkan"
            break;
        case "expire":
            _status = "Pembayaran Kedaluwarsa"
            break;
        case "retur":
            _status = "Kembali"
            break;

        default:
            break;
    }

    return _status;
}

const createInvoice = (booking) => {
    let bookingData = new BookingClass(booking)

    return new Promise((resolve, rejetc) => {
        var dd = {
            footer: {
                margin: [0, -75, 0, 10],
                columns: [
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 150, 80],
                            body: [
                                [
                                    {
                                        image: logoWhite,
                                        width: 100,
                                        margin: [0, 5, 0, 10],
                                        border: [false, false, false, false],
                                        // borderColor: ['#DDDDDD', '#DDDDDD', '#DDDDDD', '#DDDDDD'],
                                        fillColor: '#0081B4',
                                    },
                                    {
                                        text: 'Contact Customer Care',
                                        fillColor: '#0081B4',
                                        color: '#ffffff',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        // borderColor: ['#DDDDDD', '#DDDDDD', '#DDDDDD', '#DDDDDD'],
                                        margin: [0, 15, 0, 5],
                                        textTransform: 'uppercase',
                                    },
                                    {
                                        text: '',
                                        border: [false, false, false, false],
                                        // borderColor: ['#DDDDDD', '#DDDDDD', '#DDDDDD', '#DDDDDD'],
                                        alignment: 'right',
                                        fillColor: '#0081B4',
                                        margin: [0, 15, 0, 5],
                                        textTransform: 'uppercase',
                                    },
                                ],
                                [
                                    {
                                        text: 'PT. Balen Insan Kreasindo',
                                        fillColor: '#0081B4',
                                        border: [false, false, false, false],
                                        margin: [0, -10, 0, 5],
                                        color: '#ffffff',
                                        textTransform: 'uppercase',
                                    },
                                    {
                                        text: '(021) xxxx xxxx',
                                        fillColor: '#0081B4',
                                        border: [false, false, false, false],
                                        margin: [0, -10, 0, 5],
                                        alignment: 'left',
                                        color: '#ffffff',
                                        textTransform: 'uppercase',
                                    },
                                    {
                                        text: 'hello@balen.id',
                                        border: [false, false, false, false],
                                        alignment: 'left',
                                        fillColor: '#0081B4',
                                        margin: [0, -10, 0, 5],
                                        color: '#ffffff',
                                        textTransform: 'uppercase',
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            watermark: { text: paymentStatus(bookingData.paymentStatus).toUpperCase(), color: 'blue', opacity: 0.2, bold: true, italics: false, fontSize: 30 },
            content: [
                {
                    columns: [
                        {
                            image: logoBlack,
                            width: 150,
                        },
                        [
                            {
                                text: 'Bukti Transaksi',
                                color: '#333333',
                                width: '*',
                                fontSize: 20,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 0, 0, 15],
                            },
                            {
                                stack: [
                                    {
                                        columns: [
                                            {
                                                text: 'No. Invoice',
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: bookingData.invoiceNumber,
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Dibuat',
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: `${generateDateTimeStringFormat(bookingData.createdAt).dateTime}`,
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Status',
                                                color: '#aaaaab',
                                                bold: true,
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: '*',
                                            },
                                            {
                                                text: paymentStatus(bookingData.paymentStatus),
                                                bold: true,
                                                fontSnize: 14,
                                                alignment: 'right',
                                                color: 'green',
                                                width: 100,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    ],
                },
                {
                    columns: [
                        {
                            text: 'Nama',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 11,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                        {
                            text: 'Alamat Email',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 11,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                        {
                            text: 'Nomor Telepon',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 11,
                            alignment: 'right',
                            margin: [0, 20, 0, 5],
                        },
                    ],
                },
                {
                    columns: [
                        {
                            text: bookingData.customerName,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                        },
                        {
                            text: bookingData.customerEmail,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                            margin: [-3, 0, 0, 0],
                        },
                        {
                            text: bookingData.customerPhone,
                            bold: true,
                            color: '#333333',
                            alignment: 'right',
                            margin: [-3, 0, 0, 0],
                        },
                    ],
                },
                '\n',
                {
                    columns: [
                        {
                            text: 'Ringkasan Pesanan',
                            color: '#aaaaab',
                            bold: true,
                            margin: [0, 7, 0, 3],
                        }
                    ],
                },
                {
                    columns: [
                        {
                            text: `${bookingData.companyName} \n ${bookingData.vehicleBrand} - ${bookingData.vehicleType}`,
                            style: 'invoiceBillingAddress',
                        },
                    ],
                },
                '\n',
                {
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            if (i === 1 || i === 0) {
                                return '#bfdde8';
                            }
                            return '#eaeaea';
                        },
                        vLineColor: function (i, node) {
                            return '#eaeaea';
                        },
                        hLineStyle: function (i, node) {
                            // if (i === 0 || i === node.table.body.length) {
                            return null;
                            //}
                        },
                        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                        paddingLeft: function (i, node) {
                            return 10;
                        },
                        paddingRight: function (i, node) {
                            return 10;
                        },
                        paddingTop: function (i, node) {
                            return 2;
                        },
                        paddingBottom: function (i, node) {
                            return 2;
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return '#fff';
                        },
                    },
                    table: {
                        headerRows: 1,
                        widths: ['*', 80],
                        body: [
                            [
                                {
                                    text: 'Berat Muatan',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    border: [false, false, false, true],
                                    text: `${bookingData.vehicleLoadCapacityUsage}`,
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Karoseri Mobil',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: `${bookingData.vehicleBody}`,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Berangkat Dari',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: `${bookingData.pickupSubDistrict}, ${bookingData.pickupDistrict}, ${bookingData.pickupCity}`,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Tujuan',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: `${bookingData.deliverySubDistrict}, ${bookingData.deliveryDistrict}, ${bookingData.deliveryCity}`,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Asuransi',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: 'left',
                                },
                                {
                                    text: `${bookingData.orderInsuranceName}`,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                        ],
                    },
                },
                '\n',
                '\n\n',
                {
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return '#eaeaea';
                        },
                        vLineColor: function (i, node) {
                            return '#eaeaea';
                        },
                        hLineStyle: function (i, node) {
                            // if (i === 0 || i === node.table.body.length) {
                            return null;
                            //}
                        },
                        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                        paddingLeft: function (i, node) {
                            return 10;
                        },
                        paddingRight: function (i, node) {
                            return 10;
                        },
                        paddingTop: function (i, node) {
                            return 3;
                        },
                        paddingBottom: function (i, node) {
                            return 3;
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return '#fff';
                        },
                    },
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],
                        body: [
                            [
                                {
                                    text: `Biaya Asuransi (${bookingData.orderPriceInsurancePercent} %)`,
                                    border: [false, true, false, true],
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    border: [false, true, false, true],
                                    text: `Rp ${numeral(bookingData.orderPriceInsurance).format('0,0')}`,
                                    alignment: 'right',
                                    fillColor: '#f5f5f5',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Biaya Pengiriman',
                                    border: [false, false, false, true],
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    text: `Rp ${numeral(bookingData.orderPrice).format('0,0')}`,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Total',
                                    bold: true,
                                    fontSize: 20,
                                    alignment: 'right',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    text: `Rp ${numeral(bookingData.totalOrderPrice).format('0,0')}`,
                                    bold: true,
                                    fontSize: 20,
                                    alignment: 'right',
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                        ],
                    },
                }
            ],
            styles: {
                notesTitle: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 50, 0, 3],
                },
                notesText: {
                    fontSize: 10,
                },
            },
            defaultStyle: {
                columnGap: 20,
                //font: 'Quicksand',
            },
        };

        pdfMake.createPdf(dd).getDataUrl((next) => {
            resolve(next)
        })
    })
}

module.exports = {
    createInvoice
}