import { Injectable } from '@angular/core';
import { IPosPrinter } from 'ipos-printer';
import { TestResult } from 'src/app/types/testResult.type';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private ivecoLogo: string = ''
  private conecsaLogo: string = '';

  constructor() { }

  public async printTestResult(testResult: TestResult): Promise<void> {
    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });
    // await IPosPrinter.printBitmap({ alignment: 1, bitmapSize: 16, base64: this.ivecoLogo });
    // await IPosPrinter.printBlankLines({ lines: 2, height: 32 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'TESTE PROVA HÍDRICA', typeface: 'ST', fontSize: 32 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 32 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 0 });
    await IPosPrinter.printSpecifiedTypeText({ text: 'VAN:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.van, typeface: 'ST', fontSize: 24 });
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


    await IPosPrinter.printSpecifiedTypeText({ text: 'OPERADOR:', typeface: 'ST', fontSize: 24 });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.operator, typeface: 'ST', fontSize: 24 });

    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printColumnsText({ colsTextArr: ['TETO', `${testResult.upsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['FRENTE', `${testResult.frontSideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['TETO POSTERIOR', `${testResult.backSideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['LADO ESQUERDO', `${testResult.leftSideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['LADO DIREITO', `${testResult.rightSideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['RESULTADO', `${testResult.status}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printRowBlock();
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printQRCode({ data: testResult.operationId, moduleSize: 5, errorCorrectionLevel: 1 });
    await IPosPrinter.printBlankLines({ lines: 2, height: 24 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });
    //await IPosPrinter.printBitmap({ alignment: 1, bitmapSize: 16, base64: this.conecsaLogo });
    await IPosPrinter.printBlankLines({ lines: 5, height: 32 });
  }
}
