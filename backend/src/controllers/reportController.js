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
      return res.status(404).json({ error: 'Requête d\'analyse non trouvée' });
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
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération du rapport' });
  }
};

module.exports = {
  generateReport,
};

// Generate complete patient history PDF
const generatePatientHistoryPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        analyses: {
          include: {
            results: {
              include: {
                analysisType: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    // Build content for each analysis
    const analysesContent = patient.analyses.map((request) => [
      { text: `\nAnalyse du ${new Date(request.createdAt).toLocaleDateString()}`, style: 'subheader' },
      { text: `Médecin: ${request.doctorName} - Statut: ${request.status}`, margin: [0, 5, 0, 10] },
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
        margin: [0, 0, 0, 20],
      },
    ]).flat();

    const docDefinition = {
      content: [
        { text: 'LABORATOIRE D\'ANALYSES MÉDICALES', style: 'header', alignment: 'center' },
        { text: 'Historique Complet du Patient', style: 'subheader', alignment: 'center', margin: [0, 20, 0, 20] },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Patient: ', bold: true },
                patient.fullName,
                '\n',
                { text: 'Date de naissance: ', bold: true },
                new Date(patient.dateOfBirth).toLocaleDateString(),
                '\n',
                { text: 'CIN: ', bold: true },
                patient.cin,
              ],
            },
            {
              width: '*',
              text: [
                { text: 'Téléphone: ', bold: true },
                patient.phone,
                '\n',
                { text: 'Email: ', bold: true },
                patient.email || 'N/A',
                '\n',
                { text: 'Nombre d\'analyses: ', bold: true },
                patient.analyses.length.toString(),
              ],
              alignment: 'right',
            },
          ],
        },
        { text: '', margin: [0, 20] },
        { text: 'Historique des Analyses', style: 'header2', margin: [0, 10, 0, 10] },
        ...analysesContent,
        { text: '\n\nDocument généré le ' + new Date().toLocaleDateString(), alignment: 'center', fontSize: 10, color: 'gray' },
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
        header2: {
          fontSize: 14,
          bold: true,
          decoration: 'underline',
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
    res.setHeader('Content-Disposition', `attachment; filename=historique_patient_${patient.id}.pdf`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération du rapport' });
  }
};

module.exports = {
  generateReport,
  generatePatientHistoryPDF,
};
