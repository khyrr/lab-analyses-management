const PdfPrinter = require('pdfmake');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

const printer = new PdfPrinter(fonts);

const generateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.analysisRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: true,
        results: {
          include: {
            analysisType: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Analysis request not found' });
    }

    const docDefinition = {
      content: [
        { text: 'LABORATOIRE D\'ANALYSES MÉDICALES', style: 'header', alignment: 'center' },
        { text: 'Rapport d\'Analyses', style: 'subheader', alignment: 'center', margin: [0, 20, 0, 20] },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Patient: ', bold: true },
                request.patient.fullName,
                '\n',
                { text: 'Date de naissance: ', bold: true },
                new Date(request.patient.dateOfBirth).toLocaleDateString(),
                '\n',
                { text: 'CIN: ', bold: true },
                request.patient.cin,
              ],
            },
            {
              width: '*',
              text: [
                { text: 'Date: ', bold: true },
                new Date(request.createdAt).toLocaleDateString(),
                '\n',
                { text: 'Médecin: ', bold: true },
                request.doctorName,
                '\n',
                { text: 'Statut: ', bold: true },
                request.status,
              ],
              alignment: 'right',
            },
          ],
        },
        { text: '', margin: [0, 20] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Analyse', style: 'tableHeader' },
                { text: 'Résultat', style: 'tableHeader' },
                { text: 'Unité', style: 'tableHeader' },
                { text: 'Valeurs de référence', style: 'tableHeader' },
                { text: 'Obs.', style: 'tableHeader' },
              ],
              ...request.results.map((result) => [
                result.analysisType.name,
                { text: result.value.toString(), bold: result.isAbnormal, color: result.isAbnormal ? 'red' : 'black' },
                result.analysisType.unit,
                `${result.analysisType.reference_min} - ${result.analysisType.reference_max}`,
                result.isAbnormal ? { text: '!', color: 'red', bold: true } : '',
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
        { text: '\n\nSignature du Biologiste', alignment: 'right', margin: [0, 50, 0, 0] },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rapport_${request.id}.pdf`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  generateReport,
};
