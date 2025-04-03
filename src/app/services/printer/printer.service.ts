import { Injectable } from '@angular/core';
import { IPosPrinter } from 'ipos-printer';
import { TestResult } from 'src/app/types/testResult.type';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  public async printTestResult(testResult: TestResult): Promise<boolean> {
    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'TESTE PROVA HÍDRICA', typeface: 'ST', fontSize: 32 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 32 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 0 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'VP:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.vp || 'Não informado', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'CHASSI:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.chassis || 'Não informado', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'CIS:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.cis || 'Não Informado', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'DESCRIÇÃO:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.description, typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'DATA:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.date, typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'HORA:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.time, typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'DURAÇÃO:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.duration, typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'OPERADOR:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.operator, typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printColumnsText({ colsTextArr: ['TETO', `${testResult.upsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['FRENTE', `${testResult.frontsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['TETO POSTERIOR', `${testResult.backsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['LADO ESQUERDO', `${testResult.leftsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['LADO DIREITO', `${testResult.rightsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['RESULTADO', `${testResult.status}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printRowBlock();
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printQRCode({ data: testResult.operationId, moduleSize: 5, errorCorrectionLevel: 1 });
    await IPosPrinter.printBlankLines({ lines: 2, height: 24 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });
    await IPosPrinter.printBlankLines({ lines: 4, height: 32 });

    return true;
  }
}
